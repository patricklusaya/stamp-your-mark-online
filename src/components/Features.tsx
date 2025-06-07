
import { Palette, Zap, Shield, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Palette,
      title: "Easy Design Tools",
      description: "Intuitive drag-and-drop interface with professional templates and custom text options."
    },
    {
      icon: Zap,
      title: "Instant Preview",
      description: "See your stamp design in real-time with our advanced preview technology."
    },
    {
      icon: Shield,
      title: "Premium Quality",
      description: "High-grade materials and precision manufacturing for long-lasting stamps."
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "Quick production and shipping to get your stamps when you need them."
    }
  ];

  return (
    <section className="py-24 px-4 bg-secondary/20">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Why Choose Our Stamps?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional quality meets user-friendly design tools
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover-scale transition-all duration-300 hover:shadow-lg border-0 bg-card/80 backdrop-blur">
              <CardContent className="p-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
