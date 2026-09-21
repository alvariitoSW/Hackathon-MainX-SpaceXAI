# Reparto de trabajo y propiedad de archivos

Somos 2 desarrolladores en el mismo repo, cada uno con su Cursor. Este archivo existe para
que **nunca editemos el mismo archivo a la vez**. Si respetas el mapa, no habrá conflictos
de merge.

## Quién hace qué

| | Dev A | Dev B |
| --- | --- | --- |
| **Pantallas** | Nevera, Recetas | Lista de la compra, Perfil, Onboarding |
| **Incluye** | Escáner de tickets, integración con Gemini | Formularios, flujo de bienvenida |
| **Backend** | inventory, receipt, recipes | profile, shopping |

Dev A se encarga de su parte de punta a punta (frontend y backend). Dev B igual.

## Mapa de archivos

### Dev A — solo estos

```
backend/routers/inventory.py
backend/routers/receipt.py
backend/routers/recipes.py
backend/gemini_service.py
frontend/src/views/FridgeView.jsx
frontend/src/views/RecipesView.jsx
frontend/src/components/scanner/     <- crea aquí lo que necesites
frontend/src/components/recipes/     <- crea aquí lo que necesites
```

### Dev B — solo estos

```
backend/routers/profile.py
backend/routers/shopping.py
frontend/src/views/ProfileView.jsx
frontend/src/views/ShoppingListView.jsx
frontend/src/views/OnboardingView.jsx    <- por crear
frontend/src/App.jsx                     <- para enganchar el onboarding
frontend/src/components/forms/           <- crea aquí lo que necesites
```

### Congelados — no los toques sin avisar por chat

```
backend/main.py              solo registra routers, no debería cambiar
backend/database.py          ya tiene todo lo necesario
frontend/src/index.css       sistema de cristal
frontend/tailwind.config.js  tokens de diseño
frontend/src/lib/            freshness.js y utils.js
frontend/src/components/ui/  GlassCard, PillButton, FreshnessBadge
frontend/src/components/BottomNav.jsx
frontend/src/services/api.js ya exporta los 6 métodos del contrato
frontend/src/views/ViewShell.jsx
```

Si de verdad necesitas cambiar uno de estos, **dilo por chat antes** y hazlo con un cambio
mínimo y localizado.

### Compartidos — edítalos solo en tu sección

```
STATE.md                 mueve solo tus propias tarjetas
docs/API_CONTRACT.md     si cambias un esquema, avisa inmediatamente
```

## Reglas para crear archivos nuevos

- Componentes de Dev A: `frontend/src/components/scanner/` o `components/recipes/`
- Componentes de Dev B: `frontend/src/components/forms/`
- Nunca metas un componente nuevo directamente en `components/ui/`: esa carpeta es del
  sistema de diseño y la usamos los dos.
- Endpoints nuevos: siempre en tu router, nunca en `backend/main.py`.

## Flujo de git

Trabajamos los dos sobre `main`. Con el mapa de arriba respetado, los conflictos deberían
ser cero.

```powershell
git pull --rebase    # SIEMPRE antes de empezar y antes de pushear
git add .
git commit -m "feat(nevera): ..."
git push
```

Haz commits pequeños y frecuentes. Si `git pull --rebase` da conflicto en un archivo que
no es tuyo, quédate con la versión del otro (`git checkout --theirs <archivo>`) y avisa.

## Antes de tocar código, lee

1. `STATE.md` — qué está hecho y qué está en curso
2. `docs/API_CONTRACT.md` — los esquemas JSON exactos
3. `docs/DESIGN_SYSTEM.md` — si vas a escribir JSX, esto es obligatorio
4. `docs/PROJECT_CONTEXT.md` — el pitch, si necesitas contexto de producto
