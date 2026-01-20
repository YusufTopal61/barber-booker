import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Scissors, Clock, ArrowRight, Loader2 } from "lucide-react";

const ServicesPreview = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-medium mb-4 uppercase tracking-wider text-sm">
            Onze Diensten
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Kies Jouw <span className="text-gradient-gold">Service</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Van klassieke knipbeurten tot complete verzorging. Wij bieden premium
            services voor de moderne man.
          </p>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {services?.map((service) => (
              <div
                key={service.id}
                className="card-gold p-6 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                  <Scissors className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">
                  {service.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration_minutes} min</span>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    €{Number(service.price).toFixed(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/services" className="flex items-center gap-2">
              Bekijk Alle Diensten
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
