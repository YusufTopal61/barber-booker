import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, ArrowRight, Loader2 } from "lucide-react";

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
    <section className="section bg-background">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-number">Diensten</span>
          <h2>Onze Services</h2>
          <p>
            Van klassieke knipbeurten tot complete verzorging. Premium services
            voor de moderne man.
          </p>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services?.map((service, index) => (
              <div
                key={service.id}
                className="card-minimal group flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-1">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration_minutes} min</span>
                  </div>
                </div>
                <div className="text-right ml-6">
                  <span className="text-2xl font-semibold">
                    €{Number(service.price).toFixed(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="outline" asChild>
            <Link to="/services" className="flex items-center gap-2">
              Bekijk alle diensten
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
