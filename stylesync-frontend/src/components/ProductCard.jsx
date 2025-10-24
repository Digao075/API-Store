// src/components/ProductCard.jsx
import {
  CardWrapper,
  ImageContainer,
  ProductImage,
  ContentWrapper,
  ProductName,
  ProductPrice
} from './ProductCard.styles';

export function ProductCard({ product }) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    <CardWrapper to={`/product/${product.id}`}>
      <ImageContainer>
        <ProductImage src={product.imageUrls && product.imageUrls[0]} alt={product.name} />
      </ImageContainer>
      <ContentWrapper>
        <ProductName>{product.name}</ProductName>
        <ProductPrice>{formattedPrice}</ProductPrice>
      </ContentWrapper>
    </CardWrapper>
  );
}