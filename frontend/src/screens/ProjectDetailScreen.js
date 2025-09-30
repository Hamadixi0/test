import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProjects } from '../context/ProjectContext';

export default function ProjectDetailScreen({ route, navigation }) {
  const { projectId } = route.params;
  const { getProject, currentProject, isLoading } = useProjects();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    const result = await getProject(projectId);
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to load project');
      navigation.goBack();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'initializing':
      case 'analyzing_prompt':
      case 'generating_assets':
      case 'creating_code':
      case 'building_levels':
      case 'optimizing':
        return 'sync';
      case 'error':
        return 'alert-circle';
      default:
        return 'time';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#28a745';
      case 'initializing':
      case 'analyzing_prompt':
      case 'generating_assets':
      case 'creating_code':
      case 'building_levels':
      case 'optimizing':
        return '#ffc107';
      case 'error':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Ionicons name="cube-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{currentProject.gameType}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="settings-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Engine</Text>
            <Text style={styles.infoValue}>{currentProject.engine}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.infoValue}>
              {new Date(currentProject.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Updated</Text>
            <Text style={styles.infoValue}>
              {new Date(currentProject.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Concept</Text>
        <View style={styles.promptBox}>
          <Text style={styles.promptText}>{currentProject.prompt}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {currentProject.preview && (
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="play-circle" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Play Game</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="logo-github" size={24} color="#333" />
            <Text style={styles.actionText}>View Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="download-outline" size={24} color="#666" />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color="#666" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderAssets = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Generated Assets</Text>
      {Object.entries(currentProject.assets || {}).map(([category, assets]) => (
        <View key={category} style={styles.assetCategory}>
          <Text style={styles.categoryTitle}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
          {assets.length > 0 ? (
            assets.map((asset, index) => (
              <View key={index} style={styles.assetItem}>
                <Ionicons name="document-outline" size={16} color="#666" />
                <Text style={styles.assetName}>{asset}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noAssets}>No assets generated yet</Text>
          )}
        </View>
      ))}
    </View>
  );

  const renderSettings = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Project Settings</Text>
      <View style={styles.settingSection}>
        <Text style={styles.settingLabel}>Target Platforms</Text>
        <View style={styles.platformList}>
          {(currentProject.settings?.targetPlatforms || []).map((platform) => (
            <View key={platform} style={styles.platformTag}>
              <Text style={styles.platformText}>{platform}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.settingSection}>
        <Text style={styles.settingLabel}>Quality Level</Text>
        <Text style={styles.settingValue}>
          {currentProject.settings?.qualityLevel || 'Medium'}
        </Text>
      </View>

      <View style={styles.settingSection}>
        <Text style={styles.settingLabel}>Multiplayer</Text>
        <Text style={styles.settingValue}>
          {currentProject.settings?.multiplayer ? 'Enabled' : 'Disabled'}
        </Text>
      </View>

      {currentProject.settings?.multiplayer && (
        <View style={styles.settingSection}>
          <Text style={styles.settingLabel}>Max Players</Text>
          <Text style={styles.settingValue}>
            {currentProject.settings?.maxPlayers || 1}
          </Text>
        </View>
      )}
    </View>
  );

  if (isLoading || !currentProject) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading project...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.projectName}>{currentProject.name}</Text>
          <Text style={styles.projectDescription}>
            {currentProject.description || 'No description'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentProject.status) }]}>
          <Ionicons 
            name={getStatusIcon(currentProject.status)} 
            size={16} 
            color="white" 
          />
          <Text style={styles.statusText}>
            {currentProject.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { id: 'overview', label: 'Overview', icon: 'grid-outline' },
          { id: 'assets', label: 'Assets', icon: 'folder-outline' },
          { id: 'settings', label: 'Settings', icon: 'settings-outline' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons 
              name={tab.icon} 
              size={20} 
              color={activeTab === tab.id ? '#007AFF' : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'assets' && renderAssets()}
        {activeTab === 'settings' && renderSettings()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  projectName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  promptBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  promptText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '45%',
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    fontWeight: '500',
  },
  assetCategory: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  assetName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  noAssets: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  settingSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  platformList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformTag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  platformText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
});