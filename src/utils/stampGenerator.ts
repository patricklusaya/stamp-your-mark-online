
import { drawRoundedRect, drawStar, drawCurvedText, drawImperfectCircle, addVintageInkEffects } from './stampDrawing';

export interface StampConfig {
  stampText: string;
  fontSize: number;
  stampType: string;
  borderWidth: number;
  state: string;
}

export const generateStampCanvas = (config: StampConfig): HTMLCanvasElement | null => {
  const { stampText, fontSize, stampType, borderWidth, state } = config;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const scale = 4; // Increased for better quality
  
  let baseWidth, baseHeight;
  if (stampType === "notary-circle") {
    baseWidth = baseHeight = 400;
  } else if (stampType === "logo-square") {
    baseWidth = baseHeight = 350;
  } else if (stampType === "signature-oval") {
    baseWidth = 450;
    baseHeight = 200;
  } else {
    baseWidth = 450;
    baseHeight = 150;
  }

  canvas.width = baseWidth * scale;
  canvas.height = baseHeight * scale;
  
  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = false; // Disable for grunge effect

  // Create aged paper background for authentic vintage look
  ctx.fillStyle = '#faf8f3';
  ctx.fillRect(0, 0, baseWidth, baseHeight);

  // Set up vintage ink styling with sepia tones
  ctx.strokeStyle = '#2a1810'; // Dark sepia brown instead of black
  ctx.fillStyle = '#2a1810';
  ctx.lineWidth = borderWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // Add overall transparency for faded ink look
  ctx.globalAlpha = 0.8;

  const centerX = baseWidth / 2;
  const centerY = baseHeight / 2;

  switch (stampType) {
    case "notary-circle":
      drawVintageNotaryCircle(ctx, centerX, centerY, baseWidth, baseHeight, stampText, fontSize, borderWidth, state);
      break;
    case "business-rectangle":
      drawVintageBusinessRectangle(ctx, centerX, centerY, baseWidth, baseHeight, stampText, fontSize, borderWidth);
      break;
    case "address-rectangle":
      drawVintageAddressRectangle(ctx, baseWidth, baseHeight, stampText, fontSize, borderWidth);
      break;
    case "signature-oval":
      drawVintageSignatureOval(ctx, centerX, centerY, baseWidth, baseHeight, stampText, fontSize, borderWidth);
      break;
    case "logo-square":
      drawVintageLogoSquare(ctx, centerX, centerY, baseWidth, baseHeight, stampText, fontSize, borderWidth);
      break;
  }

  // Reset alpha for ink effects
  ctx.globalAlpha = 1;
  
  // Apply enhanced vintage ink effects for authenticity
  addVintageInkEffects(ctx, baseWidth, baseHeight);

  return canvas;
};

const getVintageTypewriterFont = (size: number, bold: boolean = false): string => {
  return `${bold ? 'bold ' : ''}${size}px "Special Elite", "Old Stamper", "Typewriter", "Courier Prime", "Courier New", monospace`;
};

const drawVintageNotaryCircle = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  baseWidth: number,
  baseHeight: number,
  stampText: string,
  fontSize: number,
  borderWidth: number,
  state: string
) => {
  const outerRadius = (Math.min(baseWidth, baseHeight) - 40) / 2;
  
  // Draw imperfect outer circle with vintage ink effects
  drawImperfectCircle(ctx, centerX, centerY, outerRadius, borderWidth + 1, 0.7);
  
  // Draw imperfect inner circle
  drawImperfectCircle(ctx, centerX, centerY, outerRadius - 25, borderWidth, 0.6);

  const lines = stampText.split('\n').filter(line => line.trim());
  ctx.font = getVintageTypewriterFont(fontSize + 2, true);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Add text with vintage variations
  ctx.save();
  if (lines.length >= 2) {
    // Add slight misalignment for authentic hand-stamped look
    const offsetX1 = (Math.random() - 0.5) * 2;
    const offsetY1 = (Math.random() - 0.5) * 1;
    const offsetX2 = (Math.random() - 0.5) * 2;
    const offsetY2 = (Math.random() - 0.5) * 1;
    
    ctx.globalAlpha = 0.75 + Math.random() * 0.2;
    ctx.fillText(lines[1], centerX + offsetX1, centerY - fontSize/2 + offsetY1);
    
    ctx.globalAlpha = 0.7 + Math.random() * 0.2;
    ctx.fillText(lines[2] || "PUBLIC", centerX + offsetX2, centerY + fontSize/2 + offsetY2);
  }
  ctx.restore();

  // Draw curved text with vintage effects
  if (lines[0]) {
    drawCurvedText(ctx, lines[0], centerX, centerY, outerRadius - 45, -Math.PI/2, true, fontSize, true);
  }

  drawCurvedText(ctx, state, centerX, centerY, outerRadius - 45, Math.PI/2, false, fontSize, true);

  // Draw imperfect star with vintage look
  ctx.save();
  ctx.globalAlpha = 0.8;
  const starSize = 4;
  drawStar(ctx, centerX, centerY + fontSize + 15, starSize);
  ctx.restore();
  
  // Draw decorative lines with imperfections
  ctx.save();
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.6;
  
  // Left line with slight curve
  ctx.beginPath();
  ctx.moveTo(centerX - 30, centerY + fontSize + 15);
  ctx.quadraticCurveTo(centerX - 20, centerY + fontSize + 14, centerX - 10, centerY + fontSize + 15);
  ctx.stroke();
  
  // Right line with slight curve
  ctx.beginPath();
  ctx.moveTo(centerX + 10, centerY + fontSize + 15);
  ctx.quadraticCurveTo(centerX + 20, centerY + fontSize + 16, centerX + 30, centerY + fontSize + 15);
  ctx.stroke();
  ctx.restore();
};

