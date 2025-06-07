
import { Card, CardContent } from "@/components/ui/card";

const Gallery = () => {
  const stampTypes = [
    {
      title: "Business Stamps",
      description: "Professional stamps for companies and organizations",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop"
    },
    {
      title: "Address Stamps",
      description: "Personal return address stamps for envelopes and packages",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
    },
    {
      title: "Logo Stamps",
      description: "Custom logo stamps for branding and marketing",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
    },
    {
      title: "Date Stamps",
      description: "Self-inking date stamps for documents and forms",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop"
    },
    {
      title: "Signature Stamps",
      description: "Personalized signature stamps for efficiency",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop"
    },
    {
      title: "Custom Designs",
      description: "Unique stamps created from your own artwork",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-24 px-4 bg-secondary/10">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">Stamp Gallery</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of customizable stamp types
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stampTypes.map((stamp, index) => (
            <Card key={index} className="group overflow-hidden hover-scale transition-all duration-300 hover:shadow-xl">
              <div className="relative overflow-hidden">
                <img 
                  src={stamp.image} 
                  alt={stamp.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{stamp.title}</h3>
                <p className="text-muted-foreground">{stamp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
