import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, RouteProp } from '@react-navigation/native';
import { AppDispatch, RootState } from '../store';
import { fetchProject } from '../store/slices/projectSlice';
import { RootStackParamList } from '../navigation/AppNavigator';

type ProjectScreenRouteProp = RouteProp<RootStackParamList, 'Project'>;

const ProjectScreen: React.FC = () => {
  const route = useRoute<ProjectScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { projectId } = route.params;
  const { currentProject } = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    dispatch(fetchProject(projectId));
  }, [dispatch, projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'generating': return '#f59e0b';
      case 'ready': return '#10b981';
      case 'building': return '#3b82f6';
      case 'published': return '#8b5cf6';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (!currentProject) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading project...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.projectName}>{currentProject.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentProject.status) }]}>
          <Text style={styles.statusText}>{currentProject.status}</Text>
        </View>
      </View>

      {currentProject.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{currentProject.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>{currentProject.type}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Engine:</Text>
          <Text style={styles.detailValue}>{currentProject.engine}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created:</Text>
          <Text style={styles.detailValue}>
            {new Date(currentProject.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Updated:</Text>
          <Text style={styles.detailValue}>
            {new Date(currentProject.updatedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Generation</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Generate Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Generate Art Assets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Generate Audio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Generate Level Design</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Build & Export</Text>
        <TouchableOpacity style={[styles.actionButton, styles.buildButton]}>
          <Text style={styles.actionButtonText}>Build WebGL Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.buildButton]}>
          <Text style={styles.actionButtonText}>Export to Unity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.buildButton]}>
          <Text style={styles.actionButtonText}>Build Mobile App</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  projectName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
  },
  actionButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  buildButton: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProjectScreen;