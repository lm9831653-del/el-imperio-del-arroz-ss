/* =========================================================
   El Imperio del Arroz S&S — script.js
   Animaciones al hacer scroll + carrito compartido entre
   menu.html y domicilio.html (usando localStorage)
   ========================================================= */

/* ---------- Animación de aparición al hacer scroll ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const animEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && animEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    animEls.forEach((el) => obs.observe(el));
  } else {
    animEls.forEach((el) => el.classList.add('reveal--visible'));
  }

  actualizarBadgeCarrito();
});

/* ---------- Carrito de pedido compartido ---------- */
const CARRITO_KEY = 'imperioCarrito';

function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CARRITO_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

function agregarAlCarrito(cat, nombre, cantidad) {
  cantidad = cantidad || 1;
  const carrito = obtenerCarrito();
  const key = cat + '|' + nombre;
  carrito[key] = (carrito[key] || 0) + cantidad;
  guardarCarrito(carrito);
  return carrito[key];
}

function totalItemsCarrito() {
  const carrito = obtenerCarrito();
  return Object.values(carrito).reduce((a, b) => a + b, 0);
}

function actualizarBadgeCarrito() {
  const badges = document.querySelectorAll('.carrito-badge');
  if (!badges.length) return;
  const total = totalItemsCarrito();
  badges.forEach((badge) => {
    badge.textContent = String(total);
    badge.style.display = total > 0 ? 'flex' : 'none';
  });
}

/* ---------- Botones "Agregar" del menú ----------
   Cada botón .btn-agregar trae data-cat y data-nombre.
   Al hacer clic: se guarda en el carrito y se muestra una
   animación antes de ir a la página de domicilio. */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-agregar');
  if (!btn) return;
  e.preventDefault();

  const cat = btn.dataset.cat;
  const nombre = btn.dataset.nombre;
  if (!cat || !nombre) return;

  agregarAlCarrito(cat, nombre, 1);
  actualizarBadgeCarrito();

  if (!btn.dataset.textoOriginal) btn.dataset.textoOriginal = btn.textContent;
  btn.classList.add('btn-agregar--ok');
  btn.textContent = '¡Agregado! ✓';

  setTimeout(() => {
    window.location.href = 'domicilio.html';
  }, 550);
});
