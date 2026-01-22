import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-[90vh] flex items-center justify-center pt-20">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto text-center stagger-children">
          {/* Section Number */}
          <span className="section-number">{"{01}"} — Welkom</span>

          {/* Main Heading */}
          <h1 className="mt-6 mb-8">
            Premium Barbering
            <br />
            <span className="text-muted-foreground">voor de Moderne Man</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed">
            Ervaar vakmanschap en stijl. Traditioneel barberen gecombineerd met
            moderne technieken voor jouw perfecte look.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/booking" className="flex items-center gap-2">
                Boek afspraak
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">Bekijk diensten</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 pt-12 border-t border-border">
            <div className="flex flex-wrap justify-center gap-12 md:gap-16 text-center">
              <div>
                <p className="text-3xl font-semibold text-foreground">4.9</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Google Reviews
                </p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-foreground">10+</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Jaar Ervaring
                </p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-foreground">15K+</p>
                <p className="text-sm text-muted-foreground mt-1">Knipbeurten</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
