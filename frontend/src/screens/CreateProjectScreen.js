import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProjects } from '../context/ProjectContext';

export default function CreateProjectScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gameType: '2D',
    engine: 'Unity',
    prompt: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { createProject } = useProjects();

  const gameTypes = ['2D', '2.5D', '3D'];
  const engines = ['Unity', 'Godot'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    if (!formData.prompt.trim()) {
      Alert.alert('Error', 'Please describe your game idea');
      return;
    }

    if (formData.prompt.length < 10) {
      Alert.alert('Error', 'Please provide a more detailed game description (at least 10 characters)');
      return;
    }

    setIsLoading(true);
    const result = await createProject(formData);
    setIsLoading(false);

    if (result.success) {
      Alert.alert(
        'Project Created!',
        'Your AI game generation has started. You can monitor progress in the Projects tab.',
        [
          {
            text: 'View Project',
            onPress: () => {
              navigation.navigate('Projects');
              navigation.navigate('ProjectDetail', { projectId: result.project.id });
            },
          },
          {
            text: 'Create Another',
            onPress: () => {
              setFormData({
                name: '',
                description: '',
                gameType: '2D',
                engine: 'Unity',
                prompt: '',
              });
            },
          },
        ]
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to create project');
    }
  };

  const renderOption = (options, selectedValue, field, iconName) => (
    <View style={styles.optionContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionButton,
            selectedValue === option && styles.optionButtonSelected,
          ]}
          onPress={() => handleInputChange(field, option)}
        >
          <Ionicons 
            name={iconName} 
            size={20} 
            color={selectedValue === option ? '#007AFF' : '#666'} 
          />
          <Text
            style={[
              styles.optionText,
              selectedValue === option && styles.optionTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="create-outline" size={48} color="#007AFF" />
          <Text style={styles.title}>Create New Game</Text>
          <Text style={styles.subtitle}>
            Describe your game idea and let AI bring it to life
          </Text>
        </View>

        <View style={styles.form}>
          {/* Project Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Project Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="My Awesome Game"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              maxLength={100}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Brief description of your game..."
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={3}
              maxLength={500}
            />
          </View>

          {/* Game Type */}
          <View style={styles.section}>
            <Text style={styles.label}>Game Type *</Text>
            {renderOption(gameTypes, formData.gameType, 'gameType', 'cube-outline')}
          </View>

          {/* Engine */}
          <View style={styles.section}>
            <Text style={styles.label}>Game Engine *</Text>
            {renderOption(engines, formData.engine, 'engine', 'settings-outline')}
          </View>

          {/* Game Prompt */}
          <View style={styles.section}>
            <Text style={styles.label}>Game Idea *</Text>
            <Text style={styles.helperText}>
              Describe your game concept in detail. The more specific you are, the better the AI can create your vision.
            </Text>
            <TextInput
              style={[styles.input, styles.promptArea]}
              placeholder="A platformer game where the player is a robot cat exploring an alien world filled with floating islands. The cat can jump, shoot laser beams, and collect energy crystals to unlock new abilities. The game should have vibrant neon colors and electronic music..."
              value={formData.prompt}
              onChangeText={(value) => handleInputChange('prompt', value)}
              multiline
              numberOfLines={8}
              maxLength={2000}
            />
            <Text style={styles.characterCount}>
              {formData.prompt.length}/2000 characters
            </Text>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            style={[styles.createButton, isLoading && styles.createButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="rocket-outline" size={20} color="white" />
                <Text style={styles.createButtonText}>Create Game with AI</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              Game generation typically takes 2-5 minutes. You'll receive real-time updates on the progress.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  promptArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  optionButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  optionText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  optionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginLeft: 12,
  },
});