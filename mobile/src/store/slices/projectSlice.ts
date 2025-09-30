import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: '2D' | '2.5D' | '3D';
  engine: 'unity' | 'godot';
  status: 'draft' | 'generating' | 'ready' | 'building' | 'published' | 'error';
  previewUrl?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_params: { page?: number; limit?: number; status?: string } = {}, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'My First Game',
          description: 'A simple 2D platformer',
          type: '2D',
          engine: 'unity',
          status: 'draft',
          isPublic: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      return {
        projects: mockProjects,
        pagination: {
          page: 1,
          limit: 10,
          total: mockProjects.length,
          pages: 1,
        },
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch projects');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: {
    name: string;
    description?: string;
    type: '2D' | '2.5D' | '3D';
    engine: 'unity' | 'godot';
    aiPrompt?: string;
  }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      const newProject: Project = {
        id: Date.now().toString(),
        ...projectData,
        status: 'draft',
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newProject;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create project');
    }
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      const project: Project = {
        id: projectId,
        name: 'Sample Project',
        description: 'A sample project description',
        type: '2D',
        engine: 'unity',
        status: 'draft',
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return project;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch project');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    updateProject: (state, action: PayloadAction<Partial<Project> & { id: string }>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload };
      }
      if (state.currentProject?.id === action.payload.id) {
        state.currentProject = { ...state.currentProject, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch projects
    builder.addCase(fetchProjects.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.isLoading = false;
      state.projects = action.payload.projects;
      state.pagination = action.payload.pagination;
      state.error = null;
    });
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create project
    builder.addCase(createProject.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createProject.fulfilled, (state, action) => {
      state.isLoading = false;
      state.projects.unshift(action.payload);
      state.currentProject = action.payload;
      state.error = null;
    });
    builder.addCase(createProject.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch project
    builder.addCase(fetchProject.fulfilled, (state, action) => {
      state.currentProject = action.payload;
    });
  },
});

export const { clearError, setCurrentProject, updateProject } = projectSlice.actions;
export default projectSlice.reducer;