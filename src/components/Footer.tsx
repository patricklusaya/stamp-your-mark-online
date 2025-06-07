
import { Stamp } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary/5 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Stamp className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">StampCraft</span>
            </div>
            <p className="text-muted-foreground">
              Creating high-quality custom stamps for businesses and individuals worldwide.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Business Stamps</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Address Stamps</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Logo Stamps</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Date Stamps</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Design Guide</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 StampCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
