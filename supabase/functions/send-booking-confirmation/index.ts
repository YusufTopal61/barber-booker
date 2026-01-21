import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL") || "y.topal2006@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  type: "confirmation" | "cancellation";
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

function generateCustomerConfirmationEmail(data: BookingEmailRequest): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Afspraak Bevestiging</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background-color: #171717; border-radius: 12px; padding: 40px; border: 1px solid #262626;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; width: 56px; height: 56px; background-color: #f59e0b; border-radius: 50%; line-height: 56px; font-size: 24px;">✂️</div>
        <h1 style="color: #fafafa; font-size: 28px; margin: 16px 0 8px; font-family: Georgia, serif;">BarberShop</h1>
        <p style="color: #f59e0b; font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Afspraak Bevestigd</p>
      </div>
      
      <!-- Greeting -->
      <p style="color: #fafafa; font-size: 18px; margin-bottom: 24px;">
        Beste ${data.customerName},
      </p>
      <p style="color: #a3a3a3; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
        Bedankt voor je boeking! Je afspraak is succesvol bevestigd. Hieronder vind je de details van je afspraak.
      </p>
      
      <!-- Appointment Details -->
      <div style="background-color: #262626; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
        <h2 style="color: #f59e0b; font-size: 14px; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px;">Afspraakdetails</h2>
        
        <div style="border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 12px;">
          <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 4px;">Service</p>
          <p style="color: #fafafa; font-size: 16px; margin: 0; font-weight: 600;">${data.serviceName}</p>
        </div>
        
        <div style="border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 12px;">
          <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 4px;">Datum & Tijd</p>
          <p style="color: #fafafa; font-size: 16px; margin: 0; font-weight: 600;">${data.appointmentDate} om ${data.appointmentTime}</p>
        </div>
        
        <div style="border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 12px;">
          <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 4px;">Duur</p>
          <p style="color: #fafafa; font-size: 16px; margin: 0; font-weight: 600;">${data.serviceDuration} minuten</p>
        </div>
        
        <div>
          <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 4px;">Prijs</p>
          <p style="color: #f59e0b; font-size: 20px; margin: 0; font-weight: 700;">${formatPrice(data.servicePrice)}</p>
        </div>
      </div>
      
      <!-- Location -->
      <div style="background-color: #262626; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
        <h2 style="color: #f59e0b; font-size: 14px; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px;">Locatie</h2>
        <p style="color: #fafafa; font-size: 16px; margin: 0;">BarberShop</p>
        <p style="color: #a3a3a3; font-size: 14px; margin: 4px 0 0;">Kerkstraat 123, 1017 GC Amsterdam</p>
      </div>
      
      <!-- Important Note -->
      <div style="background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 16px; margin-bottom: 32px;">
        <p style="color: #f59e0b; font-size: 14px; margin: 0; line-height: 1.5;">
          <strong>Let op:</strong> Kun je niet komen? Laat het ons minimaal 24 uur van tevoren weten zodat we de tijd aan iemand anders kunnen geven.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #262626;">
        <p style="color: #a3a3a3; font-size: 14px; margin: 0;">Tot snel!</p>
        <p style="color: #fafafa; font-size: 16px; margin: 8px 0 0; font-family: Georgia, serif;">Het BarberShop Team</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

function generateAdminNotificationEmail(data: BookingEmailRequest): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nieuwe Afspraak</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background-color: #171717; border-radius: 12px; padding: 40px; border: 1px solid #262626;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; width: 56px; height: 56px; background-color: #22c55e; border-radius: 50%; line-height: 56px; font-size: 24px;">📅</div>
        <h1 style="color: #fafafa; font-size: 24px; margin: 16px 0 8px;">Nieuwe Afspraak!</h1>
        <p style="color: #22c55e; font-size: 14px; margin: 0;">Er is zojuist een nieuwe boeking gemaakt</p>
      </div>
      
      <!-- Customer Details -->
      <div style="background-color: #262626; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #f59e0b; font-size: 14px; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px;">Klantgegevens</h2>
        
        <div style="border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 12px;">
          <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 4px;">Naam</p>
          <p style="color: #fafafa; font-size: 16px; margin: 0; font-weight: 600;">${data.customerName}</p>
        </div>
        
        <div>
          <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 4px;">E-mail</p>
          <p style="color: #fafafa; font-size: 16px; margin: 0;">${data.customerEmail}</p>
        </div>
      </div>
      
      <!-- Appointment Details -->
      <div style="background-color: #262626; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #f59e0b; font-size: 14px; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px;">Afspraakdetails</h2>
        
        <div style="border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 12px;">
          <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 4px;">Service</p>
          <p style="color: #fafafa; font-size: 16px; margin: 0; font-weight: 600;">${data.serviceName}</p>
        </div>
        
        <div style="border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 12px;">
          <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 4px;">Datum & Tijd</p>
          <p style="color: #fafafa; font-size: 16px; margin: 0; font-weight: 600;">${data.appointmentDate} om ${data.appointmentTime}</p>
        </div>
        
        <div style="border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 12px;">
          <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 4px;">Duur</p>
          <p style="color: #fafafa; font-size: 16px; margin: 0;">${data.serviceDuration} minuten</p>
        </div>
        
        <div>
          <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 4px;">Prijs</p>
          <p style="color: #f59e0b; font-size: 18px; margin: 0; font-weight: 700;">${formatPrice(data.servicePrice)}</p>
        </div>
      </div>
      
      ${data.notes ? `
      <!-- Notes -->
      <div style="background-color: #262626; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #f59e0b; font-size: 14px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 1px;">Opmerkingen</h2>
        <p style="color: #a3a3a3; font-size: 14px; margin: 0; line-height: 1.5;">${data.notes}</p>
      </div>
      ` : ''}
      
      <!-- Footer -->
      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #262626;">
        <p style="color: #a3a3a3; font-size: 14px; margin: 0;">
          Bekijk alle afspraken in het <a href="#" style="color: #f59e0b; text-decoration: none;">admin dashboard</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

