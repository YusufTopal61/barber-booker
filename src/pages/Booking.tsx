import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addMinutes } from "date-fns";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServiceSelection from "@/components/booking/ServiceSelection";
import DateTimeSelection from "@/components/booking/DateTimeSelection";
import CustomerForm, { CustomerFormData } from "@/components/booking/CustomerForm";
import BookingSummary from "@/components/booking/BookingSummary";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

type BookingStep = "service" | "datetime" | "details";

const steps: { key: BookingStep; label: string }[] = [
  { key: "service", label: "Service" },
  { key: "datetime", label: "Datum & Tijd" },
  { key: "details", label: "Gegevens" },
];

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<BookingStep>("service");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    searchParams.get("service")
  );
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [customerData, setCustomerData] = useState<CustomerFormData | null>(null);

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

      const endDateTime = addMinutes(data.startDateTime, service.duration_minutes);

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
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          {/* Progress Steps */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = step.key === currentStep;

                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                          isCompleted
                            ? "bg-primary text-primary-foreground"
                            : isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span
                        className={`mt-2 text-sm font-medium ${
                          isCurrent ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 ${
                          isCompleted ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6 md:p-8">
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
                    <Button
                      onClick={goToNextStep}
                      disabled={!canProceed()}
                    >
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
