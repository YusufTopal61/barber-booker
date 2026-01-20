import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Calendar,
  Clock,
  Scissors,
  MapPin,
  Phone,
  Mail,
  Home,
  Loader2,
} from "lucide-react";

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("id");

  const { data: appointment, isLoading } = useQuery({
    queryKey: ["appointment-confirmation", appointmentId],
    queryFn: async () => {
      if (!appointmentId) return null;

      // We need to fetch via a different approach since RLS blocks direct read
      // For now, we'll show a generic success message
      return null;
    },
    enabled: !!appointmentId,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mb-8 animate-fade-in-up">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Afspraak <span className="text-gradient-gold">Bevestigd!</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Bedankt voor je boeking. We kijken ernaar uit je te verwelkomen!
              </p>
            </div>

            {/* Confirmation Details */}
            <div className="bg-card border border-border rounded-lg p-8 mb-8 text-left">
              <h2 className="font-serif text-xl font-semibold mb-6 text-center">
                Wat je moet weten
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Bevestigingsmail</h3>
                    <p className="text-muted-foreground text-sm">
                      Je ontvangt binnen enkele minuten een bevestigingsmail met alle details van je afspraak.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Op tijd komen</h3>
                    <p className="text-muted-foreground text-sm">
                      Probeer 5 minuten voor je afspraak aanwezig te zijn. Bij vertraging, bel ons even.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Annuleren of wijzigen</h3>
                    <p className="text-muted-foreground text-sm">
                      Moet je annuleren? Doe dit minimaal 24 uur van tevoren via telefoon of e-mail.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-card border border-border rounded-lg p-8 mb-8">
              <h2 className="font-serif text-xl font-semibold mb-6">Onze Locatie</h2>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Adres</p>
                    <p className="text-muted-foreground text-sm">
                      Hoofdstraat 123<br />
                      1234 AB Amsterdam
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Telefoon</p>
                    <a
                      href="tel:+31201234567"
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      020 - 123 4567
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Terug naar Home
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/booking" className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Nieuwe Afspraak
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;
