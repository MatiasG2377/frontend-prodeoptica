export async function fetchProductos() {
  const res = await fetch("http://127.0.0.1:8000/api/productos/");
  const data = await res.json();
  return Array.isArray(data) ? data : data.results;
}

export async function fetchProveedores() {
  const res = await fetch("http://127.0.0.1:8000/api/proveedores/");
  return await res.json();
}

export async function updateProducto(id, productoActualizado) {
  return await fetch(`http://127.0.0.1:8000/api/productos/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productoActualizado),
  });
}

export async function registrarMovimiento(data) {
  return await fetch("http://127.0.0.1:8000/api/movimiento/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function registrarKardex(data) {
  return await fetch("http://127.0.0.1:8000/api/kardex/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function buscarProductos(term) {
  const res = await fetch(
    `http://127.0.0.1:8000/api/productos/buscar/?q=${term}`
  );
  return await res.json();
}
