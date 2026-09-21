# Contexto para agentes (Cursor / Claude)

Este repo es un hackathon de 4 h: PWA mobile-first de nevera inteligente (tickets con IA, recetas personalizadas).

## Lee primero

| Archivo | Para que |
| --- | --- |
| [STATE.md](STATE.md) | Kanban y que esta hecho |
| [docs/OWNERSHIP.md](docs/OWNERSHIP.md) | Que archivos puedes tocar |
| [docs/API_CONTRACT.md](docs/API_CONTRACT.md) | Esquemas JSON de la API |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | UI iOS liquid glass (obligatorio en frontend) |
| [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) | Pitch y happy path |
| [docs/DEMO_MOVIL.md](docs/DEMO_MOVIL.md) | Demo desde el movil (HTTPS) |

## Idioma

Todo el texto que ve el usuario va en **ingles** (UI, mensajes de error, datos mock y
valores del contrato). El codigo, los comentarios y esta documentacion, en castellano.

## Arranque

```powershell
cd backend; python -m uvicorn main:app --reload --port 8000
cd frontend; npm run dev
```

## Backend

- Routers por dominio en `backend/routers/` (no anadir logica en `main.py`).
- Todos los endpoints del contrato ya estan registrados; Gemini en `gemini_service.py` aun lanza `NotImplementedError` con fallback a mocks en receipt/recipes.

## Frontend

- Shell listo: fondos en `frontend/public/img/`, `GlassCard`, `PillButton`, `FreshnessBadge`, `ViewShell`.
- Nevera (`FridgeView.jsx`) conectada a API real.
- Recetas, Lista, Perfil: placeholders; Onboarding por crear (Dev B).
