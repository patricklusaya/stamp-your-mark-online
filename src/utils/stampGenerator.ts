
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
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#000';
  ctx.lineWidth = borderWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

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
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius - 20, 0, 2 * Math.PI);
  ctx.stroke();

  const lines = stampText.split('\n').filter(line => line.trim());
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  if (lines.length >= 2) {
    ctx.fillText(lines[1], centerX, centerY - fontSize/2);
    ctx.fillText(lines[2] || "PUBLIC", centerX, centerY + fontSize/2);
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
  ctx.stroke();
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
  ctx.lineWidth = 1;
  ctx.strokeRect(15, 15, baseWidth - 30, baseHeight - 30);
  
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const businessLines = stampText.split('\n');
  const lineHeight = fontSize + 3;
  const startY = centerY - ((businessLines.length - 1) * lineHeight) / 2;
  
  businessLines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + index * lineHeight);
  });
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
  
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const addressLines = stampText.split('\n');
  const padding = 20;
  
  addressLines.forEach((line, index) => {
    ctx.fillText(line, padding, padding + index * (fontSize + 5));
  });
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
  ctx.stroke();
  
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, (baseWidth - 35) / 2, (baseHeight - 35) / 2, 0, 0, 2 * Math.PI);
  ctx.stroke();
  
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(stampText.replace(/\n/g, ' '), centerX, centerY);
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
  ctx.stroke();
  
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 15, 15, baseWidth - 30, baseHeight - 30, cornerRadius - 3);
  ctx.stroke();
  
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const logoLines = stampText.split('\n');
  const logoLineHeight = fontSize + 5;
  const logoStartY = centerY - ((logoLines.length - 1) * logoLineHeight) / 2;
  
  logoLines.forEach((line, index) => {
    ctx.fillText(line, centerX, logoStartY + index * logoLineHeight);
  });
};
