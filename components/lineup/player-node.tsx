import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Player, PlayerPosition } from '@/types/lineup';
import { Ionicons } from '@expo/vector-icons';

interface PlayerNodeProps {
  player: Player;
  onPress?: () => void;
}

export const PlayerNode: React.FC<PlayerNodeProps> = ({ player, onPress }) => {
  const isGoalkeeper = player.position === PlayerPosition.GOALKEEPER;
  const isStarPlayer = player.isStarPlayer && !isGoalkeeper;

  const borderColor = isGoalkeeper
    ? '#FBC02D'
    : player.isStarPlayer
    ? '#0d59f2'
    : '#ffffff';

  const avatarSize = isStarPlayer ? 48 : 40;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatar,
              {
                width: avatarSize,
                height: avatarSize,
                borderColor,
                borderWidth: 2,
                shadowColor: borderColor,
                shadowOpacity: player.isStarPlayer ? 0.3 : 0.2,
                shadowRadius: player.isStarPlayer ? 12 : 8,
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
          >
            <View style={styles.placeholder}>
              <Ionicons name="person" size={avatarSize * 0.6} color="#9CA3AF" />
            </View>
          </View>

          {/* Rating badge */}
          <View
            style={[
              styles.ratingBadge,
              {
                backgroundColor: player.isStarPlayer ? '#0d59f2' : '#0f172a',
                borderColor: player.isStarPlayer
                  ? 'rgba(13, 89, 242, 0.3)'
                  : isGoalkeeper
                  ? 'rgba(251, 192, 45, 0.3)'
                  : 'rgba(255, 255, 255, 0.3)',
              },
            ]}
          >
            <Text
              style={[
                styles.ratingText,
                {
                  fontSize: player.isStarPlayer ? 11 : 10,
                  color: player.isStarPlayer
                    ? '#ffffff'
                    : isGoalkeeper
                    ? '#FBC02D'
                    : '#ffffff',
                },
              ]}
            >
              {player.rating.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Player name */}
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{player.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#374151',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#374151',
  },
  ratingBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  ratingText: {
    fontWeight: 'bold',
  },
  nameContainer: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  nameText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#ffffff',
  },
});
