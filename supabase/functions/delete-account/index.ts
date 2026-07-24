// eslint-disable-next-line import/no-unresolved
import { createClient } from 'npm:@supabase/supabase-js@2.90.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, apikey, content-type, x-client-info',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (request.method !== 'POST') {
    return Response.json(
      { error: 'Method not allowed' },
      { status: 405, headers: corsHeaders },
    );
  }

  const authorization = request.headers.get('Authorization');
  if (!authorization) {
    return Response.json(
      { error: 'Authentication required' },
      { status: 401, headers: corsHeaders },
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return Response.json(
      { error: 'Server configuration is incomplete' },
      { status: 500, headers: corsHeaders },
    );
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });
  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();
  if (userError || !user) {
    return Response.json(
      { error: 'Invalid session' },
      { status: 401, headers: corsHeaders },
    );
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error('Failed to delete user', {
      userId: user.id,
      code: error.code,
    });
    return Response.json(
      { error: 'Account deletion failed' },
      { status: 500, headers: corsHeaders },
    );
  }

  return new Response(null, { status: 204, headers: corsHeaders });
});
