let ws;
let reconnectTimer;
let currentState = null;

const wsUri = `ws://${window.location.host}`;

function connectWS() {
  console.log('[Admin WS] Intentando conectar a:', wsUri);
  ws = new WebSocket(wsUri);

  ws.onopen = () => {
    console.log('[Admin WS] Conectado.');
    document.getElementById('conn-dot').classList.add('connected');
    document.getElementById('conn-text').innerText = 'Conectado';
    if (reconnectTimer) clearInterval(reconnectTimer);
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'STATE_UPDATE') {
        currentState = data.state;
        updateUI(data.state);
      }
    } catch (err) {
      console.error('[Admin WS] Error al procesar mensaje:', err);
    }
  };

  ws.onclose = () => {
    console.log('[Admin WS] Conexión perdida. Intentando reconectar...');
    document.getElementById('conn-dot').classList.remove('connected');
    document.getElementById('conn-text').innerText = 'Desconectado';
    if (!reconnectTimer) {
      reconnectTimer = setInterval(connectWS, 2000);
    }
  };

  ws.onerror = (err) => {
    console.error('[Admin WS] Error detectado:', err);
    ws.close();
  };
}

// Sincronizar el estado del servidor con los controles del panel
function updateUI(state) {
  // 1. Modo automático
  const autoToggle = document.getElementById('auto-mode-toggle');
  autoToggle.checked = state.autoMode;
  
  const matchIdInput = document.getElementById('espn-match-id');
  if (document.activeElement !== matchIdInput) {
    matchIdInput.value = state.espnMatchId;
  }

  // Activar/desactivar overlays de bloqueo si el modo auto está activo
  const scoreCard = document.getElementById('scorecard-section');
  const clockCard = document.getElementById('clockcard-section');
  
  if (state.autoMode) {
    scoreCard.classList.add('auto-active');
    clockCard.classList.add('auto-active');
  } else {
    scoreCard.classList.remove('auto-active');
    clockCard.classList.remove('auto-active');
  }

  // 2. Marcador y nombres de equipos
  document.getElementById('home-score-display').innerText = state.homeTeam.score;
  document.getElementById('away-score-display').innerText = state.awayTeam.score;

  const homeName = document.getElementById('home-name-input');
  if (document.activeElement !== homeName) homeName.value = state.homeTeam.name;

  const homeAbbr = document.getElementById('home-abbr-input');
  if (document.activeElement !== homeAbbr) homeAbbr.value = state.homeTeam.abbr;

  const awayName = document.getElementById('away-name-input');
  if (document.activeElement !== awayName) awayName.value = state.awayTeam.name;

  const awayAbbr = document.getElementById('away-abbr-input');
  if (document.activeElement !== awayAbbr) awayAbbr.value = state.awayTeam.abbr;

  // Banderas
  document.getElementById('home-avatar').src = state.homeTeam.logo || '';
  document.getElementById('away-avatar').src = state.awayTeam.logo || '';

  // 3. Reloj y etapa
  let clockDisplay = state.clock.display;
  if (!state.autoMode) {
    const mins = String(state.clock.minutes).padStart(2, '0');
    const secs = String(state.clock.seconds).padStart(2, '0');
    clockDisplay = `${mins}:${secs}`;
  }
  document.getElementById('clock-display').innerText = clockDisplay;

  // Botón iniciar/pausar
  const clockBtn = document.getElementById('btn-clock-toggle');
  if (state.clock.running) {
    clockBtn.innerText = 'Pausar';
    clockBtn.className = 'btn btn-danger';
  } else {
    clockBtn.innerText = 'Iniciar';
    clockBtn.className = 'btn btn-success';
  }

  // Selector de etapa
  const stageSelect = document.getElementById('match-stage-select');
  stageSelect.value = state.stage;

  // Selector de posición del marcador
  const posSelect = document.getElementById('scoreboard-position-select');
  if (state.scoreboardPosition) {
    posSelect.value = state.scoreboardPosition;
  }

  // Label de escala
  const scaleLabel = document.getElementById('scale-value-label');
  if (scaleLabel && state.scoreboardScale !== undefined) {
    scaleLabel.innerText = Math.round(state.scoreboardScale * 100) + '%';
  }

  // 4. Tiempo Adicional
  const addedTimeInput = document.getElementById('edit-added-time');
  if (document.activeElement !== addedTimeInput) {
    addedTimeInput.value = state.addedTime;
  }

  // 5. Tanda de Penales
  const penaltiesToggle = document.getElementById('penalties-active-toggle');
  penaltiesToggle.checked = state.penalties && state.penalties.active;

  const penaltiesControls = document.getElementById('penalties-admin-controls');
  if (state.penalties && state.penalties.active) {
    penaltiesControls.style.opacity = '1';
    penaltiesControls.style.pointerEvents = 'all';

    // Actualizar nombres en los penales
    document.getElementById('admin-home-pen-name').innerText = state.homeTeam.name;
    document.getElementById('admin-away-pen-name').innerText = state.awayTeam.name;

    // Calcular totales
    const homeGoals = state.penalties.home.filter(s => s === 'scored').length;
    const awayGoals = state.penalties.away.filter(s => s === 'scored').length;
    document.getElementById('admin-home-pen-total').innerText = homeGoals;
    document.getElementById('admin-away-pen-total').innerText = awayGoals;

    // Renderizar círculos interactivos
    renderAdminPenaltySlots('admin-home-pen-slots', 'home', state.penalties.home);
    renderAdminPenaltySlots('admin-away-pen-slots', 'away', state.penalties.away);
  } else {
    penaltiesControls.style.opacity = '0.4';
    penaltiesControls.style.pointerEvents = 'none';
  }

  // Actualizar listas del Ticker
  renderCustomTickerList(state.customTickerItems);
  renderApiTickerList(state.apiTickerItems);

  // Actualizar lista de Clima
  const weatherContainer = document.getElementById('weather-cities-list');
  if (weatherContainer && state.weather && state.weather.cities) {
    const isTyping = document.activeElement && document.activeElement.classList.contains('weather-input-override');
    
    if (isTyping) {
      // Solo actualizar celdas que no tienen foco
      state.weather.cities.forEach((city, idx) => {
        const row = weatherContainer.rows[idx];
        if (row) {
          // Checkbox
          const chk = row.cells[0].querySelector('input[type="checkbox"]');
          if (chk) chk.checked = city.enabled !== false;
          
          // API Temp
          const apiCell = row.cells[2];
          if (apiCell) {
            apiCell.innerText = city.isCustom ? 'N/A' : (city.apiTemp !== undefined ? `${city.apiTemp}°C` : '--');
          }
          
          // Input (si no está enfocado)
          const input = row.cells[3].querySelector('input');
          if (input && input !== document.activeElement) {
            input.value = city.isCustom ? city.temp : (city.overrideTemp !== null ? city.overrideTemp : '');
          }
        }
      });
    } else {
      // Regenerar la lista de ciudades completa
      weatherContainer.innerHTML = '';
      state.weather.cities.forEach(city => {
        const row = document.createElement('tr');
        row.className = 'weather-table-row';
        
        const isEnabled = city.enabled !== false;
        const apiVal = city.isCustom ? 'N/A' : (city.apiTemp !== undefined ? `${city.apiTemp}°C` : '--');
        const overrideVal = city.isCustom ? city.temp : (city.overrideTemp !== null ? city.overrideTemp : '');
        const placeholderText = city.isCustom ? 'Temp' : '--';
        
        const checkboxHtml = `
          <input type="checkbox" onchange="toggleWeatherCity('${city.name}', this.checked)" ${isEnabled ? 'checked' : ''} style="cursor: pointer; width: 15px; height: 15px;">
        `;
        
        const actionBtnHtml = city.isCustom ? `
          <button class="btn btn-danger" onclick="deleteCustomCity('${city.name}')" 
                  style="padding: 2px 6px; font-size: 0.75rem; border-radius: 3px;" title="Eliminar chiste">
            🗑️
          </button>
        ` : `
          <button class="btn btn-danger" onclick="saveWeatherOverride('${city.name}', null)" 
                  style="padding: 2px 6px; font-size: 0.75rem; border-radius: 3px;" ${city.overrideTemp === null ? 'disabled' : ''} title="Limpiar override">
            ✕
          </button>
        `;
        
        row.innerHTML = `
          <td style="text-align: center; padding: 8px 6px;">${checkboxHtml}</td>
          <td style="font-weight: bold; color: ${city.isCustom ? 'var(--accent-blue)' : 'var(--text-light)'}; padding: 8px 6px;">${city.name}</td>
          <td style="text-align: center; color: var(--text-dim); padding: 8px 6px;">${apiVal}</td>
          <td style="text-align: center; padding: 8px 6px;">
            <input type="text" class="weather-input-override" value="${overrideVal}" placeholder="${placeholderText}" 
                   data-city="${city.name}"
                   onchange="saveWeatherOverride('${city.name}', this.value)" style="width: 75px; text-align: center;">
          </td>
          <td style="text-align: center; padding: 8px 6px;">${actionBtnHtml}</td>
        `;
        weatherContainer.appendChild(row);
      });
    }
  }
}

