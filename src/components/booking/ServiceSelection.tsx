import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Scissors, Clock, Loader2, Check } from "lucide-react";

interface ServiceSelectionProps {
  selectedServiceId: string | null;
  onSelect: (serviceId: string) => void;
}

const ServiceSelection = ({ selectedServiceId, onSelect }: ServiceSelectionProps) => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">
          Kies een Service
        </h2>
        <p className="text-muted-foreground">
          Selecteer de behandeling die je wilt boeken
        </p>
      </div>

      <div className="grid gap-4">
        {services?.map((service) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={`w-full p-5 rounded-lg border-2 text-left transition-all duration-300 ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-6 h-6 text-primary-foreground" />
                    ) : (
                      <Scissors className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration_minutes} minuten</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">
                    €{Number(service.price).toFixed(0)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelection;
