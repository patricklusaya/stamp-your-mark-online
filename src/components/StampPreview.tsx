
import { useEffect, useRef } from "react";
import { generateStampCanvas, StampConfig } from "@/utils/stampGenerator";

interface StampPreviewProps {
  config: StampConfig;
}

const StampPreview = ({ config }: StampPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const generatedCanvas = generateStampCanvas(config);
      if (generatedCanvas) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const scale = 0.8;
          canvasRef.current.width = generatedCanvas.width * scale;
          canvasRef.current.height = generatedCanvas.height * scale;
          ctx.scale(scale, scale);
          ctx.drawImage(generatedCanvas, 0, 0);
        }
      }
    }
  }, [config]);

  return (
    <div className="bg-card/80 backdrop-blur p-6 rounded-lg border">
      <h2 className="text-2xl font-semibold mb-6">Live Preview</h2>
      <div className="flex items-center justify-center min-h-[400px] bg-secondary/20 rounded-lg">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <canvas 
            ref={canvasRef}
            className="max-w-full max-h-full"
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-4 text-center">
        This is how your stamp will look when downloaded
      </p>
    </div>
  );
};

export default StampPreview;