// Renderizar círculos interactivos en el panel de control
function renderAdminPenaltySlots(containerId, team, list) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  list.forEach((status, index) => {
    const circle = document.createElement('div');
    circle.className = `admin-pen-circle ${status}`;
    
    // Icono correspondiente
    let symbol = index + 1;
    if (status === 'scored') symbol = '✓';
    else if (status === 'missed') symbol = '✗';
    circle.innerText = symbol;

    // Evento click para ciclar el estado
    circle.onclick = () => {
      let nextStatus = 'pending';
      if (status === 'pending') nextStatus = 'scored';
      else if (status === 'scored') nextStatus = 'missed';
      else if (status === 'missed') nextStatus = 'pending';

      sendPenaltyUpdate(team, index, nextStatus);
    };

    container.appendChild(circle);
  });
}

// Enviar estado actualizado al servidor
function sendStateUpdate(partialState, pollNow = false) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'UPDATE_STATE',
      state: partialState,
      pollNow
    }));
  }
}

// Cambiar el marcador desde los botones de +1/-1
function adjustScore(team, amount) {
  if (!currentState || currentState.autoMode) return;

  if (team === 'home') {
    const newScore = Math.max(0, currentState.homeTeam.score + amount);
    sendStateUpdate({
      homeTeam: { ...currentState.homeTeam, score: newScore }
    });
  } else if (team === 'away') {
    const newScore = Math.max(0, currentState.awayTeam.score + amount);
    sendStateUpdate({
      awayTeam: { ...currentState.awayTeam, score: newScore }
    });
  }
}

