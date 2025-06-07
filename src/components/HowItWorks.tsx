
import { MousePointer, Eye, Package } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MousePointer,
      title: "Design Your Stamp",
      description: "Use our intuitive design tools to create your perfect stamp with text, logos, and graphics.",
      step: "01"
    },
    {
      icon: Eye,
      title: "Preview & Approve",
      description: "Review your design with our realistic preview and make any final adjustments.",
      step: "02"
    },
    {
      icon: Package,
      title: "Receive Your Stamp",
      description: "We manufacture and ship your high-quality stamp directly to your door.",
      step: "03"
    }
  ];

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create your custom stamp in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-muted-foreground text-lg">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full">
                  <div className="w-full h-0.5 bg-gradient-to-r from-primary to-primary/20"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
