import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("id");

  const { data: appointment, isLoading } = useQuery({
    queryKey: ["appointment-confirmation", appointmentId],
    queryFn: async () => {
      if (!appointmentId) return null;
      return null;
    },
    enabled: !!appointmentId,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-16">
        <div className="container-narrow py-16">
          <div className="max-w-xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mb-8 animate-fade-in">
              <div className="w-20 h-20 rounded-full border-2 border-foreground flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-foreground" />
              </div>
              <h1 className="text-3xl font-semibold mb-4">Afspraak bevestigd</h1>
              <p className="text-lg text-muted-foreground">
                Bedankt voor je boeking. We kijken ernaar uit je te verwelkomen!
              </p>
            </div>

            {/* Confirmation Details */}
            <div className="card-minimal text-left mb-8">
              <h2 className="text-lg font-semibold mb-6">Wat je moet weten</h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Bevestigingsmail</h3>
                    <p className="text-muted-foreground text-sm">
                      Je ontvangt binnen enkele minuten een bevestigingsmail met
                      alle details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Op tijd komen</h3>
                    <p className="text-muted-foreground text-sm">
                      Probeer 5 minuten voor je afspraak aanwezig te zijn.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Annuleren of wijzigen</h3>
                    <p className="text-muted-foreground text-sm">
                      Doe dit minimaal 24 uur van tevoren via telefoon of
                      e-mail.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="card-minimal mb-8">
              <h2 className="text-lg font-semibold mb-4">Onze locatie</h2>

              <div className="flex flex-col sm:flex-row gap-6 text-left">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Adres</p>
                    <p className="text-muted-foreground text-sm">
                      Hoofdstraat 123
                      <br />
                      1234 AB Amsterdam
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Telefoon</p>
                    <a
                      href="tel:+31201234567"
                      className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                    >
                      020 - 123 4567
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/" className="flex items-center gap-2">
                  Terug naar home
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/booking">Nieuwe afspraak</Link>
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
