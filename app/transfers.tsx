import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useWindowDimensions,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SideMenu } from '@/components/lineup/side-menu';
import { SUGGESTED_TRANSFER_PLAYERS, RECENT_TRANSFERS } from '@/constants/transfer-data';
import { TransferPlayer, RecentTransfer } from '@/types/transfer';
import { PlayerPosition } from '@/types/lineup';

export default function TransfersScreen() {
  const { width } = useWindowDimensions();
  const isWebLayout = width > 900;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [selectedClub, setSelectedClub] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [shortlistedPlayers, setShortlistedPlayers] = useState<TransferPlayer[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isGridView, setIsGridView] = useState(true);
  const [showPositionPicker, setShowPositionPicker] = useState(false);
  const [showClubPicker, setShowClubPicker] = useState(false);
  const [showSortPicker, setShowSortPicker] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<TransferPlayer | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const availableClubs = Array.from(new Set(SUGGESTED_TRANSFER_PLAYERS.map(p => p.club))).sort();

  const filteredPlayers = SUGGESTED_TRANSFER_PLAYERS.filter(player => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!player.name.toLowerCase().includes(query) &&
          !player.club.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Position filter
    if (selectedPosition !== 'All') {
      const positionMatch: Record<string, PlayerPosition> = {
        'Goalkeeper': PlayerPosition.GOALKEEPER,
        'Defender': PlayerPosition.DEFENDER,
        'Midfielder': PlayerPosition.MIDFIELDER,
        'Forward': PlayerPosition.FORWARD,
      };
      if (player.position !== positionMatch[selectedPosition]) {
        return false;
      }
    }

    // Club filter
    return selectedClub === 'All' || player.club === selectedClub;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'age':
        return a.age - b.age;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const toggleShortlist = (player: TransferPlayer) => {
    setShortlistedPlayers(prev => {
      const exists = prev.find(p => p.name === player.name);
      if (exists) {
        return prev.filter(p => p.name !== player.name);
      }
      return [...prev, player];
    });
  };

  const isShortlisted = (player: TransferPlayer) => {
    return shortlistedPlayers.some(p => p.name === player.name);
  };

  const calculateWinProbability = () => {
    if (shortlistedPlayers.length === 0) return 72.5;
    const totalBoost = shortlistedPlayers.reduce((sum, p) => sum + (p.rating - 7.0) * 2, 0);
    return Math.min(98.0, 72.5 + totalBoost);
  };

  const calculateSquadStrength = () => {
    const currentAvg = 7.91; // Base squad strength
    if (shortlistedPlayers.length === 0) return currentAvg;
    const totalRating = shortlistedPlayers.reduce((sum, p) => sum + p.rating, 0);
    const avgNewPlayers = totalRating / shortlistedPlayers.length;
    return (currentAvg * 11 + avgNewPlayers * shortlistedPlayers.length) / (11 + shortlistedPlayers.length);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPosition('All');
    setSelectedClub('All');
    setSortBy('rating');
  };

  const hasActiveFilters = searchQuery || selectedPosition !== 'All' || selectedClub !== 'All' || sortBy !== 'rating';

  if (isWebLayout) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.webContainer}>
          <SideMenu isWeb />
          <View style={styles.webMainContent}>
            {renderHeader()}
            {renderTabBar()}
            <View style={styles.webContent}>
              <View style={styles.webGrid}>
                <View style={styles.webLeftColumn}>
                  {activeTab === 0 && renderTransferMarket()}
                  {activeTab === 1 && renderShortlist()}
                  {activeTab === 2 && renderRecentTransfers()}
                </View>
                <View style={styles.webRightColumn}>
                  {renderStatsPanel()}
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderHeader()}
        {renderTabBar()}
        {activeTab === 0 && renderTransferMarket()}
        {activeTab === 1 && renderShortlist()}
        {activeTab === 2 && renderRecentTransfers()}
      </View>
      {renderModals()}
    </SafeAreaView>
  );

  function renderHeader() {
    return (
      <View style={[styles.header, isWebLayout && styles.headerWeb]}>
        {!isWebLayout && (
          <TouchableOpacity
            style={styles.drawerButton}
            onPress={() => setShowDrawer(true)}
          >
            <Ionicons name="menu" size={24} color="#ffffff" />
          </TouchableOpacity>
        )}
        <View style={styles.headerLeft}>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, isWebLayout && styles.headerTitleWeb]}>
              {isWebLayout ? 'Transfer Market' : 'Transfer Market'}
            </Text>
            {isWebLayout && (
              <Text style={styles.headerSubtitle}>Scout and recruit world-class talent</Text>
            )}
            {!isWebLayout && (
              <View style={styles.playerCount}>
                <Ionicons name="trending-up" size={12} color="#9ca3af" />
                <Text style={styles.playerCountText}>{filteredPlayers.length} players available</Text>
              </View>
            )}
          </View>
        </View>
        {isWebLayout && (
          <View style={styles.headerRight}>
            <View style={styles.viewToggle}>
              <TouchableOpacity
                style={[styles.viewToggleButton, isGridView && styles.viewToggleButtonActive]}
                onPress={() => setIsGridView(true)}
              >
                <Ionicons name="grid" size={20} color={isGridView ? '#0d59f2' : '#9ca3af'} />
              </TouchableOpacity>
              <View style={styles.viewToggleDivider} />
              <TouchableOpacity
                style={[styles.viewToggleButton, !isGridView && styles.viewToggleButtonActive]}
                onPress={() => setIsGridView(false)}
              >
                <Ionicons name="list" size={20} color={!isGridView ? '#0d59f2' : '#9ca3af'} />
              </TouchableOpacity>
            </View>
            <View style={styles.quickStats}>
              <View style={styles.statChip}>
                <Text style={styles.statChipLabel}>Shortlisted</Text>
                <Text style={styles.statChipValue}>{shortlistedPlayers.length}</Text>
              </View>
              <View style={[styles.statChip, styles.statChipGreen]}>
                <Text style={styles.statChipLabel}>Win Probability</Text>
                <Text style={[styles.statChipValue, styles.statChipValueGreen]}>
                  {calculateWinProbability().toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }

  function renderSearchAndFilters() {
    return (
      <View style={styles.filtersContainer}>
        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search players or clubs..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter chips */}
        {!isWebLayout ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
            <TouchableOpacity
              style={[styles.filterChip, selectedPosition !== 'All' && styles.filterChipActive]}
              onPress={() => setShowPositionPicker(true)}
            >
              <Ionicons name="football" size={16} color={selectedPosition !== 'All' ? '#0d59f2' : '#9ca3af'} />
              <Text style={[styles.filterChipText, selectedPosition !== 'All' && styles.filterChipTextActive]}>
                {selectedPosition}
              </Text>
              <Ionicons name="chevron-down" size={16} color={selectedPosition !== 'All' ? '#0d59f2' : '#9ca3af'} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, selectedClub !== 'All' && styles.filterChipActive]}
              onPress={() => setShowClubPicker(true)}
            >
              <Ionicons name="shield" size={16} color={selectedClub !== 'All' ? '#0d59f2' : '#9ca3af'} />
              <Text style={[styles.filterChipText, selectedClub !== 'All' && styles.filterChipTextActive]}>
                {selectedClub === 'All' ? 'All Clubs' : selectedClub}
              </Text>
              <Ionicons name="chevron-down" size={16} color={selectedClub !== 'All' ? '#0d59f2' : '#9ca3af'} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, sortBy !== 'rating' && styles.filterChipActive]}
              onPress={() => setShowSortPicker(true)}
            >
              <Ionicons name="swap-vertical" size={16} color={sortBy !== 'rating' ? '#0d59f2' : '#9ca3af'} />
              <Text style={[styles.filterChipText, sortBy !== 'rating' && styles.filterChipTextActive]}>
                Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </Text>
              <Ionicons name="chevron-down" size={16} color={sortBy !== 'rating' ? '#0d59f2' : '#9ca3af'} />
            </TouchableOpacity>

            {hasActiveFilters && (
              <TouchableOpacity style={styles.clearFilterChip} onPress={clearFilters}>
                <Ionicons name="close-circle" size={16} color="#ef4444" />
                <Text style={styles.clearFilterText}>Clear</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        ) : (
          <View style={styles.filterRow}>
            {renderDropdown('All', ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'], selectedPosition, setSelectedPosition, 'football')}
            {renderDropdown('All', ['All', ...availableClubs], selectedClub, setSelectedClub, 'shield')}
            {renderDropdown('rating', ['rating', 'age', 'name'], sortBy, setSortBy, 'swap-vertical', 'Sort')}
          </View>
        )}
      </View>
    );
  }

  function renderDropdown(defaultValue: string, items: string[], value: string, onChange: (value: string) => void, icon: string, label?: string) {
    return (
      <View style={styles.dropdown}>
        <Ionicons name={icon as any} size={18} color="#9ca3af" />
        <Text style={styles.dropdownText}>{label || value}</Text>
        <Ionicons name="chevron-down" size={18} color="#9ca3af" />
      </View>
    );
  }

  function renderTabBar() {
    const tabs = [
      { label: 'Market', count: filteredPlayers.length, icon: 'globe' },
      { label: 'Shortlist', count: shortlistedPlayers.length, icon: 'star' },
      { label: 'Recent', count: RECENT_TRANSFERS.length, icon: 'time' },
    ];

    return (
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === index && styles.tabActive]}
            onPress={() => setActiveTab(index)}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={activeTab === index ? '#ffffff' : '#9ca3af'}
            />
            <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
              {isWebLayout ? tab.label === 'Market' ? 'Transfer Market' : tab.label === 'Recent' ? 'Recent Transfers' : tab.label : tab.label}
            </Text>
            <View style={[styles.tabBadge, activeTab === index && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, activeTab === index && styles.tabBadgeTextActive]}>
                {tab.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  function renderTransferMarket() {
    return (
      <View style={styles.tabContent}>
        {renderSearchAndFilters()}
        {filteredPlayers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#374151" />
            <Text style={styles.emptyStateTitle}>No players found</Text>
            <Text style={styles.emptyStateText}>Try adjusting your filters</Text>
          </View>
        ) : isWebLayout && isGridView ? (
          <ScrollView style={styles.gridScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.playerGrid}>
              {filteredPlayers.map((player, index) => renderPlayerGridCard(player, index))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
            {filteredPlayers.map((player, index) => renderPlayerListCard(player, index))}
          </ScrollView>
        )}
      </View>
    );
  }

  function renderShortlist() {
    return (
      <View style={styles.tabContent}>
        {!isWebLayout && shortlistedPlayers.length > 0 && (
          <View style={styles.mobileStatsCard}>
            <View style={styles.mobileStatItem}>
              <Ionicons name="trending-up" size={20} color="#ffffff" />
              <Text style={styles.mobileStatValue}>{calculateWinProbability().toFixed(1)}%</Text>
              <Text style={styles.mobileStatLabel}>Win Probability</Text>
            </View>
            <View style={styles.mobileStatDivider} />
            <View style={styles.mobileStatItem}>
              <Ionicons name="shield" size={20} color="#ffffff" />
              <Text style={styles.mobileStatValue}>{calculateSquadStrength().toFixed(1)}</Text>
              <Text style={styles.mobileStatLabel}>Squad Strength</Text>
            </View>
          </View>
        )}
        {shortlistedPlayers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="star-outline" size={64} color="#374151" />
            <Text style={styles.emptyStateTitle}>No players in shortlist</Text>
            <Text style={styles.emptyStateText}>Add players from the transfer market</Text>
          </View>
        ) : (
          <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
            {shortlistedPlayers.map((player, index) => renderPlayerListCard(player, index))}
          </ScrollView>
        )}
      </View>
    );
  }

  function renderRecentTransfers() {
    return (
      <View style={styles.tabContent}>
        <View style={styles.recentHeader}>
          <View style={styles.recentHeaderIcon}>
            <Ionicons name="time" size={20} color="#8b5cf6" />
          </View>
          <View style={styles.recentHeaderText}>
            <Text style={styles.recentHeaderTitle}>Last Premier League Transfers</Text>
            <Text style={styles.recentHeaderSubtitle}>Recent high-profile moves</Text>
          </View>
        </View>
        <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
          {RECENT_TRANSFERS.map((transfer, index) => renderTransferCard(transfer, index))}
        </ScrollView>
      </View>
    );
  }

  // Render functions continue...
  function renderPlayerGridCard(player: TransferPlayer, index: number) {
    const positionColor = getPositionColor(player.position);
    const shortlisted = isShortlisted(player);

    return (
      <TouchableOpacity
        key={index}
        style={[styles.playerGridCard, shortlisted && styles.playerCardShortlisted]}
        onPress={() => setSelectedPlayer(player)}
      >
        <View style={styles.gridCardHeader}>
          <View style={styles.gridCardAvatarContainer}>
            <View style={[styles.gridCardAvatar, { borderColor: positionColor }]}>
              <Image source={player.imageUrl} style={styles.gridCardAvatarImage} />
            </View>
            <View style={[styles.gridCardRatingBadge, { backgroundColor: getRatingColor(player.rating) }]}>
              <Text style={styles.gridCardRatingText}>{player.rating.toFixed(1)}</Text>
            </View>
            <Pressable
              style={styles.gridCardStar}
              onPress={() => {
                toggleShortlist(player);
              }}
            >
              <Ionicons
                name={shortlisted ? 'star' : 'star-outline'}
                size={24}
                color={shortlisted ? '#fbbf24' : '#6b7280'}
              />
            </Pressable>
          </View>
          <Text style={styles.gridCardName}>{player.name}</Text>
          <Text style={styles.gridCardClub}>{player.club}</Text>
        </View>
        <View style={styles.gridCardFooter}>
          <View style={styles.gridCardStats}>
            <View style={styles.gridCardStat}>
              <Ionicons name="football" size={18} color={positionColor} />
              <Text style={[styles.gridCardStatText, { color: positionColor }]}>
                {player.displayPosition}
              </Text>
            </View>
            <View style={styles.gridCardStatDivider} />
            <View style={styles.gridCardStat}>
              <Ionicons name="calendar" size={18} color="#6b7280" />
              <Text style={styles.gridCardStatText}>{player.age} yrs</Text>
            </View>
          </View>
          {player.rating >= 9.0 && (
            <View style={styles.eliteBadge}>
              <Ionicons name="trophy" size={14} color="#ffffff" />
              <Text style={styles.eliteBadgeText}>ELITE</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  function renderPlayerListCard(player: TransferPlayer, index: number) {
    const positionColor = getPositionColor(player.position);
    const shortlisted = isShortlisted(player);

    return (
      <TouchableOpacity
        key={index}
        style={[styles.playerListCard, shortlisted && styles.playerCardShortlisted]}
        onPress={() => setSelectedPlayer(player)}
      >
        <View style={styles.playerAvatar}>
          <View style={[styles.avatarCircle, { borderColor: positionColor }]}>
            <Image source={player.imageUrl} style={styles.avatarImage} />
          </View>
          <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(player.rating) }]}>
            <Text style={styles.ratingText}>{player.rating.toFixed(1)}</Text>
          </View>
        </View>
        <View style={styles.playerInfo}>
          <View style={styles.playerInfoHeader}>
            <Text style={styles.playerName}>{player.name}</Text>
            {player.rating >= 9.0 && (
              <View style={styles.eliteBadgeSmall}>
                <Ionicons name="trophy" size={12} color="#ffffff" />
                <Text style={styles.eliteBadgeTextSmall}>ELITE</Text>
              </View>
            )}
          </View>
          <View style={styles.playerInfoChips}>
            <View style={[styles.infoChip, { backgroundColor: `${positionColor}33`, borderColor: `${positionColor}66` }]}>
              <Ionicons name="shield" size={12} color="#9ca3af" />
              <Text style={styles.infoChipText}>{player.club}</Text>
            </View>
            <View style={[styles.infoChip, { backgroundColor: `${positionColor}33`, borderColor: positionColor }]}>
              <Ionicons name="football" size={12} color={positionColor} />
              <Text style={[styles.infoChipText, { color: positionColor }]}>{player.displayPosition}</Text>
            </View>
            <View style={styles.infoChip}>
              <Ionicons name="calendar" size={12} color="#9ca3af" />
              <Text style={styles.infoChipText}>{player.age} yrs</Text>
            </View>
          </View>
        </View>
        <Pressable
          style={styles.shortlistButton}
          onPress={() => {
            toggleShortlist(player);
          }}
        >
          <Ionicons
            name={shortlisted ? 'star' : 'star-outline'}
            size={24}
            color={shortlisted ? '#fbbf24' : '#6b7280'}
          />
        </Pressable>
      </TouchableOpacity>
    );
  }

  function renderTransferCard(transfer: RecentTransfer, index: number) {
    const positionColor = getPositionColorForString(transfer.position);

    return (
      <View key={index} style={styles.transferCard}>
        <View style={styles.transferHeader}>
          <View style={[styles.positionBadge, { backgroundColor: `${positionColor}33`, borderColor: positionColor }]}>
            <Text style={[styles.positionBadgeText, { color: positionColor }]}>{transfer.position}</Text>
          </View>
          <Text style={styles.transferPlayerName}>{transfer.playerName}</Text>
          <View style={styles.feeBadge}>
            <Text style={styles.feeBadgeText}>{transfer.fee}</Text>
          </View>
        </View>
        <View style={styles.transferRoute}>
          <View style={styles.transferClubBox}>
            <Text style={styles.transferClubLabel}>FROM</Text>
            <Text style={styles.transferClubName}>{transfer.fromClub}</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#6b7280" />
          <View style={[styles.transferClubBox, styles.transferClubBoxTo]}>
            <Text style={styles.transferClubLabel}>TO</Text>
            <Text style={[styles.transferClubName, styles.transferClubNameTo]}>{transfer.toClub}</Text>
          </View>
        </View>
        <View style={styles.transferDate}>
          <Ionicons name="calendar-outline" size={12} color="#6b7280" />
          <Text style={styles.transferDateText}>{transfer.date}</Text>
        </View>
      </View>
    );
  }

  function renderStatsPanel() {
    return (
      <View style={styles.statsPanel}>
        <Text style={styles.statsPanelTitle}>IMPACT ANALYSIS</Text>

        <View style={styles.statCard}>
          <View style={[styles.statCardIcon, { backgroundColor: '#22c55e33' }]}>
            <Ionicons name="trophy" size={20} color="#22c55e" />
          </View>
          <Text style={styles.statCardLabel}>League Win Probability</Text>
          <Text style={[styles.statCardValue, { color: '#22c55e' }]}>
            {calculateWinProbability().toFixed(1)}%
          </Text>
          {shortlistedPlayers.length > 0 && (
            <View style={styles.statCardChange}>
              <Ionicons name="arrow-up" size={12} color="#22c55e" />
              <Text style={[styles.statCardChangeText, { color: '#22c55e' }]}>
                +{(calculateWinProbability() - 72.5).toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statCardIcon, { backgroundColor: '#0d59f233' }]}>
            <Ionicons name="shield" size={20} color="#0d59f2" />
          </View>
          <Text style={styles.statCardLabel}>Squad Strength</Text>
          <Text style={[styles.statCardValue, { color: '#0d59f2' }]}>
            {calculateSquadStrength().toFixed(2)}
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statCardIcon, { backgroundColor: '#8b5cf633' }]}>
            <Ionicons name="globe" size={20} color="#8b5cf6" />
          </View>
          <Text style={styles.statCardLabel}>Champions League Chance</Text>
          <Text style={[styles.statCardValue, { color: '#8b5cf6' }]}>
            {Math.min(95, calculateWinProbability() + 5).toFixed(1)}%
          </Text>
        </View>

        <View style={styles.statsDivider} />

        <Text style={styles.statsPanelTitle}>SHORTLISTED PLAYERS</Text>
        {shortlistedPlayers.length === 0 ? (
          <Text style={styles.emptyShortlistText}>No players shortlisted yet</Text>
        ) : (
          shortlistedPlayers.map((player, index) => (
            <View key={index} style={styles.shortlistedPlayerCard}>
              <View style={[styles.shortlistedAvatar, { borderColor: getPositionColor(player.position) }]}>
                <Image source={player.imageUrl} style={styles.shortlistedAvatarImage} />
              </View>
              <View style={styles.shortlistedInfo}>
                <Text style={styles.shortlistedName}>{player.name}</Text>
                <Text style={styles.shortlistedPosition}>{player.displayPosition}</Text>
              </View>
              <View style={[styles.shortlistedRating, { backgroundColor: getRatingColor(player.rating) }]}>
                <Text style={styles.shortlistedRatingText}>{player.rating.toFixed(1)}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleShortlist(player)}>
                <Ionicons name="close" size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={styles.statsDivider} />

        <Text style={styles.statsPanelTitle}>POSITION NEEDS</Text>
        {renderPositionNeed('Striker', 'High Priority', '#ef4444')}
        {renderPositionNeed('Midfielder', 'Medium Priority', '#f59e0b')}
        {renderPositionNeed('Defender', 'Low Priority', '#22c55e')}
      </View>
    );
  }

  function renderPositionNeed(position: string, priority: string, color: string) {
    return (
      <View style={styles.positionNeed}>
        <View style={[styles.positionNeedBar, { backgroundColor: color }]} />
        <View style={styles.positionNeedInfo}>
          <Text style={styles.positionNeedTitle}>{position}</Text>
          <Text style={[styles.positionNeedPriority, { color }]}>{priority}</Text>
        </View>
      </View>
    );
  }

  function renderModals() {
    return (
      <>
        {/* Drawer Modal */}
        <Modal visible={showDrawer} transparent animationType="none">
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

        {/* Position Picker Modal */}
        <Modal visible={showPositionPicker} transparent animationType="slide">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowPositionPicker(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Select Position</Text>
              <View style={styles.modalDivider} />
              {['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map((position) => (
                <TouchableOpacity
                  key={position}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedPosition(position);
                    setShowPositionPicker(false);
                  }}
                >
                  <Ionicons
                    name={getPositionIcon(position)}
                    size={20}
                    color={selectedPosition === position ? '#0d59f2' : '#9ca3af'}
                  />
                  <Text style={[styles.modalOptionText, selectedPosition === position && styles.modalOptionTextActive]}>
                    {position}
                  </Text>
                  {selectedPosition === position && (
                    <Ionicons name="checkmark-circle" size={20} color="#0d59f2" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Club Picker Modal */}
        <Modal visible={showClubPicker} transparent animationType="slide">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowClubPicker(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Select Club</Text>
              <View style={styles.modalDivider} />
              <ScrollView style={styles.modalScroll}>
                {['All', ...availableClubs].map((club) => (
                  <TouchableOpacity
                    key={club}
                    style={styles.modalOption}
                    onPress={() => {
                      setSelectedClub(club);
                      setShowClubPicker(false);
                    }}
                  >
                    <Ionicons
                      name="shield"
                      size={20}
                      color={selectedClub === club ? '#0d59f2' : '#9ca3af'}
                    />
                    <Text style={[styles.modalOptionText, selectedClub === club && styles.modalOptionTextActive]}>
                      {club}
                    </Text>
                    {selectedClub === club && (
                      <Ionicons name="checkmark-circle" size={20} color="#0d59f2" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Sort Picker Modal */}
        <Modal visible={showSortPicker} transparent animationType="slide">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowSortPicker(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Sort By</Text>
              <View style={styles.modalDivider} />
              {[
                { value: 'rating', label: 'Rating', icon: 'star' },
                { value: 'age', label: 'Age', icon: 'calendar' },
                { value: 'name', label: 'Name', icon: 'text' },
              ].map((sort) => (
                <TouchableOpacity
                  key={sort.value}
                  style={styles.modalOption}
                  onPress={() => {
                    setSortBy(sort.value);
                    setShowSortPicker(false);
                  }}
                >
                  <Ionicons
                    name={sort.icon as any}
                    size={20}
                    color={sortBy === sort.value ? '#0d59f2' : '#9ca3af'}
                  />
                  <Text style={[styles.modalOptionText, sortBy === sort.value && styles.modalOptionTextActive]}>
                    {sort.label}
                  </Text>
                  {sortBy === sort.value && (
                    <Ionicons name="checkmark-circle" size={20} color="#0d59f2" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Player Details Modal */}
        <Modal visible={selectedPlayer !== null} transparent animationType="fade">
          <View style={styles.playerDetailOverlay}>
            <View style={styles.playerDetailModal}>
              {selectedPlayer && (
                <>
                  <TouchableOpacity
                    style={styles.playerDetailClose}
                    onPress={() => setSelectedPlayer(null)}
                  >
                    <Ionicons name="close" size={24} color="#9ca3af" />
                  </TouchableOpacity>
                  <View style={styles.playerDetailHeader}>
                    <View style={[styles.playerDetailAvatar, { borderColor: getPositionColor(selectedPlayer.position) }]}>
                      <Image source={selectedPlayer.imageUrl} style={styles.playerDetailAvatarImage} />
                    </View>
                    <Text style={styles.playerDetailName}>{selectedPlayer.name}</Text>
                    <Text style={styles.playerDetailClub}>{selectedPlayer.club}</Text>
                  </View>
                  <View style={styles.playerDetailStats}>
                    <View style={styles.playerDetailStat}>
                      <Text style={styles.playerDetailStatValue}>{selectedPlayer.rating.toFixed(1)}</Text>
                      <Text style={styles.playerDetailStatLabel}>Rating</Text>
                    </View>
                    <View style={styles.playerDetailStat}>
                      <Text style={styles.playerDetailStatValue}>{selectedPlayer.age}</Text>
                      <Text style={styles.playerDetailStatLabel}>Age</Text>
                    </View>
                    <View style={styles.playerDetailStat}>
                      <Text style={styles.playerDetailStatValue}>{selectedPlayer.displayPosition}</Text>
                      <Text style={styles.playerDetailStatLabel}>Position</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.playerDetailButton, isShortlisted(selectedPlayer) && styles.playerDetailButtonActive]}
                    onPress={() => {
                      toggleShortlist(selectedPlayer);
                      setSelectedPlayer(null);
                    }}
                  >
                    <Ionicons
                      name={isShortlisted(selectedPlayer) ? 'star' : 'star-outline'}
                      size={20}
                      color="#ffffff"
                    />
                    <Text style={styles.playerDetailButtonText}>
                      {isShortlisted(selectedPlayer) ? 'Remove from Shortlist' : 'Add to Shortlist'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </>
    );
  }

  function getPositionColor(position: PlayerPosition): string {
    switch (position) {
      case PlayerPosition.GOALKEEPER:
        return '#eab308';
      case PlayerPosition.DEFENDER:
        return '#3b82f6';
      case PlayerPosition.MIDFIELDER:
        return '#22c55e';
      case PlayerPosition.FORWARD:
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  function getPositionColorForString(position: string): string {
    if (position === 'GK') return '#eab308';
    if (position.includes('B') || position.includes('D')) return '#3b82f6';
    if (position.includes('M') || position.includes('AM') || position.includes('DM')) return '#22c55e';
    return '#ef4444';
  }

  function getRatingColor(rating: number): string {
    if (rating >= 9.0) return '#fbbf24';
    if (rating >= 8.0) return '#22c55e';
    if (rating >= 7.0) return '#0d59f2';
    return '#6b7280';
  }

  function getPositionIcon(position: string): any {
    switch (position) {
      case 'Goalkeeper':
        return 'hand-left';
      case 'Defender':
        return 'shield';
      case 'Midfielder':
        return 'flash';
      case 'Forward':
        return 'football';
      default:
        return 'ellipse';
    }
  }
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
  webContent: {
    flex: 1,
  },
  webGrid: {
    flex: 1,
    flexDirection: 'row',
  },
  webLeftColumn: {
    flex: 3,
  },
  webRightColumn: {
    width: 400,
    borderLeftWidth: 1,
    borderLeftColor: '#374151',
    backgroundColor: '#0d1117',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    backgroundColor: '#101622',
  },
  headerWeb: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  drawerButton: {
    marginRight: 12,
    padding: 4,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#0d59f233',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerTitleWeb: {
    fontSize: 24,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  playerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playerCountText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#1e2736',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    overflow: 'hidden',
  },
  viewToggleButton: {
    padding: 8,
  },
  viewToggleButtonActive: {
    backgroundColor: '#0d59f233',
  },
  viewToggleDivider: {
    width: 1,
    backgroundColor: '#374151',
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0d59f233',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0d59f266',
  },
  statChipGreen: {
    backgroundColor: '#22c55e33',
    borderColor: '#22c55e66',
  },
  statChipLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
    marginBottom: 2,
  },
  statChipValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d59f2',
  },
  statChipValueGreen: {
    color: '#22c55e',
  },
  filtersContainer: {
    padding: 16,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e2736',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
  },
  filterChips: {
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1e2736',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#374151',
    marginRight: 8,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#0d59f233',
    borderColor: '#0d59f2',
  },
  filterChipText: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#0d59f2',
    fontWeight: '600',
  },
  clearFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ef444433',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ef4444',
    gap: 6,
  },
  clearFilterText: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1e2736',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
    gap: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: '#ffffff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0d1117',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#0d59f2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#374151',
    borderRadius: 10,
  },
  tabBadgeActive: {
    backgroundColor: '#0d59f2',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tabBadgeTextActive: {
    color: '#ffffff',
  },
  tabContent: {
    flex: 1,
  },
  gridScroll: {
    flex: 1,
    padding: 32,
  },
  listScroll: {
    flex: 1,
    padding: 16,
  },
  playerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  playerGridCard: {
    width: '31%',
    backgroundColor: '#1e2736',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
    overflow: 'hidden',
  },
  playerCardShortlisted: {
    borderColor: '#0d59f2',
    borderWidth: 2,
  },
  gridCardHeader: {
    padding: 16,
    alignItems: 'center',
  },
  gridCardAvatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  gridCardAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    overflow: 'hidden',
  },
  gridCardAvatarImage: {
    width: '100%',
    height: '100%',
  },
  gridCardRatingBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1e2736',
  },
  gridCardRatingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  gridCardStar: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  gridCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  gridCardClub: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  gridCardFooter: {
    padding: 16,
    backgroundColor: '#101622',
    gap: 12,
  },
  gridCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridCardStat: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  gridCardStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#374151',
  },
  gridCardStatText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  eliteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'linear-gradient(to right, #fbbf24, #f59e0b)',
    borderRadius: 6,
    gap: 6,
  },
  eliteBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  eliteBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'linear-gradient(to right, #fbbf24, #f59e0b)',
    borderRadius: 4,
    gap: 4,
  },
  eliteBadgeTextSmall: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  playerListCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1e2736',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 12,
    gap: 12,
  },
  playerAvatar: {
    position: 'relative',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1e2736',
  },
  ratingText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  playerInfo: {
    flex: 1,
    gap: 6,
  },
  playerInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  playerInfoChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#374151',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4b5563',
    gap: 4,
  },
  infoChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
  },
  shortlistButton: {
    padding: 8,
  },
  mobileStatsCard: {
    margin: 16,
    padding: 16,
    backgroundColor: 'linear-gradient(135deg, #0d59f2, #0a47c4)',
    borderRadius: 12,
    flexDirection: 'row',
  },
  mobileStatItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  mobileStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  mobileStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  mobileStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e2736',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    gap: 12,
  },
  recentHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#8b5cf633',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentHeaderText: {
    flex: 1,
  },
  recentHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  recentHeaderSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  transferCard: {
    padding: 12,
    backgroundColor: '#1e2736',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 12,
    gap: 12,
  },
  transferHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  positionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  positionBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  transferPlayerName: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  feeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#22c55e33',
    borderRadius: 6,
  },
  feeBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  transferRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transferClubBox: {
    flex: 1,
    padding: 8,
    backgroundColor: '#101622',
    borderRadius: 8,
  },
  transferClubBoxTo: {
    backgroundColor: '#0d59f233',
    borderWidth: 1,
    borderColor: '#0d59f266',
  },
  transferClubLabel: {
    fontSize: 9,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 4,
  },
  transferClubName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  transferClubNameTo: {
    color: '#0d59f2',
  },
  transferDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  transferDateText: {
    fontSize: 11,
    color: '#6b7280',
  },
  statsPanel: {
    padding: 24,
    gap: 16,
  },
  statsPanelTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
    letterSpacing: 1.2,
  },
  statCard: {
    padding: 16,
    backgroundColor: '#1e2736',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    gap: 12,
  },
  statCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
  },
  statCardValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statCardChange: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#22c55e33',
    borderRadius: 6,
    gap: 4,
    alignSelf: 'flex-start',
  },
  statCardChangeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  statsDivider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 8,
  },
  emptyShortlistText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
  shortlistedPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1e2736',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 12,
    gap: 12,
  },
  shortlistedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
  },
  shortlistedAvatarImage: {
    width: '100%',
    height: '100%',
  },
  shortlistedInfo: {
    flex: 1,
  },
  shortlistedName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  shortlistedPosition: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  shortlistedRating: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  shortlistedRatingText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  positionNeed: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1e2736',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 12,
    gap: 12,
  },
  positionNeedBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  positionNeedInfo: {
    flex: 1,
  },
  positionNeedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  positionNeedPriority: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e2736',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#4b5563',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 8,
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  modalOptionText: {
    flex: 1,
    fontSize: 15,
    color: '#ffffff',
  },
  modalOptionTextActive: {
    color: '#0d59f2',
    fontWeight: '600',
  },
  playerDetailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  playerDetailModal: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#1e2736',
    borderRadius: 16,
    padding: 24,
  },
  playerDetailClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  playerDetailHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  playerDetailAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  playerDetailAvatarImage: {
    width: '100%',
    height: '100%',
  },
  playerDetailName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  playerDetailClub: {
    fontSize: 14,
    color: '#9ca3af',
  },
  playerDetailStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  playerDetailStat: {
    flex: 1,
    padding: 12,
    backgroundColor: '#0d59f233',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0d59f266',
    alignItems: 'center',
  },
  playerDetailStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d59f2',
    marginBottom: 4,
  },
  playerDetailStatLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  playerDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#0d59f2',
    borderRadius: 8,
    gap: 8,
  },
  playerDetailButtonActive: {
    backgroundColor: '#374151',
  },
  playerDetailButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerContent: {
    width: 280,
    backgroundColor: '#0d1117',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});


