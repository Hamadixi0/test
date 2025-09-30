import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  background: linear-gradient(135deg, ${props => props.theme.colors.background} 0%, ${props => props.theme.colors.surface} 100%);
`;

const Hero = styled.div`
  max-width: 800px;
  margin-bottom: ${props => props.theme.spacing['4xl']};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes['5xl']};
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.lg};
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xl};
  line-height: 1.6;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  color: ${props => props.theme.colors.background};
  text-decoration: none;
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.lg};
  border-radius: 12px;
  transition: all ${props => props.theme.animations.normal};
  box-shadow: ${props => props.theme.shadows.lg};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.xl};
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  max-width: 1200px;
  width: 100%;
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: ${props => props.theme.spacing.xl};
  text-align: left;
  transition: all ${props => props.theme.animations.normal};

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}20, ${props => props.theme.colors.accent}20);
  border: 2px solid ${props => props.theme.colors.primary}40;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSizes['2xl']};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const Home = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Creation',
      description: 'Create complete games through natural conversation. Our AI guides you through every step from concept to completion.'
    },
    {
      icon: '🎮',
      title: 'Multiple Dimensions',
      description: 'Build 2D, 2.5D, or 3D games with various genres including RPG, Platformer, Puzzle, Action, and Strategy games.'
    },
    {
      icon: '🎨',
      title: 'Complete Asset Generation',
      description: 'Generate game code, maps, assets, story, and UI elements. Everything you need for a playable game.'
    },
    {
      icon: '📱',
      title: 'Multi-Platform Export',
      description: 'Export your games for Web, PC, and Mobile platforms with optimized builds for each target.'
    },
    {
      icon: '☁️',
      title: 'Cloud Storage',
      description: 'Save your projects to cloud storage and sync across devices. Never lose your creative work.'
    },
    {
      icon: '🔗',
      title: 'GitHub Integration',
      description: 'Push your games directly to GitHub repositories with OAuth integration. Share and collaborate easily.'
    }
  ];

  return (
    <HomeContainer>
      <Hero>
        <Title>Create Games Through Conversation</Title>
        <Subtitle>
          The revolutionary AI Game Builder that lets you create full 2D, 2.5D, or 3D games 
          just by chatting. No coding experience required.
        </Subtitle>
        <CTAButton to="/build">Start Building Your Game</CTAButton>
      </Hero>

      <Features>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </Features>
    </HomeContainer>
  );
};

export default Home;