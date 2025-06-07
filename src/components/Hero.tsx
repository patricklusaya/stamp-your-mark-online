
import { Button } from "@/components/ui/button";
import { ArrowRight, Stamp } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 px-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto text-center space-y-8 animate-fade-in max-w-4xl">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-medium">
            <Stamp className="w-4 h-4" />
            Create Professional Stamps in Minutes
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Design Your
            <span className="block text-primary">Custom Stamp</span>
            <span className="block text-3xl md:text-4xl text-muted-foreground font-normal mt-4">
              Online. Instantly. Delivered Fast.
            </span>
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button size="lg" className="text-xl px-12 py-8 hover-scale">
            Start Creating Now
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover-scale">
            See Examples
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">2 min</div>
            <div className="text-sm text-muted-foreground">Design Time</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">24hr</div>
            <div className="text-sm text-muted-foreground">Fast Delivery</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">5★</div>
            <div className="text-sm text-muted-foreground">Quality Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
