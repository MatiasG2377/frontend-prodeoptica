// app/utils/ventaHelpers.js
export function isValidCI(ci) {
  return /^\d{10,}$/.test(ci);
}
export function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export function calculateCartTotal(cart) {
  return cart.reduce(
    (acc, item) => acc + item.pvp_producto * (item.cantidad || 1),
    0
  );
}
