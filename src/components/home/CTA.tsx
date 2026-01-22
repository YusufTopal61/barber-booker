import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="section border-t border-border">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center">
          <span className="section-number">{"{04}"} — Afspraak</span>
          <h2 className="mt-6 mb-6">Klaar voor jouw nieuwe look?</h2>
          <p className="text-lg text-muted-foreground mb-10">
            Boek vandaag nog je afspraak en ervaar het verschil van premium
            barbering.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/booking" className="flex items-center gap-2">
                Boek online
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="tel:+31201234567">020 - 123 4567</a>
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
