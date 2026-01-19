import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SideMenu } from '@/components/lineup/side-menu';
import { PitchView } from '@/components/lineup/pitch-view';
import { PLAYERS, FORMATIONS } from '@/constants/lineup-data';
import { PlayerPosition } from '@/types/lineup';

export default function TacticalLineupScreen() {
  const [selectedFormation, setSelectedFormation] = useState('4-3-3');
  const [showFormationPicker, setShowFormationPicker] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const { width } = useWindowDimensions();

  const isWebLayout = width > 900;
  const formation = FORMATIONS[selectedFormation];

  const getPositionName = (position: PlayerPosition): string => {
    switch (position) {
      case PlayerPosition.GOALKEEPER:
        return 'Goalkeeper';
      case PlayerPosition.DEFENDER:
        return 'Defender';
      case PlayerPosition.MIDFIELDER:
        return 'Midfielder';
      case PlayerPosition.FORWARD:
        return 'Forward';
    }
  };

  const renderMobileLayout = () => (
    <View style={styles.container}>
      {/* Team Header */}
      <View style={styles.teamHeader}>
        <View style={styles.mobileTopRow}>
          <TouchableOpacity onPress={() => setShowDrawer(true)}>
            <Ionicons name="menu" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="settings" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <View style={styles.teamInfo}>
          <View style={styles.teamTitleContainer}>
            <View>
              <Text style={styles.teamLabel}>HOME TEAM</Text>
              <Text style={styles.teamName}>Manchester City</Text>
            </View>
            <View style={styles.overallBadge}>
              <Ionicons name="trending-up" size={16} color="#0d59f2" />
              <Text style={styles.overallText}>86 OVR</Text>
            </View>
          </View>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.formationSelector}
            onPress={() => setShowFormationPicker(true)}
          >
            <View>
              <Text style={styles.formationLabel}>FORMATION</Text>
              <Text style={styles.formationValue}>{formation.displayName}</Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.autoButton}>
            <Ionicons name="sparkles" size={20} color="#0d59f2" />
            <Text style={styles.autoButtonText}>Auto</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pitch View */}
      <PitchView players={PLAYERS} formation={formation} />

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>All players fit</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Avg Age: </Text>
            <Text style={styles.statusValue}>26.4</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Make Prediction</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Drawer Modal */}
      <Modal
        visible={showDrawer}
        animationType="none"
        transparent
        onRequestClose={() => setShowDrawer(false)}
      >
        <View style={styles.drawerOverlay}>
          <View style={styles.drawerContent}>
            <SideMenu />
          </View>
          <TouchableOpacity
            style={styles.drawerBackdrop}
            activeOpacity={1}
            onPress={() => setShowDrawer(false)}
          />
        </View>
      </Modal>

      {/* Formation Picker Modal */}
      {renderFormationPicker()}
    </View>
  );

  const renderWebLayout = () => (
    <View style={styles.webContainer}>
      {/* Left Side Menu */}
      <SideMenu isWeb />

      {/* Center - Pitch View */}
      <View style={styles.webCenter}>
        <View style={styles.webTeamHeader}>
          <View>
            <Text style={styles.teamLabel}>HOME TEAM</Text>
            <Text style={[styles.teamName, styles.webTeamName]}>Manchester City</Text>
          </View>
          <View style={styles.webOverallBadge}>
            <Ionicons name="trending-up" size={20} color="#0d59f2" />
            <Text style={styles.webOverallText}>86 OVR</Text>
          </View>
        </View>

        <View style={styles.webPitchContainer}>
          <PitchView players={PLAYERS} formation={formation} />
        </View>
      </View>

      {/* Right Side - Controls */}
      <View style={styles.webRightPanel}>
        <View style={styles.webPanelHeader}>
          <Text style={styles.webPanelTitle}>Match Prediction</Text>
          <TouchableOpacity>
            <Ionicons name="settings" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.webPanelContent} showsVerticalScrollIndicator={false}>
          {renderFormationSection()}
          {renderPlayersList()}
          {renderStats()}
        </ScrollView>

        <View style={styles.webPanelFooter}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Make Prediction</Text>
            <Ionicons name="arrow-forward" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Formation Picker Modal - Also for web */}
      {renderFormationPicker()}
    </View>
  );

  const renderFormationSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>FORMATION</Text>
      <TouchableOpacity
        style={styles.webFormationSelector}
        onPress={() => setShowFormationPicker(true)}
      >
        <Text style={styles.webFormationText}>{formation.displayName}</Text>
        <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.autoFillButton}>
        <Ionicons name="sparkles" size={20} color="#0d59f2" />
        <Text style={styles.autoFillText}>Auto Fill Best XI</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPlayersList = () => (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>STARTING XI</Text>
      {PLAYERS.map((player, index) => (
        <View
          key={index}
          style={[
            styles.playerCard,
            player.isStarPlayer && styles.playerCardStar,
          ]}
        >
          <View style={styles.playerAvatar}>
            <Ionicons name="person" size={20} color="#9CA3AF" />
          </View>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerPosition}>{getPositionName(player.position)}</Text>
          </View>
          <View
            style={[
              styles.playerRating,
              player.isStarPlayer && styles.playerRatingStar,
            ]}
          >
            <Text
              style={[
                styles.playerRatingText,
                player.isStarPlayer && styles.playerRatingTextStar,
              ]}
            >
              {player.rating.toFixed(1)}
            </Text>
          </View>
          {player.isStarPlayer && (
            <Ionicons name="star" size={18} color="#0d59f2" style={styles.starIcon} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>Team Status</Text>
        <View style={styles.statsStatus}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>All players fit</Text>
        </View>
      </View>
      <View style={styles.statsDivider} />
      <View style={styles.statsRow}>
        <View>
          <Text style={styles.statLabel}>Average Age</Text>
          <Text style={styles.statValue}>26.4</Text>
        </View>
        <View style={styles.statRight}>
          <Text style={[styles.statLabel, styles.statLabelRight]}>Team Rating</Text>
          <Text style={[styles.statValue, styles.statValueBlue]}>86</Text>
        </View>
      </View>
    </View>
  );

  const renderFormationPicker = () => (
    <Modal
      visible={showFormationPicker}
      animationType="fade"
      transparent
      onRequestClose={() => setShowFormationPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowFormationPicker(false)}
        />
        <View style={[styles.modalContent, isWebLayout && styles.modalContentWeb]}>
          <Text style={styles.modalTitle}>Select Formation</Text>
          {Object.entries(FORMATIONS).map(([key, form]) => {
            const isSelected = key === selectedFormation;
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.formationOption,
                  isSelected && styles.formationOptionSelected,
                ]}
                onPress={() => {
                  setSelectedFormation(key);
                  setShowFormationPicker(false);
                }}
              >
                <View>
                  <Text
                    style={[
                      styles.formationOptionName,
                      isSelected && styles.formationOptionNameSelected,
                    ]}
                  >
                    {form.name}
                  </Text>
                  <Text style={styles.formationOptionDisplay}>
                    {form.displayName}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color="#0d59f2" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {isWebLayout ? renderWebLayout() : renderMobileLayout()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101622',
  },
  container: {
    flex: 1,
    backgroundColor: '#101622',
  },
  webContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  teamHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  mobileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamInfo: {
    marginBottom: 16,
  },
  teamTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  teamLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  teamName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  webTeamName: {
    fontSize: 32,
  },
  overallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 89, 242, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  overallText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0d59f2',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formationSelector: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e2736',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  formationLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  formationValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  autoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 89, 242, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(13, 89, 242, 0.3)',
    gap: 6,
  },
  autoButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d59f2',
  },
  bottomActions: {
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statusLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d59f2',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#0d59f2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContent: {
    width: 280,
    height: '100%',
    backgroundColor: '#0d1117',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  webCenter: {
    flex: 3,
  },
  webTeamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  webOverallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 89, 242, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(13, 89, 242, 0.3)',
    gap: 8,
  },
  webOverallText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d59f2',
  },
  webPitchContainer: {
    flex: 1,
    padding: 24,
  },
  webRightPanel: {
    width: 470,
    backgroundColor: '#0d1117',
    borderLeftWidth: 1,
    borderLeftColor: '#374151',
  },
  webPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  webPanelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  webPanelContent: {
    flex: 1,
    padding: 24,
  },
  webPanelFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6B7280',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  webFormationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e2736',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 12,
  },
  webFormationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  autoFillButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 89, 242, 0.15)',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(13, 89, 242, 0.3)',
    gap: 8,
  },
  autoFillText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0d59f2',
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e2736',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 8,
  },
  playerCardStar: {
    borderColor: 'rgba(13, 89, 242, 0.3)',
  },
  playerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    borderWidth: 2,
    borderColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  playerPosition: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  playerRating: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  playerRatingStar: {
    backgroundColor: '#0d59f2',
  },
  playerRatingText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  playerRatingTextStar: {
    color: '#ffffff',
  },
  starIcon: {
    marginLeft: 0,
  },
  statsContainer: {
    backgroundColor: '#1e2736',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  statsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsDivider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statLabelRight: {
    textAlign: 'right',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statValueBlue: {
    color: '#0d59f2',
  },
  statRight: {
    alignItems: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1e2736',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 500,
  },
  modalContentWeb: {
    borderRadius: 20,
    marginBottom: '20%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  formationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#101622',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 12,
  },
  formationOptionSelected: {
    backgroundColor: 'rgba(13, 89, 242, 0.15)',
    borderColor: '#0d59f2',
    borderWidth: 2,
  },
  formationOptionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  formationOptionNameSelected: {
    color: '#0d59f2',
  },
  formationOptionDisplay: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
