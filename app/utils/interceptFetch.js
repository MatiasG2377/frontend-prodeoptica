// app/utils/interceptFetch.js
import Swal from "sweetalert2";

export function interceptarFetchConLogout() {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const token = localStorage.getItem("access_token");

    let [resource, config] = args;
    config = config || {};

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await originalFetch(resource, config);

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("access_token");

      await Swal.fire({
        icon: "warning",
        title: "Sesión expirada",
        text: "Por favor, vuelve a iniciar sesión.",
        confirmButtonColor: "#7d2a3f",
        confirmButtonText: "Ir al login",
      });

      window.location.href = "/login";
      return new Response(null, { status: 401 });
    }

    return response;
  };
}
