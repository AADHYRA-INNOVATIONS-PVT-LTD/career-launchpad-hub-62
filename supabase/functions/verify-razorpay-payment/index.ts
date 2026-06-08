import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!key_secret) {
      throw new Error('Razorpay secret not configured in environment variables')
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error('Missing required payment verification fields')
    }

    // Verify signature using Web Crypto API
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    // Convert secret string to key
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key_secret);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    // Sign the text
    const textData = encoder.encode(text);
    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, textData);
    
    // Convert ArrayBuffer to hex string
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const generated_signature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (generated_signature !== razorpay_signature) {
      throw new Error('Invalid payment signature')
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Payment verified successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
