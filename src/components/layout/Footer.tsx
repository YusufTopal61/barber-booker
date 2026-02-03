import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="container-narrow py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="text-xl font-semibold text-foreground">
              Kapper De Bui
            </Link>
            <p className="text-muted-foreground text-sm mt-4 max-w-sm leading-relaxed">
              Traditioneel vakmanschap ontmoet moderne stijl. Al meer dan 10 jaar
              de beste kapper in de buurt.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Links</h4>
            <nav className="space-y-3">
              <Link
                to="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                to="/services"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Diensten
              </Link>
              <Link
                to="/booking"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Afspraak Maken
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Hoofdstraat 123</p>
              <p>1234 AB Amsterdam</p>
              <a
                href="tel:+31201234567"
                className="block hover:text-foreground transition-colors"
              >
                020 - 123 4567
              </a>
            </div>
          </div>
        </div>

        <div className="divider my-12" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Kapper De Bui</p>
          <div className="flex gap-6">
            <Link
              to="/admin/login"
              className="hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