function generateCancellationEmail(data: BookingEmailRequest, isAdmin: boolean): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Afspraak Geannuleerd</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background-color: #171717; border-radius: 12px; padding: 40px; border: 1px solid #262626;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; width: 56px; height: 56px; background-color: #ef4444; border-radius: 50%; line-height: 56px; font-size: 24px;">❌</div>
        <h1 style="color: #fafafa; font-size: 24px; margin: 16px 0 8px;">Afspraak Geannuleerd</h1>
        <p style="color: #ef4444; font-size: 14px; margin: 0;">De volgende afspraak is geannuleerd</p>
      </div>
      
      ${!isAdmin ? `
      <p style="color: #a3a3a3; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
        Beste ${data.customerName}, helaas is je afspraak geannuleerd. Je kunt altijd een nieuwe afspraak maken via onze website.
      </p>
      ` : ''}
      
      <!-- Appointment Details -->
      <div style="background-color: #262626; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
        <h2 style="color: #f59e0b; font-size: 14px; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 1px;">Geannuleerde Afspraak</h2>
        
        ${isAdmin ? `
        <div style="border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 12px;">
          <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 4px;">Klant</p>
          <p style="color: #fafafa; font-size: 16px; margin: 0; font-weight: 600;">${data.customerName} (${data.customerEmail})</p>
        </div>
        ` : ''}
        
        <div style="border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 12px;">
          <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 4px;">Service</p>
          <p style="color: #fafafa; font-size: 16px; margin: 0; font-weight: 600;">${data.serviceName}</p>
        </div>
        
        <div>
          <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 4px;">Datum & Tijd</p>
          <p style="color: #fafafa; font-size: 16px; margin: 0; font-weight: 600;">${data.appointmentDate} om ${data.appointmentTime}</p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #262626;">
        <p style="color: #a3a3a3; font-size: 14px; margin: 0;">
          ${isAdmin ? 'Het tijdslot is nu weer beschikbaar voor nieuwe boekingen.' : 'We hopen je snel weer te zien!'}
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: BookingEmailRequest = await req.json();
    const { type } = data;

    const emailPromises: Promise<any>[] = [];

    if (type === "confirmation") {
      // Send confirmation to customer
      emailPromises.push(
        resend.emails.send({
          from: "BarberShop <onboarding@resend.dev>",
          to: [data.customerEmail],
          subject: `Afspraak Bevestigd - ${data.serviceName} op ${data.appointmentDate}`,
          html: generateCustomerConfirmationEmail(data),
        })
      );

      // Send notification to admin
      emailPromises.push(
        resend.emails.send({
          from: "BarberShop Systeem <onboarding@resend.dev>",
          to: [adminEmail],
          subject: `Nieuwe Afspraak: ${data.customerName} - ${data.serviceName}`,
          html: generateAdminNotificationEmail(data),
        })
      );
    } else if (type === "cancellation") {
      // Send cancellation to customer
      emailPromises.push(
        resend.emails.send({
          from: "BarberShop <onboarding@resend.dev>",
          to: [data.customerEmail],
          subject: `Afspraak Geannuleerd - ${data.appointmentDate}`,
          html: generateCancellationEmail(data, false),
        })
      );

      // Send cancellation notification to admin
      emailPromises.push(
        resend.emails.send({
          from: "BarberShop Systeem <onboarding@resend.dev>",
          to: [adminEmail],
          subject: `Afspraak Geannuleerd: ${data.customerName} - ${data.appointmentDate}`,
          html: generateCancellationEmail(data, true),
        })
      );
    }

    const results = await Promise.all(emailPromises);
    console.log("Emails sent successfully:", results);

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
