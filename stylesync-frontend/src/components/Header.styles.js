export const IconWrapper = styled.div`
  position: relative;
  cursor: pointer;
  color: white;
  font-size: 1.5rem; 


  ${props => props.$isText && `
    font-size: 1rem;
    font-weight: 500;
    cursor: default;
  `}

  &:hover {
    color: #f0ad4e; //
  }
`;