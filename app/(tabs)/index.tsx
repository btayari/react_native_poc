import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/tactical-lineup');
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return <View />;
}