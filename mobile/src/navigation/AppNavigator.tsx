import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Import screens (we'll create these next)
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProjectScreen from '../screens/ProjectScreen';
import CreateProjectScreen from '../screens/CreateProjectScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Project: { projectId: string };
  CreateProject: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6366f1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'AI Game Builder' }}
          />
          <Stack.Screen
            name="Project"
            component={ProjectScreen}
            options={{ title: 'Project Details' }}
          />
          <Stack.Screen
            name="CreateProject"
            component={CreateProjectScreen}
            options={{ title: 'Create New Game' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};