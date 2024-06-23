import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Inicializa Supabase
const supabase = createClient(
    'https://ogtbjqbvfmnlvkucqutj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ndGJqcWJ2Zm1ubHZrdWNxdXRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzM1NTYyMSwiZXhwIjoyMDMyOTMxNjIxfQ.1uP3YbHw5HSLkoPOVZOjeYhgYZ88fK20S6RWQR_QIIE'
);




document.addEventListener('DOMContentLoaded', async function() {
  // Obtén el ID del producto almacenado en sessionStorage
  var idProducto = sessionStorage.getItem('sessionStorageCategoria');

  // Realiza una consulta a Supabase para obtener los detalles del producto
  try {
    const { data, error } = await supabase
      .from('Productos de Tienda de Comestibles') // Asegúrate de que este sea el nombre correcto de tu tabla
      .select('*')
      .eq('id', idProducto) // Usa el ID del producto para filtrar los resultados
      .single(); // Suponiendo que solo esperas un resultado

    if (error) throw error;

    // Si la consulta fue exitosa, inserta los valores en las etiquetas HTML
    if (data) {
      document.getElementById('descripcionProductoCategoria').textContent = data.Categoría;
      document.getElementById('descripcionProductoNombre').textContent = data.Nombre;
      document.getElementById('descripcionProductoDescripción').textContent = data.Descripción;
      document.getElementById('descripcionProductoPrecio').textContent = `$${data.PrecioCUP}`;
      document.getElementById('descripcionProductoStock').textContent = data.Stock;
      document.getElementById('descripcionProductoCantidad').textContent = data.Cantidad;
      document.getElementById('descripcionProductoImg1').src = data.Foto1;
      document.getElementById('descripcionProductoImg2').src = data.Foto1;
      document.getElementById('descripcionProductoImg3').src = data.Foto1; // Asegúrate de que 'Cantidad' es un campo en tu tabla
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
});
