import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Inicializa Supabase
const supabase = createClient(
    'https://ogtbjqbvfmnlvkucqutj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ndGJqcWJ2Zm1ubHZrdWNxdXRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzM1NTYyMSwiZXhwIjoyMDMyOTMxNjIxfQ.1uP3YbHw5HSLkoPOVZOjeYhgYZ88fK20S6RWQR_QIIE'
);





  // Reemplaza 'idProducto' con el ID real del producto que deseas mostrar
  const idProducto = sessionStorage.getItem('sessionStorageCategoria');

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const { data, error } = await supabase
        .from('Productos de Tienda de Comestibles') // Asegúrate de que este sea el nombre correcto de tu tabla
        .select('*')
        .eq('id', idProducto) // Usa el ID del producto para filtrar los resultados
        .single(); // Suponiendo que solo esperas un resultado
  
      if (error) throw error;
  
      // Si la consulta fue exitosa, inserta los valores en las etiquetas HTML
      if (data) {
        document.getElementById('descripcionProductoCategoria').textContent = data.Tipo;
        document.getElementById('descripcionProductoNombre').textContent = data.Nombre;
        document.getElementById('descripcionProductoCantidad').textContent = data.Cantidad;
        document.getElementById('descripcionProductoFoto').src = data.Foto1;
        document.getElementById('descripcionProductoDescripción').textContent = data.Descripcion;
        document.getElementById('descripcionProductoPrecio').textContent = `$${data.PrecioCUP}`;
        document.getElementById('descripcionProductoFoto2').src = data.Foto2;
        document.getElementById('descripcionProductoFoto3').src = data.Foto3;
        document.getElementById('descripcionProductoStock').textContent = data.Stock;
        
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  });


