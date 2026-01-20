import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  useWindowDimensions,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SideMenu } from '@/components/lineup/side-menu';
import { SQUAD_PLAYERS, SUGGESTED_PLAYERS } from '@/constants/squad-data';
import { SquadPlayer, PlayerPosition } from '@/types/lineup';

type FilterType = 'All Players' | 'Sort by Rating' | 'Sort by Age' | 'Transfer Listed';

export default function SquadManagementScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All Players');
  const [showDrawer, setShowDrawer] = useState(false);
  const [squadPlayers, setSquadPlayers] = useState<SquadPlayer[]>(SQUAD_PLAYERS);
  const [suggestedPlayers, setSuggestedPlayers] = useState<SquadPlayer[]>(SUGGESTED_PLAYERS);
  const [transferListedPlayers, setTransferListedPlayers] = useState<Set<string>>(new Set());
  const [draggedPlayer, setDraggedPlayer] = useState<SquadPlayer | null>(null);
  const [dropTargetPosition, setDropTargetPosition] = useState<PlayerPosition | 'suggested' | null>(null);
  const { width } = useWindowDimensions();

  // Refs for scroll containers
  const scrollViewRef = useRef<ScrollView>(null);
  const webScrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isWebLayout = width > 900;

  const filters: FilterType[] = ['All Players', 'Sort by Rating', 'Sort by Age', 'Transfer Listed'];

  const playersByPosition = useMemo(() => {
    const grouped: Record<PlayerPosition, SquadPlayer[]> = {
      [PlayerPosition.GOALKEEPER]: [],
      [PlayerPosition.DEFENDER]: [],
      [PlayerPosition.MIDFIELDER]: [],
      [PlayerPosition.FORWARD]: [],
    };
    squadPlayers.forEach((player) => {
      grouped[player.position].push(player);
    });
    return grouped;
  }, [squadPlayers]);

  const sortPlayers = (players: SquadPlayer[]): SquadPlayer[] => {
    let sortedPlayers = [...players];
    switch (selectedFilter) {
      case 'Sort by Rating':
        sortedPlayers.sort((a, b) => b.rating - a.rating);
        break;
      case 'Sort by Age':
        sortedPlayers.sort((a, b) => a.age - b.age);
        break;
      case 'Transfer Listed':
        sortedPlayers = sortedPlayers.filter((p) => transferListedPlayers.has(p.name));
        break;
      default:
        break;
    }
    return sortedPlayers;
  };

  const toggleTransferListed = useCallback((player: SquadPlayer) => {
    setTransferListedPlayers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(player.name)) {
        newSet.delete(player.name);
      } else {
        newSet.add(player.name);
      }
      return newSet;
    });
  }, []);

  // Move player from suggested to squad
  const movePlayerToSquad = useCallback((player: SquadPlayer, targetPosition: PlayerPosition) => {
    setSuggestedPlayers((prev) => prev.filter((p) => p.name !== player.name));
    const updatedPlayer: SquadPlayer = {
      ...player,
      position: targetPosition,
      isSuggested: false,
    };
    setSquadPlayers((prev) => [...prev, updatedPlayer]);
  }, []);

  // Move player from squad to suggested
  const movePlayerToSuggested = useCallback((player: SquadPlayer) => {
    setSquadPlayers((prev) => prev.filter((p) => p.name !== player.name));
    const updatedPlayer: SquadPlayer = {
      ...player,
      isSuggested: true,
    };
    setSuggestedPlayers((prev) => [...prev, updatedPlayer]);
  }, []);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, player: SquadPlayer) => {
    setDraggedPlayer(player);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', player.name);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedPlayer(null);
    setDropTargetPosition(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, position: PlayerPosition | 'suggested') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetPosition(position);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDropTargetPosition(null);
  }, []);

  // Auto-scroll functions for web
  const startAutoScroll = useCallback((direction: 'up' | 'down') => {
    if (autoScrollIntervalRef.current) return;

    const scrollSpeed = 10;
    autoScrollIntervalRef.current = setInterval(() => {
      if (webScrollContainerRef.current) {
        const scrollAmount = direction === 'up' ? -scrollSpeed : scrollSpeed;
        webScrollContainerRef.current.scrollTop += scrollAmount;
      }
    }, 16);
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  // Cleanup auto-scroll on unmount or drag end
  useEffect(() => {
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, []);

  // Stop auto-scroll when drag ends
  useEffect(() => {
    if (!draggedPlayer) {
      stopAutoScroll();
    }
  }, [draggedPlayer, stopAutoScroll]);

  const handleDrop = useCallback((e: React.DragEvent, targetPosition: PlayerPosition | 'suggested') => {
    e.preventDefault();
    if (!draggedPlayer) return;

    if (targetPosition === 'suggested') {
      if (!draggedPlayer.isSuggested) {
        movePlayerToSuggested(draggedPlayer);
      }
    } else {
      if (draggedPlayer.isSuggested) {
        movePlayerToSquad(draggedPlayer, targetPosition);
      }
    }

    setDraggedPlayer(null);
    setDropTargetPosition(null);
  }, [draggedPlayer, movePlayerToSquad, movePlayerToSuggested]);

  const getPositionColor = useCallback((position: PlayerPosition): string => {
    switch (position) {
      case PlayerPosition.GOALKEEPER:
        return '#eab308';
      case PlayerPosition.DEFENDER:
        return '#3b82f6';
      case PlayerPosition.MIDFIELDER:
        return '#22c55e';
      case PlayerPosition.FORWARD:
        return '#ef4444';
    }
  }, []);

  const getPositionName = (position: PlayerPosition): string => {
    switch (position) {
      case PlayerPosition.GOALKEEPER:
        return 'Goalkeepers';
      case PlayerPosition.DEFENDER:
        return 'Defenders';
      case PlayerPosition.MIDFIELDER:
        return 'Midfielders';
      case PlayerPosition.FORWARD:
        return 'Forwards';
    }
  };

  const squadStats = useMemo(() => {
    const totalPlayers = squadPlayers.length;
    const avgRating =
      totalPlayers > 0
        ? squadPlayers.reduce((sum, p) => sum + p.rating, 0) / totalPlayers
        : 0;
    const avgAge =
      totalPlayers > 0
        ? squadPlayers.reduce((sum, p) => sum + p.age, 0) / totalPlayers
        : 0;
    return { totalPlayers, avgRating, avgAge, transferListedCount: transferListedPlayers.size };
  }, [squadPlayers, transferListedPlayers]);

  const renderPlayerItem = (player: SquadPlayer) => {
    const positionColor = getPositionColor(player.position);
    const isTransferListed = transferListedPlayers.has(player.name);
    const isBeingDragged = draggedPlayer?.name === player.name;

    const playerContent = (
      <View
        style={[
          styles.playerItem,
          isBeingDragged && styles.playerItemDragging,
        ]}
      >
        <View style={styles.avatarContainer}>
          <Image source={player.imageUrl} style={styles.playerAvatar} />
          <View style={[styles.shirtNumberBadge, { backgroundColor: positionColor }]}>
            <Text style={styles.shirtNumberText}>{player.shirtNumber}</Text>
          </View>
        </View>

        <View style={styles.playerInfo}>
          <View style={styles.playerNameRow}>
            <Text style={styles.playerName}>{player.name}</Text>
            {isTransferListed && (
              <View style={styles.listedBadge}>
                <Text style={styles.listedBadgeText}>LISTED</Text>
              </View>
            )}
            {player.isSuggested && (
              <View style={styles.suggestedBadge}>
                <Text style={styles.suggestedBadgeText}>{player.club}</Text>
              </View>
            )}
          </View>
          <View style={styles.playerDetailsRow}>
            <View style={[styles.positionBadge, { backgroundColor: `${positionColor}33` }]}>
              <Text style={[styles.positionBadgeText, { color: positionColor }]}>
                {player.displayPosition}
              </Text>
            </View>
            <Text style={styles.playerAge}>{player.age} yrs</Text>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Text
            style={[
              styles.ratingValue,
              player.rating >= 8.5 && styles.ratingValueHigh,
            ]}
          >
            {player.rating.toFixed(1)}
          </Text>
          <Text style={styles.ratingLabel}>RATING</Text>
        </View>

        {!player.isSuggested && (
          <TouchableOpacity
            style={[
              styles.transferListButton,
              isTransferListed && styles.transferListButtonActive,
            ]}
            onPress={() => toggleTransferListed(player)}
          >
            <Ionicons
              name={isTransferListed ? 'pricetag' : 'pricetag-outline'}
              size={14}
              color={isTransferListed ? '#ef4444' : '#6B7280'}
            />
          </TouchableOpacity>
        )}

        <Ionicons name="menu" size={20} color="#6B7280" style={styles.dragHandle} />
      </View>
    );

    if (Platform.OS === 'web') {
      return (
        <div
          key={player.name}
          draggable
          onDragStart={(e) => handleDragStart(e, player)}
          onDragEnd={handleDragEnd}
          style={{ cursor: 'grab' }}
        >
          {playerContent}
        </div>
      );
    }

    // Mobile: Use long press to select, then tap on target section
    return (
      <TouchableOpacity
        key={player.name}
        onLongPress={() => setDraggedPlayer(player)}
        onPress={() => {
          if (draggedPlayer && draggedPlayer.name === player.name) {
            setDraggedPlayer(null);
          }
        }}
        delayLongPress={300}
      >
        {playerContent}
      </TouchableOpacity>
    );
  };

  const renderPositionSection = (position: PlayerPosition) => {
    const players = playersByPosition[position];
    const sortedPlayers = sortPlayers(players);

    if (sortedPlayers.length === 0 && selectedFilter === 'Transfer Listed') {
      return null;
    }

    if (players.length === 0 && !draggedPlayer?.isSuggested) {
      return null;
    }

    const positionColor = getPositionColor(position);
    const isDropTarget = dropTargetPosition === position;
    const canAcceptDrop = draggedPlayer?.isSuggested === true;

    const sectionContent = (
      <View
        style={[
          styles.positionSection,
          isDropTarget && canAcceptDrop && styles.positionSectionDropTarget,
          isDropTarget && canAcceptDrop && { borderColor: positionColor },
        ]}
      >
        <View style={styles.positionHeader}>
          <View style={styles.positionTitleRow}>
            <View style={[styles.positionIndicator, { backgroundColor: positionColor }]} />
            <Text style={styles.positionTitle}>{getPositionName(position).toUpperCase()}</Text>
          </View>
          <View style={styles.positionCountBadge}>
            <Text style={styles.positionCountText}>{sortedPlayers.length}</Text>
          </View>
        </View>
        {sortedPlayers.map(renderPlayerItem)}

        {/* Mobile drop target button */}
        {Platform.OS !== 'web' && draggedPlayer?.isSuggested && (
          <TouchableOpacity
            style={[styles.dropTargetButton, { borderColor: positionColor }]}
            onPress={() => {
              movePlayerToSquad(draggedPlayer, position);
              setDraggedPlayer(null);
            }}
          >
            <Ionicons name="add-circle" size={20} color={positionColor} />
            <Text style={[styles.dropTargetText, { color: positionColor }]}>
              Drop {draggedPlayer.name} here
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );

    if (Platform.OS === 'web') {
      return (
        <div
          key={position}
          onDragOver={(e) => canAcceptDrop && handleDragOver(e, position)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => canAcceptDrop && handleDrop(e, position)}
        >
          {sectionContent}
        </div>
      );
    }

    return <View key={position}>{sectionContent}</View>;
  };

  const renderSuggestedPlayersSection = () => {
    const isDropTarget = dropTargetPosition === 'suggested';
    const canAcceptDrop = draggedPlayer && !draggedPlayer.isSuggested;

    const sectionContent = (
      <View
        style={[
          styles.suggestedSection,
          isDropTarget && canAcceptDrop && styles.suggestedSectionDropTarget,
        ]}
      >
        <View style={styles.suggestedHeader}>
          <View style={styles.suggestedIconContainer}>
            <Ionicons name="star" size={20} color="#c41e3a" />
          </View>
          <View style={styles.suggestedTitleContainer}>
            <Text style={styles.suggestedTitle}>SUGGESTED PLAYERS</Text>
            <Text style={styles.suggestedSubtitle}>
              {Platform.OS === 'web'
                ? 'Drag to add to squad'
                : 'Long press to select, then tap target section'}
            </Text>
          </View>
          <View style={styles.suggestedCountBadge}>
            <Text style={styles.suggestedCountText}>{suggestedPlayers.length}</Text>
          </View>
        </View>
        {suggestedPlayers.map(renderPlayerItem)}

        {/* Mobile drop target button */}
        {Platform.OS !== 'web' && draggedPlayer && !draggedPlayer.isSuggested && (
          <TouchableOpacity
            style={[styles.dropTargetButton, { borderColor: '#c41e3a' }]}
            onPress={() => {
              movePlayerToSuggested(draggedPlayer);
              setDraggedPlayer(null);
            }}
          >
            <Ionicons name="add-circle" size={20} color="#c41e3a" />
            <Text style={[styles.dropTargetText, { color: '#c41e3a' }]}>
              Move {draggedPlayer.name} to suggested
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );

    if (Platform.OS === 'web') {
      return (
        <div
          onDragOver={(e) => canAcceptDrop && handleDragOver(e, 'suggested')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => canAcceptDrop && handleDrop(e, 'suggested')}
        >
          {sectionContent}
        </div>
      );
    }

    return sectionContent;
  };

  const renderTeamHeader = () => (
    <View style={styles.teamHeaderContainer}>
      <View style={styles.teamHeader}>
        <View style={styles.teamLogoContainer}>
          <View style={styles.teamLogo}>
            <Ionicons name="shield" size={40} color="#6CABDD" />
          </View>
          <View style={styles.rankBadge}>
            <Text style={styles.rankBadgeText}>1st</Text>
          </View>
        </View>
        <View style={styles.teamInfoContainer}>
          <Text style={styles.teamName}>Manchester Blue</Text>
          <View style={styles.teamStatsRow}>
            <Ionicons name="people" size={16} color="#9CA3AF" />
            <Text style={styles.teamStatText}>{squadPlayers.length}/28</Text>
            <View style={styles.statDivider} />
            <Ionicons name="wallet" size={16} color="#9CA3AF" />
            <Text style={styles.budgetText}>£15.5m</Text>
          </View>
        </View>
      </View>

      {/* Mobile drag indicator */}
      {Platform.OS !== 'web' && draggedPlayer && (
        <View style={styles.dragIndicator}>
          <Ionicons name="hand-left" size={16} color="#0d59f2" />
          <Text style={styles.dragIndicatorText}>
            Selected: {draggedPlayer.name} - Tap a section to move
          </Text>
          <TouchableOpacity onPress={() => setDraggedPlayer(null)}>
            <Ionicons name="close-circle" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderFilterChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
    >
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter;
        return (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, isSelected && styles.filterChipSelected]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
              {filter}
            </Text>
            {filter.includes('Sort') && (
              <Ionicons
                name="swap-vertical"
                size={14}
                color={isSelected ? '#ffffff' : '#9CA3AF'}
                style={styles.filterIcon}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderStatCard = (
    label: string,
    value: string,
    icon: keyof typeof Ionicons.glyphMap,
    color: string
  ) => (
    <View style={[styles.statCard, { borderColor: `${color}4D` }]}>
      <View style={[styles.statIconContainer, { backgroundColor: `${color}33` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={styles.statTextContainer}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  const renderWebSquadStats = () => (
    <View style={styles.webSquadStats}>
      <Text style={styles.webStatsTitle}>SQUAD OVERVIEW</Text>
      <View style={styles.statsRow}>
        {renderStatCard('Total', `${squadStats.totalPlayers}`, 'people', '#0d59f2')}
        {renderStatCard('Avg Rating', squadStats.avgRating.toFixed(1), 'star', '#22c55e')}
      </View>
      <View style={styles.statsRow}>
        {renderStatCard('Avg Age', squadStats.avgAge.toFixed(1), 'calendar', '#eab308')}
        {renderStatCard('Listed', `${squadStats.transferListedCount}`, 'pricetag', '#ef4444')}
      </View>
    </View>
  );

  const renderWebSuggestedPanel = () => {
    const isDropTarget = dropTargetPosition === 'suggested';
    const canAcceptDrop = draggedPlayer && !draggedPlayer.isSuggested;

    const panelContent = (
      <View
        style={[
          styles.webSuggestedPanel,
          isDropTarget && canAcceptDrop && styles.webSuggestedPanelDropTarget,
        ]}
      >
        <View style={styles.webSuggestedHeader}>
          <View style={styles.suggestedIconContainer}>
            <Ionicons name="star" size={20} color="#c41e3a" />
          </View>
          <View style={styles.webSuggestedTitleContainer}>
            <Text style={styles.webSuggestedTitle}>SUGGESTED</Text>
            <Text style={styles.webSuggestedSubtitle}>Drag to add to squad</Text>
          </View>
          <View style={styles.suggestedCountBadge}>
            <Text style={styles.suggestedCountText}>{suggestedPlayers.length}</Text>
          </View>
        </View>
        <ScrollView style={styles.webSuggestedList}>
          {suggestedPlayers.map(renderPlayerItem)}
        </ScrollView>
        <View style={styles.webSuggestedActions}>
          <TouchableOpacity style={styles.scoutButton}>
            <Ionicons name="search" size={16} color="#ffffff" />
            <Text style={styles.scoutButtonText}>Scout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={16} color="#9CA3AF" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        onDragOver={(e) => {
          if (canAcceptDrop) {
            e.preventDefault();
            handleDragOver(e, 'suggested');
          }
        }}
        onDragLeave={handleDragLeave}
        onDrop={(e) => {
          if (canAcceptDrop) {
            handleDrop(e, 'suggested');
          }
        }}
      >
        {panelContent}
      </div>
    );
  };

  const renderMobileLayout = () => (
    <View style={styles.container}>
      <View style={styles.topAppBar}>
        <TouchableOpacity onPress={() => setShowDrawer(true)}>
          <Ionicons name="menu" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Squad Management</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#0d59f2" />
        </TouchableOpacity>
      </View>

      {renderTeamHeader()}
      {renderFilterChips()}

      <ScrollView style={styles.playersList} showsVerticalScrollIndicator={false}>
        {[
          PlayerPosition.GOALKEEPER,
          PlayerPosition.DEFENDER,
          PlayerPosition.MIDFIELDER,
          PlayerPosition.FORWARD,
        ].map(renderPositionSection)}
        {renderSuggestedPlayersSection()}
        <View style={styles.bottomPadding} />
      </ScrollView>

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
    </View>
  );

  const renderWebLayout = () => (
    <View style={styles.webContainer}>
      <SideMenu isWeb />
      <View style={styles.webMainContent}>
        <View style={styles.webTopBar}>
          <Text style={styles.webTitle}>Squad Management</Text>
          <View style={styles.webPlayerCountBadge}>
            <Ionicons name="people" size={20} color="#0d59f2" />
            <Text style={styles.webPlayerCountText}>{squadPlayers.length} Players</Text>
          </View>
        </View>

        <View style={styles.webContentRow}>
          <View style={styles.webLeftColumn}>
            {renderTeamHeader()}
            {renderFilterChips()}
            {Platform.OS === 'web' ? (
              <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {/* Top scroll zone */}
                {draggedPlayer && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 80,
                      zIndex: 100,
                      background: 'linear-gradient(to bottom, rgba(13, 89, 242, 0.1), transparent)',
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      startAutoScroll('up');
                    }}
                    onDragLeave={stopAutoScroll}
                  />
                )}
                {/* Scrollable container */}
                <div
                  ref={webScrollContainerRef}
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                  }}
                >
                  {[
                    PlayerPosition.GOALKEEPER,
                    PlayerPosition.DEFENDER,
                    PlayerPosition.MIDFIELDER,
                    PlayerPosition.FORWARD,
                  ].map(renderPositionSection)}
                  <View style={styles.bottomPadding} />
                </div>
                {/* Bottom scroll zone */}
                {draggedPlayer && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 80,
                      zIndex: 100,
                      background: 'linear-gradient(to top, rgba(13, 89, 242, 0.1), transparent)',
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      startAutoScroll('down');
                    }}
                    onDragLeave={stopAutoScroll}
                  />
                )}
              </div>
            ) : (
              <ScrollView ref={scrollViewRef} style={styles.webSquadList} showsVerticalScrollIndicator={false}>
                {[
                  PlayerPosition.GOALKEEPER,
                  PlayerPosition.DEFENDER,
                  PlayerPosition.MIDFIELDER,
                  PlayerPosition.FORWARD,
                ].map(renderPositionSection)}
                <View style={styles.bottomPadding} />
              </ScrollView>
            )}
          </View>

          <View style={styles.webRightColumn}>
            {renderWebSquadStats()}
            {renderWebSuggestedPanel()}
          </View>
        </View>
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
  topAppBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  teamHeaderContainer: {
    padding: 16,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c2433',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  teamLogoContainer: {
    position: 'relative',
  },
  teamLogo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#1e3a5f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#0d59f2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1c2433',
  },
  rankBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  teamInfoContainer: {
    marginLeft: 16,
    flex: 1,
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  teamStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamStatText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginLeft: 4,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#6B7280',
    marginHorizontal: 12,
  },
  budgetText: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  dragIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 89, 242, 0.15)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(13, 89, 242, 0.3)',
  },
  dragIndicatorText: {
    flex: 1,
    color: '#0d59f2',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  filterContainer: {
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c2433',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  filterChipSelected: {
    backgroundColor: '#0d59f2',
    borderColor: '#0d59f2',
  },
  filterChipText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  filterIcon: {
    marginLeft: 4,
  },
  playersList: {
    flex: 1,
  },
  positionSection: {
    marginVertical: 4,
    backgroundColor: '#101622',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  positionSectionDropTarget: {
    backgroundColor: 'rgba(13, 89, 242, 0.1)',
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(16, 22, 34, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55, 65, 81, 0.5)',
  },
  positionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  positionTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  positionCountBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  positionCountText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '600',
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55, 65, 81, 0.5)',
  },
  playerItemDragging: {
    opacity: 0.5,
    backgroundColor: 'rgba(13, 89, 242, 0.1)',
  },
  avatarContainer: {
    position: 'relative',
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  shirtNumberBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#101622',
  },
  shirtNumberText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  listedBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginLeft: 6,
  },
  listedBadgeText: {
    color: '#ef4444',
    fontSize: 8,
    fontWeight: 'bold',
  },
  suggestedBadge: {
    backgroundColor: 'rgba(196, 30, 58, 0.2)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginLeft: 6,
  },
  suggestedBadgeText: {
    color: '#c41e3a',
    fontSize: 8,
    fontWeight: 'bold',
  },
  playerDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  positionBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  positionBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  playerAge: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 8,
  },
  ratingContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  ratingValue: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ratingValueHigh: {
    color: '#0d59f2',
  },
  ratingLabel: {
    color: '#6B7280',
    fontSize: 10,
    marginTop: 2,
  },
  transferListButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  transferListButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#ef4444',
  },
  dragHandle: {
    marginLeft: 4,
  },
  dropTargetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    margin: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(13, 89, 242, 0.05)',
  },
  dropTargetText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  suggestedSection: {
    margin: 16,
    backgroundColor: '#1c2433',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(55, 65, 81, 0.5)',
  },
  suggestedSectionDropTarget: {
    backgroundColor: 'rgba(196, 30, 58, 0.1)',
    borderColor: '#c41e3a',
  },
  suggestedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55, 65, 81, 0.5)',
  },
  suggestedIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(196, 30, 58, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestedTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  suggestedTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  suggestedSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  suggestedCountBadge: {
    backgroundColor: 'rgba(196, 30, 58, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  suggestedCountText: {
    color: '#c41e3a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 80,
  },
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerContent: {
    width: 280,
    backgroundColor: '#0d1117',
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#101622',
  },
  webMainContent: {
    flex: 1,
  },
  webTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  webTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  webPlayerCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 89, 242, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(13, 89, 242, 0.3)',
  },
  webPlayerCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d59f2',
    marginLeft: 8,
  },
  webContentRow: {
    flex: 1,
    flexDirection: 'row',
  },
  webLeftColumn: {
    flex: 3,
  },
  webRightColumn: {
    flex: 2,
    backgroundColor: '#0d1117',
    borderLeftWidth: 1,
    borderLeftColor: '#374151',
  },
  webSquadList: {
    flex: 1,
  },
  webSquadStats: {
    padding: 20,
    backgroundColor: '#1c2433',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  webStatsTitle: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 89, 242, 0.1)',
    padding: 12,
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 1,
  },
  statIconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  statTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  webSuggestedPanel: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  webSuggestedPanelDropTarget: {
    backgroundColor: 'rgba(196, 30, 58, 0.05)',
    borderColor: '#c41e3a',
  },
  webSuggestedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  webSuggestedTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  webSuggestedTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  webSuggestedSubtitle: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 2,
  },
  webSuggestedList: {
    flex: 1,
  },
  webSuggestedActions: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#1c2433',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  scoutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d59f2',
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  scoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#374151',
    paddingVertical: 10,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});
