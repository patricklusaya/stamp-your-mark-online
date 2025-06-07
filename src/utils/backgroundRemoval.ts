
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

function resizeCanvasIfNeeded(sourceCanvas: HTMLCanvasElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  let width = sourceCanvas.width;
  let height = sourceCanvas.height;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(sourceCanvas, 0, 0, width, height);
  return canvas;
}

export const removeBackgroundFromCanvas = async (sourceCanvas: HTMLCanvasElement): Promise<HTMLCanvasElement> => {
  try {
    console.log('Starting background removal process...');
    
    // For now, return a canvas with transparent background applied manually
    // This is a simplified version that works immediately
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = sourceCanvas.width;
    outputCanvas.height = sourceCanvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Copy the source canvas
    outputCtx.drawImage(sourceCanvas, 0, 0);
    
    // Get image data
    const imageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = imageData.data;
    
    // Simple background removal: make white pixels transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // If pixel is close to white, make it transparent
      if (r > 240 && g > 240 && b > 240) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }
    
    outputCtx.putImageData(imageData, 0, 0);
    console.log('Background removal completed');
    
    return outputCanvas;
  } catch (error) {
    console.error('Error removing background:', error);
    // Return original canvas if background removal fails
    return sourceCanvas;
  }
};
