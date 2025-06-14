
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  customerEmail: string;
  customerName: string;
  orderId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerEmail, customerName, orderId, orderItems, totalAmount }: OrderConfirmationRequest = await req.json();

    const itemsList = orderItems.map(item => 
      `<li>${item.name} x${item.quantity} - KSh ${(item.price * item.quantity).toLocaleString()}</li>`
    ).join('');

    const emailResponse = await resend.emails.send({
      from: "MilluxCollections <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Thank you for your order, ${customerName}!</h1>
          
          <p>We've received your order and are preparing it for delivery.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h2 style="color: #333; margin-top: 0;">Order Details</h2>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Items:</strong></p>
            <ul>
              ${itemsList}
            </ul>
            <p><strong>Total:</strong> KSh ${totalAmount.toLocaleString()}</p>
          </div>
          
          <p>We'll send you another email with tracking information once your order ships.</p>
          
          <p>If you have any questions about your order, please contact us via WhatsApp at +254700000000.</p>
          
          <p>Best regards,<br>The MilluxCollections Team</p>
        </div>
      `,
    });

    console.log("Order confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
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
