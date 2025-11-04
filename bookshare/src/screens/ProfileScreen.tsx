import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Switch } from 'react-native';
import { supabase } from '@/lib/supabase';
import useAuth from '@/hooks/useAuth';

export default function ProfileScreen() {
  const { session } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => { (async () => {
    const { data } = await supabase.from('profiles').select('*').single();
    if (data) {
      setDisplayName(data.display_name || '');
      setUsername(data.username || '');
      setIsPublic(!!data.is_public);
    }
  })(); }, []);

  async function save() {
    const { error } = await supabase.from('profiles').upsert({ id: session!.user.id, display_name: displayName, email: session!.user.email, username, is_public: isPublic });
    if (error) alert(error.message); else alert('Saved');
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize:20, fontWeight:'800', marginBottom: 8 }}>Profile</Text>
      <Text>Email: {session?.user.email}</Text>
      <TextInput value={displayName} onChangeText={setDisplayName} placeholder="Display Name" style={{ borderWidth:1, borderColor:'#e5e7eb', padding:10, borderRadius:10, marginVertical:10 }} />
      <TextInput value={username} onChangeText={setUsername} placeholder="Username (unique)" autoCapitalize='none' style={{ borderWidth:1, borderColor:'#e5e7eb', padding:10, borderRadius:10, marginVertical:10 }} />
      <View style={{ flexDirection:'row', alignItems:'center', marginVertical:10 }}>
        <Switch value={isPublic} onValueChange={setIsPublic} />
        <Text style={{ marginLeft: 8 }}>Make my library public (optional)</Text>
      </View>
      <Button title="Save" onPress={save} />
      <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}
