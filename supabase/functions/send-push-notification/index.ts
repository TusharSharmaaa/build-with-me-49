import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  title: string;
  body: string;
  url?: string;
  toolId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { title, body, url, toolId }: NotificationPayload = await req.json();

    console.log('Sending push notification:', { title, body, url, toolId });

    // In a real implementation, you would:
    // 1. Store push subscription endpoints in a database table
    // 2. Fetch all subscriptions from the database
    // 3. Send push notifications to all subscribed endpoints using Web Push protocol
    
    // For now, we'll just log the notification details
    // and return success. To implement actual push notifications:
    // - Store user push subscriptions in a 'push_subscriptions' table
    // - Use the web-push library to send notifications
    // - Handle subscription management (add/remove)

    const notificationData = {
      title,
      body,
      url: url || '/',
      timestamp: new Date().toISOString(),
      toolId: toolId || null,
    };

    // TODO: Implement actual push notification sending
    // Example structure for future implementation:
    /*
    const { data: subscriptions } = await supabaseClient
      .from('push_subscriptions')
      .select('*');
    
    if (subscriptions) {
      for (const subscription of subscriptions) {
        // Send push notification using web-push library
        await webpush.sendNotification(
          subscription.endpoint,
          JSON.stringify(notificationData)
        );
      }
    }
    */

    console.log('Notification prepared:', notificationData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification queued',
        data: notificationData 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error sending push notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