const drawVintageBusinessRectangle = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  baseWidth: number,
  baseHeight: number,
  stampText: string,
  fontSize: number,
  borderWidth: number
) => {
  // Draw slightly imperfect rectangle borders
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = borderWidth;
  
  // Outer border with slight imperfections
  ctx.beginPath();
  ctx.moveTo(15 + Math.random(), 15);
  ctx.lineTo(baseWidth - 30 + Math.random(), 15 + Math.random());
  ctx.lineTo(baseWidth - 15 + Math.random(), baseHeight - 30 + Math.random());
  ctx.lineTo(15 + Math.random(), baseHeight - 15 + Math.random());
  ctx.closePath();
  ctx.stroke();
  
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, baseWidth - 40, baseHeight - 40);
  ctx.restore();
  
  ctx.font = getVintageTypewriterFont(fontSize, true);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const businessLines = stampText.split('\n');
  const lineHeight = fontSize + 5;
  const startY = centerY - ((businessLines.length - 1) * lineHeight) / 2;
  
  businessLines.forEach((line, index) => {
    ctx.save();
    ctx.globalAlpha = 0.75 + Math.random() * 0.2;
    const offsetX = (Math.random() - 0.5) * 1;
    const offsetY = (Math.random() - 0.5) * 1;
    ctx.fillText(line, centerX + offsetX, startY + index * lineHeight + offsetY);
    ctx.restore();
  });
};

const drawVintageAddressRectangle = (
  ctx: CanvasRenderingContext2D,
  baseWidth: number,
  baseHeight: number,
  stampText: string,
  fontSize: number,
  borderWidth: number
) => {
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(15, 15, baseWidth - 30, baseHeight - 30);
  ctx.restore();
  
  ctx.font = getVintageTypewriterFont(fontSize);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const addressLines = stampText.split('\n');
  const padding = 30;
  
  addressLines.forEach((line, index) => {
    ctx.save();
    ctx.globalAlpha = 0.75 + Math.random() * 0.2;
    const offsetX = (Math.random() - 0.5) * 1;
    const offsetY = (Math.random() - 0.5) * 1;
    ctx.fillText(line, padding + offsetX, padding + index * (fontSize + 8) + offsetY);
    ctx.restore();
  });
};

const drawVintageSignatureOval = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  baseWidth: number,
  baseHeight: number,
  stampText: string,
  fontSize: number,
  borderWidth: number
) => {
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = borderWidth + 1;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, (baseWidth - 30) / 2, (baseHeight - 30) / 2, 0, 0, 2 * Math.PI);
  ctx.stroke();
  
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, (baseWidth - 50) / 2, (baseHeight - 50) / 2, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();
  
  ctx.font = getVintageTypewriterFont(fontSize + 2);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.save();
  ctx.globalAlpha = 0.8;
  const offsetX = (Math.random() - 0.5) * 2;
  const offsetY = (Math.random() - 0.5) * 2;
  ctx.fillText(stampText.replace(/\n/g, ' '), centerX + offsetX, centerY + offsetY);
  ctx.restore();
};

const drawVintageLogoSquare = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  baseWidth: number,
  baseHeight: number,
  stampText: string,
  fontSize: number,
  borderWidth: number
) => {
  const cornerRadius = 10;
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = borderWidth;
  drawRoundedRect(ctx, 15, 15, baseWidth - 30, baseHeight - 30, cornerRadius);
  ctx.stroke();
  
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 25, 25, baseWidth - 50, baseHeight - 50, cornerRadius - 5);
  ctx.stroke();
  ctx.restore();
  
  ctx.font = getVintageTypewriterFont(fontSize, true);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const logoLines = stampText.split('\n');
  const logoLineHeight = fontSize + 8;
  const logoStartY = centerY - ((logoLines.length - 1) * logoLineHeight) / 2;
  
  logoLines.forEach((line, index) => {
    ctx.save();
    ctx.globalAlpha = 0.75 + Math.random() * 0.2;
    const offsetX = (Math.random() - 0.5) * 1.5;
    const offsetY = (Math.random() - 0.5) * 1.5;
    ctx.fillText(line, centerX + offsetX, logoStartY + index * logoLineHeight + offsetY);
    ctx.restore();
  });
};
