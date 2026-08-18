let ws;
let reconnectTimer;
let citiesList = [
  { name: 'SAN JUAN', temp: 12 },
  { name: 'BUENOS AIRES', temp: 15 },
  { name: 'CÓRDOBA', temp: 14 },
  { name: 'MENDOZA', temp: 13 },
  { name: 'ROSARIO', temp: 14 },
  { name: 'TUCUMÁN', temp: 16 },
  { name: 'SALTA', temp: 15 },
  { name: 'NEUQUÉN', temp: 10 },
  { name: 'USHUAIA', temp: 4 },
  { name: 'BARILOCHE', temp: 6 },
  { name: 'POSADAS', temp: 18 },
  { name: 'RESISTENCIA', temp: 17 }
];

let currentIndex = 0;
let rotationInterval = null;

const wsUri = `ws://${window.location.host}`;

// Conectar con el WebSocket Server para recibir actualizaciones de clima
function connectWS() {
  console.log('[Weather WS] Intentando conectar a:', wsUri);
  ws = new WebSocket(wsUri);

  ws.onopen = () => {
    console.log('[Weather WS] Conexión establecida.');
    if (reconnectTimer) clearInterval(reconnectTimer);
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'STATE_UPDATE' && data.state.weather && data.state.weather.cities) {
        // Actualizar la lista en memoria con los valores frescos y habilitados del servidor
        citiesList = data.state.weather.cities
          .filter(c => c.enabled !== false)
          .map(c => ({
            name: c.name,
            temp: c.temp
          }));
        console.log('[Weather WS] Datos de clima sincronizados desde el servidor.');
      }
    } catch (err) {
      console.error('[Weather WS] Error al procesar datos del websocket:', err);
    }
  };

  ws.onclose = () => {
    console.log('[Weather WS] Conexión cerrada. Intentando reconectar...');
    if (!reconnectTimer) {
      reconnectTimer = setInterval(connectWS, 2000);
    }
  };

  ws.onerror = (err) => {
    console.error('[Weather WS] Error detectado:', err);
    ws.close();
  };
}

// Reloj Local en Tiempo Real (HH:mm)
function startClock() {
  const clockEl = document.getElementById('current-time');
  
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockEl.innerText = `${hours}:${minutes}`;
  }

  updateTime();
  setInterval(updateTime, 1000); // Comprobar la hora del sistema cada segundo
}

// Rotación animada de las provincias/ciudades de Argentina
function startWeatherRotation() {
  const tempEl = document.getElementById('weather-temp');
  const cityEl = document.getElementById('weather-city');
  const contentEl = document.getElementById('info-content');

  function showCity(index) {
    if (citiesList.length === 0) return;
    
    const cityData = citiesList[index % citiesList.length];
    
    // Formatear la temperatura: si es un número puro, le agregamos °C. Si no, lo dejamos tal cual
    let tempVal = String(cityData.temp).trim();
    if (/^-?\d+$/.test(tempVal)) {
      tempVal = `${tempVal}°C`;
    }
    
    tempEl.innerText = tempVal;
    cityEl.innerText = cityData.name;

    // Disparar animación de entrada (slide up + fade in)
    contentEl.classList.remove('slide-anim');
    void contentEl.offsetWidth; // Forzar reflow en el navegador para reiniciar animación
    contentEl.classList.add('slide-anim');
  }

  // Mostrar el primer elemento al iniciar
  showCity(currentIndex);

  // Iniciar ciclo de 8 segundos por ciudad
  if (rotationInterval) clearInterval(rotationInterval);
  rotationInterval = setInterval(() => {
    currentIndex++;
    showCity(currentIndex);
  }, 8000);
}

// Inicializar componentes al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  connectWS();
  startClock();
  startWeatherRotation();
});
