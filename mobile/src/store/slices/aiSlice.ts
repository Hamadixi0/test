import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Generation {
  id: string;
  projectId: string;
  type: 'code' | '2d_art' | '3d_model' | 'audio' | 'level' | 'ui' | 'shader' | 'physics';
  prompt: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  agent: string;
  resultUrls?: string[];
  approved?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AIState {
  generations: Generation[];
  activeGenerations: Generation[];
  isGenerating: boolean;
  error: string | null;
  models: {
    code: any[];
    art: any[];
    audio: any[];
    '3d': any[];
  };
  templates: {
    gameTypes: any[];
    artStyles: any[];
    musicGenres: any[];
  };
}

const initialState: AIState = {
  generations: [],
  activeGenerations: [],
  isGenerating: false,
  error: null,
  models: {
    code: [],
    art: [],
    audio: [],
    '3d': [],
  },
  templates: {
    gameTypes: [],
    artStyles: [],
    musicGenres: [],
  },
};

// Async thunks
export const fetchAIModels = createAsyncThunk(
  'ai/fetchModels',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      const models = {
        code: [
          { id: 'gpt-4', name: 'GPT-4', provider: 'openai', description: 'Advanced code generation' },
        ],
        art: [
          { id: 'dall-e-3', name: 'DALL-E 3', provider: 'openai', description: 'High-quality 2D art generation' },
        ],
        audio: [
          { id: 'elevenlabs', name: 'ElevenLabs', provider: 'elevenlabs', description: 'Voice and sound effects' },
        ],
        '3d': [
          { id: 'triposr', name: 'TripoSR', provider: 'stability', description: '3D model generation' },
        ],
      };
      
      return models;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch AI models');
    }
  }
);

export const fetchAITemplates = createAsyncThunk(
  'ai/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      const templates = {
        gameTypes: [
          {
            id: 'platformer-2d',
            name: '2D Platformer',
            description: 'Classic side-scrolling platformer game',
          },
        ],
        artStyles: [
          { id: 'pixel', name: 'Pixel Art', description: 'Retro 8-bit/16-bit style' },
        ],
        musicGenres: [
          { id: 'chiptune', name: 'Chiptune', description: 'Retro 8-bit music' },
        ],
      };
      
      return templates;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch AI templates');
    }
  }
);

export const startGeneration = createAsyncThunk(
  'ai/startGeneration',
  async (data: {
    projectId: string;
    type: Generation['type'];
    prompt: string;
  }, { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call
      const generation: Generation = {
        id: Date.now().toString(),
        projectId: data.projectId,
        type: data.type,
        prompt: data.prompt,
        status: 'pending',
        agent: `${data.type}_agent`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Simulate async generation
      setTimeout(() => {
        // This would normally be handled by websocket updates
      }, 2000);
      
      return generation;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start generation');
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateGeneration: (state, action: PayloadAction<Partial<Generation> & { id: string }>) => {
      const index = state.generations.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.generations[index] = { ...state.generations[index], ...action.payload };
      }
      
      const activeIndex = state.activeGenerations.findIndex(g => g.id === action.payload.id);
      if (activeIndex !== -1) {
        state.activeGenerations[activeIndex] = { ...state.activeGenerations[activeIndex], ...action.payload };
        
        // Remove from active if completed or failed
        if (action.payload.status === 'completed' || action.payload.status === 'failed') {
          state.activeGenerations.splice(activeIndex, 1);
        }
      }
    },
    approveGeneration: (state, action: PayloadAction<string>) => {
      const generation = state.generations.find(g => g.id === action.payload);
      if (generation) {
        generation.approved = true;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch AI models
    builder.addCase(fetchAIModels.fulfilled, (state, action) => {
      state.models = action.payload;
    });

    // Fetch AI templates
    builder.addCase(fetchAITemplates.fulfilled, (state, action) => {
      state.templates = action.payload;
    });

    // Start generation
    builder.addCase(startGeneration.pending, (state) => {
      state.isGenerating = true;
      state.error = null;
    });
    builder.addCase(startGeneration.fulfilled, (state, action) => {
      state.isGenerating = false;
      state.generations.unshift(action.payload);
      state.activeGenerations.push(action.payload);
      state.error = null;
    });
    builder.addCase(startGeneration.rejected, (state, action) => {
      state.isGenerating = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, updateGeneration, approveGeneration } = aiSlice.actions;
export default aiSlice.reducer;