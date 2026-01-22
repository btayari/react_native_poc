import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

interface SideMenuProps {
  isWeb?: boolean;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isWeb = false }) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { icon: 'home', label: 'Home', isActive: pathname === '/', onPress: () => router.push('/') },
    { icon: 'bar-chart', label: 'Prediction', isActive: pathname === '/tactical-lineup', onPress: () => router.push('/tactical-lineup') },
    { icon: 'swap-horizontal', label: 'Transfers', isActive: pathname === '/transfers', onPress: () => router.push('/transfers') },
    { icon: 'search', label: 'Scouting', isActive: false, onPress: () => {} },
  ];

  const teamMenuItems: MenuItem[] = [
    { icon: 'people', label: 'Squad', isActive: pathname === '/squad-management', onPress: () => router.push('/squad-management') },
    { icon: 'stats-chart', label: 'Statistics', isActive: false, onPress: () => {} },
    { icon: 'calendar', label: 'Fixtures', isActive: false, onPress: () => {} },
  ];

  const settingsItems: MenuItem[] = [
    { icon: 'settings', label: 'Settings', isActive: false, onPress: () => {} },
    { icon: 'help-circle', label: 'Help & Support', isActive: false, onPress: () => {} },
  ];

  return (
    <SafeAreaView style={[styles.container, isWeb && styles.webContainer]}>
      {/* User Profile */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#9CA3AF" />
          </View>
        </View>

        <Text style={styles.userName}>John Manager</Text>
        <Text style={styles.userEmail}>john.manager@mancity.com</Text>

        <View style={styles.clubBadge}>
          <View style={styles.badgeIcon}>
            <Ionicons name="shield" size={16} color="#ffffff" />
          </View>
          <Text style={styles.clubName}>Manchester City</Text>
        </View>
      </View>

      {/* Navigation Menu */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <MenuItemComponent key={index} {...item} />
        ))}

        <Text style={styles.sectionHeader}>TEAM MANAGEMENT</Text>
        {teamMenuItems.map((item, index) => (
          <MenuItemComponent key={`team-${index}`} {...item} />
        ))}

        <Text style={styles.sectionHeader}>SETTINGS</Text>
        {settingsItems.map((item, index) => (
          <MenuItemComponent key={`settings-${index}`} {...item} />
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#9CA3AF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const MenuItemComponent: React.FC<MenuItem> = ({ icon, label, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isActive && styles.menuItemActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={22}
        color={isActive ? '#0d59f2' : '#9CA3AF'}
      />
      <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    borderRightWidth: 1,
    borderRightColor: '#374151',
  },
  webContainer: {
    width: 280,
    minWidth: 280,
    maxWidth: 280,
    flexShrink: 0,
  },
  profileSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#0d59f2',
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0d59f2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  clubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e2736',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  badgeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6CABDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  clubName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6B7280',
    letterSpacing: 1.2,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
  },
  menuItemActive: {
    backgroundColor: 'rgba(13, 89, 242, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(13, 89, 242, 0.3)',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#D1D5DB',
    marginLeft: 14,
  },
  menuLabelActive: {
    fontWeight: '600',
    color: '#0d59f2',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginLeft: 8,
  },
});
