// utils/cartHelpers.js
export function calculateTotal(cart) {
    return cart
      .reduce((total, item) => total + (parseFloat(item.pvp_producto) * item.cantidad) - (parseFloat(item.descuento) || 0), 0)
      .toFixed(2);
  }
  