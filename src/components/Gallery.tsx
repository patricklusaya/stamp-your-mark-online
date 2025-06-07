
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Gallery = () => {
  const stampTypes = [
    {
      title: "Business Stamps",
      description: "Professional company stamps",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop"
    },
    {
      title: "Address Stamps",
      description: "Personal return address stamps",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
    },
    {
      title: "Custom Designs",
      description: "Unique stamps from your artwork",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-20 px-4 bg-secondary/10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold">Popular Stamp Types</h2>
          <p className="text-xl text-muted-foreground">Choose your style or create something unique</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stampTypes.map((stamp, index) => (
            <Card key={index} className="group overflow-hidden hover-scale transition-all duration-300 hover:shadow-xl">
              <div className="relative overflow-hidden">
                <img 
                  src={stamp.image} 
                  alt={stamp.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">{stamp.title}</h3>
                <p className="text-muted-foreground mb-4">{stamp.description}</p>
                <Link to="/create">
                  <Button variant="outline" className="w-full">Choose This Style</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/create">
            <Button size="lg" className="text-xl px-12 py-8 hover-scale">
              Start Creating Your Stamp
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
