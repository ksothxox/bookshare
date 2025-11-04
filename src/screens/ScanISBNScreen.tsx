import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { fetchBookByISBN } from '@/lib/booksApi';
import { supabase } from '@/lib/supabase';
import useAuth from '@/hooks/useAuth';

export default function ScanISBNScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
    if (scanned) return; setScanned(true);
    const meta = await fetchBookByISBN(data);
    if (!meta) { Alert.alert('Not found', 'Could not fetch book details'); setScanned(false); return; }
    const { data: ins, error } = await supabase.from('books').insert({
      user_id: session!.user.id,
      isbn: meta.isbn,
      title: meta.title || meta.isbn,
      authors: meta.authors || null,
      cover_url: meta.coverUrl || null,
    }).select().single();
    if (error) Alert.alert('Error', error.message); else Alert.alert('Added', ins.title);
    setScanned(false);
  };

  if (hasPermission === null) return <Text>Requesting camera permission…</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={{ flex:1 }}>
      <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={{ flex:1 }} />
      <Button title="Reset" onPress={() => setScanned(false)} />
    </View>
  );
}
