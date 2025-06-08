
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
    const x1 = Math.cos(angle) * size;
    const y1 = Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(x1, y1);
    else ctx.lineTo(x1, y1);
  }
  ctx.closePath();
  ctx.fill();
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
    ctx.font = `bold ${fontSize}px "Special Elite", "Courier Prime", "Courier New", monospace`;
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
    
    // Add slight random variation for hand-stamped effect
    const offsetX = (Math.random() - 0.5) * 0.5;
    const offsetY = (Math.random() - 0.5) * 0.5;
    ctx.translate(offsetX, offsetY);
    
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();
};

export const addInkEffects = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Add ink bleed and imperfections
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    
    if (alpha > 0) {
      // Add slight color variation to simulate ink density
      const variation = Math.random() * 20 - 10;
      data[i] = Math.max(0, Math.min(255, data[i] + variation));     // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + variation)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + variation)); // B
      
      // Occasionally add ink bleed effect
      if (Math.random() < 0.02) {
        data[i + 3] = Math.max(0, alpha - 30); // Reduce opacity slightly
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Add subtle texture overlay
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#000000';
  
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 2;
    ctx.fillRect(x, y, size, size);
  }
  
  ctx.restore();
};
