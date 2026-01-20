import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Calendar, Clock, Scissors, Euro } from "lucide-react";

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
}

interface BookingSummaryProps {
  service: Service | null;
  dateTime: Date | null;
}

const BookingSummary = ({ service, dateTime }: BookingSummaryProps) => {
  if (!service && !dateTime) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
      <h3 className="font-serif text-lg font-semibold mb-4 pb-4 border-b border-border">
        Jouw Boeking
      </h3>

      <div className="space-y-4">
        {service && (
          <>
            <div className="flex items-start gap-3">
              <Scissors className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-muted-foreground">Service</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{service.duration_minutes} minuten</p>
                <p className="text-sm text-muted-foreground">Duur</p>
              </div>
            </div>
          </>
        )}

        {dateTime && (
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">
                {format(dateTime, "EEEE d MMMM", { locale: nl })}
              </p>
              <p className="text-sm text-muted-foreground">
                om {format(dateTime, "HH:mm")} uur
              </p>
            </div>
          </div>
        )}

        {service && (
          <div className="pt-4 mt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Totaal</span>
              <span className="text-2xl font-bold text-primary flex items-center">
                <Euro className="w-5 h-5 mr-1" />
                {Number(service.price).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;
