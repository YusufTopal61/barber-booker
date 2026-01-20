import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Klaar voor Jouw{" "}
            <span className="text-gradient-gold">Nieuwe Look</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Boek vandaag nog je afspraak en ervaar het verschil van premium barbering.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/booking" className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Boek Online
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="tel:+31201234567" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                020 - 123 4567
              </a>
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Geen inschrijving nodig • Gratis annuleren tot 24 uur van tevoren
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
