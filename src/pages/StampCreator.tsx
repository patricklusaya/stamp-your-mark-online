
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { removeBackgroundFromCanvas } from "@/utils/backgroundRemoval";
import { generateStampCanvas } from "@/utils/stampGenerator";
import { getPlaceholderText } from "@/utils/stampPlaceholders";
import StampControls from "@/components/StampControls";
import StampPreview from "@/components/StampPreview";
import DocumentStamper from "@/components/DocumentStamper";

const StampCreator = () => {
  const [stampText, setStampText] = useState("YOUR NAME\nNOTARY\nPUBLIC");
  const [fontSize, setFontSize] = useState([16]);
  const [stampType, setStampType] = useState("notary-circle");
  const [borderWidth, setBorderWidth] = useState([3]);
  const [state, setState] = useState("STATE OF NEW YORK");
  const [removeBackground, setRemoveBackground] = useState(true);
  const [activeTab, setActiveTab] = useState<"create" | "stamp-document">("create");

  const getPlaceholder = () => getPlaceholderText(stampType);

  const handleDownload = async () => {
    const canvas = generateStampCanvas({
      stampText,
      fontSize: fontSize[0],
      stampType,
      borderWidth: borderWidth[0],
      state
    });
    
    if (!canvas) return;

    try {
      let finalCanvas = canvas;
      
      if (removeBackground) {
        finalCanvas = await removeBackgroundFromCanvas(canvas);
      }
      
      const link = document.createElement('a');
      link.download = `${stampType}-stamp.png`;
      link.href = finalCanvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error processing stamp:', error);
      const link = document.createElement('a');
      link.download = `${stampType}-stamp.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  };

  const stampConfig = {
    stampText,
    fontSize: fontSize[0],
    stampType,
    borderWidth: borderWidth[0],
    state
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
          <p className="text-xl text-muted-foreground">Choose from professional formats and stamp your documents</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-card/50 backdrop-blur rounded-lg p-1 border">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "create" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Stamp
            </button>
            <button
              onClick={() => setActiveTab("stamp-document")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "stamp-document" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Stamp Document
            </button>
          </div>
        </div>

        {activeTab === "create" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StampControls
              stampText={stampText}
              setStampText={setStampText}
              fontSize={fontSize}
              setFontSize={setFontSize}
              stampType={stampType}
              setStampType={(type) => {
                setStampType(type);
                setStampText(getPlaceholderText(type));
              }}
              borderWidth={borderWidth}
              setBorderWidth={setBorderWidth}
              state={state}
              setState={setState}
              removeBackground={removeBackground}
              setRemoveBackground={setRemoveBackground}
              onDownload={handleDownload}
              getPlaceholderText={getPlaceholder}
            />

            <StampPreview config={stampConfig} />
          </div>
        ) : (
          <DocumentStamper stampConfig={stampConfig} />
        )}
      </div>
    </div>
  );
};

export default StampCreator;
