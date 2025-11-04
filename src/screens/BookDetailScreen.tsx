import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Book } from '@/types';
import useAuth from '@/hooks/useAuth';
import CoverPicker from '@/components/CoverPicker';

export default function BookDetailScreen({ route }: any) {
  const { bookId } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const { session } = useAuth();

  async function load() {
    const { data } = await supabase.from('books').select('*').eq('id', bookId).single();
    setBook(data as Book);
  }
  useEffect(() => { load(); }, [bookId]);

  async function updateCover(url: string) {
    await supabase.from('books').update({ cover_url: url }).eq('id', bookId);
    load();
  }

  async function requestBorrow() {
    const { error } = await supabase.functions.invoke('borrow_request', { body: { book_id: bookId } });
    if (error) alert(error.message); else alert('Borrow request sent');
  }

  if (!book) return null;
  const isOwner = book.user_id === session!.user.id;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '800' }}>{book.title}</Text>
      {!!book.authors?.length && <Text style={{ color:'#6b7280', marginBottom: 12 }}>{book.authors.join(', ')}</Text>}

      <CoverPicker value={book.cover_url} userId={session!.user.id} onChange={updateCover} />

      {!isOwner && <Button title="Request to Borrow" onPress={requestBorrow} />}
      {isOwner && <Text style={{ marginTop: 8, color:'#6b7280' }}>You own this book.</Text>}
    </View>
  );
}
