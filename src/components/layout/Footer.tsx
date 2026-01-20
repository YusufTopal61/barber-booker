import { Link } from "react-router-dom";
import { Scissors, MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Scissors className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-2xl font-semibold">
                Barber<span className="text-primary">Shop</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Traditioneel vakmanschap ontmoet moderne stijl. Al meer dan 10 jaar
              de beste kapper in de buurt.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Snel Links</h4>
            <nav className="space-y-3">
              <Link
                to="/"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/services"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Diensten & Prijzen
              </Link>
              <Link
                to="/booking"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Afspraak Maken
              </Link>
              <Link
                to="/admin/login"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-foreground">Hoofdstraat 123</p>
                  <p className="text-muted-foreground text-sm">1234 AB Amsterdam</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a
                  href="tel:+31201234567"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  020 - 123 4567
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Openingstijden</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground text-sm">Werkdagen</span>
              </div>
              <div className="pl-8 space-y-1 text-sm">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Maandag</span>
                  <span className="text-foreground">Gesloten</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Di - Vr</span>
                  <span className="text-foreground">09:00 - 18:00</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Zaterdag</span>
                  <span className="text-foreground">09:00 - 17:00</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Zondag</span>
                  <span className="text-foreground">Gesloten</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="divider-gold my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BarberShop. Alle rechten voorbehouden.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Voorwaarden
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
