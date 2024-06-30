import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Inicializa Supabase
const supabase = createClient(
    'https://ogtbjqbvfmnlvkucqutj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ndGJqcWJ2Zm1ubHZrdWNxdXRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzM1NTYyMSwiZXhwIjoyMDMyOTMxNjIxfQ.1uP3YbHw5HSLkoPOVZOjeYhgYZ88fK20S6RWQR_QIIE'
);


async function obtenerDatosProducto(idProducto) {
    try {
      let { data, error } = await supabase
        .from('Productos de Tienda de Comestibles')
        .select('*')
        .eq('id', idProducto)
        .single();
  
      if (error) throw error;
  
      return data;
    } catch (error) {
      console.error('Error al obtener los datos del producto:', error);
      return null;
    }
  }


document.addEventListener('DOMContentLoaded', (event) => {
    // Primero, creamos la base de datos IndexedDB
    let db;
    const request = indexedDB.open("carritoComprasDB", 1);
  
    request.onerror = function(event) {
      console.log("No se pudo abrir la base de datos debido a un error: " + request.error);
    };
  
    request.onsuccess = function(event) {
      db = request.result;
    };
  
    request.onupgradeneeded = function(event) {
      let db = event.target.result;
      let objectStore = db.createObjectStore("productos", { keyPath: "idProducto" });
    };
  
    // Luego, añadimos un producto al carrito cuando se hace clic en el botón
    document.getElementById('btnAddCart').addEventListener('click', function() {
      const idProducto = sessionStorage.getItem('sessionStorageCategoria');
      const cantidad = parseInt(document.getElementById('cantAddCart').value);
  
      let transaction = db.transaction(["productos"], "readwrite");
      let objectStore = transaction.objectStore("productos");
      
      let request = objectStore.get(idProducto);
  
      request.onsuccess = function(event) {
        let data = request.result;
        if (data) {
          // Si el producto ya existe en el carrito, actualizamos la cantidad
          // Asegúrate de que la cantidad se convierta a un número antes de sumarla
          data.cantidad = parseInt(data.cantidad) + cantidad;
          let requestUpdate = objectStore.put(data);
          requestUpdate.onerror = function(event) {
            console.log("Error al actualizar la cantidad del producto: " + request.error);
          };
          requestUpdate.onsuccess = function(event) {
            console.log("Cantidad del producto actualizada con éxito.");
          };
        } else {
          // Si el producto no existe en el carrito, lo añadimos
          let requestAdd = objectStore.add({ idProducto: idProducto, cantidad: cantidad });
          requestAdd.onerror = function(event) {
            console.log("Error al añadir el producto al carrito: " + request.error);
          };
          requestAdd.onsuccess = function(event) {
            console.log("Producto añadido al carrito con éxito.");
          };
        }
      };
  
      request.onerror = function(event) {
        console.log("Error al obtener el producto: " + request.error);
      };
  
      // Después de añadir el producto al carrito, actualizamos el badge
      actualizarBadge();
    });
  
    function actualizarBadge() {
      let transaction = db.transaction(["productos"], "readonly");
      let objectStore = transaction.objectStore("productos");
  
      // Usamos un cursor para iterar sobre todos los productos en el almacén de objetos
      let request = objectStore.openCursor();
      let totalCantidad = 0;
  
      request.onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor) {
          totalCantidad += parseInt(cursor.value.cantidad);
          cursor.continue();
        } else {
          // Cuando hemos terminado de iterar, actualizamos el badge
          let badge = document.getElementById('badgeCantCart');
          badge.textContent = totalCantidad;
          // Si la cantidad total es mayor que 0, mostramos el badge
          // De lo contrario, lo ocultamos
          badge.style.display = totalCantidad > 0 ? 'inline' : 'none';
        }
      };
  
      request.onerror = function(event) {
        console.log("Error al obtener los productos: " + request.error);
      };
    }
  });
  
  // Primero, obtenemos una referencia al div 'listCarrito'
let listCarrito = document.getElementById('listCarrito');

// Luego, iteramos sobre los productos en el almacén de objetos de IndexedDB
let transaction = db.transaction(["productos"], "readonly");
let objectStore = transaction.objectStore("productos");
let request = objectStore.openCursor();

request.onsuccess = function(event) {
  let cursor = event.target.result;
  if (cursor) {
    // Para cada producto en el almacén de objetos, obtenemos los datos adicionales del producto de Supabase
    // Nota: Necesitarás reemplazar 'obtenerDatosProducto' con tu propia función para obtener los datos del producto de Supabase
    obtenerDatosProducto(cursor.value.idProducto).then(producto => {
      // Creamos un nuevo elemento de lista para el producto
      let item = document.createElement('div');
      item.classList.add('d-flex', 'align-items-center');
      item.innerHTML = `
        <a class="position-relative flex-shrink-0" href="shop-product-grocery.html">
          <span class="badge text-bg-danger position-absolute top-0 start-0 z-2 mt-0 ms-0">-$${producto.descuento}</span>
          <img src="${producto.imagen}" width="110" alt="Thumbnail">
        </a>
        <div class="w-100 ps-3">
          <h5 class="fs-sm fw-medium lh-base mb-2">
            <a class="hover-effect-underline" href="shop-product-grocery.html">${producto.nombre}</a>
          </h5>
          <div class="h6 pb-1 mb-2">$${producto.precio}</div>
          <div class="d-flex align-items-center justify-content-between">
            <div class="count-input rounded-pill">
              <button type="button" class="btn btn-icon btn-sm" data-decrement="" aria-label="Decrement quantity">
                <i class="ci-minus"></i>
              </button>
              <input type="number" class="form-control form-control-sm" value="${cursor.value.cantidad}" readonly="">
              <button type="button" class="btn btn-icon btn-sm" data-increment="" aria-label="Increment quantity">
                <i class="ci-plus"></i>
              </button>
            </div>
            <button type="button" class="btn-close fs-sm" data-bs-toggle="tooltip" data-bs-custom-class="tooltip-sm"
              data-bs-title="Remove" aria-label="Remove from cart"></button>
          </div>
        </div>
      `;

      // Añadimos el elemento de lista al div 'listCarrito'
      listCarrito.appendChild(item);
    });

    cursor.continue();
  }
};

request.onerror = function(event) {
  console.log("Error al obtener los productos: " + request.error);
};