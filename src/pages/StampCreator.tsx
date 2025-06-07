
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { removeBackgroundFromCanvas } from "@/utils/backgroundRemoval";

const StampCreator = () => {
  const [stampText, setStampText] = useState("YOUR NAME\nNOTARY\nPUBLIC");
  const [fontSize, setFontSize] = useState([14]);
  const [stampType, setStampType] = useState("notary-circle");
  const [borderWidth, setBorderWidth] = useState([2]);
  const [state, setState] = useState("STATE OF NEW YORK");
  const [removeBackground, setRemoveBackground] = useState(true);

  const stampTypes = {
    "notary-circle": "Notary Circle",
    "business-rectangle": "Business Rectangle", 
    "address-rectangle": "Address Rectangle",
    "signature-oval": "Signature Oval",
    "logo-square": "Logo Square"
  };

  const generateStampCanvas = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size based on stamp type
    if (stampType === "notary-circle") {
      canvas.width = 300;
      canvas.height = 300;
    } else if (stampType === "logo-square") {
      canvas.width = 250;
      canvas.height = 250;
    } else {
      canvas.width = 350;
      canvas.height = 120;
    }

    // Fill background (will be removed later if removeBackground is true)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set drawing styles
    ctx.strokeStyle = '#1e40af';
    ctx.fillStyle = '#1e40af';
    ctx.lineWidth = borderWidth[0];
    ctx.font = `${fontSize[0]}px Arial`;
    ctx.textAlign = 'center';

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw stamp based on type
    switch (stampType) {
      case "notary-circle":
        // Outer circle with dashed border
        const outerRadius = (Math.min(canvas.width, canvas.height) - 20) / 2;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
        ctx.stroke();

        // Inner circle
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius - 20, 0, 2 * Math.PI);
        ctx.stroke();

        // Center text (NOTARY PUBLIC)
        const lines = stampText.split('\n').filter(line => line.trim());
        ctx.font = `bold ${fontSize[0]}px Arial`;
        
        if (lines.length >= 2) {
          ctx.fillText(lines[1], centerX, centerY - 5); // NOTARY
          ctx.fillText(lines[2] || "PUBLIC", centerX, centerY + fontSize[0]);
        }

        // Curved text at top (NAME)
        if (lines[0]) {
          drawCurvedText(ctx, lines[0], centerX, centerY, outerRadius - 35, -Math.PI/2, true);
        }

        // Curved text at bottom (STATE)
        drawCurvedText(ctx, state, centerX, centerY, outerRadius - 35, Math.PI/2, false);

        // Center decorative element
        ctx.beginPath();
        ctx.arc(centerX - 10, centerY + 35, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10, centerY + 35, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(centerX - 8, centerY + 35);
        ctx.lineTo(centerX + 8, centerY + 35);
        ctx.stroke();
        break;

      case "business-rectangle":
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
        ctx.font = `bold ${fontSize[0]}px Arial`;
        const businessLines = stampText.split('\n');
        businessLines.forEach((line, index) => {
          ctx.fillText(line, centerX, centerY - (businessLines.length - 1) * fontSize[0]/2 + index * fontSize[0]);
        });
        break;

      case "address-rectangle":
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        ctx.font = `${fontSize[0]}px Arial`;
        const addressLines = stampText.split('\n');
        addressLines.forEach((line, index) => {
          ctx.fillText(line, centerX, 40 + index * (fontSize[0] + 5));
        });
        break;

      case "signature-oval":
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, (canvas.width - 20) / 2, (canvas.height - 20) / 2, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.font = `italic ${fontSize[0]}px Arial`;
        ctx.fillText(stampText.replace(/\n/g, ' '), centerX, centerY);
        break;

      case "logo-square":
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        ctx.font = `bold ${fontSize[0]}px Arial`;
        const logoLines = stampText.split('\n');
        logoLines.forEach((line, index) => {
          ctx.fillText(line, centerX, centerY - (logoLines.length - 1) * fontSize[0]/2 + index * fontSize[0]);
        });
        break;
    }

    return canvas;
  };

  const drawCurvedText = (ctx: CanvasRenderingContext2D, text: string, centerX: number, centerY: number, radius: number, startAngle: number, clockwise: boolean) => {
    const angleStep = (Math.PI * 1.5) / text.length; // Adjust curve spread
    ctx.save();
    ctx.font = `bold ${fontSize[0]}px Arial`;
    
    for (let i = 0; i < text.length; i++) {
      const angle = startAngle + (clockwise ? i * angleStep : -i * angleStep);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + (clockwise ? Math.PI/2 : -Math.PI/2));
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
    ctx.restore();
  };

  const handleDownload = async () => {
    const canvas = generateStampCanvas();
    if (!canvas) return;

    try {
      let finalCanvas = canvas;
      
      if (removeBackground) {
        finalCanvas = await removeBackgroundFromCanvas(canvas);
      }
      
      const link = document.createElement('a');
      link.download = `${stampType}-stamp.png`;
      link.href = finalCanvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error processing stamp:', error);
      // Fallback to download with background
      const link = document.createElement('a');
      link.download = `${stampType}-stamp.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const getPlaceholderText = () => {
    switch (stampType) {
      case "notary-circle":
        return "YOUR NAME\nNOTARY\nPUBLIC";
      case "business-rectangle":
        return "COMPANY NAME\nESTABLISHED 2024\nPROFESSIONAL SERVICES";
      case "address-rectangle":
        return "John Smith\n123 Main Street\nNew York, NY 10001";
      case "signature-oval":
        return "John Smith";
      case "logo-square":
        return "LOGO\nCOMPANY";
      default:
        return "Your Custom Text";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Create Your Professional Stamp</h1>
          <p className="text-xl text-muted-foreground">Choose from professional formats and download without background</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6 bg-card/80 backdrop-blur p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold">Customize Your Stamp</h2>
            
            <div className="space-y-2">
              <Label>Stamp Type</Label>
              <Select value={stampType} onValueChange={(value) => {
                setStampType(value);
                setStampText(getPlaceholderText());
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(stampTypes).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stamp-text">Stamp Text</Label>
              <Textarea
                id="stamp-text"
                value={stampText}
                onChange={(e) => setStampText(e.target.value)}
                placeholder={getPlaceholderText()}
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">Use line breaks for multiple lines</p>
            </div>

            {stampType === "notary-circle" && (
              <div className="space-y-2">
                <Label htmlFor="state">State/Location</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="STATE OF NEW YORK"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Font Size: {fontSize[0]}px</Label>
              <Slider
                value={fontSize}
                onValueChange={setFontSize}
                max={24}
                min={10}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Border Width: {borderWidth[0]}px</Label>
              <Slider
                value={borderWidth}
                onValueChange={setBorderWidth}
                max={6}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remove-bg"
                checked={removeBackground}
                onChange={(e) => setRemoveBackground(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="remove-bg">Remove background (transparent)</Label>
            </div>

            <Button onClick={handleDownload} size="lg" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Stamp
            </Button>
          </div>

          {/* Preview */}
          <div className="bg-card/80 backdrop-blur p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-6">Live Preview</h2>
            <div className="flex items-center justify-center min-h-[400px] bg-secondary/20 rounded-lg">
              <div className="bg-white p-8 shadow-lg rounded-lg">
                <canvas 
                  ref={(canvasRef) => {
                    if (canvasRef) {
                      const generatedCanvas = generateStampCanvas();
                      if (generatedCanvas) {
                        const ctx = canvasRef.getContext('2d');
                        if (ctx) {
                          canvasRef.width = generatedCanvas.width;
                          canvasRef.height = generatedCanvas.height;
                          ctx.drawImage(generatedCanvas, 0, 0);
                        }
                      }
                    }
                  }}
                  className="max-w-full max-h-full"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              This is how your stamp will look when downloaded
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampCreator;
