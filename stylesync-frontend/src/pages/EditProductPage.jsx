import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export function EditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${productId}`);
        setProductData({
          name: response.data.name,
          description: response.data.description,
          price: response.data.price,
          category: response.data.category,
        });
      } catch (err) {
        setError('Não foi possível carregar os dados do produto.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/products/${productId}`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Produto atualizado com sucesso!');
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err) {
      setError('Falha ao atualizar o produto. Tente novamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5"><Spinner animation="border" /></div>;
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header as="h2" className="h4">Editar Produto</Card.Header>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Produto</Form.Label>
                  <Form.Control type="text" name="name" value={productData.name} onChange={handleChange} required />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control type="text" name="category" value={productData.category} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={productData.description} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Preço (ex: 189.90)</Form.Label>
                  <Form.Control type="number" step="0.01" name="price" value={productData.price} onChange={handleChange} required />
                </Form.Group>
                
                <div className="d-flex justify-content-between">
                  <Button variant="warning" type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                  <Button variant="outline-secondary" onClick={() => navigate('/admin')}>
                    Cancelar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}