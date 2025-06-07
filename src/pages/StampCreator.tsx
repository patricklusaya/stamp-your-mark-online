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
  const [fontSize, setFontSize] = useState([16]);
  const [stampType, setStampType] = useState("notary-circle");
  const [borderWidth, setBorderWidth] = useState([3]);
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

    // Set high resolution for crisp output
    const scale = 3; // 3x resolution for better quality
    
    // Set canvas size based on stamp type
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
    
    // Scale the context to draw at high resolution
    ctx.scale(scale, scale);

    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.textRenderingOptimization = 'optimizeQuality';

    // Fill background (will be removed later if removeBackground is true)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // Set drawing styles
    ctx.strokeStyle = '#1a365d'; // Darker blue for better contrast
    ctx.fillStyle = '#1a365d';
    ctx.lineWidth = borderWidth[0];
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const centerX = baseWidth / 2;
    const centerY = baseHeight / 2;

    // Draw stamp based on type
    switch (stampType) {
      case "notary-circle":
        // Outer circle with solid border
        const outerRadius = (Math.min(baseWidth, baseHeight) - 40) / 2;
        ctx.lineWidth = borderWidth[0] + 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
        ctx.stroke();

        // Inner circle
        ctx.lineWidth = borderWidth[0];
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius - 25, 0, 2 * Math.PI);
        ctx.stroke();

        // Center text with better typography
        const lines = stampText.split('\n').filter(line => line.trim());
        ctx.font = `bold ${fontSize[0] + 2}px "Times New Roman", serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (lines.length >= 2) {
          ctx.fillText(lines[1], centerX, centerY - fontSize[0]/2); // NOTARY
          ctx.fillText(lines[2] || "PUBLIC", centerX, centerY + fontSize[0]/2);
        }

        // Curved text at top (NAME) with better spacing
        if (lines[0]) {
          drawCurvedText(ctx, lines[0], centerX, centerY, outerRadius - 45, -Math.PI/2, true);
        }

        // Curved text at bottom (STATE)
        drawCurvedText(ctx, state, centerX, centerY, outerRadius - 45, Math.PI/2, false);

        // Decorative elements with better design
        const starSize = 4;
        drawStar(ctx, centerX, centerY + fontSize[0] + 15, starSize);
        
        // Side decorative lines
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 30, centerY + fontSize[0] + 15);
        ctx.lineTo(centerX - 10, centerY + fontSize[0] + 15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX + 10, centerY + fontSize[0] + 15);
        ctx.lineTo(centerX + 30, centerY + fontSize[0] + 15);
        ctx.stroke();
        break;

      case "business-rectangle":
        // Double border design
        ctx.lineWidth = borderWidth[0];
        ctx.strokeRect(15, 15, baseWidth - 30, baseHeight - 30);
        ctx.lineWidth = 1;
        ctx.strokeRect(20, 20, baseWidth - 40, baseHeight - 40);
        
        // Text with better formatting
        ctx.font = `bold ${fontSize[0]}px "Arial", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const businessLines = stampText.split('\n');
        const lineHeight = fontSize[0] + 5;
        const startY = centerY - ((businessLines.length - 1) * lineHeight) / 2;
        
        businessLines.forEach((line, index) => {
          ctx.fillText(line, centerX, startY + index * lineHeight);
        });
        break;

      case "address-rectangle":
        // Simple elegant border
        ctx.lineWidth = borderWidth[0];
        ctx.strokeRect(15, 15, baseWidth - 30, baseHeight - 30);
        
        // Left-aligned text for addresses
        ctx.font = `${fontSize[0]}px "Arial", sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const addressLines = stampText.split('\n');
        const padding = 30;
        addressLines.forEach((line, index) => {
          ctx.fillText(line, padding, padding + index * (fontSize[0] + 8));
        });
        break;

      case "signature-oval":
        // Elegant oval with thicker border
        ctx.lineWidth = borderWidth[0] + 1;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, (baseWidth - 30) / 2, (baseHeight - 30) / 2, 0, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Inner oval
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, (baseWidth - 50) / 2, (baseHeight - 50) / 2, 0, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Elegant script-style text
        ctx.font = `italic ${fontSize[0] + 2}px "Georgia", serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stampText.replace(/\n/g, ' '), centerX, centerY);
        break;

      case "logo-square":
        // Modern square design with rounded corners effect
        const cornerRadius = 10;
        ctx.lineWidth = borderWidth[0];
        drawRoundedRect(ctx, 15, 15, baseWidth - 30, baseHeight - 30, cornerRadius);
        ctx.stroke();
        
        ctx.lineWidth = 1;
        drawRoundedRect(ctx, 25, 25, baseWidth - 50, baseHeight - 50, cornerRadius - 5);
        ctx.stroke();
        
        // Modern typography
        ctx.font = `bold ${fontSize[0]}px "Helvetica", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const logoLines = stampText.split('\n');
        const logoLineHeight = fontSize[0] + 8;
        const logoStartY = centerY - ((logoLines.length - 1) * logoLineHeight) / 2;
        
        logoLines.forEach((line, index) => {
          ctx.fillText(line, centerX, logoStartY + index * logoLineHeight);
        });
        break;
    }

    return canvas;
  };

  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 144 - 90) * Math.PI / 180;
      const x1 = Math.cos(angle) * size;
      const y1 = Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const drawCurvedText = (ctx: CanvasRenderingContext2D, text: string, centerX: number, centerY: number, radius: number, startAngle: number, clockwise: boolean) => {
    ctx.save();
    ctx.font = `bold ${fontSize[0]}px "Times New Roman", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const totalAngle = Math.PI * 1.2; // Reduced for better curve
    const angleStep = totalAngle / Math.max(text.length - 1, 1);
    const startOffset = startAngle - totalAngle / 2;
    
    for (let i = 0; i < text.length; i++) {
      const angle = startOffset + (clockwise ? i * angleStep : -i * angleStep);
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
      link.href = finalCanvas.toDataURL('image/png', 1.0); // Maximum quality
      link.click();
    } catch (error) {
      console.error('Error processing stamp:', error);
      // Fallback to download with background
      const link = document.createElement('a');
      link.download = `${stampType}-stamp.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
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
                max={32}
                min={12}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Border Width: {borderWidth[0]}px</Label>
              <Slider
                value={borderWidth}
                onValueChange={setBorderWidth}
                max={8}
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
                          // Scale down for preview while maintaining quality
                          const scale = 0.8;
                          canvasRef.width = generatedCanvas.width * scale;
                          canvasRef.height = generatedCanvas.height * scale;
                          ctx.scale(scale, scale);
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
