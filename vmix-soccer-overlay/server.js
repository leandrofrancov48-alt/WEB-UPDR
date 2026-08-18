const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const STATE_FILE = path.join(__dirname, 'state.json');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Estado inicial por defecto
let state = {
  autoMode: true,
  espnMatchId: '760507', // Por defecto: Bélgica vs Estados Unidos
  homeTeam: {
    name: 'Estados Unidos',
    abbr: 'USA',
    score: 0,
    logo: 'https://a.espncdn.com/i/teamlogos/countries/500/usa.png'
  },
  awayTeam: {
    name: 'Bélgica',
    abbr: 'BEL',
    score: 0,
    logo: 'https://a.espncdn.com/i/teamlogos/countries/500/bel.png'
  },
  clock: {
    display: "0'",
    running: false,
    minutes: 0,
    seconds: 0,
    lastUpdate: Date.now()
  },
  stage: 'No Iniciado', // Scheduled, 1T, Entretiempo, 2T, Alargue, Penales, Finalizado, etc.
  addedTime: 0, // Minutos de adición (0 = oculto)
  overrideAddedTime: false, // Anulación manual del tiempo de descuento en modo automático
  scoreboardPosition: 'bottom-center', // Posición en pantalla: top-left, top-center, bottom-center, bottom-left, bottom-right
  scoreboardScale: 1.0, // Escala del marcador: 0.7 a 1.3
  penalties: {
    active: false,
    home: ['pending', 'pending', 'pending', 'pending', 'pending'],
    away: ['pending', 'pending', 'pending', 'pending', 'pending']
  },
  customTickerItems: [
    '¡Bienvenidos a la transmisión especial! 🎥',
    'Deja tu comentario en el chat y participa con nosotros 💬',
    'Sigue todas las novedades de la Copa del Mundo en nuestro canal 🏆'
  ],
  apiTickerItems: [], // Se llena automáticamente desde ESPN
  weather: {
    enabled: true,
    cities: [
      { name: 'SAN JUAN', lat: -31.5375, lon: -68.5364, temp: 12, apiTemp: 12, overrideTemp: null, enabled: true, isCustom: false },
      { name: 'BUENOS AIRES', lat: -34.6037, lon: -58.3816, temp: 15, apiTemp: 15, overrideTemp: null, enabled: true, isCustom: false },
      { name: 'CÓRDOBA', lat: -31.4135, lon: -64.1810, temp: 14, apiTemp: 14, overrideTemp: null, enabled: true, isCustom: false },
      { name: 'MENDOZA', lat: -32.8895, lon: -68.8458, temp: 13, apiTemp: 13, overrideTemp: null, enabled: true, isCustom: false },
      { name: 'ROSARIO', lat: -32.9468, lon: -60.6393, temp: 14, apiTemp: 14, overrideTemp: null, enabled: true, isCustom: false },
      { name: 'TUCUMÁN', lat: -26.8241, lon: -65.2226, temp: 16, apiTemp: 16, overrideTemp: null, enabled: true, isCustom: false },
      { name: 'SALTA', lat: -24.7859, lon: -65.4117, temp: 15, apiTemp: 15, overrideTemp: null, enabled: true, isCustom: false },
      { name: 'NEUQUÉN', lat: -38.9516, lon: -68.0591, temp: 10, apiTemp: 10, overrideTemp: null, enabled: true, isCustom: false },
      { name: 'USHUAIA', lat: -54.8019, lon: -68.3030, temp: 4, apiTemp: 4, overrideTemp: null, enabled: true, isCustom: false },
      { name: 'BARILOCHE', lat: -41.1335, lon: -71.3103, temp: 6, apiTemp: 6, overrideTemp: null, enabled: true, isCustom: false },
      { name: 'POSADAS', lat: -27.3671, lon: -55.8961, temp: 18, apiTemp: 18, overrideTemp: null, enabled: true, isCustom: false },
      { name: 'RESISTENCIA', lat: -27.4514, lon: -58.9866, temp: 17, apiTemp: 17, overrideTemp: null, enabled: true, isCustom: false }
    ]
  }
};

