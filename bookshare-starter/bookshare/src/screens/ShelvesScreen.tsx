import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Switch } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Shelf } from '@/types';

export default function ShelvesScreen() {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [name, setName] = useState('');

  async function load() {
    const { data } = await supabase.from('shelves').select('*').order('created_at', { ascending: false });
    setShelves((data || []) as Shelf[]);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!name.trim()) return;
    await supabase.from('shelves').insert({ name });
    setName(''); load();
  }

  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection:'row' }}>
        <TextInput placeholder="New shelf name" value={name} onChangeText={setName} style={{ flex:1, borderWidth:1, borderColor:'#e5e7eb', padding:10, borderRadius:10 }} />
        <Button title="Add" onPress={add} />
      </View>
      <FlatList data={shelves} keyExtractor={s=>s.id} renderItem={({item}) => (
        <View style={{ padding: 12, backgroundColor:'#fff', borderRadius:10, marginVertical:6 }}>
          <Text style={{ fontWeight:'700' }}>{item.name}</Text>
          <View style={{ flexDirection:'row', alignItems:'center', gap: 8, marginTop: 6 }}>
            <Text>Private</Text>
            <Switch value={!!item.is_private} onValueChange={async (v) => { await supabase.from('shelves').update({ is_private: v }).eq('id', item.id); load(); }} />
          </View>
        </View>
      )} />
    </View>
  );
}
