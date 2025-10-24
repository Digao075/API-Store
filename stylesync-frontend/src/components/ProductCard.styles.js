import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const CardWrapper = styled(Link)`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden; 
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1; 
  overflow: hidden;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; 
`;

export const ContentWrapper = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1; 
`;

export const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProductPrice = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  margin-top: auto; 
`;