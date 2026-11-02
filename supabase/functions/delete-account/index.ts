import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function response(body: string | null, status: number, headers: HeadersInit = {}) {
  return new Response(body, {
    status,
    headers: { ...corsHeaders, ...headers },
  });
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return response(null, 204);
  if (request.method !== 'POST') return response('Method not allowed', 405);

  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return response('Unauthorized', 401);

  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !anonKey || !serviceRoleKey) return response('Server configuration error', 500);

  const token = authorization.slice('Bearer '.length);
  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error: userError } = await authClient.auth.getUser(token);
  if (userError || !data.user) return response('Unauthorized', 401);

  const adminClient = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await adminClient.auth.admin.deleteUser(data.user.id);
  if (error) return response(JSON.stringify({ error: 'Account deletion failed.' }), 500, { 'Content-Type': 'application/json' });

  return response(null, 204);
});
