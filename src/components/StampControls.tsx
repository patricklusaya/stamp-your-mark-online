
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";

interface StampControlsProps {
  stampText: string;
  setStampText: (text: string) => void;
  fontSize: number[];
  setFontSize: (size: number[]) => void;
  stampType: string;
  setStampType: (type: string) => void;
  borderWidth: number[];
  setBorderWidth: (width: number[]) => void;
  state: string;
  setState: (state: string) => void;
  removeBackground: boolean;
  setRemoveBackground: (remove: boolean) => void;
  onDownload: () => void;
  getPlaceholderText: () => string;
}

const stampTypes = {
  "notary-circle": "Notary Circle",
  "business-rectangle": "Business Rectangle", 
  "address-rectangle": "Address Rectangle",
  "signature-oval": "Signature Oval",
  "logo-square": "Logo Square"
};

const StampControls = ({
  stampText,
  setStampText,
  fontSize,
  setFontSize,
  stampType,
  setStampType,
  borderWidth,
  setBorderWidth,
  state,
  setState,
  removeBackground,
  setRemoveBackground,
  onDownload,
  getPlaceholderText
}: StampControlsProps) => {
  return (
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

      <Button onClick={onDownload} size="lg" className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Download Stamp
      </Button>
    </div>
  );
};

export default StampControls;
