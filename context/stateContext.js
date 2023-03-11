import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  const incQty = () => {
    setQty(qty + 1);
  };

  const decQty = () => {
    setQty(() => {
      if (qty - 1 < 1) return 1;

      return qty - 1;
    });
  };

  const addToCart = (product, quantity) => {
    const isProductInCart = cartItems.find(item => item._id === product._id);

    setTotalPrice(totalPrice + product.price * quantity);
    setTotalQuantities(totalQuantities + quantity);

    if (isProductInCart) {
      const updatedCartItems = cartItems.map(cartProduct => {
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;

      setCartItems([...cartItems, { ...product }]);
    }

    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  const removeFromCart = product => {
    const productToRemove = cartItems.find(item => item._id === product._id);
    const newCartItems = cartItems.filter(item => item._id !== product._id);

    setTotalPrice(
      totalPrice - productToRemove.price * productToRemove.quantity
    );
    setTotalQuantities(totalQuantities - productToRemove.quantity);
    setCartItems(newCartItems);
  };

  const toggleCartItemQuantity = (id, action) => {
    const productToUpdate = cartItems.find(product => product._id === id);
    const newCartItems = cartItems.filter(product => product._id !== id);

    if (action === 'INC') {
      setCartItems([
        ...newCartItems,
        { ...productToUpdate, quantity: productToUpdate.quantity + 1 },
      ]);

      setTotalPrice(totalPrice + productToUpdate.price);
      setTotalQuantities(totalQuantities + 1);
    } else if (action === 'DEC') {
      if (productToUpdate.quantity > 1) {
        setCartItems([
          ...newCartItems,
          { ...productToUpdate, quantity: productToUpdate.quantity - 1 },
        ]);

        setTotalPrice(totalPrice - productToUpdate.price);
        setTotalQuantities(totalQuantities - 1);
      }
    }
  };

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        setShowCart,
        incQty,
        decQty,
        addToCart,
        toggleCartItemQuantity,
        removeFromCart,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
