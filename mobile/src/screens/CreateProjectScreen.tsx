import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppDispatch, RootState } from '../store';
import { createProject } from '../store/slices/projectSlice';
import { RootStackParamList } from '../navigation/AppNavigator';

type CreateProjectScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateProject'>;

const CreateProjectScreen: React.FC = () => {
  const navigation = useNavigation<CreateProjectScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { isLoading } = useSelector((state: RootState) => state.projects);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'2D' | '2.5D' | '3D'>('2D');
  const [engine, setEngine] = useState<'unity' | 'godot'>('unity');
  const [aiPrompt, setAiPrompt] = useState('');

  const gameTypes = [
    { id: '2D' as const, name: '2D Game', description: 'Classic 2D games with sprites' },
    { id: '2.5D' as const, name: '2.5D Game', description: '2D gameplay with 3D visuals' },
    { id: '3D' as const, name: '3D Game', description: 'Full 3D world and gameplay' },
  ];

  const engines = [
    { id: 'unity' as const, name: 'Unity', description: 'Popular cross-platform engine' },
    { id: 'godot' as const, name: 'Godot', description: 'Open-source engine' },
  ];

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    try {
      const result = await dispatch(createProject({
        name: name.trim(),
        description: description.trim() || undefined,
        type,
        engine,
        aiPrompt: aiPrompt.trim() || undefined,
      })).unwrap();

      Alert.alert('Success', 'Project created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Project', { projectId: result.id }),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to create project');
    }
  };

  const renderTypeSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.sectionTitle}>Game Type</Text>
      {gameTypes.map((gameType) => (
        <TouchableOpacity
          key={gameType.id}
          style={[
            styles.optionCard,
            type === gameType.id && styles.optionCardSelected,
          ]}
          onPress={() => setType(gameType.id)}
        >
          <Text style={[
            styles.optionName,
            type === gameType.id && styles.optionNameSelected,
          ]}>
            {gameType.name}
          </Text>
          <Text style={[
            styles.optionDescription,
            type === gameType.id && styles.optionDescriptionSelected,
          ]}>
            {gameType.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEngineSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.sectionTitle}>Game Engine</Text>
      {engines.map((gameEngine) => (
        <TouchableOpacity
          key={gameEngine.id}
          style={[
            styles.optionCard,
            engine === gameEngine.id && styles.optionCardSelected,
          ]}
          onPress={() => setEngine(gameEngine.id)}
        >
          <Text style={[
            styles.optionName,
            engine === gameEngine.id && styles.optionNameSelected,
          ]}>
            {gameEngine.name}
          </Text>
          <Text style={[
            styles.optionDescription,
            engine === gameEngine.id && styles.optionDescriptionSelected,
          ]}>
            {gameEngine.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create New Game</Text>
      <Text style={styles.subtitle}>
        Describe your game idea and let AI bring it to life
      </Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Project Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="My Awesome Game"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Brief description of your game"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {renderTypeSelector()}
        {renderEngineSelector()}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>AI Prompt</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your game idea in detail. The more specific, the better! e.g., 'A 2D platformer with a ninja character who can wall-jump and throw shurikens...'"
            value={aiPrompt}
            onChangeText={setAiPrompt}
            multiline
            numberOfLines={4}
          />
          <Text style={styles.hint}>
            This will help AI generate better game assets and code for your project
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.createButton, isLoading && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.createButtonText}>
            {isLoading ? 'Creating...' : 'Create Project'}
          </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  selectorContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  optionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  optionCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f0ff',
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  optionNameSelected: {
    color: '#6366f1',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  optionDescriptionSelected: {
    color: '#4f46e5',
  },
  createButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  createButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  createButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateProjectScreen;