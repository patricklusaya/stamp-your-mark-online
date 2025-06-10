
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
  
  // Add slight imperfections to the star
  ctx.globalAlpha = 0.8 + Math.random() * 0.2;
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
  fontSize: number
) => {
  ctx.save();
  ctx.font = `bold ${fontSize}px "Special Elite", "Courier Prime", "Courier New", monospace`;
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
    
    // Add slight character-level imperfections
    const charOffsetX = (Math.random() - 0.5) * 0.5;
    const charOffsetY = (Math.random() - 0.5) * 0.5;
    const charRotation = (Math.random() - 0.5) * 0.01;
    
    ctx.translate(x + charOffsetX, y + charOffsetY);
    ctx.rotate(angle + (clockwise ? Math.PI/2 : -Math.PI/2) + charRotation);
    
    // Add slight transparency variation for each character
    ctx.globalAlpha = 0.8 + Math.random() * 0.2;
    
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();
};

export const drawCurvedOvalText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  startAngle: number,
  clockwise: boolean,
  fontSize: number
) => {
  ctx.save();
  ctx.font = `bold ${fontSize}px "Special Elite", "Courier Prime", "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const totalAngle = Math.PI * 0.8; // Reduced for better oval text distribution
  const angleStep = totalAngle / Math.max(text.length - 1, 1);
  const startOffset = startAngle - totalAngle / 2;
  
  for (let i = 0; i < text.length; i++) {
    const angle = startOffset + (clockwise ? i * angleStep : -i * angleStep);
    const x = centerX + Math.cos(angle) * radiusX;
    const y = centerY + Math.sin(angle) * radiusY;
    
    ctx.save();
    
    // Add slight character-level imperfections
    const charOffsetX = (Math.random() - 0.5) * 0.5;
    const charOffsetY = (Math.random() - 0.5) * 0.5;
    const charRotation = (Math.random() - 0.5) * 0.01;
    
    ctx.translate(x + charOffsetX, y + charOffsetY);
    ctx.rotate(angle + (clockwise ? Math.PI/2 : -Math.PI/2) + charRotation);
    
    // Add slight transparency variation for each character
    ctx.globalAlpha = 0.8 + Math.random() * 0.2;
    
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();
};
