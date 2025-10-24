import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext.jsx';
import { Container, Row, Col, Form, Button, Card, ListGroup, Alert } from 'react-bootstrap';

export function CheckoutPage() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3333/api/orders', {
        cartItems,
        customerInfo,
      });


      alert('Pedido realizado com sucesso!');
      clearCart(); 
      navigate('/');
    } catch (err) {
      setError('Não foi possível processar seu pedido. Tente novamente.');
      console.error("Erro no checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Finalizar Compra</h1>
      <Row>
        <Col md={7}>
          <h3 className="mb-4">Informações de Contato e Entrega</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome Completo</Form.Label>
              <Form.Control type="text" name="name" onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Endereço de Entrega</Form.Label>
              <Form.Control type="text" name="address" onChange={handleChange} required />
            </Form.Group>
            <div className="d-grid">
              <Button variant="warning" type="submit" size="lg" disabled={loading}>
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </Button>
            </div>
          </Form>
        </Col>

        <Col md={5}>
          <Card>
            <Card.Header as="h4">Resumo do Pedido</Card.Header>
            <ListGroup variant="flush">
              {cartItems.map(item => (
                <ListGroup.Item key={item.id} className="d-flex justify-content-between">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}</span>
                </ListGroup.Item>
              ))}
              <ListGroup.Item className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}