// Iniciar o pausar el reloj
function toggleClock() {
  if (!currentState || currentState.autoMode) return;

  sendStateUpdate({
    clock: {
      ...currentState.clock,
      running: !currentState.clock.running
    }
  });
}

// Resetear el reloj
function resetClock() {
  if (!currentState || currentState.autoMode) return;

  if (confirm('¿Estás seguro de que quieres reiniciar el reloj a 00:00?')) {
    sendStateUpdate({
      clock: {
        display: "00'",
        running: false,
        minutes: 0,
        seconds: 0
      }
    });
    document.getElementById('edit-minutes').value = 0;
    document.getElementById('edit-seconds').value = 0;
  }
}

// Establecer un minuto/segundo personalizado
function saveCustomTime() {
  if (!currentState || currentState.autoMode) return;

  const mins = parseInt(document.getElementById('edit-minutes').value) || 0;
  const secs = parseInt(document.getElementById('edit-seconds').value) || 0;

  sendStateUpdate({
    clock: {
      ...currentState.clock,
      minutes: mins,
      seconds: secs,
      display: `${mins}'`
    }
  });
}

// Cambiar la etapa del partido
function updateStage(stageVal) {
  sendStateUpdate({ stage: stageVal });
}



// --- TICKER MANAGER ---

function renderCustomTickerList(items) {
  const container = document.getElementById('custom-ticker-list');
  container.innerHTML = '';

  items.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'ticker-row-item';
    
    const textSpan = document.createElement('span');
    textSpan.innerText = item;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.style.padding = '3px 8px';
    deleteBtn.style.fontSize = '0.8rem';
    deleteBtn.innerText = '❌';
    deleteBtn.onclick = () => removeTickerItem(index);

    row.appendChild(textSpan);
    row.appendChild(deleteBtn);
    container.appendChild(row);
  });
}

