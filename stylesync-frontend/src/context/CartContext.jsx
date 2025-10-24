import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('stylesync_cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('stylesync_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- FUNÇÕES DE MANIPULAÇÃO DO CARRINHO ---

  function addToCart(product) { 
    setCartItems(prevState => {
      const existingItem = prevState.find(item => 
        item.id === product.id && item.size === product.size
      );

      if (existingItem) {
        return prevState.map(item =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevState, { ...product, quantity: 1 }];
      }
    });
    console.log("Produto adicionado ao carrinho:", product);
  }

  function removeFromCart(productId, productSize) {
    setCartItems(prevState => prevState.filter(item => 
      !(item.id === productId && item.size === productSize)
    ));
  }

  function updateQuantity(productId, productSize, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(productId, productSize);
    } else {
      setCartItems(prevState => 
        prevState.map(item => 
          item.id === productId && item.size === productSize 
            ? { ...item, quantity: newQuantity } 
            : item
        )
      );
    }
  }
  
  function clearCart() {
    setCartItems([]);
  }

  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      totalItemsInCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}