import { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert, Row, Col, Table, Spinner, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await axios.get('${import.meta.env.VITE_API_URL}/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Não foi possível carregar a lista de produtos.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      setError('Por favor, selecione pelo menos uma imagem.');
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const uploadPromises = Array.from(imageFiles).map(file => {
        const formData = new FormData();
        formData.append('image', file);
        return axios.post('${import.meta.env.VITE_API_URL}/api/upload', formData);
      });
      const uploadResponses = await Promise.all(uploadPromises);
      const imageUrls = uploadResponses.map(response => response.data.url);

      const finalProductData = { ...productData, imageUrls };
      await axios.post('${import.meta.env.VITE_API_URL}/api/products', finalProductData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Produto adicionado com sucesso!');
      setProductData({ name: '', description: '', price: '', category: '' });
      setImageFiles([]);
      e.target.reset();
      await fetchProducts();

    } catch (err) {
      setError('Falha ao adicionar o produto. Verifique os dados e tente novamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Você tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.");

    if (confirmDelete) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage("Produto deletado com sucesso!");
        await fetchProducts(); 
      } catch (err) {
        setError("Falha ao deletar o produto. Tente novamente.");
        console.error("Erro ao deletar produto:", err);
      }
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-between align-items-center mb-5">
        <Col>
          <h1 className="h2 fw-bold">Painel do Administrador</h1>
        </Col>
        <Col xs="auto">
          <Button variant="outline-danger" onClick={handleLogout}>Sair</Button>
        </Col>
      </Row>
      
      <Card className="mb-5 shadow-sm">
        <Card.Header as="h3" className="h4">Adicionar Novo Produto</Card.Header>
        <Card.Body>
          {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Produto</Form.Label>
                  <Form.Control type="text" name="name" value={productData.name} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control type="text" name="category" value={productData.category} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={productData.description} onChange={handleChange} required />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Preço (ex: 189.90)</Form.Label>
                  <Form.Control type="number" step="0.01" name="price" value={productData.price} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fotos do Produto</Form.Label>
                  <Form.Control 
                    type="file" 
                    name="images"
                    multiple 
                    onChange={(e) => setImageFiles(e.target.files)}
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Button variant="warning" type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Adicionando...' : 'Adicionar Produto'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <h3 className="h4 mb-4">Produtos Cadastrados</h3>
      {loadingProducts ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</td>
                <td>
               <Button as={Link} to={`/admin/edit-product/${product.id}`}variant="outline-primary" size="sm" className="me-2">Editar</Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Deletar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}