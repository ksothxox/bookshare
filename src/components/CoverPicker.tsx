import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { View, TextInput, Button, Image, Text } from 'react-native';
import { uploadCoverFromUri } from '@/lib/upload';

export default function CoverPicker({ value, onChange, userId }: { value?: string|null; onChange: (url: string) => void; userId: string }) {
  const [searchIsbn, setSearchIsbn] = useState('');
  const [temp, setTemp] = useState<string|undefined>(undefined);

  async function pick() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9 });
    if (!res.canceled) {
      const url = await uploadCoverFromUri(userId, res.assets[0].uri);
      onChange(url);
    }
  }

  async function fetchFromOpenLibrary() {
    const clean = searchIsbn.replace(/[^0-9Xx]/g, '');
    const url = `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg`;
    try {
      const r = await fetch(url, { method: 'HEAD' });
      if (r.ok) { setTemp(url); onChange(url); }
    } catch {}
  }

  return (
    <View>
      {!!value && <Image source={{ uri: value }} style={{ width: 120, height: 180, borderRadius: 8, marginBottom: 8 }} />}
      <Button title="Upload from phone" onPress={pick} />
      <View style={{ flexDirection:'row', marginTop: 8 }}>
        <TextInput value={searchIsbn} onChangeText={setSearchIsbn} placeholder="ISBN to fetch cover" style={{ flex:1, borderWidth:1, borderColor:'#e5e7eb', padding:8, borderRadius:8 }} />
        <Button title="Fetch" onPress={fetchFromOpenLibrary} />
      </View>
      {temp && <Text style={{ color:'#10b981', marginTop:6 }}>Cover selected from Open Library.</Text>}
    </View>
  );
}
