import { createContext, useState, useEffect } from 'react';
import { Snackbar, SnackbarContent } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { green, red } from '@mui/material/colors';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []);
  const [modalState, setModalState] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'right',
    messageType: 'add',
  });

  const addToCart = (item) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.id === item.id);
    if (isItemInCart) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
   
    }
    setModalState({ ...modalState, open: true, messageType: 'add' });
  };

  const removeFromCart = (item) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.id === item.id);

    if (isItemInCart.quantity === 1) {
      setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));
    } else {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    }
    setModalState({ ...modalState, open: true, messageType: 'delete' });
  };

  const removeItemFromCart = (item) => {
    setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));
    setModalState({ ...modalState, open: true, messageType: 'delete' });

  };

  const handleCloseModal = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setModalState({ ...modalState, open: false });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      setCartItems(JSON.parse(cartItems));
    }
  }, []);

  const { vertical, horizontal, open, messageType } = modalState;

  const getMessageContent = () => {
    if (messageType === 'add') {
      return (
        <SnackbarContent
          message={
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon style={{ color: green[600], marginRight: 8 }} />
              Item added to cart
            </span>
          }
        />
      );
    } else {
      return (
        <SnackbarContent
          message={
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <DeleteIcon style={{ color: red[600], marginRight: 8 }} />
              Item removed from cart
            </span>
          }
        />
      );
    }
  };
 
   const cartItemsCount = cartItems.length
    
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartItemsCount,
        getCartTotal,
        removeItemFromCart,
        modalState,
        handleCloseModal,
      }}
    >
      {children}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleCloseModal}
        key={vertical + horizontal}
        autoHideDuration={3000} 
      >
        {getMessageContent()}
      </Snackbar>
    </CartContext.Provider>
  );
};
