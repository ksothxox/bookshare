import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function BorrowRequestsScreen() {
  const [items, setItems] = useState<any[]>([]);
  async function load() {
    const { data } = await supabase.from('borrow_requests_view').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  }
  useEffect(() => { load(); }, []);

  async function act(id: string, action: 'approve'|'decline'|'returned') {
    await supabase.from('borrow_requests').update({ status: action === 'approve' ? 'approved' : action === 'decline' ? 'declined' : 'returned' }).eq('id', id);
    load();
  }

  return (
    <View style={{ padding: 16 }}>
      <FlatList data={items} keyExtractor={i=>i.id} renderItem={({item}) => (
        <View style={{ padding: 12, backgroundColor:'#fff', borderRadius:10, marginVertical:6 }}>
          <Text style={{ fontWeight:'700' }}>{item.book_title}</Text>
          <Text style={{ color:'#6b7280' }}>Borrower: {item.borrower_email}</Text>
          <Text>Status: {item.status}</Text>
          {item.status === 'pending' && (
            <View style={{ flexDirection:'row', gap: 8, marginTop: 8 }}>
              <Button title="Approve" onPress={() => act(item.id, 'approve')} />
              <Button title="Decline" onPress={() => act(item.id, 'decline')} />
            </View>
          )}
          {item.status === 'approved' && (
            <Button title="Mark Returned" onPress={() => act(item.id, 'returned')} />
          )}
        </View>
      )} />
    </View>
  );
}
