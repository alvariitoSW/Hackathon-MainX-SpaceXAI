# STATE — Tablero Kanban del Hackathon

> **Regla:** este archivo se actualiza al terminar cada hito. Mueve tu tarjeta de columna y
> marca la casilla. Antes de empezar, lee este archivo para saber en qué anda el otro dev.
> Mueve **solo tus propias tarjetas**.

**Reparto:** Dev A -> Nevera y Recetas | Dev B -> Lista, Perfil y Onboarding

El mapa completo de qué archivo es de quién está en `docs/OWNERSHIP.md`. Léelo antes de
tocar código o acabaremos con conflictos de merge.

---

## To-Do

### Dev A — Nevera
- [ ] Escáner: subida de imagen desde `FridgeView` hacia `POST /api/receipt/scan`
- [ ] Botón oculto **Demo/Bypass** que inyecta JSON mockeado sin llamar a la API
- [ ] Integrar Gemini Vision en `extract_food_from_image()`
- [ ] Estimar fecha de caducidad según la categoría del alimento
- [ ] Poder consumir o tirar un alimento (`DELETE /api/inventory/{id}`, ya existe en backend)

### Dev A — Recetas
- [ ] Vista Recetas: botón "¿Qué como hoy?" + selector de tipo de comida
- [ ] Tarjetas de receta (tiempo, dificultad, ingredientes, pasos, nota nutricional)
- [ ] Integrar Gemini en `generate_recipes()` priorizando lo que caduca antes
- [ ] Respetar alergias y dieta del perfil en el prompt

### Dev B — Lista, Perfil y Onboarding
- [ ] Vista Perfil: formulario de dieta, alergias, tiempo de cocina y fase hormonal
- [ ] Conectar el formulario a `PUT /api/profile` (endpoint ya funcionando)
- [ ] Vista Onboarding: flujo de bienvenida que rellena el perfil la primera vez
- [ ] Enganchar el onboarding en `App.jsx` (mostrarlo si no hay perfil guardado)
- [ ] Vista Lista de la compra consumiendo `POST /api/shopping-list`
- [ ] Poder marcar ingredientes como comprados

### Conjunto
- [ ] Manifest PWA + iconos
- [ ] Prueba end-to-end del happy path completo
- [ ] Ensayo del pitch con el botón Demo/Bypass

---

## In Progress

_(nada ahora mismo)_

---

## Done

### Estructura
- [x] Monorepo `frontend/` + `backend/` + `docs/`
- [x] `.cursorrules`, `docs/PROJECT_CONTEXT.md`, `docs/API_CONTRACT.md`
- [x] `docs/OWNERSHIP.md` con el mapa de propiedad de archivos
- [x] Mocks iniciales `profile.json` e `inventory.json`

### Backend
- [x] FastAPI con CORS, dividido en routers por dominio (`backend/routers/`)
- [x] `GET /api/inventory` y `DELETE /api/inventory/{id}`
- [x] `GET /api/profile` y `PUT /api/profile` (probado, conserva acentos)
- [x] `POST /api/receipt/scan` con fallback a mock si Gemini falla
- [x] `POST /api/recipes/generate` con fallback a mock si Gemini falla
- [x] `POST /api/shopping-list` derivando ingredientes que faltan
- [x] `gemini_service.py` con firmas y datos mock listos para el fallback

### Frontend
- [x] Shell `App.jsx` + `BottomNav.jsx` con estética iOS liquid glass
- [x] `services/api.js` con los 6 métodos del contrato (rutas relativas vía proxy)
- [x] Sistema de diseño: paleta, tipografía Inter + Instrument Serif, utilidades de cristal
- [x] Componentes `GlassCard`, `PillButton`, `FreshnessBadge`, `ViewShell`
- [x] Fondos generados por IA en `frontend/public/img/`
- [x] Vista **Nevera** funcionando con datos reales y semáforo de caducidad
- [x] `lib/freshness.js` con orden por urgencia y códigos de color

### Demo
- [x] Acceso desde el móvil por túnel HTTPS (`docs/DEMO_MOVIL.md`)

---

## Notas de sincronización

- Puertos: backend `8000`, frontend `5173`. Vite proxea `/api` al backend, así que en el
  frontend se llama a rutas relativas (`/api/...`), nunca a `http://localhost:8000`.
- Para probar desde el móvil, ver `docs/DEMO_MOVIL.md` (túnel HTTPS con cloudflared).
- La clave de Gemini va en `backend/.env` como `GEMINI_API_KEY`. **Nunca** se commitea.
- Si cambias un esquema JSON, actualiza `docs/API_CONTRACT.md` y avisa por chat.
- Endpoints nuevos van en tu router de `backend/routers/`, nunca en `main.py`.
