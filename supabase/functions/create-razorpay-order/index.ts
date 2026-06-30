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
    const { amount, currency = 'INR', receipt = 'receipt_1' } = await req.json()

    // Razorpay expects amount in paise (smallest currency unit)
    const amountInPaise = Math.round(amount * 100);
    
    // Validate amount >= 100 paise
    if (amountInPaise < 100) {
      return new Response(
        JSON.stringify({ error: 'Minimum amount must be at least 1 INR (100 paise)' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get Razorpay credentials from environment variables
    const key_id = Deno.env.get('RAZORPAY_KEY_ID')
    const key_secret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!key_id || !key_secret) {
      return new Response(
        JSON.stringify({ error: 'Razorpay credentials not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Call Razorpay API to create an order
    const auth = btoa(`${key_id}:${key_secret}`)
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt,
      })
    })

    const order = await response.json()

    if (!response.ok) {
      const statusCode = response.status === 401 ? 401 : 500;
      return new Response(
        JSON.stringify({ error: order.error?.description || 'Failed to create Razorpay order' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: statusCode }
      )
    }

    return new Response(
      JSON.stringify(order),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
