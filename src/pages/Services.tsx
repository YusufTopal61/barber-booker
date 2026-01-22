import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Loader2 } from "lucide-react";

const Services = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="section">
          <div className="container-narrow">
            <div className="max-w-2xl">
              <span className="section-number">{"{01}"} — Diensten</span>
              <h1 className="mt-6 mb-6">Onze Services</h1>
              <p className="text-lg text-muted-foreground">
                Van klassieke knipbeurten tot complete verzorgingspakketten.
                Kies de service die bij jou past.
              </p>
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="pb-24">
          <div className="container-narrow">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {services?.map((service, index) => (
                  <div
                    key={service.id}
                    className="card-minimal flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-2">
                        {service.name}
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration_minutes} minuten</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-2xl font-semibold">
                        €{Number(service.price).toFixed(0)}
                      </span>
                      <Button size="sm" asChild>
                        <Link
                          to={`/booking?service=${service.id}`}
                          className="flex items-center gap-2"
                        >
                          Boek
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="section border-t border-border">
          <div className="container-narrow">
            <div className="section-header text-center mx-auto">
              <span className="section-number">{"{02}"} — Ervaring</span>
              <h2 className="mx-auto">Wat je kunt verwachten</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <p className="text-3xl mb-4">✂️</p>
                <h4 className="text-lg font-medium mb-2">Premium Producten</h4>
                <p className="text-muted-foreground text-sm">
                  Wij gebruiken alleen de beste producten voor jouw haar en
                  baard.
                </p>
              </div>
              <div className="p-6">
                <p className="text-3xl mb-4">🎯</p>
                <h4 className="text-lg font-medium mb-2">Persoonlijk Advies</h4>
                <p className="text-muted-foreground text-sm">
                  Onze barbers adviseren je graag over de stijl die bij jou
                  past.
                </p>
              </div>
              <div className="p-6">
                <p className="text-3xl mb-4">☕</p>
                <h4 className="text-lg font-medium mb-2">Gratis Drankje</h4>
                <p className="text-muted-foreground text-sm">
                  Geniet van een gratis koffie of thee tijdens je bezoek.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section border-t border-border">
          <div className="container-narrow text-center">
            <h2 className="mb-4">Klaar om te boeken?</h2>
            <p className="text-muted-foreground mb-8">
              Kies een tijdslot dat jou uitkomt en reserveer direct online.
            </p>
            <Button size="lg" asChild>
              <Link to="/booking" className="flex items-center gap-2">
                Maak een afspraak
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
