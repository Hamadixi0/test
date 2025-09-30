import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';

const ProjectContext = createContext();

const initialState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  socket: null,
};

function projectReducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true };
    case 'LOAD_PROJECTS_SUCCESS':
      return {
        ...state,
        projects: action.payload,
        isLoading: false,
      };
    case 'CREATE_PROJECT_SUCCESS':
      return {
        ...state,
        projects: [action.payload, ...state.projects],
        currentProject: action.payload,
        isLoading: false,
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        currentProject: state.currentProject?.id === action.payload.id 
          ? action.payload 
          : state.currentProject,
      };
    case 'DELETE_PROJECT_SUCCESS':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload 
          ? null 
          : state.currentProject,
      };
    case 'SET_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: action.payload,
      };
    case 'SET_SOCKET':
      return {
        ...state,
        socket: action.payload,
      };
    case 'PROJECT_ERROR':
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      loadProjects();
      initializeSocket();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    return () => {
      if (state.socket) {
        state.socket.disconnect();
      }
    };
  }, [state.socket]);

  const initializeSocket = () => {
    const socket = io(process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000', {
      auth: {
        token: token
      }
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('project_created', (data) => {
      dispatch({ type: 'UPDATE_PROJECT', payload: data.project });
    });

    socket.on('project_updated', (data) => {
      dispatch({ type: 'UPDATE_PROJECT', payload: data.project });
    });

    socket.on('generation_progress', (data) => {
      dispatch({ type: 'UPDATE_PROJECT', payload: data.project });
    });

    socket.on('ai_progress', (data) => {
      // Handle AI generation progress updates
      console.log('AI Progress:', data);
    });

    dispatch({ type: 'SET_SOCKET', payload: socket });
  };

  const loadProjects = async () => {
    try {
      dispatch({ type: 'LOADING' });
      const response = await projectService.getProjects();
      dispatch({ type: 'LOAD_PROJECTS_SUCCESS', payload: response.projects });
    } catch (error) {
      console.error('Error loading projects:', error);
      dispatch({ type: 'PROJECT_ERROR' });
    }
  };

  const createProject = async (projectData) => {
    try {
      dispatch({ type: 'LOADING' });
      const response = await projectService.createProject(projectData);
      
      // Join the project room for real-time updates
      if (state.socket) {
        state.socket.emit('join_project', response.project.id);
      }
      
      dispatch({ type: 'CREATE_PROJECT_SUCCESS', payload: response.project });
      return { success: true, project: response.project };
    } catch (error) {
      dispatch({ type: 'PROJECT_ERROR' });
      return { success: false, error: error.message };
    }
  };

  const updateProject = async (projectId, updates) => {
    try {
      const response = await projectService.updateProject(projectId, updates);
      dispatch({ type: 'UPDATE_PROJECT', payload: response.project });
      return { success: true, project: response.project };
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await projectService.deleteProject(projectId);
      dispatch({ type: 'DELETE_PROJECT_SUCCESS', payload: projectId });
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, error: error.message };
    }
  };

  const getProject = async (projectId) => {
    try {
      const response = await projectService.getProject(projectId);
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: response.project });
      
      // Join the project room for real-time updates
      if (state.socket) {
        state.socket.emit('join_project', projectId);
      }
      
      return { success: true, project: response.project };
    } catch (error) {
      console.error('Error getting project:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...state,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}