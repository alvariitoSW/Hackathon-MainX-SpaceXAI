# STATE - Tablero Kanban del Hackathon

> Regla: este archivo se actualiza al terminar cada hito. Mueve tu tarjeta de columna y
> marca la casilla. Antes de empezar, lee este archivo para saber en que anda el otro dev.
> Mueve solo tus propias tarjetas.

**Reparto:** Dev A -> Nevera y Recetas | Dev B -> Lista, Perfil y Onboarding

El mapa completo de que archivo es de quien esta en `docs/OWNERSHIP.md`. Leelo antes de
tocar codigo o acabaremos con conflictos de merge.

---

## To-Do

### Dev A - Nevera
- [ ] Scanner: subida de imagen desde `FridgeView` hacia `POST /api/receipt/scan`
- [ ] Boton oculto **Demo/Bypass** que inyecta JSON mockeado sin llamar a la API
- [ ] Integrar Gemini Vision en `extract_food_from_image()`
- [ ] Estimar fecha de caducidad segun la categoria del alimento
- [ ] Poder consumir o tirar un alimento (`DELETE /api/inventory/{id}`, ya existe en backend)

### Dev A - Recetas
- [x] Vista Recetas: alerta preventiva, dashboard, selector de tiempo, craving input y recomendaciones mock
- [x] Tarjetas de receta mock (tiempo, etiquetas, boton "Cook this" y pasos expandibles)
- [ ] Integrar Gemini en `generate_recipes()` priorizando lo que caduca antes
- [ ] Respetar alergias y dieta del perfil en el prompt
- [ ] Enviar el perfil local al llamar `generateRecipes(mealType)`; el cliente ya lo adjunta automaticamente desde `localStorage`

### Dev B - Lista, Perfil y Onboarding
- [x] Vista Perfil: leer el perfil de `profileStore`, editarlo y guardarlo
- [x] Boton "Redo onboarding" en Perfil usando `clearProfile()`
- [x] Onboarding/Profile: usar frecuencia flexible de compra (`shopping_frequency`) en vez de dia fijo
- [x] Vista Lista de la compra consumiendo `POST /api/shopping-list` con fallback demo
- [x] Poder marcar ingredientes como comprados en memoria durante la sesion

### Conjunto
- [ ] Manifest PWA + iconos
- [ ] Prueba end-to-end del happy path completo
- [ ] Ensayo del pitch con el boton Demo/Bypass

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
- [x] `GET /api/profile` y `PUT /api/profile`
- [x] `POST /api/receipt/scan` con fallback a mock si Gemini falla
- [x] `POST /api/recipes/generate` con fallback a mock si Gemini falla
- [x] `POST /api/recipes/generate` prioriza `profile` enviado por el frontend y lo sincroniza a `profile.json`
- [x] `POST /api/shopping-list` derivando ingredientes que faltan
- [x] `gemini_service.py` con firmas y datos mock listos para el fallback

### Frontend
- [x] Shell `App.jsx` + `BottomNav.jsx` con estetica iOS liquid glass
- [x] `services/api.js` con los 6 metodos del contrato (rutas relativas via proxy)
- [x] Sistema de diseno: paleta, tipografia Inter + Instrument Serif, utilidades de cristal
- [x] Componentes `GlassCard`, `PillButton`, `FreshnessBadge`, `ViewShell`
- [x] Fondos generados por IA en `frontend/public/img/`
- [x] Vista **Fridge** funcionando con datos reales y semaforo de caducidad
- [x] `lib/freshness.js` con orden por urgencia y codigos de color
- [x] **Onboarding** de 5 pasos (name, gender + cycle phase, diet, allergens, routine)
- [x] `lib/profileStore.js`: perfil por dispositivo en `localStorage` + sync al backend
- [x] `?reset=1` en la URL rehace el onboarding (para repetir la demo)
- [x] **Toda la app en ingles**: UI, datos mock y valores del contrato de API
- [x] `FridgeView` saluda con el nombre real del perfil (ya no "Laura" hardcodeado)

### Demo
- [x] Acceso desde el movil por tunel HTTPS (`docs/DEMO_MOVIL.md`)

---

## Notas de sincronizacion

- Puertos: backend `8000`, frontend `5173`. Vite proxea `/api` al backend, asi que en el
  frontend se llama a rutas relativas (`/api/...`), nunca a `http://localhost:8000`.
- Para probar desde el movil, ver `docs/DEMO_MOVIL.md` (tunel HTTPS con cloudflared).
- La clave de Gemini va en `backend/.env` como `GEMINI_API_KEY`. Nunca se commitea.
- Si cambias un esquema JSON, actualiza `docs/API_CONTRACT.md` y avisa por chat.
- Endpoints nuevos van en tu router de `backend/routers/`, nunca en `main.py`.
- Perfil: la fuente de verdad para cada juez/dispositivo es `localStorage` (`smartfridge.profile`).
  El backend mantiene un solo `profile.json`, solo como sincronizacion para Gemini y fallback.
- Schedule: usamos `shopping_frequency`, no `shopping_day`. Valores visibles: `Every 5 days`,
  `Weekly`, `Every 2 weeks`, `Monthly`, `Custom`.
- Recetas: `generateRecipes(mealType)` adjunta automaticamente el perfil local; el backend lo
  usa antes que `profile.json`, asi las recetas respetan el onboarding del usuario actual.
- Idioma: todo el texto visible va en ingles, incluidos los datos mock y los valores del contrato.
  Codigo y comentarios, en castellano. Los prompts a Gemini tienen que pedir respuesta en ingles.
