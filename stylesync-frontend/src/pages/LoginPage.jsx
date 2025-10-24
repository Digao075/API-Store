
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

export function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');


    const success = await login(email, password); 

    if (success) {
      navigate('/admin');
    } else {
      setError('Credenciais inválidas. Por favor, tente novamente.');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow-sm">
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">Login</h3>
          <Form onSubmit={handleLogin}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="seu@email.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className="d-grid">
              <Button variant="warning" type="submit">
                Entrar
              </Button>
            </div>
            <div className="text-center mt-3">
  <small>Não tem uma conta? <Link to="/register">Cadastre-se</Link></small>
</div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}