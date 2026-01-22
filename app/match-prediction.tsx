import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MATCH_PREDICTION_DATA } from '@/constants/match-prediction-data';
import { StatComparison } from '@/types/match-prediction';
import { SideMenu } from '@/components/lineup/side-menu';

export default function MatchPredictionScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isWebLayout = width > 900;

  const prediction = MATCH_PREDICTION_DATA;

  const formatMatchDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${month} ${day}, ${hour}:${minute}`;
  };

  const formatStatValue = (value: number | string): string => {
    if (typeof value === 'number') {
      if (value >= 10 && value <= 100) {
        return `${Math.round(value)}%`;
      } else if (value < 10) {
        return value.toFixed(2);
      } else {
        return value.toString();
      }
    }
    return value.toString();
  };

  const renderMatchHeader = () => (
    <View style={styles.matchHeader}>
      {/* Home Team */}
      <View style={styles.teamSection}>
        <View style={styles.teamLogoContainer}>
          <Image
            source={{ uri: prediction.homeTeamLogo }}
            style={styles.teamLogo}
            defaultSource={require('@/assets/images/icon.png')}
          />
        </View>
        <Text style={styles.teamName}>{prediction.homeTeam}</Text>
      </View>

      {/* Match Info */}
      <View style={styles.matchInfo}>
        <Text style={styles.vsText}>VS</Text>
        <Text style={styles.matchDateTime}>{formatMatchDate(prediction.matchDate)}</Text>
        <View style={styles.venueBadge}>
          <Ionicons name="location" size={12} color="#9ca3af" />
          <Text style={styles.venueText}>{prediction.venue}</Text>
        </View>
      </View>

      {/* Away Team */}
      <View style={styles.teamSection}>
        <View style={styles.teamLogoContainer}>
          <Image
            source={{ uri: prediction.awayTeamLogo }}
            style={styles.teamLogo}
            defaultSource={require('@/assets/images/icon.png')}
          />
        </View>
        <Text style={styles.teamName}>{prediction.awayTeam}</Text>
      </View>
    </View>
  );

  const renderWebMatchHeader = () => (
    <View style={styles.webMatchHeader}>
      {/* Home Team */}
      <View style={styles.webTeamSection}>
        <View style={styles.webTeamLogoContainer}>
          <Image
            source={{ uri: prediction.homeTeamLogo }}
            style={styles.webTeamLogo}
            defaultSource={require('@/assets/images/icon.png')}
          />
        </View>
        <Text style={styles.webTeamName}>{prediction.homeTeam}</Text>
      </View>

      {/* Match Info */}
      <View style={styles.webMatchInfo}>
        <Text style={styles.webVsText}>VS</Text>
        <Text style={styles.webMatchDateTime}>{formatMatchDate(prediction.matchDate)}</Text>
        <View style={styles.webVenueBadge}>
          <Ionicons name="location" size={16} color="#9ca3af" />
          <Text style={styles.webVenueText}>{prediction.venue}</Text>
        </View>
        <View style={styles.confidenceBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          <Text style={styles.confidenceText}>{prediction.confidenceLevel}</Text>
        </View>
      </View>

      {/* Away Team */}
      <View style={styles.webTeamSection}>
        <View style={styles.webTeamLogoContainer}>
          <Image
            source={{ uri: prediction.awayTeamLogo }}
            style={styles.webTeamLogo}
            defaultSource={require('@/assets/images/icon.png')}
          />
        </View>
        <Text style={styles.webTeamName}>{prediction.awayTeam}</Text>
      </View>
    </View>
  );

  const renderLegendItem = (label: string, color: string) => (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );

  const renderWinProbabilitySection = () => {
    const homeWinPercent = Math.round(prediction.winProbability.homeWin * 100);
    const drawPercent = Math.round(prediction.winProbability.draw * 100);
    const awayWinPercent = Math.round(prediction.winProbability.awayWin * 100);

    return (
      <View style={styles.winProbabilitySection}>
        {/* Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>WIN PROBABILITY</Text>
          <View style={styles.confidenceBadgeSmall}>
            <Ionicons name="checkmark-circle" size={14} color="#10b981" />
            <Text style={styles.confidenceBadgeText}>{prediction.confidenceLevel}</Text>
          </View>
        </View>

        {/* Probability Bar */}
        <View style={styles.probabilityBar}>
          <View style={[styles.probabilitySegment, styles.homeWinSegment, { flex: homeWinPercent }]}>
            <Text style={styles.probabilityPercentText}>{homeWinPercent}%</Text>
          </View>
          <View style={[styles.probabilitySegment, styles.drawSegment, { flex: drawPercent }]}>
            <Text style={styles.probabilityPercentText}>{drawPercent}%</Text>
          </View>
          <View style={[styles.probabilitySegment, styles.awayWinSegment, { flex: awayWinPercent }]}>
            <Text style={[styles.probabilityPercentText, styles.awayWinText]}>{awayWinPercent}%</Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          {renderLegendItem('Home Win', '#0d59f2')}
          {renderLegendItem('Draw', '#64748b')}
          {renderLegendItem('Away Win', '#38bdf8')}
        </View>
      </View>
    );
  };

  const renderStatRow = (stat: StatComparison, isFirst = false, isLast = false) => {
    const homeValue = typeof stat.homeValue === 'number' ? stat.homeValue : parseFloat(stat.homeValue as string);
    const awayValue = typeof stat.awayValue === 'number' ? stat.awayValue : parseFloat(stat.awayValue as string);

    const homeAdvantage = homeValue > awayValue;
    const awayAdvantage = awayValue > homeValue;

    const total = homeValue + awayValue;
    const homeWidth = (homeValue / total) * 100;

    return (
      <View style={[styles.statRow, isLast && styles.statRowLast]}>
        {/* Background indicators */}
        <View style={styles.statRowBackground}>
          {homeAdvantage && (
            <View style={[styles.homeIndicator, { width: `${homeWidth}%` }]} />
          )}
          {awayAdvantage && (
            <View style={[styles.awayIndicator, { width: `${100 - homeWidth}%` }]} />
          )}
        </View>

        {/* Content */}
        <View style={styles.statRowContent}>
          <Text style={[styles.statValue, homeAdvantage && styles.statValueAdvantage]}>
            {formatStatValue(stat.homeValue)}
          </Text>
          <Text style={styles.statMetric}>{stat.metric}</Text>
          <Text style={[styles.statValue, styles.statValueRight, awayAdvantage && styles.statValueAwayAdvantage]}>
            {formatStatValue(stat.awayValue)}
          </Text>
        </View>
      </View>
    );
  };

  const renderPredictedStatsSection = () => (
    <View style={styles.predictedStatsSection}>
      {/* Section Header */}
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>Predicted Key Stats</Text>
        <Text style={styles.modelVersion}>{prediction.modelVersion}</Text>
      </View>

      {/* Stats Table */}
      <View style={styles.statsTable}>
        {/* Header Row */}
        <View style={styles.statsTableHeader}>
          <Text style={styles.statsTableHeaderText}>HOME</Text>
          <Text style={[styles.statsTableHeaderText, styles.statsTableHeaderCenter]}>METRIC</Text>
          <Text style={[styles.statsTableHeaderText, styles.statsTableHeaderRight]}>AWAY</Text>
        </View>

        {/* Stats Rows */}
        {renderStatRow(prediction.predictedStats.expectedGoals, true)}
        {renderStatRow(prediction.predictedStats.possession)}
        {renderStatRow(prediction.predictedStats.shotsOnTarget)}
        {renderStatRow(prediction.predictedStats.passCompletion)}
        {renderStatRow(prediction.predictedStats.ppda, false, true)}
      </View>
    </View>
  );

  const renderTacticalInsight = () => (
    <View style={styles.tacticalInsightSection}>
      <View style={styles.tacticalInsightContent}>
        <Ionicons name="bulb" size={24} color="#0d59f2" />
        <View style={styles.tacticalInsightText}>
          <Text style={styles.tacticalInsightTitle}>{prediction.tacticalInsight.title}</Text>
          <Text style={styles.tacticalInsightDescription}>{prediction.tacticalInsight.description}</Text>
        </View>
      </View>
    </View>
  );

  const renderBottomActions = () => (
    <View style={styles.bottomActions}>
      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Compare Scenarios</Text>
      </TouchableOpacity>
      <View style={styles.buttonSpacer} />
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Export Report</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMobileLayout = () => (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#0d59f2" />
          <Text style={styles.backText}>Edit Lineup</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prediction</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderMatchHeader()}
        {renderWinProbabilitySection()}
        {renderPredictedStatsSection()}
        {renderTacticalInsight()}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Actions */}
      {renderBottomActions()}
    </View>
  );

  const renderWebLayout = () => (
    <View style={styles.webContainer}>
      {/* Left Side Menu */}
      <SideMenu isWeb />

      {/* Main Content */}
      <View style={styles.webMainContent}>
        {/* Header */}
        <View style={styles.webHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.webBackButton}>
            <Ionicons name="chevron-back" size={28} color="#0d59f2" />
            <Text style={styles.webBackText}>Back to Lineup</Text>
          </TouchableOpacity>
          <Text style={styles.webHeaderTitle}>Match Prediction</Text>
          <View style={styles.webHeaderActions}>
            <TouchableOpacity style={styles.webSecondaryButton}>
              <Ionicons name="git-compare" size={18} color="#ffffff" />
              <Text style={styles.webSecondaryButtonText}>Compare Scenarios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.webPrimaryButton}>
              <Ionicons name="download-outline" size={18} color="#ffffff" />
              <Text style={styles.webPrimaryButtonText}>Export Report</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.webContent} showsVerticalScrollIndicator={false}>
          <View style={styles.webContentInner}>
            {renderWebMatchHeader()}

            {/* Main Grid */}
            <View style={styles.webGrid}>
              <View style={styles.webLeftColumn}>
                {renderWinProbabilitySection()}
                {renderTacticalInsight()}
              </View>
              <View style={styles.webRightColumn}>
                {renderPredictedStatsSection()}
              </View>
            </View>

            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>
      </View>
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
  webMainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#0d59f2',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  webHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  webBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  webBackText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0d59f2',
    marginLeft: 8,
  },
  webHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  webHeaderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  webSecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#1e2736',
    gap: 8,
  },
  webSecondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  webPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#0d59f2',
    gap: 8,
  },
  webPrimaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  webContent: {
    flex: 1,
  },
  webContentInner: {
    padding: 32,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  teamLogo: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  matchInfo: {
    flex: 1,
    alignItems: 'center',
  },
  vsText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9ca3af',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  matchDateTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  venueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 4,
  },
  venueText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  webMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 32,
  },
  webTeamSection: {
    flex: 1,
    alignItems: 'center',
  },
  webTeamLogoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#101622',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 16,
  },
  webTeamLogo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  webTeamName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  webMatchInfo: {
    flex: 2,
    alignItems: 'center',
  },
  webVsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 2.0,
    marginBottom: 12,
  },
  webMatchDateTime: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 12,
  },
  webVenueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#101622',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
    marginBottom: 16,
  },
  webVenueText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    gap: 6,
  },
  confidenceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
  },
  winProbabilitySection: {
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 1.2,
  },
  confidenceBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    gap: 4,
  },
  confidenceBadgeText: {
    fontSize: 11,
    color: '#10b981',
  },
  probabilityBar: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  probabilitySegment: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeWinSegment: {
    backgroundColor: '#0d59f2',
  },
  drawSegment: {
    backgroundColor: '#64748b',
  },
  awayWinSegment: {
    backgroundColor: '#38bdf8',
  },
  probabilityPercentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  awayWinText: {
    color: '#000000',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  predictedStatsSection: {
    marginBottom: 24,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modelVersion: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statsTable: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    overflow: 'hidden',
  },
  statsTableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
  },
  statsTableHeaderText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 1.0,
  },
  statsTableHeaderCenter: {
    textAlign: 'center',
  },
  statsTableHeaderRight: {
    textAlign: 'right',
  },
  statRow: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  statRowLast: {
    borderBottomWidth: 0,
  },
  statRowBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    flexDirection: 'row',
  },
  homeIndicator: {
    height: '100%',
    backgroundColor: 'rgba(13, 89, 242, 0.2)',
  },
  awayIndicator: {
    height: '100%',
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    marginLeft: 'auto',
  },
  statRowContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  statValueRight: {
    textAlign: 'right',
  },
  statValueAdvantage: {
    color: '#0d59f2',
  },
  statValueAwayAdvantage: {
    color: '#38bdf8',
  },
  statMetric: {
    width: 120,
    fontSize: 13,
    fontWeight: '500',
    color: '#9ca3af',
    textAlign: 'center',
  },
  tacticalInsightSection: {
    marginBottom: 24,
  },
  tacticalInsightContent: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(13, 89, 242, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(13, 89, 242, 0.2)',
  },
  tacticalInsightText: {
    flex: 1,
    marginLeft: 12,
  },
  tacticalInsightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d59f2',
    marginBottom: 4,
  },
  tacticalInsightDescription: {
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 18,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    backgroundColor: '#101622',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  buttonSpacer: {
    width: 12,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#0d59f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  webGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  webLeftColumn: {
    flex: 2,
  },
  webRightColumn: {
    flex: 3,
  },
  bottomSpacing: {
    height: 40,
  },
});
