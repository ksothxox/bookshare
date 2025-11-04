import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '@/screens/SignInScreen';
import LibraryScreen from '@/screens/LibraryScreen';
import ScanISBNScreen from '@/screens/ScanISBNScreen';
import BookDetailScreen from '@/screens/BookDetailScreen';
import ShelvesScreen from '@/screens/ShelvesScreen';
import FriendsScreen from '@/screens/FriendsScreen';
import BorrowRequestsScreen from '@/screens/BorrowRequestsScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import useAuth from '@/hooks/useAuth';

export type RootStackParamList = {
  SignIn: undefined;
  Library: undefined;
  ScanISBN: undefined;
  BookDetail: { bookId: string };
  Shelves: undefined;
  Friends: undefined;
  BorrowRequests: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { session, ready } = useAuth();
  if (!ready) return null;
  return (
    <Stack.Navigator>
      {!session ? (
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Library" component={LibraryScreen} options={{ title: 'My Library' }} />
          <Stack.Screen name="ScanISBN" component={ScanISBNScreen} options={{ title: 'Scan ISBN' }} />
          <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Book' }} />
          <Stack.Screen name="Shelves" component={ShelvesScreen} options={{ title: 'Shelves' }} />
          <Stack.Screen name="Friends" component={FriendsScreen} options={{ title: 'Friends' }} />
          <Stack.Screen name="BorrowRequests" component={BorrowRequestsScreen} options={{ title: 'Borrow Requests' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