// Cargar estado persistente si existe
if (fs.existsSync(STATE_FILE)) {
  try {
    const rawData = fs.readFileSync(STATE_FILE, 'utf8');
    const savedState = JSON.parse(rawData);
    // Mezclar estado guardado con la estructura por defecto para compatibilidad
    state = { ...state, ...savedState };
    
    // Asegurar compatibilidad para nuevas propiedades del clima
    if (state.weather && Array.isArray(state.weather.cities)) {
      state.weather.cities.forEach(city => {
        if (city.enabled === undefined) city.enabled = true;
        if (city.isCustom === undefined) city.isCustom = false;
      });
    }

    console.log('[Server] Estado cargado con éxito desde state.json');
  } catch (err) {
    console.error('[Server] Error al leer state.json, usando valores por defecto:', err);
  }
}

// Guardar estado en state.json
function saveState() {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    console.error('[Server] Error al guardar state.json:', err);
  }
}

// Enviar estado a todos los clientes WebSocket conectados
function broadcast(msgObj) {
  const payload = JSON.stringify(msgObj);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Sincronizar el reloj si está corriendo (tanto en modo manual como automático)
setInterval(() => {
  if (state.clock.running) {
    const now = Date.now();
    const diffMs = now - state.clock.lastUpdate;
    if (diffMs >= 1000) {
      const secondsPassed = Math.floor(diffMs / 1000);
      state.clock.seconds += secondsPassed;
      state.clock.lastUpdate = now - (diffMs % 1000); // Guardar remanente de ms

      if (state.clock.seconds >= 60) {
        state.clock.minutes += Math.floor(state.clock.seconds / 60);
        state.clock.seconds = state.clock.seconds % 60;
      }

      // Detención automática del reloj según la etapa reglamentaria (solo en modo manual)
      if (!state.autoMode) {
        let stopLimit = null;
        const adition = parseInt(state.addedTime || 0);

        if (state.stage === '1T' && state.clock.minutes >= (45 + adition)) {
          stopLimit = 45 + adition;
        } else if (state.stage === '2T' && state.clock.minutes >= (90 + adition)) {
          stopLimit = 90 + adition;
        } else if (state.stage === 'Alargue') {
          if (state.clock.minutes < (106 + adition) && state.clock.minutes >= (105 + adition)) {
            stopLimit = 105 + adition;
          } else if (state.clock.minutes >= (120 + adition)) {
            stopLimit = 120 + adition;
          }
        }

        if (stopLimit !== null) {
          state.clock.minutes = stopLimit;
          state.clock.seconds = 0;
          state.clock.running = false;
          console.log(`[Server Clock] Auto-stop alcanzado a los ${stopLimit}:00 para la etapa ${state.stage} (Adición: +${adition})`);
        }
        
        state.clock.display = `${state.clock.minutes}'`;
      }
      
      // Auto-broadcast de actualización del reloj cada segundo a todos los clientes
      broadcast({ type: 'STATE_UPDATE', state });
      saveState();
    }
  }
}, 1000);

// Poller de la API de ESPN (ejecuta cada 15 segundos)
async function pollESPN() {
  if (!state.autoMode) return;

  try {
    // ESPN usa fechas en formato YYYYMMDD. Vamos a consultar el día actual (hora local del servidor/usuario)
    // Para asegurarnos de encontrar el partido USA vs Bélgica el 6 de Julio de 2026, podemos pasar la fecha dinámicamente o por defecto
    const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    
    // Obtenemos los eventos de la fecha actual. Hacemos fallback a la fecha del partido si no hay eventos activos
    // o simplemente consultamos el día actual y mañana para recopilar datos.
    // Usamos _=Date.now() para hacer cache-busting y obligar a ESPN a darnos los datos más recientes.
    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?_=${Date.now()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    let eventFound = null;
    let tickerEvents = [];

    // Recopilar partidos para el ticker (del feed principal)
    if (data.events) {
      tickerEvents = [...data.events];
      // Buscar el partido configurado en el feed principal
      eventFound = data.events.find(e => e.id === state.espnMatchId);
    }

    // Si el partido configurado no está en el feed de hoy (por ejemplo, si el streaming es en una fecha distinta o mañana), 
    // hacemos una consulta específica de esa fecha si podemos deducirla, o asumimos el ID.
    // Para mayor robustez, si el ID del partido no está hoy, consultamos la fecha del partido directamente.
    // El partido USA vs Bélgica es el 6 de Julio de 2026.
    if (!eventFound && state.espnMatchId === '760507') {
      const matchDateUrl = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260706&_=${Date.now()}`;
      const matchRes = await fetch(matchDateUrl);
      if (matchRes.ok) {
        const matchData = await matchRes.json();
        if (matchData.events) {
          eventFound = matchData.events.find(e => e.id === state.espnMatchId);
          // Mezclar eventos para alimentar un ticker más completo
          tickerEvents = [...tickerEvents, ...matchData.events];
        }
      }
    } else if (!eventFound && state.espnMatchId) {
      // Si es otro ID personalizado, consultamos los últimos eventos para ver si aparece
      console.log(`[ESPN Poll] Buscando partido personalizado ${state.espnMatchId}...`);
    }

    // 1. Procesar el partido configurado (Marcador + Tiempo)
    if (eventFound) {
      const competition = eventFound.competitions[0];
      const competitors = competition.competitors;
      const status = competition.status;

      // Buscar local y visitante
      const homeCompetitor = competitors.find(c => c.homeAway === 'home');
      const awayCompetitor = competitors.find(c => c.homeAway === 'away');

      if (homeCompetitor && awayCompetitor) {
        const newHomeScore = parseInt(homeCompetitor.score || 0);
        const newAwayScore = parseInt(awayCompetitor.score || 0);

        // Detectar si hubo un gol para enviar alerta
        let goalScored = null;
        if (newHomeScore > state.homeTeam.score) {
          goalScored = {
            team: 'home',
            name: homeCompetitor.team.displayName,
            abbr: homeCompetitor.team.abbreviation,
            score: `${newHomeScore} - ${newAwayScore}`
          };
        } else if (newAwayScore > state.awayTeam.score) {
          goalScored = {
            team: 'away',
            name: awayCompetitor.team.displayName,
            abbr: awayCompetitor.team.abbreviation,
            score: `${newHomeScore} - ${newAwayScore}`
          };
        }

        // Actualizar equipos en el estado
        state.homeTeam = {
          name: translateTeamName(homeCompetitor.team.displayName),
          abbr: homeCompetitor.team.abbreviation,
          score: newHomeScore,
          logo: homeCompetitor.team.logo || state.homeTeam.logo
        };

        state.awayTeam = {
          name: translateTeamName(awayCompetitor.team.displayName),
          abbr: awayCompetitor.team.abbreviation,
          score: newAwayScore,
          logo: awayCompetitor.team.logo || state.awayTeam.logo
        };

        // Actualizar etapa del partido y verificar si cambió
        const newStage = translateMatchState(status.type.state, status.type.detail);
        if (newStage !== state.stage) {
          state.stage = newStage;
          state.overrideAddedTime = false; // Resetear anulación manual al cambiar de etapa
        }

        // Actualizar reloj
        state.clock.display = status.displayClock || "0'";
        const wasRunning = state.clock.running;
        state.clock.running = status.type.state === 'in' && status.type.name !== 'STATUS_HALFTIME'; 
        
        if (state.clock.running && !wasRunning) {
          state.clock.lastUpdate = Date.now();
        }
        
        // Extraer minutos desde el string de ESPN (ej: "34'" -> 34)
        const minMatch = (status.displayClock || "").match(/^(\d+)/);
        if (minMatch) {
          const parsedMins = parseInt(minMatch[1]);
          if (parsedMins !== state.clock.minutes) {
            state.clock.minutes = parsedMins;
            state.clock.seconds = 0; // Reiniciar segundos a cero solo cuando el minuto avanza
            state.clock.lastUpdate = Date.now();
            console.log(`[ESPN Poll] Reloj sincronizado con ESPN en minuto: ${parsedMins}'`);
          }
        }

        // Parsear tiempo adicional de la API de ESPN si no está anulado por el usuario
        if (!state.overrideAddedTime) {
          const addedTimeMatch = (status.displayClock || "").match(/\+(\d+)/);
          if (addedTimeMatch) {
            state.addedTime = parseInt(addedTimeMatch[1]);
          } else {
            state.addedTime = 0;
          }
        }

        // Si la etapa del partido es penales en ESPN, activar automáticamente el widget
        if (state.stage === 'Penales') {
          state.penalties.active = true;
        }


        // Si se detectó gol, registrar en consola
        if (goalScored) {
          console.log(`[ESPN Poll] ¡GOL DETECTADO! ${goalScored.name} anotó.`);
        }
      }
    }

    // 2. Procesar el ticker de ESPN (Otros partidos y resultados del día)
    const newApiTickerItems = [];
    
    // Evitar duplicados en base al ID del evento
    const uniqueEvents = [];
    const seenIds = new Set();
    tickerEvents.forEach(e => {
      if (!seenIds.has(e.id)) {
        seenIds.add(e.id);
        uniqueEvents.push(e);
      }
    });

    uniqueEvents.forEach(ev => {
      // Ignorar el partido principal si el usuario no quiere verlo duplicado en el ticker
      // Aunque en streams deportivos es común que pase. Lo dejamos.
      const comp = ev.competitions[0];
      const t1 = comp.competitors[0];
      const t2 = comp.competitors[1];
      const matchState = comp.status.type.state;
      const matchDetail = comp.status.type.detail;
      
      const t1Name = translateTeamName(t1.team.displayName);
      const t2Name = translateTeamName(t2.team.displayName);
      
      let itemText = '';

      if (matchState === 'pre') {
        // Programado: "USA vs BEL (Lunes, 20:00)"
        // Formatear detalle quitando partes redundantes
        let timeDetail = translateMatchDetail(matchDetail);
        itemText = `📅 PRÓXIMO: ${t1Name} vs ${t2Name} (${timeDetail})`;
      } else if (matchState === 'in') {
        // En vivo: "🔴 EN VIVO: USA 1 - 2 BEL (67')"
        itemText = `🔴 EN VIVO: ${t1Name} ${t1.score} - ${t2.score} ${t2Name} (${comp.status.displayClock})`;
      } else if (matchState === 'post') {
        // Finalizado: "FINAL: USA 2 - 3 BEL (TE)"
        let statDetail = comp.status.type.completed ? 'FINAL' : 'FINALIZADO';
        if (matchDetail.includes('OT') || matchDetail.includes('AET') || matchDetail.includes('Extra Time')) {
          statDetail += ' (T.E.)';
        } else if (matchDetail.includes('FT-Pen') || matchDetail.includes('Penalties')) {
          statDetail += ' (PEN)';
        }
        itemText = `⚽ ${statDetail}: ${t1Name} ${t1.score} - ${t2.score} ${t2Name}`;
      }

      if (itemText) {
        newApiTickerItems.push(itemText);
      }
    });

    state.apiTickerItems = newApiTickerItems;
    state.lastUpdated = Date.now();

    // Guardar y transmitir el nuevo estado obtenido de ESPN
    saveState();
    broadcast({ type: 'STATE_UPDATE', state });

  } catch (err) {
    console.error('[ESPN Poll] Error al obtener datos de ESPN Scoreboard:', err.message);
  }
}

