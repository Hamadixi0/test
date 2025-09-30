import React from 'react';
import styled from 'styled-components';

const PreviewCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: ${props => props.theme.spacing.lg};
  max-height: 400px;
  overflow-y: auto;
`;

const PreviewTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSizes.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const PreviewIcon = styled.span`
  font-size: ${props => props.theme.fontSizes.xl};
`;

const GameTitle = styled.h4`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const GameDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 500;
`;

const DetailValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.sm};
  text-align: right;
  max-width: 60%;
  word-break: break-word;
`;

const Section = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const SectionTitle = styled.h5`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
  margin-top: ${props => props.theme.spacing.xs};
`;

const Tag = styled.span`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: 12px;
  font-size: ${props => props.theme.fontSizes.xs};
  border: 1px solid ${props => props.theme.colors.primary}40;
`;

const Description = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
  line-height: 1.5;
  margin-top: ${props => props.theme.spacing.sm};
`;

const GamePreview = ({ gameSpec }) => {
  if (!gameSpec) return null;

  const renderArray = (arr) => {
    if (!arr || !Array.isArray(arr)) return 'None specified';
    return arr.join(', ');
  };

  return (
    <PreviewCard>
      <PreviewTitle>
        <PreviewIcon>🎮</PreviewIcon>
        Game Preview
      </PreviewTitle>
      
      <GameTitle>{gameSpec.title || 'Untitled Game'}</GameTitle>
      
      <GameDetails>
        <DetailRow>
          <DetailLabel>Genre</DetailLabel>
          <DetailValue>{gameSpec.genre || 'Not specified'}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Dimension</DetailLabel>
          <DetailValue>{gameSpec.dimension || 'Not specified'}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Art Style</DetailLabel>
          <DetailValue>{gameSpec.artStyle || 'Not specified'}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Target Audience</DetailLabel>
          <DetailValue>{gameSpec.targetAudience || 'Not specified'}</DetailValue>
        </DetailRow>
      </GameDetails>

      {gameSpec.coreGameplay && (
        <Section>
          <SectionTitle>Core Gameplay</SectionTitle>
          <Description>
            {gameSpec.coreGameplay.objectives || 'No objectives specified'}
          </Description>
          {gameSpec.coreGameplay.mechanics && (
            <TagContainer>
              {gameSpec.coreGameplay.mechanics.map((mechanic, index) => (
                <Tag key={index}>{mechanic}</Tag>
              ))}
            </TagContainer>
          )}
        </Section>
      )}

      {gameSpec.story && (
        <Section>
          <SectionTitle>Story</SectionTitle>
          <Description>
            {gameSpec.story.premise || 'No story premise provided'}
          </Description>
          {gameSpec.story.mainCharacter && (
            <DetailRow>
              <DetailLabel>Main Character</DetailLabel>
              <DetailValue>{gameSpec.story.mainCharacter}</DetailValue>
            </DetailRow>
          )}
          {gameSpec.story.setting && (
            <DetailRow>
              <DetailLabel>Setting</DetailLabel>
              <DetailValue>{gameSpec.story.setting}</DetailValue>
            </DetailRow>
          )}
        </Section>
      )}

      {gameSpec.technical && (
        <Section>
          <SectionTitle>Technical Details</SectionTitle>
          <DetailRow>
            <DetailLabel>Platform</DetailLabel>
            <DetailValue>{renderArray(gameSpec.technical.platform)}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Engine</DetailLabel>
            <DetailValue>{gameSpec.technical.engine || 'HTML5 Canvas'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Resolution</DetailLabel>
            <DetailValue>{gameSpec.technical.resolution || '800x600'}</DetailValue>
          </DetailRow>
        </Section>
      )}

      {gameSpec.levels && gameSpec.levels.length > 0 && (
        <Section>
          <SectionTitle>Levels ({gameSpec.levels.length})</SectionTitle>
          {gameSpec.levels.slice(0, 3).map((level, index) => (
            <DetailRow key={index}>
              <DetailLabel>{level.name || `Level ${index + 1}`}</DetailLabel>
              <DetailValue>{level.description || 'No description'}</DetailValue>
            </DetailRow>
          ))}
          {gameSpec.levels.length > 3 && (
            <Description>
              ...and {gameSpec.levels.length - 3} more levels
            </Description>
          )}
        </Section>
      )}

      {gameSpec.assets && (
        <Section>
          <SectionTitle>Assets</SectionTitle>
          {gameSpec.assets.sprites && gameSpec.assets.sprites.length > 0 && (
            <DetailRow>
              <DetailLabel>Sprites</DetailLabel>
              <DetailValue>{gameSpec.assets.sprites.length} required</DetailValue>
            </DetailRow>
          )}
          {gameSpec.assets.sounds && gameSpec.assets.sounds.length > 0 && (
            <DetailRow>
              <DetailLabel>Sounds</DetailLabel>
              <DetailValue>{gameSpec.assets.sounds.length} required</DetailValue>
            </DetailRow>
          )}
          {gameSpec.assets.music && gameSpec.assets.music.length > 0 && (
            <DetailRow>
              <DetailLabel>Music</DetailLabel>
              <DetailValue>{gameSpec.assets.music.length} tracks</DetailValue>
            </DetailRow>
          )}
        </Section>
      )}
    </PreviewCard>
  );
};

export default GamePreview;