import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 1. Importa o cérebro da autenticação
import { CartContext } from '../context/CartContext'; // 2. Importa o cérebro do carrinho
import { 
  HeaderContainer, 
  Logo, 
  NavIcons, 
  IconWrapper, 
  CartBadge 
} from './Header.styles';
import { FaUserCircle, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';

export function Header() {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext); 
  const { totalItemsInCart } = useContext(CartContext);

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <HeaderContainer>
      <Link to="/">
        <Logo src="/logo-gtsurf.png" alt="GT Surf Logo" />
      </Link>
      
      <NavIcons>
        {user ? (
          <>
            <IconWrapper as="div" $isText={true}>
              Olá, {user.name.split(' ')[0]} 
            </IconWrapper>
            <IconWrapper onClick={handleLogout} title="Sair">
              <FaSignOutAlt />
            </IconWrapper>
          </>
        ) : (
          <IconWrapper as={Link} to="/login" title="Login / Cadastrar">
            <FaUserCircle />
          </IconWrapper>
        )}
        
        <IconWrapper as={Link} to="/cart" title="Carrinho">
          <FaShoppingCart />
          {totalItemsInCart > 0 && (
            <CartBadge>{totalItemsInCart}</CartBadge>
          )}
        </IconWrapper>
      </NavIcons>
    </HeaderContainer>
  );
}