// Traducciones rápidas para nombres de países en la Copa del Mundo
function translateTeamName(name) {
  const dict = {
    'United States': 'Estados Unidos',
    'USA': 'EE. UU.',
    'Belgium': 'Bélgica',
    'Spain': 'España',
    'Portugal': 'Portugal',
    'Germany': 'Alemania',
    'France': 'Francia',
    'Italy': 'Italia',
    'Netherlands': 'Países Bajos',
    'Brazil': 'Brasil',
    'Argentina': 'Argentina',
    'Mexico': 'México',
    'England': 'Inglaterra',
    'Bosnia and Herzegovina': 'Bosnia',
    'Senegal': 'Senegal',
    'Norway': 'Noruega',
    'Haiti': 'Haití',
    'Croatia': 'Croatia',
    'Switzerland': 'Suiza',
    'Uruguay': 'Uruguay',
    'Colombia': 'Colombia',
    'Ecuador': 'Ecuador',
    'Morocco': 'Marruecos',
    'Japan': 'Japón',
    'South Korea': 'Corea del Sur',
    'Australia': 'Australia',
    'Canada': 'Canadá',
    'Saudi Arabia': 'Arabia Saudita',
    'Cameroon': 'Camerún',
    'Ghana': 'Ghana',
    'Nigeria': 'Nigeria'
  };
  return dict[name] || name;
}

