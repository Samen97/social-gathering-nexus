import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Received request to notify-event function')
    const { event } = await req.json()
    console.log('Event data:', event)

    if (!event) {
      throw new Error('No event data provided')
    }

    // Get all users except the event creator
    const { data: users, error: usersError } = await supabaseClient
      .from('profiles')
      .select('id')
      .neq('id', event.created_by)

    if (usersError) {
      throw usersError
    }

    console.log(`Found ${users?.length} users to notify`)

    // Create notifications for each user
    if (users) {
      const notifications = users.map((user) => ({
        user_id: user.id,
        type: event.is_official ? 'new_official_event' : 'new_community_event',
        title: event.is_official ? 'New Official Event' : 'New Community Event',
        content: `${event.is_official ? 'An official' : 'A community'} event has been ${event.approval_status === 'approved' ? 'approved' : 'created'}: ${event.title}`,
        reference_id: event.id,
      }))

      const { error: notificationError } = await supabaseClient
        .from('notifications')
        .insert(notifications)

      if (notificationError) {
        throw notificationError
      }

      console.log(`Successfully created ${notifications.length} notifications`)
    }

    return new Response(
      JSON.stringify({ message: 'Notifications created successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in notify-event function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})