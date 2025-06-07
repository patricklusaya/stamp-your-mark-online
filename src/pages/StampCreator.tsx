
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";

const StampCreator = () => {
  const [stampText, setStampText] = useState("Your Custom Text");
  const [fontSize, setFontSize] = useState([16]);
  const [stampType, setStampType] = useState("rectangle");
  const [borderWidth, setBorderWidth] = useState([2]);

  const handleDownload = () => {
    // Simple implementation - in a real app, this would generate an actual stamp file
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 300;
      canvas.height = 100;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = borderWidth[0];
      if (stampType === 'rectangle') {
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      } else {
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, canvas.height / 2, (canvas.width - 20) / 2, (canvas.height - 20) / 2, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.fillStyle = '#000000';
      ctx.font = `${fontSize[0]}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(stampText, canvas.width / 2, canvas.height / 2 + fontSize[0] / 3);
      
      const link = document.createElement('a');
      link.download = 'custom-stamp.png';
      link.href = canvas.toDataURL();
      link.click();
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
          <h1 className="text-4xl font-bold mb-4">Create Your Custom Stamp</h1>
          <p className="text-xl text-muted-foreground">Design your stamp in real-time with our simple editor</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6 bg-card/80 backdrop-blur p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold">Customize Your Stamp</h2>
            
            <div className="space-y-2">
              <Label htmlFor="stamp-text">Stamp Text</Label>
              <Textarea
                id="stamp-text"
                value={stampText}
                onChange={(e) => setStampText(e.target.value)}
                placeholder="Enter your stamp text..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Font Size: {fontSize[0]}px</Label>
              <Slider
                value={fontSize}
                onValueChange={setFontSize}
                max={24}
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
                max={6}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Stamp Shape</Label>
              <div className="flex gap-4">
                <Button
                  variant={stampType === "rectangle" ? "default" : "outline"}
                  onClick={() => setStampType("rectangle")}
                  className="flex-1"
                >
                  Rectangle
                </Button>
                <Button
                  variant={stampType === "oval" ? "default" : "outline"}
                  onClick={() => setStampType("oval")}
                  className="flex-1"
                >
                  Oval
                </Button>
              </div>
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
              <div 
                className="bg-white p-8 shadow-lg"
                style={{
                  border: `${borderWidth[0]}px solid #000`,
                  borderRadius: stampType === "oval" ? "50%" : "8px",
                  minWidth: "300px",
                  minHeight: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center"
                }}
              >
                <div 
                  style={{ 
                    fontSize: `${fontSize[0]}px`,
                    fontWeight: "bold",
                    color: "#000",
                    lineHeight: "1.2",
                    maxWidth: "260px",
                    wordWrap: "break-word"
                  }}
                >
                  {stampText}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              This is how your stamp will look when printed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampCreator;
