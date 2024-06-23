eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxNDc3NjY1MSwianRpIjoiNzFiMDA5YTItYWQzMC00NWRmLTk3MWUtMWQwMTAyN2NiNzAzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjY2MjY4YTBjNDVhZjllOGMxOWI4Mzg1ZiIsIm5iZiI6MTcxNDc3NjY1MSwiZXhwIjoxNzQ2MzEyNjUxfQ.gUbuoBLEh93dWs7BUlf0zvQGJMz6BmADVTxsC0WSGN4
async function obtenerPrecios() {
    try {
      // Obtener la fecha y hora actual
      const ahora = new Date();
      
      // Establecer la fecha de inicio restando 23 horas y 30 minutos
      const fechaInicio = new Date(ahora - (23 * 60 + 30) * 60 * 1000);
      const fechaInicioFormato = encodeURIComponent(fechaInicio.toISOString());
  
      // Establecer la fecha de fin sumando 23 horas y 30 minutos a la fecha de inicio
      const fechaFin = new Date(fechaInicio.getTime() + (23 * 60 + 30) * 60 * 1000);
      const fechaFinFormato = encodeURIComponent(fechaFin.toISOString());
  
      const url = `https://tasas.eltoque.com/v1/trmi?date_from=${fechaInicioFormato}&date_to=${fechaFinFormato}`;
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': process.env.API_KEY, // Utiliza una variable de entorno para tu código de acceso
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error en la respuesta de la red: ${response.status}`);
      }
  
      const data = await response.json();
      const listaPrecios = document.getElementById('listaPrecios');
      listaPrecios.innerHTML = ''; // Limpiar la lista antes de agregar nuevos precios
  
      // Asumiendo que la estructura de la respuesta es la misma
      data.rates.forEach(rate => {
        const item = document.createElement('li');
        item.textContent = `${rate.currency}: ${rate.value}`;
        listaPrecios.appendChild(item);
      });
    } catch (error) {
      console.error('Error al obtener los precios:', error);
      const listaPrecios = document.getElementById('listaPrecios');
      listaPrecios.innerHTML = '<li>Error al cargar los precios</li>';
    }
  }

  async function obtenerDatosTRMI() {
    const url = 'https://tasas.eltoque.com/v1/trmi?date_from=2024-06-22%2000%3A00%3A01&date_to=2024-06-22%2023%3A00%3A01';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxNDc3NjY1MSwianRpIjoiNzFiMDA5YTItYWQzMC00NWRmLTk3MWUtMWQwMTAyN2NiNzAzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjY2MjY4YTBjNDVhZjllOGMxOWI4Mzg1ZiIsIm5iZiI6MTcxNDc3NjY1MSwiZXhwIjoxNzQ2MzEyNjUxfQ.gUbuoBLEh93dWs7BUlf0zvQGJMz6BmADVTxsC0WSGN4';
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error en la respuesta de la red: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      // Procesar los datos como sea necesario
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  }