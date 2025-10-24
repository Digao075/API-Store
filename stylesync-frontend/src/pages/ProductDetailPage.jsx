import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 
import { CartContext } from '../context/CartContext.jsx';
import {
  PageWrapper,
  ProductContainer,
  ImageWrapper,
  ProductImage,
  ArrowButton,
  ThumbnailContainer,
  ThumbnailImage,
  InfoWrapper,
  ProductName,
  ProductDescription,
  ProductPrice,
  SizeSelectorContainer,
  SizeButton,
  AddToCartButton
} from './ProductDetailPage.styles';
import { Spinner, Alert, Button } from 'react-bootstrap';

const SIZES = ['P', 'M', 'G', 'XG'];

export function ProductDetailPage() {
  const { productId } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const apiUrl = `http://localhost:3333/api/products/${productId}`;
    async function fetchProductDetails() {
      try {
        setLoading(true);
        const response = await axios.get(apiUrl);
        setProduct(response.data);
      } catch (err) {
        setError('Ops! Produto não encontrado.');
      } finally {
        setLoading(false);
      }
    }
    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor, selecione um tamanho.');
      return;
    }
    addToCart({ ...product, size: selectedSize });
        alert('Produto adicionado ao carrinho!');
  };

  const handleNextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => (prev + 1) % product.imageUrls.length);
  };

  const handlePrevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
  };
  
  if (loading || !product) {
    if (loading) return <div className="d-flex justify-content-center py-5"><Spinner animation="border" /></div>;
    return (
      <div className="text-center py-5">
        <Alert variant="danger">{error || 'Produto não encontrado.'}</Alert>
        <Link to="/shop"><Button variant="primary">Voltar para a Vitrine</Button></Link>
      </div>
    );
  }

  return (
    <PageWrapper>
      <ProductContainer>
        <ImageWrapper>
          {product.imageUrls.length > 1 && (
            <>
              <ArrowButton direction="left" onClick={handlePrevImage}>
                <FaChevronLeft />
              </ArrowButton>
              <ArrowButton direction="right" onClick={handleNextImage}>
                <FaChevronRight />
              </ArrowButton>
            </>
          )}
          
          <ProductImage src={product.imageUrls[currentImageIndex]} alt={`${product.name} - imagem ${currentImageIndex + 1}`} />
          
          {product.imageUrls.length > 1 && (
            <ThumbnailContainer>
              {product.imageUrls.map((url, index) => (
                <ThumbnailImage
                  key={index}
                  src={url}
                  alt={`Miniatura ${index + 1}`}
                  $isActive={index === currentImageIndex}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </ThumbnailContainer>
          )}
        </ImageWrapper>

        <InfoWrapper>
          <ProductName>{product.name}</ProductName>
          <ProductDescription>{product.description}</ProductDescription>
          <ProductPrice>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </ProductPrice>
          <SizeSelectorContainer>
            <p>Tamanho:</p>
            <div>
              {SIZES.map(size => (
                <SizeButton
                  key={size}
                  $isSelected={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </SizeButton>
              ))}
            </div>
          </SizeSelectorContainer>
          <AddToCartButton onClick={handleAddToCart}>
            Adicionar ao Carrinho
          </AddToCartButton>
        </InfoWrapper>
      </ProductContainer>
    </PageWrapper>
  );
}