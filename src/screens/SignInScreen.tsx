import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const [email, setEmail] = useState('');

  async function signIn() {
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: 'bookshare://auth' } });
    if (error) Alert.alert('Error', error.message); else Alert.alert('Check your email', 'Magic link sent.');
  }

  return (
    <View style={{ flex:1, justifyContent:'center', padding: 16 }}>
      <Text style={{ fontSize: 26, fontWeight: '800', marginBottom: 12 }}>BookShare</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" style={{ borderWidth:1, borderColor:'#e5e7eb', padding:12, borderRadius:12, marginBottom:12 }} />
      <Button title="Send magic link" onPress={signIn} />
    </View>
  );
}
