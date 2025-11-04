import { supabase } from './supabase';

export async function uploadCoverFromUri(userId: string, localUri: string) {
  const resp = await fetch(localUri);
  const blob = await resp.blob();
  const path = `${userId}/${Date.now()}.jpg`;
  const { data, error } = await supabase.storage.from('covers').upload(path, blob, {
    contentType: 'image/jpeg', upsert: false,
  });
  if (error) throw error;
  const { data: pub } = supabase.storage.from('covers').getPublicUrl(path);
  return pub.publicUrl;
}
