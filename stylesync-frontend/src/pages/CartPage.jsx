import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import { Container, Button, Card, Row, Col, Image, Stack, CloseButton } from 'react-bootstrap';

export function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <Container className="text-center py-5">
        <h2 className="h3">Seu carrinho está vazio.</h2>
        <p className="text-muted">Que tal dar uma olhada nos nossos lançamentos?</p>
        <Link to="/shop"><Button variant="warning">Ver Produtos</Button></Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Meu Carrinho</h2>
      {cartItems.map((item) => (
        <Card key={`${item.id}-${item.size}`} className="mb-3"> 
          <Card.Body>
            <Row className="align-items-center">
              <Col xs={3} md={2}>
                <Image src={item.imageUrls[0]} alt={item.name} fluid rounded />
              </Col>
              <Col xs={5} md={6}>
                <h5 className="mb-1">{item.name}</h5>
                <small className="text-muted d-block">Tamanho: {item.size}</small>
                
                <Stack direction="horizontal" gap={2} className="align-items-center mt-2">
                  <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>-</Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>+</Button>
                  <CloseButton onClick={() => removeFromCart(item.id, item.size)} className="ms-3" />
                </Stack>
              </Col>
              <Col xs={4} md={4} className="text-end fw-bold fs-5">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
      <div className="text-end mt-4">
        <h3 className="h4">
          Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
        </h3>
        <div className="mt-4">
          <Link to="/shop"><Button variant="outline-secondary" className="me-2">Continuar Comprando</Button></Link>
          <Link to="/checkout">
            <Button variant="warning">Finalizar Compra</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}