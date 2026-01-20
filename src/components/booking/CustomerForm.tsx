import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, Mail, Phone, MessageSquare } from "lucide-react";

const customerSchema = z.object({
  name: z
    .string()
    .min(2, "Naam moet minimaal 2 karakters zijn")
    .max(100, "Naam mag maximaal 100 karakters zijn"),
  email: z
    .string()
    .email("Ongeldig e-mailadres")
    .max(255, "E-mail mag maximaal 255 karakters zijn"),
  phone: z
    .string()
    .max(20, "Telefoonnummer mag maximaal 20 karakters zijn")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(500, "Opmerkingen mogen maximaal 500 karakters zijn")
    .optional()
    .or(z.literal("")),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  defaultValues?: Partial<CustomerFormData>;
  onSubmit: (data: CustomerFormData) => void;
  isSubmitting?: boolean;
}

const CustomerForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
}: CustomerFormProps) => {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      email: defaultValues?.email || "",
      phone: defaultValues?.phone || "",
      notes: defaultValues?.notes || "",
    },
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">
          Jouw Gegevens
        </h2>
        <p className="text-muted-foreground">
          Vul je contactgegevens in om de boeking te voltooien
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Naam *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Je volledige naam"
                    className="bg-card border-border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  E-mailadres *
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="je@email.nl"
                    className="bg-card border-border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Telefoonnummer (optioneel)
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="06 12345678"
                    className="bg-card border-border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Opmerkingen (optioneel)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Bijv. specifieke wensen of vragen..."
                    className="bg-card border-border min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="hero"
            size="xl"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Bezig met boeken..." : "Bevestig Afspraak"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CustomerForm;
