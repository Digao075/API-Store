import styled from 'styled-components';

export const PageWrapper = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

export const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr; // Uma coluna em telas pequenas
  gap: 2rem;

  @media (min-width: 768px) { // Duas colunas em telas maiores (tablets/desktops)
    grid-template-columns: 1fr 1fr;
  }
`;

export const ImageWrapper = styled.div`
  width: 100%;
  position: relative; // Essencial para posicionar as setas
`;

export const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 10;
  transition: background-color 0.2s;

  &:hover {
    background-color: white;
  }

  // Posiciona a seta da esquerda e da direita
  ${props => props.direction === 'left' ? 'left: 10px;' : 'right: 10px;'}
`;

export const ThumbnailContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 1rem;
  flex-wrap: wrap; // Permite que as miniaturas quebrem a linha se necessário
`;

export const ThumbnailImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
border: 2px solid ${props => props.$isActive ? '#f0ad4e' : 'transparent'};
  transition: border-color 0.2s;
`;

export const ProductImage = styled.img`
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ProductName = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
`;

export const ProductDescription = styled.p`
  font-size: 1.1rem;
  color: #6c757d; // Cinza sutil
  line-height: 1.6;
  margin-bottom: 2rem;
`;

export const ProductPrice = styled.p`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;

export const SizeSelectorContainer = styled.div`
  margin-bottom: 2rem;
  
  p {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
`;

export const SizeButton = styled.button`
  background-color: ${props => props.$isSelected ? '#D65A31' : 'white'};
  color: ${props => props.$isSelected ? 'white' : '#212529'};
  border: 1px solid #1a1514ff;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #D65A31;
    color: white;
  }
`;

export const AddToCartButton = styled.button`
  background-color: #D65A31; 
  color: #ffff;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: 100%;

  &:hover {
    opacity: 0.9;
    box-shadow: 0 4px 15px rgba(240, 173, 78, 0.4);
  }
`;