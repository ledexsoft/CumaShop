import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Inicializa Supabase
const supabase = createClient(
    'https://ogtbjqbvfmnlvkucqutj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ndGJqcWJ2Zm1ubHZrdWNxdXRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzM1NTYyMSwiZXhwIjoyMDMyOTMxNjIxfQ.1uP3YbHw5HSLkoPOVZOjeYhgYZ88fK20S6RWQR_QIIE'
);


document.addEventListener('DOMContentLoaded', (event) => {
    // Primero, creamos la base de datos IndexedDB
    let db;
    const request = indexedDB.open("carritoComprasDB", 1);
  
    request.onerror = function(event) {
      alert("No se pudo abrir la base de datos debido a un error: " + request.error);
    };
  
    request.onsuccess = function(event) {
      db = request.result;
      actualizarBadge();
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
            alert("Error al actualizar la cantidad del producto: " + request.error);
          };
          requestUpdate.onsuccess = function(event) {
            alert("Cantidad del producto actualizada con éxito.");
          };
        } else {
          // Si el producto no existe en el carrito, lo añadimos
          let requestAdd = objectStore.add({ idProducto: idProducto, cantidad: cantidad });
          requestAdd.onerror = function(event) {
            alert("Error al añadir el producto al carrito: " + request.error);
          };
          requestAdd.onsuccess = function(event) {
            alert("Producto añadido al carrito con éxito.");
          };
        }
      };
  
      request.onerror = function(event) {
        alert("Error al obtener el producto: " + request.error);
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
        alert("Error al obtener los productos: " + request.error);
      };
    }
  });
  
  // Primero, obtenemos una referencia al div 'listCarrito'
let listCarrito = document.getElementById('listCarrito');

// Luego, iteramos sobre los productos en el almacén de objetos de IndexedDB
let transaction = db.transaction(["productos"], "readonly");
let objectStore = transaction.objectStore("productos");
let request = objectStore.openCursor();


request.onerror = function(event) {
  alert("Error al obtener los productos: " + request.error);
};