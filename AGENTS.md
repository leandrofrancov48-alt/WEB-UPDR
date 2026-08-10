# Contexto y Memoria del Proyecto: Web Oficial Un Poco de Ruido 🎙️🎶

Este archivo (`AGENTS.md`) sirve como **fuente de verdad y memoria viva** para cualquier agente de Inteligencia Artificial que trabaje en esta base de código. Describe la arquitectura, reglas, historial de funcionalidades y el estado de desarrollo actual.

---

## 📌 1. Información General y Stack Tecnológico

- **Proyecto**: Plataforma Web Oficial y Ecosistema Digital de **Un Poco de Ruido (UPDR)**.
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Server Actions).
- **Lenguaje**: TypeScript (Strict Mode).
- **Estilos**: Tailwind CSS + Vanilla CSS para animaciones y micro-interacciones.
- **Base de Datos**: PostgreSQL alojada en [Neon](https://neon.tech/).
- **ORM**: [Prisma ORM](https://www.prisma.io/) (`prisma/schema.prisma`).
- **Autenticación**: Autenticación personalizada basada en cookies seguras / JWT y bcrypt.
- **Despliegue**: [Vercel](https://vercel.com/) conectado al repositorio de GitHub (`WEB-UPDR`).

---

## 🏗️ 2. Módulos y Funcionalidades del Sistema

### 🃏 A. Álbum de Figuritas Digital (`/album`)
- Sistema de colección de cromos de integrantes de Un Poco de Ruido, bandas invitadas y momentos históricos.
- **Mecánicas**: Apertura de sobres diaria/semanal, álbum interactivo por páginas, mercado de intercambios P2P entre usuarios, ranking global de completitud y notificaciones en tiempo real.
- **Recompensas**: Premios de sobres adicionales por acertar plenos en el Prode.

### ⚽ B. Prode Deportivo (`/prode`)
- Sistema de pronósticos de fútbol (Copa Mundial FIFA y Torneo Local).
- **Puntajes**:
  - Acierto de resultado exacto (Pleno): 3 puntos + **1 sobre de figuritas con 2 cartas**.
  - Acierto de ganador / empate: 1 punto.
- **Sincronización Automática**: API externa (`worldcup26.ir`) con endpoints de fixture y marcadores en vivo.
- **Resolución Inteligente de Cruces (`resolveTeamIdFromLabel`)**: Lógica que deduce automáticamente los clasificados a semifinales, final y tercer puesto a partir de etiquetas de la API (`Winner Match X` / `Loser Match X`).

### 🛡️ C. Panel de Control de Administración (`/control-updr-admin`)
- Módulos protegidos con rol de administrador:
  - `/control-updr-admin/album`: Gestión de cartas, rarezas y entrega de sobres.
  - `/control-updr-admin/prode`: Carga y edición manual de fixtures, sincronización forzada y cálculo de puntos.
  - `/control-updr-admin/emergentes`: Aprobación y gestión de postulaciones de bandas.
  - `/control-updr-admin/galeria`: Subida y administración de fotos oficiales.
  - **Generador de Contraseñas Temporales**: Herramienta para restablecer contraseñas de usuarios olvidadas con botón de copia rápida.

### 🎸 D. Bandas y Músicos Emergentes (`/emergente`, `/artistas`)
- Sistema para que bandas y músicos independientes envíen su material, links de YouTube/Spotify y reciban votos/likes de la comunidad.

### 🎮 E. Simulador de Carrera Cumbiera (`/juegos/simulador-carrera`)
- **Concepto**: Juego interactivo RPG / "Elige tu propia aventura" que simula la trayectoria de un músico de cumbia desde los 16 hasta los 38 años.
- **Interfaz (Estilo Copero 2 Columnas)**:
  - **Columna Izquierda (Panel del Músico y Decisiones In-Place)**:
    - OVR Badge gigante dorado/ámbar.
    - Datos: Rol musical (`🎤 VOZ LÍDER`, `🎹 TECLADO ROLAND`, `🪘 TIMBALES LP`, `🎸 BAJO CUMBIERO`, `🎺 VIENTOS TROPICALES`), Banda actual y `EDAD` + `CACHET`.
    - Métricas clave: `🌴 BAILES` (shows/recitales), `🔥 HITS` (temas pegados), `🎙️ FEATS` (colaboraciones).
    - Vitrina de trofeos y templos conquistados.
    - **Área de Decisión In-Place**: Tarjetas interactivas directas en la pantalla (sin ventanas emergentes / popups molestos) con probabilidades de éxito ("sale joya") y consecuencias en tiempo real.
  - **Columna Derecha (Línea de Tiempo)**:
    - Tabla histórica por edades (16 a 38) con bandas, templos, OVR y estadísticas acumuladas.
- **Jerarquía de Templos y Escenarios**:
  - 🥉 **Barrio**: Plazas, Sociedades de Fomento, Cumpleaños de 15.
  - 🥈 **Bailantas Clásicas**: El Tropitango (Pacheco), Jesse James (Casanova), Tornado (José C. Paz).
  - 🥇 **Teatros Históricos**: Teatro Gran Rex, Teatro Colonial, Estadio Luna Park.
  - 🏆 **Arena**: Movistar Arena (Sold Out).
  - 👑 **El Mundial de la Cumbia**: **Estadio River Plate (Monumental)** y Estadio Vélez Sarsfield.
- **Sistema de Progresión y Retiro Realista (Game Over Dinámico)**:
  - **Calibración de OVR**: Inicia en ~50 OVR. Cada acierto da +1 a +3 puntos. Llegar a 90+ OVR requiere una carrera casi perfecta.
  - **Retiros Prematuros (La realidad de la movida tropical)**:
    - 🚕 **El Remisero del Barrio**: Si el jugador es víctima de 2 estafas de productores/contratos, se queda sin dinero y cuelga los instrumentos para ponerse una remisería o un kiosco.
    - 🤕 **Garganta Rota**: Si sufre rotura de cuerdas vocales por cantar infiltrado y su OVR cae por debajo de 44, el médico le prohíbe volver a los escenarios.
    - 📺 **El Panelista Mediático**: Si acumula escándalos y bardo excesivo, los boliches lo vetan y termina como panelista de farándula en TV.
    - 📉 **Bancarrota**: Si el OVR cae por debajo de 36, nadie asiste a sus shows y debe volver a trabajar a la fábrica.
- **Pantalla de Retiro**: Generación de tarjeta coleccionable con veredicto de legado (*Dios de la Cumbia*, *Ídolo Popular*, *Clásico del Tropitango*, *El Remisero del Barrio*, *Garganta Rota*, etc.) y botón de compartir.

---

## 🌿 3. Estrategia de Ramas en Git

- **`main`**: Rama de producción que se despliega automáticamente en el dominio principal de Vercel.
- **`demo-simulador-cumbia`**: Rama de desarrollo y vista previa privada del Simulador de Carrera para pruebas con clientes antes del lanzamiento público.

---

## 🛠️ 4. Comandos y Entorno de Desarrollo (Windows PowerShell)

- **Iniciar servidor de desarrollo**:
  ```powershell
  cmd.exe /c "npm run dev"
  ```
- **Generar cliente de Prisma**:
  ```powershell
  cmd.exe /c "npx prisma generate"
  ```
- **Compilar para producción (validación de build)**:
  ```powershell
  cmd.exe /c "npx next build"
  ```

---

## 💡 5. Reglas de Diseño y Experiencia de Usuario (UI/UX)

1. **Sin Popups Invasivos**: Preferir siempre componentes *in-place* que no bloqueen la vista ni interrumpan el flujo del juego.
2. **Jerga y Cultura Cumbiera**: Mantener siempre la identidad criolla, popular y divertida de la movida tropical argentina en textos, diálogos y eventos.
3. **Tipografía Nítida y Amplia**: Evitar textos excesivamente pequeños; priorizar fuentes legibles, números grandes en métricas clave y contrastes adecuados sobre fondo oscuro `#0e1015`.
