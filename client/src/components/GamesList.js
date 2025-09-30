import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { gamesService, formatDate } from '../services/api';

const GamesContainer = styled.div`
  min-height: 100vh;
  padding: ${props => props.theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const GamesHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const GamesTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes['3xl']};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
`;

const GamesSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.lg};
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-top: ${props => props.theme.spacing.xl};
`;

const GameCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  overflow: hidden;
  transition: all ${props => props.theme.animations.normal};
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary}40;
  }
`;

const GameHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}20, ${props => props.theme.colors.accent}20);
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const GameTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
`;

const GameMeta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
`;

const MetaTag = styled.span`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: 12px;
  font-size: ${props => props.theme.fontSizes.xs};
  border: 1px solid ${props => props.theme.colors.primary}40;
`;

const GameBody = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const GameDate = styled.div`
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const GameActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
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
  font-size: ${props => props.theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast};

  &:hover {
    background: ${props => props.primary ? 
      `linear-gradient(45deg, ${props.theme.colors.primaryDark}, ${props.theme.colors.accent})` : 
      props.theme.colors.primary + '20'
    };
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['4xl']};
  color: ${props => props.theme.colors.textMuted};
`;

const EmptyIcon = styled.div`
  font-size: ${props => props.theme.fontSizes['5xl']};
  margin-bottom: ${props => props.theme.spacing.lg};
  opacity: 0.5;
`;

const EmptyText = styled.h3`
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textSecondary};
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  color: ${props => props.theme.colors.background};
  text-decoration: none;
  font-weight: bold;
  border-radius: 12px;
  transition: all ${props => props.theme.animations.normal};
  margin-top: ${props => props.theme.spacing.lg};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing['4xl']};
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid ${props => props.theme.colors.border};
    border-top: 3px solid ${props => props.theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const GamesList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState(new Set());

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const response = await gamesService.listGames();
      setGames(response.games || []);
    } catch (error) {
      console.error('Failed to load games:', error);
      toast.error('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (gameId) => {
    window.open(`/api/games/${gameId}/play`, '_blank');
  };

  const handleDownload = (gameId) => {
    window.open(`/api/games/${gameId}/download`, '_blank');
  };

  const handleDelete = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingIds(prev => new Set([...prev, gameId]));
      await gamesService.deleteGame(gameId);
      setGames(prev => prev.filter(game => game.gameId !== gameId));
      toast.success('Game deleted successfully');
    } catch (error) {
      console.error('Failed to delete game:', error);
      toast.error('Failed to delete game');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(gameId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <GamesContainer>
        <LoadingSpinner>
          <div className="spinner" />
        </LoadingSpinner>
      </GamesContainer>
    );
  }

  return (
    <GamesContainer>
      <GamesHeader>
        <GamesTitle>My Games</GamesTitle>
        <GamesSubtitle>
          {games.length > 0 
            ? `You have created ${games.length} game${games.length === 1 ? '' : 's'}`
            : 'No games created yet'
          }
        </GamesSubtitle>
      </GamesHeader>

      {games.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🎮</EmptyIcon>
          <EmptyText>No games created yet</EmptyText>
          <p>Start building your first game with our AI-powered game builder!</p>
          <CTAButton to="/build">Create Your First Game</CTAButton>
        </EmptyState>
      ) : (
        <GamesGrid>
          {games.map((game) => (
            <GameCard key={game.gameId}>
              <GameHeader>
                <GameTitle>{game.title}</GameTitle>
                <GameMeta>
                  <MetaTag>{game.genre}</MetaTag>
                  <MetaTag>{game.dimension}</MetaTag>
                </GameMeta>
              </GameHeader>
              
              <GameBody>
                <GameDate>
                  Created: {formatDate(game.createdAt)}
                </GameDate>
                
                <GameActions>
                  <ActionButton 
                    primary 
                    onClick={() => handlePlay(game.gameId)}
                  >
                    Play
                  </ActionButton>
                  
                  <ActionButton onClick={() => handleDownload(game.gameId)}>
                    Download
                  </ActionButton>
                  
                  <ActionButton 
                    onClick={() => handleDelete(game.gameId)}
                    disabled={deletingIds.has(game.gameId)}
                    style={{ 
                      borderColor: '#ff6b6b40', 
                      color: '#ff6b6b',
                      marginLeft: 'auto'
                    }}
                  >
                    {deletingIds.has(game.gameId) ? 'Deleting...' : 'Delete'}
                  </ActionButton>
                </GameActions>
              </GameBody>
            </GameCard>
          ))}
        </GamesGrid>
      )}
    </GamesContainer>
  );
};

export default GamesList;