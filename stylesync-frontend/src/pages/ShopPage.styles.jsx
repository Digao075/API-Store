// src/pages/ShopPage.styles.js
import styled from 'styled-components';

export const PageContainer = styled.div`
  background-color: #f8f9fa; /* Um cinza bem claro para o fundo */
  min-height: calc(100vh - 76px); // Altura da tela menos a Navbar
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  padding: 2.5rem 1rem 0; // Mais espaço no topo
`;

export const ProductGrid = styled.div`
  display: grid;
  // A mágica da responsividade: cria colunas que se ajustam automaticamente
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
  padding: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;

  // Ajuste para telas menores
  @media (max-width: 600px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
`;