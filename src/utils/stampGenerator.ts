
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

  const scale = 3;
  
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
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, baseWidth, baseHeight);

  ctx.strokeStyle = '#1a365d';
  ctx.fillStyle = '#1a365d';
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
  const outerRadius = (Math.min(baseWidth, baseHeight) - 40) / 2;
  
  ctx.lineWidth = borderWidth + 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.lineWidth = borderWidth;
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius - 25, 0, 2 * Math.PI);
  ctx.stroke();

  const lines = stampText.split('\n').filter(line => line.trim());
  ctx.font = `bold ${fontSize + 2}px "Times New Roman", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  if (lines.length >= 2) {
    ctx.fillText(lines[1], centerX, centerY - fontSize/2);
    ctx.fillText(lines[2] || "PUBLIC", centerX, centerY + fontSize/2);
  }

  if (lines[0]) {
    drawCurvedText(ctx, lines[0], centerX, centerY, outerRadius - 45, -Math.PI/2, true, fontSize);
  }

  drawCurvedText(ctx, state, centerX, centerY, outerRadius - 45, Math.PI/2, false, fontSize);

  const starSize = 4;
  drawStar(ctx, centerX, centerY + fontSize + 15, starSize);
  
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - 30, centerY + fontSize + 15);
  ctx.lineTo(centerX - 10, centerY + fontSize + 15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX + 10, centerY + fontSize + 15);
  ctx.lineTo(centerX + 30, centerY + fontSize + 15);
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
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(15, 15, baseWidth - 30, baseHeight - 30);
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, baseWidth - 40, baseHeight - 40);
  
  ctx.font = `bold ${fontSize}px "Arial", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const businessLines = stampText.split('\n');
  const lineHeight = fontSize + 5;
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
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(15, 15, baseWidth - 30, baseHeight - 30);
  
  ctx.font = `${fontSize}px "Arial", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const addressLines = stampText.split('\n');
  const padding = 30;
  addressLines.forEach((line, index) => {
    ctx.fillText(line, padding, padding + index * (fontSize + 8));
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
  ctx.lineWidth = borderWidth + 1;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, (baseWidth - 30) / 2, (baseHeight - 30) / 2, 0, 0, 2 * Math.PI);
  ctx.stroke();
  
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, (baseWidth - 50) / 2, (baseHeight - 50) / 2, 0, 0, 2 * Math.PI);
  ctx.stroke();
  
  ctx.font = `italic ${fontSize + 2}px "Georgia", serif`;
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
  const cornerRadius = 10;
  ctx.lineWidth = borderWidth;
  drawRoundedRect(ctx, 15, 15, baseWidth - 30, baseHeight - 30, cornerRadius);
  ctx.stroke();
  
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 25, 25, baseWidth - 50, baseHeight - 50, cornerRadius - 5);
  ctx.stroke();
  
  ctx.font = `bold ${fontSize}px "Helvetica", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const logoLines = stampText.split('\n');
  const logoLineHeight = fontSize + 8;
  const logoStartY = centerY - ((logoLines.length - 1) * logoLineHeight) / 2;
  
  logoLines.forEach((line, index) => {
    ctx.fillText(line, centerX, logoStartY + index * logoLineHeight);
  });
};
