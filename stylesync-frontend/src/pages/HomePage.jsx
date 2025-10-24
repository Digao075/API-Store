import { Container } from 'react-bootstrap';

import { HeroContainer, StyledHeroButton } from './HomePage.styles';

export function HomePage() {

  
  return (

    <HeroContainer>
      <Container>
        <StyledHeroButton to="/shop">
          Ver Produtos
        </StyledHeroButton>
      </Container>
    </HeroContainer>
  );
}