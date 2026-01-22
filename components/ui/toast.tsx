import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ visible, message, onHide }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible, onHide, opacity]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity }]}>
      <View style={styles.toastContent}>
        <Ionicons name="information-circle" size={20} color="#0d59f2" />
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e2736',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 12,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
