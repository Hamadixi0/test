import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.xl};
`;

const Logo = styled(Link)`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};

  &:hover {
    color: ${props => props.theme.colors.primaryDark};
  }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: ${props => props.theme.colors.background};
`;

const Nav = styled.nav`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
`;

const NavLink = styled(Link)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: 8px;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  text-decoration: none;
  font-weight: 500;
  transition: all ${props => props.theme.animations.fast};
  border: 1px solid transparent;

  &:hover {
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary}40;
    background: ${props => props.theme.colors.primary}10;
  }

  ${props => props.active && `
    color: ${props.theme.colors.primary};
    background: ${props.theme.colors.primary}20;
    border-color: ${props.theme.colors.primary}40;
  `}
`;

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <HeaderContainer>
      <Logo to="/">
        <LogoIcon>AI</LogoIcon>
        Game Builder
      </Logo>
      <Nav>
        <NavLink to="/" active={isActive('/')}>
          Home
        </NavLink>
        <NavLink to="/build" active={isActive('/build')}>
          Build Game
        </NavLink>
        <NavLink to="/games" active={isActive('/games')}>
          My Games
        </NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;