function renderApiTickerList(items) {
  const container = document.getElementById('api-ticker-list');
  container.innerHTML = '';

  if (items.length === 0) {
    const emptyRow = document.createElement('div');
    emptyRow.className = 'ticker-row-item';
    emptyRow.innerText = 'No hay partidos activos en ESPN en este momento.';
    container.appendChild(emptyRow);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'ticker-row-item';
    row.innerText = item;
    container.appendChild(row);
  });
}

function addTickerItem() {
  const input = document.getElementById('new-ticker-text');
  const text = input.value.trim();
  if (!text) return;

  if (currentState) {
    const updatedItems = [...currentState.customTickerItems, text];
    sendStateUpdate({ customTickerItems: updatedItems });
    input.value = '';
  }
}

function removeTickerItem(index) {
  if (currentState) {
    const updatedItems = currentState.customTickerItems.filter((_, i) => i !== index);
    sendStateUpdate({ customTickerItems: updatedItems });
  }
}

// --- GESTIÓN DE PENALES Y TIEMPO ADICIONAL ---

// Actualizar un penal específico
function sendPenaltyUpdate(team, index, nextStatus) {
  if (!currentState) return;
  const updatedList = [...currentState.penalties[team]];
  updatedList[index] = nextStatus;
  
  sendStateUpdate({
    penalties: {
      ...currentState.penalties,
      [team]: updatedList
    }
  });
}

// Cambiar la cantidad de slots de penales (muerte súbita)
function adjustPenaltySlots(amount) {
  if (!currentState) return;
  const homeList = [...currentState.penalties.home];
  const awayList = [...currentState.penalties.away];

  if (amount === 1) {
    homeList.push('pending');
    awayList.push('pending');
  } else if (amount === -1 && homeList.length > 5) {
    homeList.pop();
    awayList.pop();
  }

  sendStateUpdate({
    penalties: {
      ...currentState.penalties,
      home: homeList,
      away: awayList
    }
  });
}

// Reiniciar tanda de penales
function resetPenaltiesControls() {
  if (!currentState) return;
  if (confirm('¿Reiniciar la tanda de penales a los 5 tiros iniciales pendientes?')) {
    sendStateUpdate({
      penalties: {
        ...currentState.penalties,
        home: ['pending', 'pending', 'pending', 'pending', 'pending'],
        away: ['pending', 'pending', 'pending', 'pending', 'pending']
      }
    });
  }
}

// Activar o desactivar la tanda de penales desde el admin
function togglePenaltiesActive(checked) {
  if (!currentState) return;
  sendStateUpdate({
    penalties: {
      ...currentState.penalties,
      active: checked
    }
  });
}

// Tiempo adicional
function changeAddedTime(val) {
  const num = parseInt(val) || 0;
  sendStateUpdate({ addedTime: num });
}

function setAddedTime(val) {
  document.getElementById('edit-added-time').value = val;
  sendStateUpdate({ addedTime: val });
}

// Ajustar tiempo adicional con botones +/-
function adjustAddedTime(amount) {
  const input = document.getElementById('edit-added-time');
  let currentVal = parseInt(input.value) || 0;
  let newVal = Math.max(0, currentVal + amount);
  input.value = newVal;
  sendStateUpdate({ addedTime: newVal });
}

// Cambiar posición del marcador
function changeScoreboardPosition(val) {
  sendStateUpdate({ scoreboardPosition: val });
}

// Ajustar tamaño del marcador
function adjustScale(amount) {
  if (!currentState) return;
  const currentScale = currentState.scoreboardScale !== undefined ? currentState.scoreboardScale : 1.0;
  // Limitar escala entre 0.6 (60%) y 1.4 (140%)
  const newScale = Math.max(0.6, Math.min(1.4, currentScale + amount));
  sendStateUpdate({ scoreboardScale: parseFloat(newScale.toFixed(2)) });
}

