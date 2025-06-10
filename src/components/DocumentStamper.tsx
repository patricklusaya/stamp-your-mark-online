
import { useState, useRef, useCallback, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToImage = useCallback(async (file: File): Promise<HTMLImageElement> => {
    return new Promise(async (resolve, reject) => {
      const img = new Image();
      
      if (file.type.startsWith('image/')) {
        // Handle image files directly
        const reader = new FileReader();
        reader.onload = (e) => {
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        // Handle PDF files
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfjsLib = await import('pdfjs-dist');
          
          // Set worker source
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
          
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const page = await pdf.getPage(1); // Get first page
          
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) throw new Error('Could not get canvas context');
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;
          
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = canvas.toDataURL();
        } catch (error) {
          reject(new Error('Failed to process PDF file'));
        }
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Handle DOCX files (convert to image representation)
        reject(new Error('DOCX files need to be converted to PDF or image format first. Please save as PDF and upload again.'));
      } else {
        reject(new Error('Unsupported file format'));
      }
    });
  }, []);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const supportedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/pdf'
    ];

    if (!supportedTypes.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or PDF file");
      return;
    }

    setIsLoading(true);
    try {
      const img = await convertToImage(file);
      setDocument(img);
      setStamps([]);
      toast.success("Document uploaded successfully!");
    } catch (error) {
      console.error('Error converting file:', error);
      toast.error("Failed to process the file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [convertToImage]);

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
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

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
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="icon"
                disabled={isLoading}
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Upload JPG, PNG, or PDF files. {isLoading && "Processing..."}
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
