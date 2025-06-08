
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, RotateCcw } from "lucide-react";
import { generateStampCanvas, StampConfig } from "@/utils/stampGenerator";
import { toast } from "sonner";

interface StampPosition {
  x: number;
  y: number;
  id: string;
  config: StampConfig;
}

interface DocumentStamperProps {
  stampConfig: StampConfig;
}

const DocumentStamper = ({ stampConfig }: DocumentStamperProps) => {
  const [document, setDocument] = useState<HTMLImageElement | null>(null);
  const [stamps, setStamps] = useState<StampPosition[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setDocument(img);
        setStamps([]);
        toast.success("Document uploaded successfully!");
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!document || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const newStamp: StampPosition = {
      x,
      y,
      id: Date.now().toString(),
      config: stampConfig
    };

    setStamps(prev => [...prev, newStamp]);
    toast.success("Stamp placed!");
  }, [document, stampConfig]);

  const redrawCanvas = useCallback(() => {
    if (!canvasRef.current || !document) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match document
    canvas.width = document.naturalWidth;
    canvas.height = document.naturalHeight;

    // Draw document
    ctx.drawImage(document, 0, 0);

    // Draw all stamps
    stamps.forEach(stamp => {
      const stampCanvas = generateStampCanvas(stamp.config);
      if (stampCanvas) {
        const stampWidth = stampCanvas.width / 2; // Scale down stamp
        const stampHeight = stampCanvas.height / 2;
        
        ctx.save();
        ctx.globalAlpha = 0.8; // Make stamp semi-transparent
        ctx.drawImage(
          stampCanvas, 
          stamp.x - stampWidth / 2, 
          stamp.y - stampHeight / 2,
          stampWidth,
          stampHeight
        );
        ctx.restore();
      }
    });
  }, [document, stamps]);

  // Redraw canvas when document or stamps change
  useState(() => {
    redrawCanvas();
  });

  const handleClearStamps = () => {
    setStamps([]);
    toast.success("All stamps cleared!");
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'stamped-document.png';
    link.href = canvasRef.current.toDataURL('image/png', 1.0);
    link.click();
    toast.success("Document downloaded!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-card/80 backdrop-blur p-6 rounded-lg border">
        <h3 className="text-xl font-semibold mb-4">Document Stamper</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="document-upload">Upload Document</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="document-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="flex-1"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="icon"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Upload an image of your document (JPG, PNG, etc.)
            </p>
          </div>

          {document && (
            <div className="flex gap-2">
              <Button onClick={handleClearStamps} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear Stamps
              </Button>
              <Button onClick={handleDownload} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </div>
      </div>

      {document && (
        <div className="bg-card/80 backdrop-blur p-6 rounded-lg border">
          <h4 className="text-lg font-medium mb-4">
            Click on the document to place stamps ({stamps.length} placed)
          </h4>
          <div className="border rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="max-w-full max-h-[600px] cursor-crosshair"
              style={{ display: 'block', margin: '0 auto' }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Click anywhere on the document to place a stamp at that location
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentStamper;
