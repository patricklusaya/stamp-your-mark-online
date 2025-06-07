
import { Palette, Zap, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Palette,
      title: "Easy Design",
      description: "Drag, drop, and customize with our intuitive online designer"
    },
    {
      icon: Zap,
      title: "Instant Preview",
      description: "See exactly how your stamp will look before ordering"
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "Professional quality stamps delivered to your door"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold">Why Choose Our Stamps?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover-scale transition-all duration-300 hover:shadow-lg border-0 bg-card/80 backdrop-blur text-center">
              <CardContent className="p-8 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
                  <feature.icon className="w-8 h-8 text-primary" />
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
