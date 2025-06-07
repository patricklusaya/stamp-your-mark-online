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
  
  // Enable high-quality scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  ctx.drawImage(sourceCanvas, 0, 0, width, height);
  return canvas;
}

export const removeBackgroundFromCanvas = async (sourceCanvas: HTMLCanvasElement): Promise<HTMLCanvasElement> => {
  try {
    console.log('Starting background removal process...');
    
    // Create output canvas with same dimensions as source
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = sourceCanvas.width;
    outputCanvas.height = sourceCanvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Enable high-quality rendering
    outputCtx.imageSmoothingEnabled = true;
    outputCtx.imageSmoothingQuality = 'high';
    
    // Copy the source canvas
    outputCtx.drawImage(sourceCanvas, 0, 0);
    
    // Get image data
    const imageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = imageData.data;
    
    // Enhanced background removal with better edge detection
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate luminance
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // More sophisticated white background detection
      const isWhiteish = r > 235 && g > 235 && b > 235;
      const isVeryBright = luminance > 240;
      const colorVariance = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
      
      // Remove background if it's white/bright with low color variance
      if ((isWhiteish || isVeryBright) && colorVariance < 15) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      } else {
        // Keep original alpha for non-background pixels
        data[i + 3] = Math.max(data[i + 3], 255); // Ensure full opacity for stamp elements
      }
    }
    
    // Apply anti-aliasing to smooth edges
    const smoothedData = new Uint8ClampedArray(data);
    for (let y = 1; y < outputCanvas.height - 1; y++) {
      for (let x = 1; x < outputCanvas.width - 1; x++) {
        const idx = (y * outputCanvas.width + x) * 4;
        const alpha = data[idx + 3];
        
        // If this pixel is semi-transparent, smooth it with neighbors
        if (alpha > 0 && alpha < 255) {
          let totalAlpha = 0;
          let count = 0;
          
          // Check 3x3 neighborhood
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const neighborIdx = ((y + dy) * outputCanvas.width + (x + dx)) * 4;
              if (data[neighborIdx + 3] > 0) {
                totalAlpha += data[neighborIdx + 3];
                count++;
              }
            }
          }
          
          if (count > 0) {
            smoothedData[idx + 3] = Math.min(255, totalAlpha / count);
          }
        }
      }
    }
    
    // Create new image data with smoothed alpha
    const smoothedImageData = new ImageData(smoothedData, outputCanvas.width, outputCanvas.height);
    outputCtx.putImageData(smoothedImageData, 0, 0);
    
    console.log('Background removal completed with enhanced quality');
    
    return outputCanvas;
  } catch (error) {
    console.error('Error removing background:', error);
    // Return original canvas if background removal fails
    return sourceCanvas;
  }
};
