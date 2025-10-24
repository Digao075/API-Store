
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

export const NavContainer = styled.header`
  background-color: #000000ff; /* A cor 'dark' do Bootstrap */
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NavWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LogoLink = styled(RouterLink)`
  display: flex;
  align-items: center;
  padding: 5px;
`;

export const LogoImage = styled.img`
  height: 70px; // Controle o tamanho da sua logo aqui
`;

export const NavLinksContainer = styled.nav`
  display: flex;

  gap: 1.5rem;
`;

export const NavLink = styled(RouterLink)`
  color: white;
  text-decoration: none;
  padding: 10px;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 5px;
  transition: color 0.2s ease-in-out;
  margin-right: 15px;
  

  &:hover {
    color: #f0ad4e; // Laranja ao passar o mouse
  }
`;