import { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard'; 
import { PageContainer, Title, ProductGrid } from './ShopPage.styles'; 
import { Spinner } from 'react-bootstrap'; 
export function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = '${import.meta.env.VITE_API_URL}/api/products';
    axios.get(apiUrl)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar produtos:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <PageContainer>
      <Title>Lançamentos da Semana🔥</Title>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      )}
    </PageContainer>
  );
}