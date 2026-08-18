let ws;
let reconnectTimer;



const wsUri = `ws://${window.location.host}`;

function connectWS() {
  console.log('[WS] Intentando conectar a:', wsUri);
  ws = new WebSocket(wsUri);

  ws.onopen = () => {
    console.log('[WS] Conexión establecida.');
    if (reconnectTimer) clearInterval(reconnectTimer);
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'STATE_UPDATE':
          updateOverlay(data.state);
          break;
      }
    } catch (err) {
      console.error('[WS] Error al procesar mensaje:', err);
    }
  };

  ws.onclose = () => {
    console.log('[WS] Conexión cerrada. Intentando reconectar...');
    // Intentar reconectar cada 2 segundos
    if (!reconnectTimer) {
      reconnectTimer = setInterval(connectWS, 2000);
    }
  };

  ws.onerror = (err) => {
    console.error('[WS] Error detectado:', err);
    ws.close();
  };
}

// Actualizar el DOM con el estado recibido
function updateOverlay(state) {
  // 0. Posicionamiento y escala dinámica del marcador
  const scoreboardContainer = document.getElementById('scoreboard');
  scoreboardContainer.classList.remove('pos-top-left', 'pos-top-center', 'pos-bottom-center', 'pos-bottom-left', 'pos-bottom-right');
  scoreboardContainer.classList.add('pos-' + (state.scoreboardPosition || 'bottom-center'));
  scoreboardContainer.style.setProperty('--scale', state.scoreboardScale || 1.0);

  // 1. Equipos y Marcador
  document.getElementById('home-abbr').innerText = state.homeTeam.abbr;
  document.getElementById('home-score').innerText = state.homeTeam.score;
  const homeLogo = document.getElementById('home-logo');
  if (state.homeTeam.logo) {
    homeLogo.src = state.homeTeam.logo;
    homeLogo.style.display = 'block';
  } else {
    homeLogo.style.display = 'none';
  }

  document.getElementById('away-abbr').innerText = state.awayTeam.abbr;
  document.getElementById('away-score').innerText = state.awayTeam.score;
  const awayLogo = document.getElementById('away-logo');
  if (state.awayTeam.logo) {
    awayLogo.src = state.awayTeam.logo;
    awayLogo.style.display = 'block';
  } else {
    awayLogo.style.display = 'none';
  }

  // 2. Reloj e Indicador de Tiempo
  let clockDisplay = state.clock.display;
  
  // Si estamos en modo manual, o si es un formato numérico activo de ESPN (ej: "34'" o "45+2'")
  // mostramos directamente los minutos y segundos que vienen del servidor
  const isMinuteFormat = (state.clock.display || "").match(/^(\d+)/);
  if (!state.autoMode || isMinuteFormat) {
    const mins = String(state.clock.minutes).padStart(2, '0');
    const secs = String(state.clock.seconds).padStart(2, '0');
    clockDisplay = `${mins}:${secs}`;
  } else {
    // Si es un estado de texto (HT, FT, Entretiempo, etc.), mostramos el texto estático de ESPN
    clockDisplay = state.clock.display;
  }
  document.getElementById('match-clock').innerText = clockDisplay;
  document.getElementById('match-stage').innerText = state.stage;

  // 3. Badge de tiempo adicional
  const addedTimeBadge = document.getElementById('added-time-badge');
  const addedTimeText = document.getElementById('added-time-text');
  if (state.addedTime && state.addedTime > 0) {
    addedTimeText.innerText = `+${state.addedTime}`;
    addedTimeBadge.classList.add('visible');
  } else {
    addedTimeBadge.classList.remove('visible');
  }

  // 4. Badge de EN VIVO
  const liveBadge = document.getElementById('live-badge');
  const liveDot = liveBadge.querySelector('.live-dot');
  const liveText = document.getElementById('live-text');

  if (state.stage === 'No Iniciado') {
    liveDot.classList.remove('blinking');
    liveText.innerText = 'PREVIA';
    liveBadge.style.opacity = '0.7';
  } else if (state.stage === 'Finalizado') {
    liveDot.classList.remove('blinking');
    liveText.innerText = 'FINAL';
    liveBadge.style.opacity = '0.9';
  } else {
    liveDot.classList.add('blinking');
    liveText.innerText = 'EN VIVO';
    liveBadge.style.opacity = '1';
  }

  // 5. Widget de Tanda de Penales
  const penWidget = document.getElementById('penalties-widget');
  const homePenBadge = document.getElementById('home-pen-badge');
  const awayPenBadge = document.getElementById('away-pen-badge');

  if (state.penalties && state.penalties.active) {
    // Mostrar widget de penales
    penWidget.classList.add('active');
    
    // Setear abreviaturas
    document.getElementById('pen-home-abbr').innerText = state.homeTeam.abbr;
    document.getElementById('pen-away-abbr').innerText = state.awayTeam.abbr;

    // Calcular goles anotados en penales
    const homeGoals = state.penalties.home.filter(s => s === 'scored').length;
    const awayGoals = state.penalties.away.filter(s => s === 'scored').length;

    // Actualizar totales en el widget
    document.getElementById('home-penalties-total').innerText = homeGoals;
    document.getElementById('away-penalties-total').innerText = awayGoals;

    // Actualizar badges en el marcador superior
    homePenBadge.innerText = `(${homeGoals})`;
    homePenBadge.style.display = 'inline-block';
    awayPenBadge.innerText = `(${awayGoals})`;
    awayPenBadge.style.display = 'inline-block';

    // Renderizar círculos de penal
    renderPenaltyDots('home-penalty-dots', state.penalties.home);
    renderPenaltyDots('away-penalty-dots', state.penalties.away);
  } else {
    // Ocultar widget y badges
    penWidget.classList.remove('active');
    homePenBadge.style.display = 'none';
    awayPenBadge.style.display = 'none';
  }

  // 6. Actualizar Ticker
  renderTicker(state.customTickerItems, state.apiTickerItems);
}

