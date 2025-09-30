import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { gamesService, formatDate } from '../services/api';

const PlayerContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const PlayerHeader = styled.div`
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GameInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const GameTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes['2xl']};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const GameMeta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const MetaTag = styled.span`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: 8px;
  font-size: ${props => props.theme.fontSizes.xs};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
`;

const ActionButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.primary ? 
    `linear-gradient(45deg, ${props.theme.colors.primary}, ${props.theme.colors.accent})` : 
    'transparent'
  };
  color: ${props => props.primary ? props.theme.colors.background : props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary}40;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.sm};
  }
`;

const BackLink = styled(Link)`
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  transition: color ${props => props.theme.animations.fast};

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const GameFrame = styled.div`
  padding: ${props => props.theme.spacing.xl};
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
`;

const GameIframe = styled.iframe`
  width: 100%;
  max-width: 1000px;
  height: 700px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.surface};
  box-shadow: ${props => props.theme.shadows.lg};
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: ${props => props.theme.spacing.lg};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top: 3px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.lg};
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: ${props => props.theme.fontSizes['4xl']};
  opacity: 0.5;
`;

const ErrorText = styled.h3`
  color: ${props => props.theme.colors.error};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ErrorDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  max-width: 500px;
`;

const GameDetails = styled.div`
  background: ${props => props.theme.colors.surface};
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.xl};
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const DetailsSection = styled.div`
  h3 {
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.md};
    font-size: ${props => props.theme.fontSizes.lg};
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const SpecList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const SpecItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const SpecLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const SpecValue = styled.span`
  color: ${props => props.theme.colors.text};
`;

const GamePlayer = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGame();
  }, [gameId]);

  const loadGame = async () => {
    try {
      setLoading(true);
      setError(null);
      const gameData = await gamesService.getGame(gameId);
      setGame(gameData);
    } catch (error) {
      console.error('Failed to load game:', error);
      setError(error.message || 'Failed to load game');
      toast.error('Failed to load game');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (game) {
      window.open(game.downloadUrl, '_blank');
    }
  };

  const handleFullscreen = () => {
    if (game) {
      window.open(game.playUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <PlayerContainer>
        <PlayerHeader>
          <BackLink to="/games">← Back to Games</BackLink>
        </PlayerHeader>
        <LoadingState>
          <LoadingSpinner />
          <LoadingText>Loading game...</LoadingText>
        </LoadingState>
      </PlayerContainer>
    );
  }

  if (error || !game) {
    return (
      <PlayerContainer>
        <PlayerHeader>
          <BackLink to="/games">← Back to Games</BackLink>
        </PlayerHeader>
        <ErrorState>
          <ErrorIcon>🎮</ErrorIcon>
          <ErrorText>Game Not Found</ErrorText>
          <ErrorDescription>
            The game you're looking for doesn't exist or couldn't be loaded.
            Please check the URL and try again.
          </ErrorDescription>
          <ActionButton as={Link} to="/games" primary>
            Back to Games
          </ActionButton>
        </ErrorState>
      </PlayerContainer>
    );
  }

  return (
    <PlayerContainer>
      <PlayerHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BackLink to="/games">← Back to Games</BackLink>
          <GameInfo>
            <GameTitle>{game.title}</GameTitle>
            <GameMeta>
              <MetaTag>{game.genre}</MetaTag>
              <MetaTag>{game.dimension}</MetaTag>
              <span>Created: {formatDate(game.createdAt)}</span>
            </GameMeta>
          </GameInfo>
        </div>
        
        <HeaderActions>
          <ActionButton onClick={handleFullscreen}>
            Open Fullscreen
          </ActionButton>
          <ActionButton onClick={handleDownload} primary>
            Download
          </ActionButton>
        </HeaderActions>
      </PlayerHeader>

      <GameFrame>
        <GameIframe
          src={game.playUrl}
          title={game.title}
          frameBorder="0"
          allowFullScreen
        />
      </GameFrame>

      {game.specification && (
        <GameDetails>
          <DetailsSection>
            <h3>About This Game</h3>
            <p>{game.specification.story?.premise || 'No description available.'}</p>
            
            {game.specification.coreGameplay && (
              <>
                <h3>Gameplay</h3>
                <p>{game.specification.coreGameplay.objectives}</p>
              </>
            )}
          </DetailsSection>

          <DetailsSection>
            <h3>Game Details</h3>
            <SpecList>
              <SpecItem>
                <SpecLabel>Genre</SpecLabel>
                <SpecValue>{game.specification.genre}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Dimension</SpecLabel>
                <SpecValue>{game.specification.dimension}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Art Style</SpecLabel>
                <SpecValue>{game.specification.artStyle}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Target Audience</SpecLabel>
                <SpecValue>{game.specification.targetAudience}</SpecValue>
              </SpecItem>
              {game.specification.technical?.platform && (
                <SpecItem>
                  <SpecLabel>Platforms</SpecLabel>
                  <SpecValue>{game.specification.technical.platform.join(', ')}</SpecValue>
                </SpecItem>
              )}
            </SpecList>
          </DetailsSection>
        </GameDetails>
      )}
    </PlayerContainer>
  );
};

export default GamePlayer;