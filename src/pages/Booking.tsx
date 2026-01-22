import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addMinutes } from "date-fns";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServiceSelection from "@/components/booking/ServiceSelection";
import DateTimeSelection from "@/components/booking/DateTimeSelection";
import CustomerForm, {
  CustomerFormData,
} from "@/components/booking/CustomerForm";
import BookingSummary from "@/components/booking/BookingSummary";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

type BookingStep = "service" | "datetime" | "details";

const steps: { key: BookingStep; label: string; number: string }[] = [
  { key: "service", label: "Service", number: "01" },
  { key: "datetime", label: "Datum & Tijd", number: "02" },
  { key: "details", label: "Gegevens", number: "03" },
];

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<BookingStep>("service");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    searchParams.get("service")
  );
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [customerData, setCustomerData] = useState<CustomerFormData | null>(
    null
  );

  // Fetch selected service details
  const { data: selectedService } = useQuery({
    queryKey: ["service", selectedServiceId],
    queryFn: async () => {
      if (!selectedServiceId) return null;
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", selectedServiceId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!selectedServiceId,
  });

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: async (data: {
      serviceId: string;
      startDateTime: Date;
      customer: CustomerFormData;
    }) => {
      const service = selectedService;
      if (!service) throw new Error("Service not found");

      const endDateTime = addMinutes(
        data.startDateTime,
        service.duration_minutes
      );

      const { data: appointment, error } = await supabase
        .from("appointments")
        .insert({
          service_id: data.serviceId,
          start_datetime: data.startDateTime.toISOString(),
          end_datetime: endDateTime.toISOString(),
          customer_name: data.customer.name,
          customer_email: data.customer.email,
          customer_phone: data.customer.phone || null,
          notes: data.customer.notes || null,
          status: "confirmed",
        })
        .select()
        .single();

      if (error) throw error;

      // Send confirmation emails
      try {
        const { nl } = await import("date-fns/locale");
        const { format } = await import("date-fns");

        await supabase.functions.invoke("send-booking-confirmation", {
          body: {
            customerName: data.customer.name,
            customerEmail: data.customer.email,
            serviceName: service.name,
            servicePrice: service.price,
            serviceDuration: service.duration_minutes,
            appointmentDate: format(data.startDateTime, "EEEE d MMMM yyyy", {
              locale: nl,
            }),
            appointmentTime: format(data.startDateTime, "HH:mm"),
            notes: data.customer.notes || null,
            type: "confirmation",
          },
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }

      return appointment;
    },
    onSuccess: (appointment) => {
      toast.success("Afspraak succesvol geboekt!");
      navigate(`/booking/confirmation?id=${appointment.id}`);
    },
    onError: (error) => {
      console.error("Booking error:", error);
      toast.error("Er ging iets mis bij het boeken. Probeer het opnieuw.");
    },
  });

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
  };

  const handleDateTimeSelect = (dateTime: Date) => {
    setSelectedDateTime(dateTime);
  };

  const handleCustomerSubmit = (data: CustomerFormData) => {
    setCustomerData(data);
    if (selectedServiceId && selectedDateTime) {
      createAppointment.mutate({
        serviceId: selectedServiceId,
        startDateTime: selectedDateTime,
        customer: data,
      });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "service":
        return !!selectedServiceId;
      case "datetime":
        return !!selectedDateTime;
      case "details":
        return true;
      default:
        return false;
    }
  };

  const goToNextStep = () => {
    const currentIndex = steps.findIndex((s) => s.key === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.findIndex((s) => s.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key);
    }
  };

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-16">
        <div className="container-narrow py-12">
          {/* Progress Steps */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = step.key === currentStep;

                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors border ${
                          isCompleted
                            ? "bg-foreground text-background border-foreground"
                            : isCurrent
                            ? "bg-foreground text-background border-foreground"
                            : "bg-transparent text-muted-foreground border-border"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          step.number
                        )}
                      </div>
                      <span
                        className={`mt-3 text-sm font-medium ${
                          isCurrent
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-px mx-4 ${
                          isCompleted ? "bg-foreground" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="card-minimal">
                {currentStep === "service" && (
                  <ServiceSelection
                    selectedServiceId={selectedServiceId}
                    onSelect={handleServiceSelect}
                  />
                )}

                {currentStep === "datetime" && selectedServiceId && (
                  <DateTimeSelection
                    selectedServiceId={selectedServiceId}
                    selectedDateTime={selectedDateTime}
                    onSelect={handleDateTimeSelect}
                  />
                )}

                {currentStep === "details" && (
                  <CustomerForm
                    defaultValues={customerData || undefined}
                    onSubmit={handleCustomerSubmit}
                    isSubmitting={createAppointment.isPending}
                  />
                )}

                {/* Navigation */}
                {currentStep !== "details" && (
                  <div className="flex justify-between mt-8 pt-6 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={goToPreviousStep}
                      disabled={currentStepIndex === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Vorige
                    </Button>
                    <Button onClick={goToNextStep} disabled={!canProceed()}>
                      Volgende
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="hidden lg:block">
              <BookingSummary
                service={selectedService || null}
                dateTime={selectedDateTime}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
