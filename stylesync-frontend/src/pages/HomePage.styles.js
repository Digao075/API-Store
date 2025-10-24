
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import heroBackground from '../assets/perfil-insta.png';

export const HeroContainer = styled.div`
  color: white;
  min-height: calc(100vh - 100px); /* 100% da altura da tela menos a altura da Navbar */

  background-image: url(${heroBackground});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  position: relative; /* Necessário para o overlay */


`;
export const StyledHeroButton = styled(Link)` 
  display: inline-block; 
  background-color: #D65A31;
  color: #ffff;
  border: none;
  margin-left: 18%;
  margin-top: 160%;
  border-radius: 50px;
  padding: 0.8rem 2.5rem;
  font-size: 1.25rem;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    background-color: #ec971f;
  }
`;

