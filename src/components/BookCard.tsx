import React from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import { Book } from '@/types';

export default function BookCard({ book, onPress }: { book: Book; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ width: 120, marginRight: 12 }}>
      <View style={{ backgroundColor: '#f3f4f6', borderRadius: 10, overflow: 'hidden', height: 180, justifyContent: 'center' }}>
        {book.cover_url ? (
          <Image source={{ uri: book.cover_url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <Text style={{ textAlign: 'center', padding: 12 }}>No Cover</Text>
        )}
      </View>
      <Text numberOfLines={2} style={{ marginTop: 6, fontWeight: '600' }}>{book.title || book.isbn}</Text>
      {!!book.authors?.length && (
        <Text numberOfLines={1} style={{ color: '#6b7280', fontSize: 12 }}>{book.authors.join(', ')}</Text>
      )}
    </Pressable>
  );
}
