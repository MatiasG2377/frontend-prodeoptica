import { useEffect, useState } from "react";
import Swal from "sweetalert2";

/**
 * Hook que gestiona el carrito de compras.
 *
 * Este hook devuelve un objeto con las siguientes propiedades:
 *
 * - `cart`: Un arreglo de objetos que representan cada producto en el
 *   carrito. Cada objeto tiene las siguientes propiedades:
 *   - `id`: El identificador del producto.
 *   - `nombre_producto`: El nombre del producto.
 *   - `descripcion_producto`: La descripci n del producto.
 *   - `pvp_producto`: El precio de venta del producto.
 *   - `cantidad_producto`: La cantidad disponible del producto.
 *   - `minimo_producto`: La cantidad m nima del producto que se puede
 *     vender.
 *   - `cantidad`: La cantidad del producto en el carrito.
 *
 * - `addToCart`: Una funci n que agrega un producto al carrito. Si el
 *   producto ya est  en el carrito, incrementa su cantidad en 1.
 *
 * - `removeFromCart`: Una funci n que elimina un producto del carrito
 *   seg n su ndice.
 *
 * - `clearCart`: Una funci n que elimina todos los productos del carrito.
 */
export function useCart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  /**
   * Agrega un producto al carrito. Si el producto ya est  en el carrito,
   * incrementa su cantidad en 1. Si el stock del producto es menor o igual
   * a su cantidad m nima, mostrar  un mensaje de alerta.
   *
   *? @param {Object} product - El producto a agregar al carrito.
   *   Debe tener las siguientes propiedades:
   *   - `id`: El identificador del producto.
   *   - `nombre_producto`: El nombre del producto.
   *   - `descripcion_producto`: La descripci n del producto.
   *   - `pvp_producto`: El precio de venta del producto.
   *   - `cantidad_producto`: La cantidad disponible del producto.
   *   - `minimo_producto`: La cantidad m nima del producto que se puede
   *     vender.
   */
  const addToCart = (product) => {
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    // Cuántos ya hay en el carrito de este producto
    const cantidadEnCarrito =
      existingIndex >= 0 ? cart[existingIndex].cantidad : 0;
    const nuevaCantidadTotal = cantidadEnCarrito + 1;

    // Validar si controla stock y estamos alcanzando el stock mínimo
    if (
      product.controla_stock &&
      product.cantidad_producto - nuevaCantidadTotal <= product.minimo_producto
    ) {
      Swal.fire({
        title: "Alerta de stock",
        text: `El producto "${
          product.nombre_producto
        }" está por debajo del stock mínimo (${
          product.minimo_producto
        }). Solo quedan ${
          product.cantidad_producto - cantidadEnCarrito
        } unidades disponibles.`,
        icon: "warning",
        confirmButtonColor: "#712b39",
      });
    }

    // Agregar o actualizar en el carrito
    const newCart =
      existingIndex >= 0
        ? cart.map((item, i) =>
            i === existingIndex
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          )
        : [...cart, { ...product, cantidad: 1 }];

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  /**
   * Elimina un producto del carrito por su ndice.
   *
   *? @param {number} index - El ndice del producto a eliminar del carrito.
   */
  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  /**
   * Limpia el carrito eliminando todos los productos del carrito y
   * remueve el item "cart" del localStorage.
   */
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return { cart, addToCart, removeFromCart, clearCart };
}
