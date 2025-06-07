
const Footer = () => {
  return (
    <footer className="bg-secondary/20 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Custom Stamps Online</h3>
            <p className="text-muted-foreground">Professional quality stamps delivered fast. Design online in minutes.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Custom Stamps Online. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
