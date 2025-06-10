
import { drawRoundedRect, drawStar, drawCurvedText } from './stampDrawing';

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

  const scale = 2;
  
  let baseWidth, baseHeight;
  if (stampType === "notary-circle") {
    baseWidth = baseHeight = 300;
  } else if (stampType === "logo-square") {
    baseWidth = baseHeight = 250;
  } else if (stampType === "signature-oval") {
    baseWidth = 350;
    baseHeight = 150;
  } else {
    baseWidth = 350;
    baseHeight = 120;
  }

  canvas.width = baseWidth * scale;
  canvas.height = baseHeight * scale;
  
  ctx.scale(scale, scale);
  
  // Set up ink-like appearance
  ctx.strokeStyle = '#1a1a1a';
  ctx.fillStyle = '#1a1a1a';
  ctx.lineWidth = borderWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Add slight imperfections to lines
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 1;
  ctx.shadowOffsetX = 0.5;
  ctx.shadowOffsetY = 0.5;

  const centerX = baseWidth / 2;
  const centerY = baseHeight / 2;

  switch (stampType) {
    case "notary-circle":
      drawNotaryCircle(ctx, centerX, centerY, baseWidth, baseHeight, stampText, fontSize, borderWidth, state);
      break;
    case "business-rectangle":
      drawBusinessRectangle(ctx, centerX, centerY, baseWidth, baseHeight, stampText, fontSize, borderWidth);
      break;
    case "address-rectangle":
      drawAddressRectangle(ctx, baseWidth, baseHeight, stampText, fontSize, borderWidth);
      break;
    case "signature-oval":
      drawSignatureOval(ctx, centerX, centerY, baseWidth, baseHeight, stampText, fontSize, borderWidth);
      break;
    case "logo-square":
      drawLogoSquare(ctx, centerX, centerY, baseWidth, baseHeight, stampText, fontSize, borderWidth);
      break;
  }

  return canvas;
};

const addInkTexture = (ctx: CanvasRenderingContext2D) => {
  // Add random ink spots and imperfections
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * ctx.canvas.width;
    const y = Math.random() * ctx.canvas.height;
    const radius = Math.random() * 2 + 0.5;
    
    ctx.save();
    ctx.globalAlpha = Math.random() * 0.3 + 0.1;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
};

const drawNotaryCircle = (
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
  const outerRadius = (Math.min(baseWidth, baseHeight) - 20) / 2;
  
  // Draw outer circle with slight imperfections
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
  addLineImperfections(ctx);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius - 20, 0, 2 * Math.PI);
  addLineImperfections(ctx);
  ctx.stroke();

  const lines = stampText.split('\n').filter(line => line.trim());
  ctx.font = `bold ${fontSize}px "Special Elite", "Courier Prime", "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  if (lines.length >= 2) {
    addTextImperfections(ctx, lines[1], centerX, centerY - fontSize/2);
    addTextImperfections(ctx, lines[2] || "PUBLIC", centerX, centerY + fontSize/2);
  }

  if (lines[0]) {
    drawCurvedText(ctx, lines[0], centerX, centerY, outerRadius - 35, -Math.PI/2, true, fontSize);
  }

  drawCurvedText(ctx, state, centerX, centerY, outerRadius - 35, Math.PI/2, false, fontSize);

  drawStar(ctx, centerX, centerY + fontSize + 10, 3);
  
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - 25, centerY + fontSize + 10);
  ctx.lineTo(centerX - 8, centerY + fontSize + 10);
  ctx.moveTo(centerX + 8, centerY + fontSize + 10);
  ctx.lineTo(centerX + 25, centerY + fontSize + 10);
  addLineImperfections(ctx);
  ctx.stroke();

  addInkTexture(ctx);
};

const drawBusinessRectangle = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  baseWidth: number,
  baseHeight: number,
  stampText: string,
  fontSize: number,
  borderWidth: number
) => {
  ctx.strokeRect(10, 10, baseWidth - 20, baseHeight - 20);
  addLineImperfections(ctx);
  ctx.lineWidth = 1;
  ctx.strokeRect(15, 15, baseWidth - 30, baseHeight - 30);
  addLineImperfections(ctx);
  
  ctx.font = `bold ${fontSize}px "Special Elite", "Courier Prime", "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const businessLines = stampText.split('\n');
  const lineHeight = fontSize + 3;
  const startY = centerY - ((businessLines.length - 1) * lineHeight) / 2;
  
  businessLines.forEach((line, index) => {
    addTextImperfections(ctx, line, centerX, startY + index * lineHeight);
  });

  addInkTexture(ctx);
};

