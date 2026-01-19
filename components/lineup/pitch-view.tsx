import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PitchBackground } from './pitch-background';
import { PlayerNode } from './player-node';
import { Player, Formation } from '@/types/lineup';

interface PitchViewProps {
  players: Player[];
  formation: Formation;
}

export const PitchView: React.FC<PitchViewProps> = ({ players, formation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.pitch}>
        <PitchBackground />

        {/* Players positioned on pitch */}
        {formation.positions.map((posData, index) => {
          const player = players[posData.playerIndex];
          if (!player) return null;

          return (
            <View
              key={`player-${index}`}
              style={[
                styles.playerPosition,
                {
                  left: `${posData.x * 100}%`,
                  top: `${posData.y * 100}%`,
                },
              ]}
            >
              <PlayerNode player={player} />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  pitch: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  playerPosition: {
    position: 'absolute',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
});
