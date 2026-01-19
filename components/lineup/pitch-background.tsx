import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line, Circle, Rect, Path } from 'react-native-svg';

export const PitchBackground: React.FC = () => {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Center line */}
        <Line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="0.3"
        />

        {/* Center circle */}
        <Circle
          cx="50"
          cy="50"
          r="12"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="0.3"
          fill="none"
        />

        {/* Penalty box top */}
        <Rect
          x="20"
          y="0"
          width="60"
          height="15"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="0.3"
          fill="none"
        />

        {/* Penalty box bottom */}
        <Rect
          x="20"
          y="85"
          width="60"
          height="15"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="0.3"
          fill="none"
        />

        {/* Goal box top */}
        <Rect
          x="33.5"
          y="0"
          width="33"
          height="6"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="0.3"
          fill="none"
        />

        {/* Goal box bottom */}
        <Rect
          x="33.5"
          y="94"
          width="33"
          height="6"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="0.3"
          fill="none"
        />

        {/* Corner arcs */}
        {/* Top-left */}
        <Path
          d="M 0 8 Q 0 0, 8 0"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="0.3"
          fill="none"
        />

        {/* Top-right */}
        <Path
          d="M 92 0 Q 100 0, 100 8"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="0.3"
          fill="none"
        />

        {/* Bottom-left */}
        <Path
          d="M 0 92 Q 0 100, 8 100"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="0.3"
          fill="none"
        />

        {/* Bottom-right */}
        <Path
          d="M 92 100 Q 100 100, 100 92"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="0.3"
          fill="none"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1e3a28',
  },
});
