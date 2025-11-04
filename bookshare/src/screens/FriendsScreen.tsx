import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useNavigation } from '@react-navigation/native';

export default function FriendsScreen() {
  const [friends, setFriends] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const nav = useNavigation<any>();

  async function load() {
    const { data } = await supabase.from('friends_view').select('*');
    setFriends(data || []);
  }
  useEffect(() => { load(); }, []);

  async function search() {
    if (!q.trim()) return;
    const { data, error } = await supabase.from('profiles').select('id, username, display_name, email').ilike('username', `%${q}%`).limit(20);
    if (error) Alert.alert('Error', error.message); else setResults(data || []);
  }

  async function requestFriend(userId: string) {
    const { error } = await supabase.from('friends').insert({ friend_user_id: userId });
    if (error) Alert.alert('Error', error.message); else Alert.alert('Sent', 'Friend request sent');
    load();
  }

  async function accept(id: string) {
    await supabase.from('friends').update({ status: 'accepted' }).eq('id', id);
    load();
  }

  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection:'row', marginBottom: 10 }}>
        <TextInput placeholder="Search username" value={q} onChangeText={setQ} autoCapitalize='none' style={{ flex:1, borderWidth:1, borderColor:'#e5e7eb', padding:10, borderRadius:10 }} />
        <Button title="Search" onPress={search} />
      </View>

      {results.length > 0 && (
        <FlatList data={results} keyExtractor={(u)=>u.id} renderItem={({item}) => (
          <View style={{ padding: 12, backgroundColor:'#fff', borderRadius:10, marginVertical:6 }}>
            <Text style={{ fontWeight:'700' }}>@{item.username}</Text>
            <Text style={{ color:'#6b7280' }}>{item.display_name || item.email}</Text>
            <Button title="Add friend" onPress={() => requestFriend(item.id)} />
          </View>
        )} />
      )}

      <Text style={{ fontWeight:'800', marginTop: 12 }}>My Friends</Text>
      <FlatList data={friends} keyExtractor={(f:any)=>f.id} renderItem={({item}:any) => (
        <View style={{ padding: 12, backgroundColor:'#fff', borderRadius:10, marginVertical:6 }}>
          <Text style={{ fontWeight:'700' }}>{item.friend_email} {item.friend_name ? `(${item.friend_name})` : ''}</Text>
          <Text style={{ color:'#6b7280' }}>Status: {item.status}</Text>
          {item.status === 'pending' && <Button title="Accept" onPress={() => accept(item.id)} />}
        </View>
      )} />
    </View>
  );
}
