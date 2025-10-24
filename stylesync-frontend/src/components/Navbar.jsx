
import { Link as RouterLink } from 'react-router-dom';
import { useContext } from 'react';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { Navbar as BootstrapNavbar, Nav, Container, Image, Badge } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';

import {
  NavContainer,
  NavWrapper,
  LogoLink,
  LogoImage,
  NavLinksContainer,
  NavLink
} from './Navbar.styles';
import logo from '../assets/logo-png.png';

export function Navbar() {
  return (
    <NavContainer>
      <NavWrapper>

          <NavLinksContainer>
          <NavLink to="#">
            <FaSearch size={22} />
          </NavLink>
          </NavLinksContainer>

        <LogoLink to="/">
          <LogoImage src={logo} alt="GT Surf Logo" />
        </LogoLink>          
        <NavLinksContainer>
          <NavLink to="/cart">
            <FaShoppingCart size={22} />
          </NavLink>
        </NavLinksContainer>
      </NavWrapper>
    </NavContainer>
  );
  const { totalItemsInCart } = useContext(CartContext);
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand={false} className="shadow-sm py-3">
      <Container fluid className="px-4">
        {/* ... (código do menu e da logo) */}
        <Nav className="d-flex flex-row align-items-center">
          <Nav.Link href="#search" className="p-0 me-3">
            <FaSearch size={22} color="white" />
          </Nav.Link>
          <Nav.Link as={RouterLink} to="/cart" className="p-0 position-relative">
            <FaShoppingCart size={22} color="white" />
            {/* 5. Renderiza o Badge apenas se houver itens no carrinho */}
            {totalItemsInCart > 0 && (
              <Badge 
                pill 
                bg="warning" 
                className="position-absolute top-0 start-100 translate-middle"
                style={{ fontSize: '0.6em', padding: '0.3em 0.5em' }}
              >
                {totalItemsInCart}
              </Badge>
            )}
          </Nav.Link>
        </Nav>
        {/* ... (código do Offcanvas) */}
      </Container>
    </BootstrapNavbar>
  );
}