
import { Button } from "@/components/ui/button";
import { ArrowRight, Stamp } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 px-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-medium">
            <Stamp className="w-4 h-4" />
            Professional Stamp Creation
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Create Custom
            <span className="block text-primary">Stamps Online</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Design and order professional-quality custom stamps in minutes. Perfect for businesses, 
            offices, and personal use with our easy-to-use online designer.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="text-lg px-8 py-6 hover-scale">
            Start Designing
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover-scale">
            View Gallery
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">1000+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">24hr</div>
            <div className="text-sm text-muted-foreground">Fast Delivery</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">100+</div>
            <div className="text-sm text-muted-foreground">Design Templates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">5★</div>
            <div className="text-sm text-muted-foreground">Customer Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
