# WEB-UPDR

Sitio público de UPDR con login/registro, sesión persistente y base preparada para inscripciones a cupos.

## Stack
- Next.js (App Router)
- Prisma + PostgreSQL
- Google Sheets (opcional) para volcar nuevos registros

## Configuración rápida
1. Instalar dependencias
```bash
npm install
```

2. Crear `.env` desde `.env.example` y completar:
- `DATABASE_URL`
- `GOOGLE_*` (opcional)
- `ADMIN_USER` / `ADMIN_PASSWORD` (para `/control-updr-admin`)

3. Crear esquema en DB
```bash
npx prisma db push
npx prisma generate
```

4. Correr local
```bash
npm run dev
```

## Auth implementada
- `/login` con dos modos: iniciar sesión / registrarme
- Registro: email, nombre, apellido, celular, DNI, contraseña
- Login: email, DNI y contraseña
- Sesión por cookie httpOnly (`updr_session`) + tabla `Session`
- Header muestra usuario logueado y botón salir

## Endpoints
- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`

## Deploy (Vercel)
- Configurar variables de entorno del `.env`
- Deploy automático desde `main`