// Traducir estados del partido
function translateMatchState(stateStr, detail) {
  if (stateStr === 'pre') return 'No Iniciado';
  if (stateStr === 'post') return 'Finalizado';
  if (stateStr === 'in') {
    if (detail.toLowerCase().includes('halftime') || detail.toLowerCase().includes('entretiempo') || detail.toLowerCase() === 'ht') {
      return 'Entretiempo';
    }
    if (detail.toLowerCase().includes('extra time') || detail.toLowerCase().includes('alargue')) {
      return 'Alargue';
    }
    if (detail.toLowerCase().includes('penalties') || detail.toLowerCase().includes('penales')) {
      return 'Penales';
    }
    return 'En Vivo';
  }
  return detail || 'En Curso';
}

// Traducir detalles del tiempo
function translateMatchDetail(detail) {
  return detail
    .replace(/Mon, /i, 'Lun, ')
    .replace(/Tue, /i, 'Mar, ')
    .replace(/Wed, /i, 'Mié, ')
    .replace(/Thu, /i, 'Jue, ')
    .replace(/Fri, /i, 'Vie, ')
    .replace(/Sat, /i, 'Sáb, ')
    .replace(/Sun, /i, 'Dom, ')
    .replace(/July/i, 'Julio')
    .replace(/June/i, 'Junio')
    .replace(/at/i, 'a las')
    .replace(/PM EDT/i, 'PM')
    .replace(/AM EDT/i, 'AM');
}

