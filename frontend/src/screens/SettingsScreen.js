import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'AI Game Builder Platform',
      'Version 1.0.0\n\nA cross-platform AI game builder that lets anyone create full games by text prompt.\n\nBuilt with React Native, Node.js, and AI.',
      [{ text: 'OK' }]
    );
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'person-outline',
          title: 'Profile',
          subtitle: user?.username || 'Demo User',
          onPress: () => Alert.alert('Profile', 'Profile editing coming soon!'),
        },
        {
          icon: 'key-outline',
          title: 'API Keys',
          subtitle: 'Manage your AI service API keys',
          onPress: () => Alert.alert('API Keys', 'API key management coming soon!'),
        },
      ],
    },
    {
      title: 'AI Settings',
      items: [
        {
          icon: 'settings-outline',
          title: 'Default Model',
          subtitle: 'GPT-4',
          onPress: () => Alert.alert('AI Model', 'Model selection coming soon!'),
        },
        {
          icon: 'flash-outline',
          title: 'Generation Quality',
          subtitle: 'Balanced',
          onPress: () => Alert.alert('Quality', 'Quality settings coming soon!'),
        },
        {
          icon: 'analytics-outline',
          title: 'Usage Analytics',
          subtitle: 'View your AI usage statistics',
          onPress: () => Alert.alert('Analytics', 'Analytics dashboard coming soon!'),
        },
      ],
    },
    {
      title: 'Storage & Sync',
      items: [
        {
          icon: 'logo-github',
          title: 'GitHub Integration',
          subtitle: 'Connected',
          onPress: () => Alert.alert('GitHub', 'GitHub settings coming soon!'),
        },
        {
          icon: 'cloud-outline',
          title: 'Cloud Storage',
          subtitle: 'Auto-backup enabled',
          onPress: () => Alert.alert('Storage', 'Storage settings coming soon!'),
        },
        {
          icon: 'sync-outline',
          title: 'Auto-Sync',
          subtitle: 'Enabled',
          onPress: () => Alert.alert('Sync', 'Sync settings coming soon!'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications-outline',
          title: 'Notifications',
          subtitle: 'Push notifications enabled',
          onPress: () => Alert.alert('Notifications', 'Notification settings coming soon!'),
        },
        {
          icon: 'language-outline',
          title: 'Language',
          subtitle: 'English',
          onPress: () => Alert.alert('Language', 'Language selection coming soon!'),
        },
        {
          icon: 'accessibility-outline',
          title: 'Accessibility',
          subtitle: 'Customize accessibility options',
          onPress: () => Alert.alert('Accessibility', 'Accessibility settings coming soon!'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          title: 'Help & Documentation',
          subtitle: 'Learn how to use the platform',
          onPress: () => Alert.alert('Help', 'Documentation coming soon!'),
        },
        {
          icon: 'bug-outline',
          title: 'Report a Bug',
          subtitle: 'Help us improve the platform',
          onPress: () => Alert.alert('Bug Report', 'Bug reporting coming soon!'),
        },
        {
          icon: 'information-circle-outline',
          title: 'About',
          subtitle: 'Version and platform information',
          onPress: handleAbout,
        },
      ],
    },
  ];

  const renderSettingItem = (item, isLast = false) => (
    <TouchableOpacity
      key={item.title}
      style={[styles.settingItem, isLast && styles.lastSettingItem]}
      onPress={item.onPress}
    >
      <View style={styles.settingIcon}>
        <Ionicons name={item.icon} size={24} color="#007AFF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* User Header */}
      <View style={styles.userHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#007AFF" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user?.username || 'Demo User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'demo@example.com'}</Text>
        </View>
      </View>

      {/* Settings Sections */}
      {settingSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.settingGroup}>
            {section.items.map((item, index) =>
              renderSettingItem(item, index === section.items.length - 1)
            )}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#dc3545" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          AI Game Builder Platform v1.0.0
        </Text>
        <Text style={styles.footerSubtext}>
          Create. Build. Play. Share.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  userHeader: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  settingGroup: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
  },
});