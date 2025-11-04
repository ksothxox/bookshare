// Deno-style Supabase Edge Function
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const { book_id } = await req.json();
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!; // or SERVICE_ROLE for stricter control
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

  const authHeader = req.headers.get('Authorization');
  const jwt = authHeader?.replace('Bearer ', '') || '';
  const { data: { user }, error: userErr } = await supabase.auth.getUser(jwt);
  if (userErr || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const { data: book } = await supabase.from('books').select('id,user_id,shelf_id,title').eq('id', book_id).single();
  if (!book) return new Response(JSON.stringify({ error: 'Book not found' }), { status: 404 });
  if (book.user_id === user.id) return new Response(JSON.stringify({ error: 'Cannot borrow your own book' }), { status: 400 });

  const { data: shelf } = await supabase.from('shelves').select('id, user_id, is_private').eq('id', book.shelf_id).single();
  if (!shelf) return new Response(JSON.stringify({ error: 'Shelf not found' }), { status: 404 });
  if (shelf.is_private) return new Response(JSON.stringify({ error: 'This book is on a private shelf' }), { status: 403 });

  const { data: pair } = await supabase.from('friend_pairs').select('owner_id').eq('owner_id', book.user_id).eq('viewer_id', user.id).maybeSingle();
  if (!pair) return new Response(JSON.stringify({ error: 'Only friends can request to borrow' }), { status: 403 });

  const { error } = await supabase.from('borrow_requests').insert({ owner_id: book.user_id, borrower_id: user.id, book_id });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify({ ok: true }));
});
