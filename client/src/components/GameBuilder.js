import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import ChatInterface from './ChatInterface';
import GamePreview from './GamePreview';
import { aiService } from '../services/api';

const BuilderContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background};
`;

const BuilderHeader = styled.div`
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  text-align: center;
`;

const BuilderTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes['3xl']};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
`;

const BuilderSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.lg};
`;

const BuilderContent = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.lg};
  }
`;

const ChatSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 600px;
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};

  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    order: -1;
  }
`;

const ProgressCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: ${props => props.theme.spacing.lg};
`;

const ProgressTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSizes.lg};
`;

const ProgressSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const ProgressStep = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  border-radius: 8px;
  background: ${props => props.completed ? props.theme.colors.primary}20 : 'transparent'};
  border: 1px solid ${props => props.completed ? props.theme.colors.primary}40 : props.theme.colors.border};
  transition: all ${props => props.theme.animations.fast};
`;

const StepIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.completed ? props.theme.colors.primary : props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: ${props => props.completed ? props.theme.colors.background : props.theme.colors.textMuted};
  font-weight: bold;
`;

const StepText = styled.span`
  color: ${props => props.completed ? props.theme.colors.text : props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.primary ? 
    `linear-gradient(45deg, ${props.theme.colors.primary}, ${props.theme.colors.accent})` : 
    props.theme.colors.surfaceLight
  };
  color: ${props => props.primary ? props.theme.colors.background : props.theme.colors.text};
  border: 1px solid ${props => props.primary ? 'transparent' : props.theme.colors.border};
  border-radius: 8px;
  font-weight: 500;
  transition: all ${props => props.theme.animations.fast};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const GameBuilder = () => {
  const [sessionId] = useState(() => uuidv4());
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gameSpec, setGameSpec] = useState(null);
  const [generatedGame, setGeneratedGame] = useState(null);
  const [buildProgress, setBuildProgress] = useState({
    concept: false,
    mechanics: false,
    story: false,
    assets: false,
    testing: false,
    complete: false
  });

  const chatRef = useRef(null);

  useEffect(() => {
    // Initialize AI conversation
    initializeConversation();
  }, []);

  const initializeConversation = async () => {
    try {
      setIsLoading(true);
      const response = await aiService.startConversation(sessionId);
      setMessages([{
        id: uuidv4(),
        type: 'ai',
        content: response.response,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
      toast.error('Failed to start AI conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message) => {
    const userMessage = {
      id: uuidv4(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage(sessionId, message);
      
      const aiMessage = {
        id: uuidv4(),
        type: 'ai',
        content: response.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update progress based on conversation content
      updateProgress(message, response.response);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = (userMessage, aiResponse) => {
    const combined = (userMessage + ' ' + aiResponse).toLowerCase();
    
    setBuildProgress(prev => ({
      ...prev,
      concept: prev.concept || combined.includes('genre') || combined.includes('type of game'),
      mechanics: prev.mechanics || combined.includes('mechanic') || combined.includes('gameplay'),
      story: prev.story || combined.includes('story') || combined.includes('character') || combined.includes('plot'),
      assets: prev.assets || combined.includes('art') || combined.includes('visual') || combined.includes('style'),
      testing: prev.testing || combined.includes('test') || combined.includes('play') || combined.includes('level')
    }));
  };

  const generateGameSpec = async () => {
    try {
      setIsLoading(true);
      toast.info('Generating game specification...');
      
      const response = await aiService.generateSpecification(sessionId);
      setGameSpec(response.specification);
      
      setBuildProgress(prev => ({ ...prev, complete: true }));
      toast.success('Game specification generated!');
      
    } catch (error) {
      console.error('Failed to generate specification:', error);
      toast.error('Failed to generate game specification');
    } finally {
      setIsLoading(false);
    }
  };

  const buildGame = async () => {
    if (!gameSpec) {
      toast.error('Please generate a game specification first');
      return;
    }

    try {
      setIsLoading(true);
      toast.info('Building your game... This may take a few minutes.');
      
      const response = await fetch('/api/games/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameSpec, sessionId })
      });

      if (!response.ok) throw new Error('Failed to generate game');
      
      const result = await response.json();
      setGeneratedGame(result);
      
      toast.success('Game built successfully! 🎉');
      
    } catch (error) {
      console.error('Failed to build game:', error);
      toast.error('Failed to build game');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadGame = () => {
    if (generatedGame) {
      window.open(generatedGame.downloadUrl, '_blank');
    }
  };

  const playGame = () => {
    if (generatedGame) {
      window.open(generatedGame.playUrl, '_blank');
    }
  };

  const resetBuilder = () => {
    setMessages([]);
    setGameSpec(null);
    setGeneratedGame(null);
    setBuildProgress({
      concept: false,
      mechanics: false,
      story: false,
      assets: false,
      testing: false,
      complete: false
    });
    initializeConversation();
  };

  const progressSteps = [
    { key: 'concept', label: 'Game Concept', icon: '💡' },
    { key: 'mechanics', label: 'Core Mechanics', icon: '⚙️' },
    { key: 'story', label: 'Story & Characters', icon: '📖' },
    { key: 'assets', label: 'Art & Assets', icon: '🎨' },
    { key: 'testing', label: 'Testing & Levels', icon: '🧪' },
    { key: 'complete', label: 'Ready to Build', icon: '🚀' }
  ];

  return (
    <BuilderContainer>
      <BuilderHeader>
        <BuilderTitle>AI Game Builder</BuilderTitle>
        <BuilderSubtitle>
          Tell me about the game you want to create, and I'll guide you through building it step by step.
        </BuilderSubtitle>
      </BuilderHeader>

      <BuilderContent>
        <ChatSection>
          <ChatInterface
            ref={chatRef}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </ChatSection>

        <SidePanel>
          <ProgressCard>
            <ProgressTitle>Build Progress</ProgressTitle>
            <ProgressSteps>
              {progressSteps.map((step) => (
                <ProgressStep key={step.key} completed={buildProgress[step.key]}>
                  <StepIcon completed={buildProgress[step.key]}>
                    {buildProgress[step.key] ? '✓' : step.icon}
                  </StepIcon>
                  <StepText completed={buildProgress[step.key]}>
                    {step.label}
                  </StepText>
                </ProgressStep>
              ))}
            </ProgressSteps>
          </ProgressCard>

          <ProgressCard>
            <ProgressTitle>Actions</ProgressTitle>
            <ActionButtons>
              <ActionButton
                onClick={generateGameSpec}
                disabled={isLoading || !buildProgress.story}
                primary
              >
                Generate Game Spec
              </ActionButton>
              
              <ActionButton
                onClick={buildGame}
                disabled={isLoading || !gameSpec}
                primary={!!gameSpec}
              >
                Build Game
              </ActionButton>
              
              {generatedGame && (
                <>
                  <ActionButton onClick={playGame}>
                    Play Game
                  </ActionButton>
                  <ActionButton onClick={downloadGame}>
                    Download Game
                  </ActionButton>
                </>
              )}
              
              <ActionButton onClick={resetBuilder}>
                Start Over
              </ActionButton>
            </ActionButtons>
          </ProgressCard>

          {gameSpec && (
            <GamePreview gameSpec={gameSpec} />
          )}
        </SidePanel>
      </BuilderContent>
    </BuilderContainer>
  );
};

export default GameBuilder;