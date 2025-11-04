import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Book } from '@/types';
import BookCard from '@/components/BookCard';
import { useNavigation } from '@react-navigation/native';

export default function LibraryScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [query, setQuery] = useState('');
  const nav = useNavigation<any>();

  async function load() {
    const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false });
    setBooks((data || []) as Book[]);
  }
  useEffect(() => { const s = supabase.channel('books').on('postgres_changes', { event: '*', schema:'public', table:'books' }, load).subscribe(); load(); return () => { supabase.removeChannel(s); } }, []);

  const filtered = books.filter(b =>
    !query.trim() ||
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.authors?.join(',').toLowerCase().includes(query.toLowerCase()) ||
    b.isbn.includes(query)
  );

  return (
    <View style={{ flex:1, padding: 16 }}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom: 8 }}>
        <Button title="Scan ISBN" onPress={() => nav.navigate('ScanISBN')} />
        <Button title="Shelves" onPress={() => nav.navigate('Shelves')} />
        <Button title="Friends" onPress={() => nav.navigate('Friends')} />
        <Button title="Requests" onPress={() => nav.navigate('BorrowRequests')} />
      </View>
      <TextInput placeholder="Search title, author, or ISBN" value={query} onChangeText={setQuery} style={{ borderWidth:1, borderColor:'#e5e7eb', padding:10, borderRadius:10, marginBottom:10, backgroundColor:'#fff' }} />
      <FlatList horizontal data={filtered} keyExtractor={b=>b.id} renderItem={({item}) => (
        <BookCard book={item} onPress={() => nav.navigate('BookDetail', { bookId: item.id })} />
      )} showsHorizontalScrollIndicator={false} />
    </View>
  );
}