function resetScale() {
  sendStateUpdate({ scoreboardScale: 1.0 });
}

// --- CONFIGURACIÓN DE EVENT LISTENERS AL INICIAR ---

document.addEventListener('DOMContentLoaded', () => {
  connectWS();

  // Escuchar el switch de modo automático
  document.getElementById('auto-mode-toggle').addEventListener('change', (e) => {
    sendStateUpdate({ autoMode: e.target.checked }, true);
  });

  // Cambiar ESPN Match ID
  document.getElementById('espn-match-id').addEventListener('change', (e) => {
    sendStateUpdate({ espnMatchId: e.target.value.trim() }, true);
  });

  // Forzar sincronización manual
  document.getElementById('btn-sync-now').addEventListener('click', () => {
    const matchIdVal = document.getElementById('espn-match-id').value.trim();
    sendStateUpdate({ espnMatchId: matchIdVal }, true);
  });

  // Escuchar entradas de texto de nombres de equipos
  const saveTeamDetails = () => {
    if (currentState && !currentState.autoMode) {
      sendStateUpdate({
        homeTeam: {
          ...currentState.homeTeam,
          name: document.getElementById('home-name-input').value,
          abbr: document.getElementById('home-abbr-input').value
        },
        awayTeam: {
          ...currentState.awayTeam,
          name: document.getElementById('away-name-input').value,
          abbr: document.getElementById('away-abbr-input').value
        }
      });
    }
  };

  document.getElementById('home-name-input').addEventListener('blur', saveTeamDetails);
  document.getElementById('home-abbr-input').addEventListener('blur', saveTeamDetails);
  document.getElementById('away-name-input').addEventListener('blur', saveTeamDetails);
  document.getElementById('away-abbr-input').addEventListener('blur', saveTeamDetails);

  // Guardar ticker al pulsar Enter
  document.getElementById('new-ticker-text').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTickerItem();
  });
});

// Guardar anulación de clima (soporta texto)
function saveWeatherOverride(cityName, value) {
  console.log(`[Admin] Seteando anulación de clima para ${cityName}: ${value}`);
  ws.send(JSON.stringify({
    type: 'WEATHER_OVERRIDE_TEMP',
    cityName: cityName,
    overrideTemp: value !== null ? String(value).trim() : null
  }));
}

// Forzar sincronización manual de clima con Open-Meteo
function forceWeatherSync() {
  console.log('[Admin] Solicitando sincronización forzada de clima...');
  const btn = document.getElementById('btn-weather-sync');
  const originalText = btn.innerText;
  btn.innerText = '⏳ Sincronizando...';
  btn.disabled = true;

  ws.send(JSON.stringify({
    type: 'WEATHER_FORCE_SYNC'
  }));

  setTimeout(() => {
    btn.innerText = originalText;
    btn.disabled = false;
  }, 2000);
}

// Habilitar/Deshabilitar ciudad en la rotación
function toggleWeatherCity(name, enabled) {
  console.log(`[Admin] Cambiando habilitación de ${name} a: ${enabled}`);
  ws.send(JSON.stringify({
    type: 'WEATHER_TOGGLE_CITY',
    name: name,
    enabled: enabled
  }));
}

// Eliminar ciudad personalizada
function deleteCustomCity(name) {
  if (confirm(`¿Seguro que deseas eliminar el chiste/lugar "${name}"?`)) {
    ws.send(JSON.stringify({
      type: 'WEATHER_DELETE_CITY',
      name: name
    }));
  }
}

// Agregar fila personalizada
function addCustomCity() {
  const nameInput = document.getElementById('new-city-name');
  const tempInput = document.getElementById('new-city-temp');
  const name = nameInput.value.trim();
  const temp = tempInput.value.trim();
  
  if (!name) {
    alert('Ingresa un nombre o frase (ej: TU HERMANA).');
    return;
  }
  
  ws.send(JSON.stringify({
    type: 'WEATHER_ADD_CUSTOM',
    name: name,
    temp: temp
  }));
  
  nameInput.value = '';
  tempInput.value = '';
}