const drawAddressRectangle = (
  ctx: CanvasRenderingContext2D,
  baseWidth: number,
  baseHeight: number,
  stampText: string,
  fontSize: number,
  borderWidth: number
) => {
  ctx.strokeRect(10, 10, baseWidth - 20, baseHeight - 20);
  addLineImperfections(ctx);
  
  ctx.font = `${fontSize}px "Special Elite", "Courier Prime", "Courier New", monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const addressLines = stampText.split('\n');
  const padding = 20;
  
  addressLines.forEach((line, index) => {
    const x = padding + Math.random() * 2 - 1; // slight horizontal jitter
    const y = padding + index * (fontSize + 5) + Math.random() * 2 - 1; // slight vertical jitter
    addTextImperfections(ctx, line, x, y);
  });

  addInkTexture(ctx);
};

const drawSignatureOval = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  baseWidth: number,
  baseHeight: number,
  stampText: string,
  fontSize: number,
  borderWidth: number
) => {
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, (baseWidth - 20) / 2, (baseHeight - 20) / 2, 0, 0, 2 * Math.PI);
  addLineImperfections(ctx);
  ctx.stroke();
  
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, (baseWidth - 35) / 2, (baseHeight - 35) / 2, 0, 0, 2 * Math.PI);
  addLineImperfections(ctx);
  ctx.stroke();
  
  ctx.font = `${fontSize}px "Special Elite", "Courier Prime", "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  addTextImperfections(ctx, stampText.replace(/\n/g, ' '), centerX, centerY);

  addInkTexture(ctx);
};

const drawLogoSquare = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  baseWidth: number,
  baseHeight: number,
  stampText: string,
  fontSize: number,
  borderWidth: number
) => {
  const cornerRadius = 8;
  drawRoundedRect(ctx, 10, 10, baseWidth - 20, baseHeight - 20, cornerRadius);
  addLineImperfections(ctx);
  ctx.stroke();
  
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 15, 15, baseWidth - 30, baseHeight - 30, cornerRadius - 3);
  addLineImperfections(ctx);
  ctx.stroke();
  
  ctx.font = `bold ${fontSize}px "Special Elite", "Courier Prime", "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const logoLines = stampText.split('\n');
  const logoLineHeight = fontSize + 5;
  const logoStartY = centerY - ((logoLines.length - 1) * logoLineHeight) / 2;
  
  logoLines.forEach((line, index) => {
    addTextImperfections(ctx, line, centerX, logoStartY + index * logoLineHeight);
  });

  addInkTexture(ctx);
};

// Helper function to add realistic imperfections to lines
const addLineImperfections = (ctx: CanvasRenderingContext2D) => {
  const originalStroke = ctx.stroke;
  ctx.stroke = function() {
    // Add slight variations to line width
    const originalLineWidth = ctx.lineWidth;
    ctx.lineWidth = originalLineWidth + (Math.random() - 0.5) * 0.5;
    originalStroke.call(ctx);
    ctx.lineWidth = originalLineWidth;
  };
};

// Helper function to add realistic imperfections to text
const addTextImperfections = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number) => {
  // Save original settings
  ctx.save();
  
  // Add slight rotation and position variations
  const rotation = (Math.random() - 0.5) * 0.02; // Very slight rotation
  const offsetX = (Math.random() - 0.5) * 1;
  const offsetY = (Math.random() - 0.5) * 1;
  
  ctx.translate(x + offsetX, y + offsetY);
  ctx.rotate(rotation);
  
  // Add slight transparency variation
  ctx.globalAlpha = 0.8 + Math.random() * 0.2;
  
  ctx.fillText(text, 0, 0);
  
  ctx.restore();
};