// Poller de Clima para Argentina (Open-Meteo)
async function pollWeather() {
  if (!state.weather || !state.weather.enabled) return;

  try {
    console.log('[Weather Poll] Iniciando consulta de clima a Open-Meteo...');
    
    // Filtrar solo ciudades que no son personalizadas para la consulta API
    const apiCities = state.weather.cities.filter(c => !c.isCustom);
    const lats = apiCities.map(c => c.lat).join(',');
    const lons = apiCities.map(c => c.lon).join(',');
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m&_=${Date.now()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    if (Array.isArray(data)) {
      data.forEach((locData, idx) => {
        const city = apiCities[idx];
        if (city && locData.current) {
          const apiTemp = Math.round(locData.current.temperature_2m);
          city.apiTemp = apiTemp;
          
          const override = city.overrideTemp;
          city.temp = (override !== null && override !== undefined) ? override : apiTemp;
        }
      });
      
      console.log('[Weather Poll] Clima actualizado con éxito.');
      broadcast({ type: 'STATE_UPDATE', state });
      saveState();
    } else {
      console.error('[Weather Poll] Formato de respuesta de Open-Meteo no es válido (esperaba un Array).');
    }
  } catch (err) {
    console.error('[Weather Poll] Error al obtener el clima:', err.message);
  }
}

// Lanzar poller cada 5 segundos (para actualizaciones instantáneas) y al iniciar
setInterval(pollESPN, 5000);
setTimeout(pollESPN, 1000);

// Lanzar poller de clima cada 10 minutos (600000ms) y al iniciar
setInterval(pollWeather, 600000);
setTimeout(pollWeather, 2000);

// Manejo de conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('[WS] Nuevo cliente conectado');
  
  // Enviar estado actual al cliente que se conecta
  ws.send(JSON.stringify({ type: 'STATE_UPDATE', state }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'UPDATE_STATE':
          // Recibe cambios parciales de estado del panel de control
          state = { ...state, ...data.state };
          
          // Si el panel envió una actualización de adición, marcamos que fue manual
          if (data.state && data.state.addedTime !== undefined) {
            state.overrideAddedTime = true;
            console.log(`[Server] Tiempo adicional sobreescrito manualmente a: +${data.state.addedTime}`);
          }

          // Si cambiamos la etapa manualmente, reseteamos la sobreescritura
          if (data.state && data.state.stage !== undefined && data.state.stage !== state.stage) {
            state.overrideAddedTime = false;
          }

          // Si cambiamos el ID de partido o volvimos a activar autoMode, hacemos poll inmediato
          if (data.pollNow) {
            // Si el usuario vuelve a activar autoMode, le permitimos a ESPN mandar sobre la adición de nuevo
            if (data.state && data.state.autoMode) {
              state.overrideAddedTime = false;
            }
            pollESPN();
          }

          // Registrar la marca de actualización de tiempo local si cambiamos el reloj a mano
          if (data.state && data.state.clock) {
            state.clock.lastUpdate = Date.now();
          }

          saveState();
          broadcast({ type: 'STATE_UPDATE', state });
          break;

        case 'WEATHER_FORCE_SYNC':
          console.log('[WS] Solicitud de sincronización forzada de clima recibida');
          pollWeather();
          break;

        case 'WEATHER_OVERRIDE_TEMP':
          if (data.cityName) {
            const city = state.weather.cities.find(c => c.name === data.cityName);
            if (city) {
              let val = data.overrideTemp;
              if (val !== null && val !== undefined && val !== '') {
                // Si es un número puro lo convertimos, si no lo dejamos como texto libre
                if (/^-?\d+$/.test(String(val).trim())) {
                  val = parseInt(val);
                } else {
                  val = String(val).trim();
                }
              } else {
                val = null;
              }

              if (city.isCustom) {
                city.temp = val !== null ? val : '';
              } else {
                city.overrideTemp = val;
                city.temp = (city.overrideTemp !== null) ? city.overrideTemp : (city.apiTemp !== undefined ? city.apiTemp : city.temp);
              }
              
              console.log(`[WS] Clima actualizado para ${city.name}: temp=${city.temp}`);
              saveState();
              broadcast({ type: 'STATE_UPDATE', state });
            }
          }
          break;

        case 'WEATHER_ADD_CUSTOM':
          if (data.name && data.temp !== undefined) {
            const nameUpper = String(data.name).trim().toUpperCase();
            const exists = state.weather.cities.some(c => c.name === nameUpper);
            if (!exists) {
              let val = data.temp;
              if (/^-?\d+$/.test(String(val).trim())) {
                val = parseInt(val);
              } else {
                val = String(val).trim();
              }

              state.weather.cities.push({
                name: nameUpper,
                temp: val,
                enabled: true,
                isCustom: true
              });
              
              console.log(`[WS] Ciudad personalizada agregada: ${nameUpper} (${val})`);
              saveState();
              broadcast({ type: 'STATE_UPDATE', state });
            }
          }
          break;

        case 'WEATHER_DELETE_CITY':
          if (data.name) {
            const nameUpper = String(data.name).trim().toUpperCase();
            const originalLength = state.weather.cities.length;
            state.weather.cities = state.weather.cities.filter(c => c.name !== nameUpper || !c.isCustom);
            
            if (state.weather.cities.length !== originalLength) {
              console.log(`[WS] Ciudad personalizada eliminada: ${nameUpper}`);
              saveState();
              broadcast({ type: 'STATE_UPDATE', state });
            }
          }
          break;

        case 'WEATHER_TOGGLE_CITY':
          if (data.name && data.enabled !== undefined) {
            const nameUpper = String(data.name).trim().toUpperCase();
            const city = state.weather.cities.find(c => c.name === nameUpper);
            if (city) {
              city.enabled = !!data.enabled;
              console.log(`[WS] Ciudad ${city.name} habilitada=${city.enabled}`);
              saveState();
              broadcast({ type: 'STATE_UPDATE', state });
            }
          }
          break;

        default:
          console.log(`[WS] Mensaje no reconocido: ${data.type}`);
      }
    } catch (err) {
      console.error('[WS] Error al procesar mensaje:', err);
    }
  });

  ws.on('close', () => {
    console.log('[WS] Cliente desconectado');
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`\n============================================================`);
  console.log(`🔥 SISTEMA DE OVERLAY DEPORTIVO PARA VMIX INICIADO 🔥`);
  console.log(`------------------------------------------------------------`);
  console.log(`📺 Overlay (añadir en vMix como Web Browser):`);
  console.log(`   👉 http://localhost:${PORT}/overlay.html`);
  console.log(`\n🎛️ Panel de Control (abre en tu navegador):`);
  console.log(`   👉 http://localhost:${PORT}/control.html`);
  console.log(`============================================================\n`);
});