// Función auxiliar para renderizar los círculos de penales
function renderPenaltyDots(containerId, list) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  list.forEach((status) => {
    const dot = document.createElement('div');
    dot.className = `penalties-dot ${status}`;
    container.appendChild(dot);
  });
}

// Renderiza el ticker combinando los mensajes de la API y los personalizados del usuario
let lastTickerHash = '';
function renderTicker(customItems, apiItems) {
  // Unimos ambos arrays
  const allItems = [...apiItems, ...customItems];
  
  if (allItems.length === 0) {
    allItems.push('Copa del Mundo FIFA 2026 - Transmisión en Vivo 🏆');
  }

  // Crear un hash rápido para ver si el contenido cambió. Si no cambió, no re-renderizamos
  // para evitar saltos o reiniciar la animación CSS.
  const currentHash = allItems.join('||');
  if (currentHash === lastTickerHash) return;
  lastTickerHash = currentHash;

  const tickerContainer = document.getElementById('ticker-items');
  tickerContainer.innerHTML = '';

  // Renderizamos la lista de items dos veces para lograr el bucle infinito perfecto en CSS
  const renderList = [...allItems, ...allItems];
  
  renderList.forEach((item) => {
    const span = document.createElement('span');
    span.className = 'ticker-item';
    span.innerText = item;
    tickerContainer.appendChild(span);
  });

  // Ajustar la duración de la animación dinámicamente según la cantidad de texto
  // para mantener una velocidad constante (aprox. 150px por segundo)
  const totalLength = allItems.length;
  const duration = Math.max(20, totalLength * 12); // Mínimo 20 segundos
  tickerContainer.style.animationDuration = `${duration}s`;
}

// Iniciar conexión al cargar
window.addEventListener('DOMContentLoaded', connectWS);
