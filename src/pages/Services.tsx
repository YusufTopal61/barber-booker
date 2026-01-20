import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Scissors, Clock, ArrowRight, Loader2 } from "lucide-react";

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
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <span className="inline-block text-primary font-medium mb-4 uppercase tracking-wider text-sm">
                Onze Diensten
              </span>
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
                Premium <span className="text-gradient-gold">Barbering</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Van klassieke knipbeurten tot complete verzorgingspakketten. 
                Kies de service die bij jou past.
              </p>
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {services?.map((service, index) => (
                  <div
                    key={service.id}
                    className="card-gold p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4 md:gap-6 flex-1">
                      <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                        <Scissors className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl md:text-2xl font-semibold mb-2">
                          {service.name}
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {service.duration_minutes} minuten
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 md:gap-8">
                      <div className="text-right">
                        <span className="text-3xl font-bold text-primary">
                          €{Number(service.price).toFixed(0)}
                        </span>
                      </div>
                      <Button asChild>
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
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="p-6">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✂️</span>
                  </div>
                  <h4 className="font-serif text-lg font-semibold mb-2">Premium Producten</h4>
                  <p className="text-muted-foreground text-sm">
                    Wij gebruiken alleen de beste producten voor jouw haar en baard.
                  </p>
                </div>
                <div className="p-6">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="font-serif text-lg font-semibold mb-2">Persoonlijk Advies</h4>
                  <p className="text-muted-foreground text-sm">
                    Onze barbers adviseren je graag over de stijl die bij jou past.
                  </p>
                </div>
                <div className="p-6">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">☕</span>
                  </div>
                  <h4 className="font-serif text-lg font-semibold mb-2">Gratis Drankje</h4>
                  <p className="text-muted-foreground text-sm">
                    Geniet van een gratis koffie of thee tijdens je bezoek.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Klaar om te boeken?
            </h2>
            <p className="text-muted-foreground mb-8">
              Kies een tijdslot dat jou uitkomt en reserveer direct online.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/booking">Maak een Afspraak</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
