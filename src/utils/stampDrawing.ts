
export const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

export const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 144 - 90) * Math.PI / 180;
    // Add slight random variation for imperfect star
    const sizeVariation = size + (Math.random() - 0.5) * 1;
    const x1 = Math.cos(angle) * sizeVariation;
    const y1 = Math.sin(angle) * sizeVariation;
    if (i === 0) ctx.moveTo(x1, y1);
    else ctx.lineTo(x1, y1);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

export const drawImperfectCircle = (
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  radius: number, 
  lineWidth: number,
  opacity: number = 1
) => {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.lineWidth = lineWidth;
  
  // Create multiple overlapping circles with slight variations for ink bleed effect
  for (let layer = 0; layer < 3; layer++) {
    ctx.beginPath();
    
    const segments = 64;
    const angleStep = (Math.PI * 2) / segments;
    
    for (let i = 0; i <= segments; i++) {
      const angle = i * angleStep;
      
      // Add random variations for imperfect circle
      const radiusVariation = radius + (Math.random() - 0.5) * (lineWidth * 0.8);
      const pressureVariation = 1 + (Math.random() - 0.5) * 0.4; // Simulate uneven pressure
      
      const x = centerX + Math.cos(angle) * radiusVariation;
      const y = centerY + Math.sin(angle) * radiusVariation;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Randomly add ink blobs for authentic look
      if (Math.random() < 0.02) {
        ctx.save();
        ctx.globalAlpha = opacity * 0.3;
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 2 + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    ctx.closePath();
    
    // Vary opacity for each layer to create depth
    ctx.globalAlpha = opacity * (0.4 + layer * 0.3);
    ctx.stroke();
  }
  
  ctx.restore();
};

export const drawCurvedText = (
  ctx: CanvasRenderingContext2D, 
  text: string, 
  centerX: number, 
  centerY: number, 
  radius: number, 
  startAngle: number, 
  clockwise: boolean,
  fontSize: number,
  useTypewriter: boolean = false
) => {
  ctx.save();
  
  if (useTypewriter) {
    ctx.font = `bold ${fontSize}px "Special Elite", "Old Stamper", "Courier Prime", "Courier New", monospace`;
  } else {
    ctx.font = `bold ${fontSize}px "Times New Roman", serif`;
  }
  
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const totalAngle = Math.PI * 1.2;
  const angleStep = totalAngle / Math.max(text.length - 1, 1);
  const startOffset = startAngle - totalAngle / 2;
  
  for (let i = 0; i < text.length; i++) {
    const angle = startOffset + (clockwise ? i * angleStep : -i * angleStep);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + (clockwise ? Math.PI/2 : -Math.PI/2));
    
    // Add more dramatic random variation for authentic hand-stamped effect
    const offsetX = (Math.random() - 0.5) * 1.5;
    const offsetY = (Math.random() - 0.5) * 1.5;
    const rotationOffset = (Math.random() - 0.5) * 0.1; // Slight rotation variation
    
    ctx.translate(offsetX, offsetY);
    ctx.rotate(rotationOffset);
    
    // Add ink opacity variation for faded/heavy areas
    ctx.globalAlpha = 0.7 + Math.random() * 0.3;
    
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();
};

export const addVintageInkEffects = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Enhanced ink bleed and vintage effects
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    
    if (alpha > 0) {
      // Add more dramatic color variation to simulate vintage ink
      const variation = Math.random() * 30 - 15;
      data[i] = Math.max(0, Math.min(255, data[i] + variation));     // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + variation)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + variation)); // B
      
      // More frequent ink bleed effects for authentic look
      if (Math.random() < 0.05) {
        data[i + 3] = Math.max(0, alpha - Math.random() * 60); // More dramatic opacity reduction
      }
      
      // Add occasional heavy ink spots
      if (Math.random() < 0.01) {
        data[i + 3] = Math.min(255, alpha + 40); // Darker spots
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add more dramatic texture overlay for vintage feel
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#2a1810'; // Sepia-toned brown for vintage ink
  
  // Add larger ink blots and smudges
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 4 + 1;
    
    ctx.save();
    ctx.globalAlpha = Math.random() * 0.15;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  // Add streaks and smudges
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const length = Math.random() * 20 + 5;
    const angle = Math.random() * Math.PI * 2;
    
    ctx.save();
    ctx.globalAlpha = Math.random() * 0.1;
    ctx.lineWidth = Math.random() * 2 + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
    ctx.restore();
  }
  
  ctx.restore();
};

export const addInkEffects = addVintageInkEffects; // Keep backward compatibility
