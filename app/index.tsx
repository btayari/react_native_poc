import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  useWindowDimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SideMenu } from '@/components/lineup/side-menu';
import { SQUAD_PLAYERS } from '@/constants/squad-data';
import { Toast } from '@/components/ui/toast';

export default function HomeScreen() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { width } = useWindowDimensions();
  const router = useRouter();

  const isWebLayout = width > 900;

  const showComingSoonToast = () => {
    setShowToast(true);
  };

  // Team season stats
  const seasonStats = {
    leaguePosition: '1st',
    league: 'Premier League',
    points: 54,
    matchesPlayed: 22,
    goalsScored: 58,
    goalsPerMatch: 2.64,
    cleanSheets: 12,
    cleanSheetsPercent: 54.5,
  };

  // Quick actions
  const quickActions = [
    { icon: 'football' as const, label: 'Tactical Lineup', route: '/tactical-lineup', enabled: true },
    { icon: 'people' as const, label: 'Squad Management', route: '/squad-management', enabled: true },
    { icon: 'swap-horizontal' as const, label: 'Transfers', route: '/transfers', enabled: true },
    { icon: 'search' as const, label: 'Scouting', route: null, enabled: false },
    { icon: 'stats-chart' as const, label: 'Statistics', route: null, enabled: false },
    { icon: 'calendar' as const, label: 'Fixtures', route: null, enabled: false },
    { icon: 'fitness' as const, label: 'Training', route: null, enabled: false },
    { icon: 'analytics' as const, label: 'AI Analysis', route: null, enabled: false },
  ];

  // Upcoming fixtures
  const upcomingFixtures = [
    { opponent: 'Liverpool', date: 'Jan 25, 2026', time: '17:30', type: 'HOME', competition: 'Premier League' },
    { opponent: 'Arsenal', date: 'Jan 29, 2026', time: '20:00', type: 'AWAY', competition: 'Premier League' },
    { opponent: 'Chelsea', date: 'Feb 1, 2026', time: '15:00', type: 'HOME', competition: 'FA Cup' },
  ];

  // Recent form (W = Win, D = Draw, L = Loss)
  const recentForm = ['W', 'W', 'D', 'W', 'W'];
  const formStats = '13 pts from last 5';

  // Top performers
  const topPerformers = SQUAD_PLAYERS
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
    .map(p => ({
      name: p.name.split(' ').pop() || p.name,
      position: p.displayPosition,
      rating: p.rating,
      image: p.imageUrl,
    }));

  const renderSeasonStats = () => (
    <View style={[styles.statsRow, isWebLayout && styles.statsRowWeb]}>
      <View style={[styles.statCard, styles.statCardLarge, isWebLayout && styles.statCardWeb]}>
        <View style={[styles.statIcon, isWebLayout && styles.statIconWeb]}>
          <Ionicons name="trophy" size={isWebLayout ? 24 : 20} color="#3b82f6" />
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statLabel, isWebLayout && styles.statLabelWeb]}>League Position</Text>
          <Text style={[styles.statValue, isWebLayout && styles.statValueWeb]}>{seasonStats.leaguePosition}</Text>
          <Text style={styles.statSubtext}>{seasonStats.league}</Text>
        </View>
      </View>

      <View style={[styles.statCard, styles.statCardLarge, isWebLayout && styles.statCardWeb]}>
        <View style={[styles.statIcon, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }, isWebLayout && styles.statIconWeb]}>
          <Ionicons name="trending-up" size={isWebLayout ? 24 : 20} color="#22c55e" />
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statLabel, isWebLayout && styles.statLabelWeb]}>Points</Text>
          <Text style={[styles.statValue, isWebLayout && styles.statValueWeb]}>{seasonStats.points}</Text>
          <Text style={styles.statSubtext}>{seasonStats.matchesPlayed} matches</Text>
        </View>
      </View>

      <View style={[styles.statCard, styles.statCardLarge, isWebLayout && styles.statCardWeb]}>
        <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }, isWebLayout && styles.statIconWeb]}>
          <Ionicons name="football" size={isWebLayout ? 24 : 20} color="#f59e0b" />
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statLabel, isWebLayout && styles.statLabelWeb]}>Goals Scored</Text>
          <Text style={[styles.statValue, isWebLayout && styles.statValueWeb]}>{seasonStats.goalsScored}</Text>
          <Text style={styles.statSubtext}>{seasonStats.goalsPerMatch} per match</Text>
        </View>
      </View>

      <View style={[styles.statCard, styles.statCardLarge, isWebLayout && styles.statCardWeb]}>
        <View style={[styles.statIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }, isWebLayout && styles.statIconWeb]}>
          <Ionicons name="shield-checkmark" size={isWebLayout ? 24 : 20} color="#8b5cf6" />
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statLabel, isWebLayout && styles.statLabelWeb]}>Clean Sheets</Text>
          <Text style={[styles.statValue, isWebLayout && styles.statValueWeb]}>{seasonStats.cleanSheets}</Text>
          <Text style={styles.statSubtext}>{seasonStats.cleanSheetsPercent}% of matches</Text>
        </View>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={[styles.quickActionsGrid, isWebLayout && styles.quickActionsGridWeb]}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.quickActionCard,
              isWebLayout && styles.quickActionCardWeb,
              !action.enabled && styles.quickActionDisabled
            ]}
            onPress={() => {
              if (action.enabled && action.route) {
                router.push(action.route as any);
              } else {
                showComingSoonToast();
              }
            }}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name={action.icon} size={24} color={action.enabled ? '#3b82f6' : '#6B7280'} />
            </View>
            <Text style={[styles.quickActionLabel, !action.enabled && styles.quickActionLabelDisabled]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderUpcomingFixtures = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Fixtures</Text>
        <TouchableOpacity onPress={showComingSoonToast}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.fixturesList}>
        {upcomingFixtures.map((fixture, index) => (
          <View key={index} style={styles.fixtureCard}>
            <View style={[styles.fixtureType, fixture.type === 'HOME' ? styles.homeType : styles.awayType]}>
              <Text style={styles.fixtureTypeText}>{fixture.type}</Text>
            </View>
            <View style={styles.fixtureInfo}>
              <Text style={styles.fixtureCompetition}>{fixture.competition}</Text>
              <Text style={styles.fixtureOpponent}>{fixture.opponent}</Text>
              <Text style={styles.fixtureDateTime}>{fixture.date} • {fixture.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderRecentForm = () => (
    <View style={styles.recentFormSection}>
      <Text style={styles.recentFormTitle}>Recent Form</Text>
      <View style={styles.formCard}>
        <View style={styles.formBadges}>
          {recentForm.map((result, index) => (
            <View
              key={index}
              style={[
                styles.formBadge,
                result === 'W' && styles.formWin,
                result === 'D' && styles.formDraw,
                result === 'L' && styles.formLoss,
              ]}
            >
              <Text style={styles.formBadgeText}>{result}</Text>
            </View>
          ))}
        </View>
        <View style={styles.formStats}>
          <Text style={styles.formStatsText}>{formStats}</Text>
        </View>
      </View>
    </View>
  );

  const renderTopPerformers = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Top Performers</Text>
      <View style={styles.performersList}>
        {topPerformers.map((player, index) => (
          <View key={index} style={styles.performerCard}>
            <View style={styles.performerImageContainer}>
              <Image source={player.image} style={styles.performerImage} />
            </View>
            <View style={styles.performerInfo}>
              <View style={styles.performerNameRow}>
                <Text style={styles.performerName}>{player.name}</Text>
                {index === 0 && <Ionicons name="star" size={14} color="#f59e0b" />}
              </View>
              <Text style={styles.performerPosition}>{player.position}</Text>
            </View>
            <View style={styles.performerRating}>
              <Text style={styles.performerRatingText}>{player.rating.toFixed(1)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderMobileLayout = () => (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowDrawer(true)}>
          <Ionicons name="menu" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Home</Text>
        </View>
        <TouchableOpacity onPress={showComingSoonToast}>
          <Ionicons name="settings-outline" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dashboard Title */}
        <View style={styles.dashboardTitleSection}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          <Text style={styles.seasonSubtitle}>Manchester City FC - Season 2025/26</Text>
        </View>

        {renderSeasonStats()}
        {renderRecentForm()}
        {renderUpcomingFixtures()}
        {renderQuickActions()}
        {renderTopPerformers()}

        <View style={styles.bottomSpacing} />
      </ScrollView>

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

      {/* Toast */}
      <Toast
        visible={showToast}
        message="Coming Soon"
        onHide={() => setShowToast(false)}
      />
    </View>
  );

  const renderWebLayout = () => (
    <View style={styles.webContainer}>
      {/* Left Side Menu */}
      <SideMenu isWeb />

      {/* Main Content */}
      <ScrollView style={styles.webContent} showsVerticalScrollIndicator={false}>
        <View style={styles.webHeader}>
          <View>
            <Text style={styles.dashboardTitle}>Dashboard</Text>
            <Text style={styles.seasonSubtitle}>Manchester City FC - Season 2025/26</Text>
          </View>
          <View style={styles.webHeaderActions}>
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={showComingSoonToast}
            >
              <Ionicons name="notifications-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {renderSeasonStats()}

        <View style={styles.webGrid}>
          <View style={styles.webMainColumn}>
            {renderQuickActions()}
          </View>
          <View style={styles.webSideColumn}>
            {renderUpcomingFixtures()}
          </View>
        </View>

        <View style={styles.webGrid}>
          <View style={styles.webMainColumn}>
            {renderRecentForm()}
          </View>
          <View style={styles.webSideColumn}>
            {renderTopPerformers()}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Toast */}
      <Toast
        visible={showToast}
        message="Coming Soon"
        onHide={() => setShowToast(false)}
      />
    </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  webUserName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  matchCard: {
    backgroundColor: '#1e2736',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 20,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  matchLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6B7280',
    letterSpacing: 1.2,
  },
  matchBadge: {
    backgroundColor: 'rgba(13, 89, 242, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0d59f2',
  },
  matchContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  teamSection: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  teamLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  teamNameMatch: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  teamStatus: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  matchInfo: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  matchVs: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 4,
  },
  matchDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  matchVenue: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  probabilitySection: {
    marginBottom: 16,
  },
  probabilityBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  probabilitySegment: {
    height: '100%',
  },
  homeWin: {
    backgroundColor: '#0d59f2',
  },
  draw: {
    backgroundColor: '#6B7280',
  },
  awayWin: {
    backgroundColor: '#ef4444',
  },
  probabilityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  probabilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  drawText: {
    color: '#6B7280',
  },
  viewPredictionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    gap: 8,
  },
  viewPredictionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d59f2',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1e2736',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  comingSoonText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1e2736',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
    marginTop: 4,
  },
  statValueWeb: {
    fontSize: 36,
    marginTop: 6,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statLabelWeb: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e2736',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#374151',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  activityTime: {
    fontSize: 11,
    color: '#6B7280',
  },
  bottomSpacing: {
    height: 40,
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
  webContent: {
    flex: 1,
    padding: 32,
  },
  webHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  webHeaderActions: {
    flexDirection: 'row',
    gap: 16,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1e2736',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  webGrid: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  webMainColumn: {
    flex: 1.5,
  },
  webSideColumn: {
    flex: 1,
  },
  // New Dashboard Styles
  dashboardTitleSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  titleSection: {
    marginBottom: 16,
    marginTop: 4,
  },
  dashboardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  seasonSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
    marginTop: 16,
  },
  statsRowWeb: {
    gap: 16,
    flexWrap: 'nowrap',
    marginBottom: 32,
  },
  statCardLarge: {
    flex: 1,
    minWidth: '47%',
    maxWidth: '48%',
    flexDirection: 'column',
    backgroundColor: '#1e2736',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'flex-start',
  },
  statCardWeb: {
    minWidth: 0,
    maxWidth: '100%',
    padding: 20,
    minHeight: 160,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconWeb: {
    width: 44,
    height: 44,
    borderRadius: 11,
    marginBottom: 12,
  },
  statContent: {
    flex: 1,
    width: '100%',
  },
  statSubtext: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionsGridWeb: {
    gap: 16,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#1e2736',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
    minHeight: 110,
  },
  quickActionCardWeb: {
    width: '23%',
    padding: 20,
    minHeight: 130,
  },
  quickActionDisabled: {
    opacity: 0.5,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  quickActionLabelDisabled: {
    color: '#6B7280',
  },
  fixturesList: {
    gap: 12,
  },
  fixtureCard: {
    flexDirection: 'row',
    backgroundColor: '#1e2736',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
  },
  fixtureType: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 16,
  },
  homeType: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  awayType: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  fixtureTypeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3b82f6',
    letterSpacing: 0.5,
  },
  fixtureInfo: {
    flex: 1,
  },
  fixtureCompetition: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  fixtureOpponent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  fixtureDateTime: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  formCard: {
    backgroundColor: '#1e2736',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  recentFormSection: {
    marginBottom: 20,
  },
  recentFormTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  formBadges: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  formBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formWin: {
    backgroundColor: '#22c55e',
  },
  formDraw: {
    backgroundColor: '#f59e0b',
  },
  formLoss: {
    backgroundColor: '#ef4444',
  },
  formBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  formStats: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  formStatsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#22c55e',
  },
  performersList: {
    gap: 12,
  },
  performerCard: {
    flexDirection: 'row',
    backgroundColor: '#1e2736',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
  },
  performerImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#374151',
  },
  performerImage: {
    width: 48,
    height: 48,
    resizeMode: 'cover',
  },
  performerInfo: {
    flex: 1,
  },
  performerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  performerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  performerPosition: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  performerRating: {
    backgroundColor: '#0d59f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  performerRatingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
