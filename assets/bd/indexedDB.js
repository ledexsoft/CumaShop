// Suponiendo que ya tienes el cliente de Supabase inicializado
const supabase = createClient(
    'https://ogtbjqbvfmnlvkucqutj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ndGJqcWJ2Zm1ubHZrdWNxdXRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzM1NTYyMSwiZXhwIjoyMDMyOTMxNjIxfQ.1uP3YbHw5HSLkoPOVZOjeYhgYZ88fK20S6RWQR_QIIE'
);

// Función para obtener los datos de Supabase
const fetchProducts = async () => {
    try {
        const { data } = await supabase
            .from('Productos de Tienda de Comestibles') // Nombre de la tabla
            .select('*'); // Selecciona todos los campos

        // Convierte la respuesta JSON en un objeto JavaScript
        const productos = data.map(producto => ({
            id: producto.id,
            nombre: producto.Nombre,
            precio: producto.PrecioCUP,
            foto: producto.Foto1,
            cantidad: producto.Cantidad
        }));

        // Almacenar productos en IndexedDB
        await almacenarEnIndexedDB(productos);
        mostrarProductos();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

// Abrir la base de datos
function abrirIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('nombreBaseDeDatos', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('nombreAlmacen')) {
                db.createObjectStore('nombreAlmacen', { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Almacenar datos en IndexedDB
async function almacenarEnIndexedDB(datos) {
    const db = await abrirIndexedDB();
    const transaction = db.transaction('nombreAlmacen', 'readwrite');
    const objectStore = transaction.objectStore('nombreAlmacen');

    datos.forEach((dato) => {
        objectStore.put(dato);
    });

    transaction.oncomplete = () => {
        console.log('Datos almacenados en IndexedDB');
    };

    transaction.onerror = (event) => {
        console.error('Error al almacenar datos en IndexedDB:', event.target.error);
    };
}

// Recuperar datos de IndexedDB
async function recuperarDeIndexedDB() {
    const db = await abrirIndexedDB();
    const transaction = db.transaction('nombreAlmacen', 'readonly');
    const objectStore = transaction.objectStore('nombreAlmacen');

    const request = objectStore.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Mostrar productos en la lista
async function mostrarProductos() {
    const productos = await recuperarDeIndexedDB();
    const listaProductos = document.getElementById('lista-productos');

    productos.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = producto.nombre;
        li.onclick = () => {
            sessionStorage.setItem('productoId', producto.id);
            window.location.href = 'detalle.html';
        };
        listaProductos.appendChild(li);
    });
}

// Sincronizar datos entre Supabase e IndexedDB
async function sincronizarDatos() {
    const datosLocales = await recuperarDeIndexedDB();
    const datosRemotos = await fetchProducts();

    // Comparar y actualizar datos si es necesario
    if (JSON.stringify(datosLocales) !== JSON.stringify(datosRemotos)) {
        await almacenarEnIndexedDB(datosRemotos);
        console.log('Datos actualizados en IndexedDB');
    } else {
        console.log('No hay cambios en los datos');
    }
}

// Detectar cambios en la conexión a Internet
window.addEventListener('online', () => {
    console.log('Conexión a Internet restaurada');
    sincronizarDatos();
});

window.addEventListener('offline', () => {
    console.log('Sin conexión a Internet');
});

// Cargar datos al iniciar la página
window.onload = async () => {
    if (navigator.onLine) {
        await sincronizarDatos();
    } else {
        mostrarProductos();
    }
};

// Página de detalles (detalle.html)
async function abrirIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('nombreBaseDeDatos', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('nombreAlmacen')) {
                db.createObjectStore('nombreAlmacen', { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Obtener producto por ID
async function obtenerProductoPorId(id) {
    const db = await abrirIndexedDB();
    const transaction = db.transaction('nombreAlmacen', 'readonly');
    const objectStore = transaction.objectStore('nombreAlmacen');

    const request = objectStore.get(id);

    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Mostrar detalles del producto
async function mostrarDetallesProducto() {
    const productoId = sessionStorage.getItem('productoId');
    const producto = await obtenerProductoPorId(productoId);
    const detallesProducto = document.getElementById('detalles-producto');

    if (producto) {
        detallesProducto.innerHTML = `
            <p>ID: ${producto.id}</p>
            <p>Nombre: ${producto.nombre}</p>
            <p>Descripción: ${producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
        `;
    } else {
        detallesProducto.innerHTML = '<p>Producto no encontrado</p>';
    }
}

mostrarDetallesProducto();
