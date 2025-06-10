
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, RotateCcw, Move, RotateCw } from "lucide-react";
import { generateStampCanvas, StampConfig } from "@/utils/stampGenerator";
import { toast } from "sonner";

interface StampPosition {
  x: number;
  y: number;
  rotation: number;
  id: string;
  config: StampConfig;
}

interface DocumentStamperProps {
  stampConfig: StampConfig;
}

const DocumentStamper = ({ stampConfig }: DocumentStamperProps) => {
  const [document, setDocument] = useState<HTMLImageElement | null>(null);
  const [stamps, setStamps] = useState<StampPosition[]>([]);
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
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
          const canvas = globalThis.document.createElement('canvas');
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
      setSelectedStamp(null);
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

    // Check if clicked on existing stamp
    const clickedStamp = stamps.find(stamp => {
      const distance = Math.sqrt((stamp.x - x) ** 2 + (stamp.y - y) ** 2);
      return distance < 50; // 50px radius for selection
    });

    if (clickedStamp) {
      setSelectedStamp(clickedStamp.id);
      toast.success("Stamp selected! Use controls below to adjust.");
    } else {
      // Create new stamp
      const newStamp: StampPosition = {
        x,
        y,
        rotation: 0,
        id: Date.now().toString(),
        config: stampConfig
      };

      setStamps(prev => [...prev, newStamp]);
      setSelectedStamp(newStamp.id);
      toast.success("Stamp placed! Click to select and adjust.");
    }
  }, [document, stampConfig, stamps]);

  const updateSelectedStamp = useCallback((updates: Partial<StampPosition>) => {
    if (!selectedStamp) return;
    
    setStamps(prev => prev.map(stamp => 
      stamp.id === selectedStamp 
        ? { ...stamp, ...updates }
        : stamp
    ));
  }, [selectedStamp]);

  const deleteSelectedStamp = useCallback(() => {
    if (!selectedStamp) return;
    
    setStamps(prev => prev.filter(stamp => stamp.id !== selectedStamp));
    setSelectedStamp(null);
    toast.success("Stamp deleted!");
  }, [selectedStamp]);

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
        ctx.translate(stamp.x, stamp.y);
        ctx.rotate((stamp.rotation * Math.PI) / 180);
        ctx.drawImage(
          stampCanvas, 
          -stampWidth / 2, 
          -stampHeight / 2,
          stampWidth,
          stampHeight
        );
        
        // Draw selection indicator
        if (stamp.id === selectedStamp) {
          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(-stampWidth / 2 - 5, -stampHeight / 2 - 5, stampWidth + 10, stampHeight + 10);
          ctx.setLineDash([]);
        }
        
        ctx.restore();
      }
    });
  }, [document, stamps, selectedStamp]);

  // Redraw canvas when document or stamps change
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const handleClearStamps = () => {
    setStamps([]);
    setSelectedStamp(null);
    toast.success("All stamps cleared!");
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const link = globalThis.document.createElement('a');
    link.download = 'stamped-document.png';
    link.href = canvasRef.current.toDataURL('image/png', 1.0);
    link.click();
    toast.success("Document downloaded!");
  };

  const selectedStampData = stamps.find(stamp => stamp.id === selectedStamp);

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
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleClearStamps} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear All
              </Button>
              {selectedStamp && (
                <Button onClick={deleteSelectedStamp} variant="destructive" size="sm">
                  Delete Selected
                </Button>
              )}
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
            Click anywhere to place a stamp, or click on existing stamps to select and adjust them
          </p>
        </div>
      )}

      {selectedStampData && (
        <div className="bg-card/80 backdrop-blur p-6 rounded-lg border">
          <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Move className="w-5 h-5" />
            Adjust Selected Stamp
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>X Position: {Math.round(selectedStampData.x)}px</Label>
              <Slider
                value={[selectedStampData.x]}
                onValueChange={([x]) => updateSelectedStamp({ x })}
                max={document?.naturalWidth || 800}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Y Position: {Math.round(selectedStampData.y)}px</Label>
              <Slider
                value={[selectedStampData.y]}
                onValueChange={([y]) => updateSelectedStamp({ y })}
                max={document?.naturalHeight || 600}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                Rotation: {selectedStampData.rotation}°
              </Label>
              <Slider
                value={[selectedStampData.rotation]}
                onValueChange={([rotation]) => updateSelectedStamp({ rotation })}
                max={360}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentStamper;
