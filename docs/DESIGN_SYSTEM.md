# Sistema de diseño

**Lee esto antes de escribir cualquier JSX.** El sistema ya está montado y la pantalla
Nevera ya lo usa. No inventes estilos nuevos: reutiliza estos tokens y componentes o las
pantallas quedarán descoordinadas.

## La idea en una frase

Fotografía cálida a pantalla completa + tarjetas de cristal esmerilado encima + tipografía
que mezcla sans y serif itálica. Estética iOS 26 (Liquid Glass), mobile-first.

## Fondos

Cada pestaña tiene su fondo, definido en el mapa `BACKGROUNDS` de `frontend/src/App.jsx`.
Las imágenes están en `frontend/public/img/`. Un degradado oscuro encima garantiza que el
texto blanco siempre sea legible.

Como el fondo es oscuro, **todo el texto va en blanco o en blanco translúcido**. Nunca uses
`text-slate-*` ni `text-gray-*` en contenido sobre el fondo.

| Uso | Clase |
| --- | --- |
| Texto principal | `text-white` |
| Texto secundario | `text-white/60` o `text-white/70` |
| Etiquetas y eyebrows | `text-white/50` |

## Colores

Definidos en `frontend/tailwind.config.js`.

| Token | Hex | Para qué |
| --- | --- | --- |
| `cream` | `#F7F1E8` | Fondos claros puntuales |
| `sand` | `#E8DCC8` | Superficies secundarias |
| `clay` | `#C97B4A` | Acento principal (botones de acción) |
| `ember` | `#A8522C` | Acento oscuro, sombras del acento |
| `bark` | `#3D3229` | Texto sobre superficies claras, fondo del body |
| `fresh` | `#4E9B6B` | Verde: caduca en más de 3 días |
| `soon` | `#D9992B` | Ámbar: caduca en 1-3 días |
| `urgent` | `#D0553F` | Rojo: caduca hoy o ya caducó |

## Tipografía

- **Sans:** Inter. Es la de por defecto, no hace falta declararla.
- **Serif:** Instrument Serif, solo en itálica y solo para el acento del titular.

El patrón de titular es siempre el mismo: dos líneas, la segunda en serif itálica.

```jsx
<h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-white text-shadow-soft">
  Tu nevera,
  <br />
  <span className="font-serif italic font-normal">tu chef</span>
</h1>
```

No uses la serif para texto corrido. Solo para ese acento.

## Utilidades de cristal

Definidas en `frontend/src/index.css`.

| Clase | Cuándo |
| --- | --- |
| `.glass` | Tarjetas sobre el fondo fotográfico. Es la que usarás el 90% de las veces. |
| `.glass-solid` | Cristal casi opaco, para cuando necesites máximo contraste (formularios). |
| `.glass-specular` | Añade el brillo del borde superior. Va siempre junto a las anteriores. |
| `.text-shadow-soft` | Sombra suave en titulares grandes sobre foto. |

El `saturate(180%)` del `backdrop-filter` es lo que hace que el cristal recoja el color del
fondo en vez de verse gris. Si copias el efecto a otro sitio, no lo quites.

## Componentes

Están en `frontend/src/components/ui/`. Úsalos, no los reescribas.

### `GlassCard`

```jsx
import GlassCard from "../components/ui/GlassCard";

<GlassCard className="p-4">contenido</GlassCard>
<GlassCard variant="solid" className="p-5">formulario</GlassCard>
```

Ya aplica `rounded-3xl` y el brillo especular. Acepta `as` para cambiar la etiqueta HTML.

### `PillButton`

```jsx
import PillButton from "../components/ui/PillButton";

<PillButton onClick={fn}>Escanear ticket</PillButton>
<PillButton variant="accent">Generar recetas</PillButton>
<PillButton variant="ghost">Omitir</PillButton>
```

Variantes: `primary` (blanco, por defecto), `accent` (naranja `clay`), `ghost` (cristal).
Ocupa el ancho completo y ya trae el feedback táctil al pulsar.

### `FreshnessBadge`

```jsx
import FreshnessBadge from "../components/ui/FreshnessBadge";
import { freshnessOf } from "../lib/freshness";

<FreshnessBadge freshness={freshnessOf(item)} />
```

### `ViewShell`

Cabecera compartida de las pantallas secundarias. Te ahorra repetir el titular.

```jsx
import ViewShell, { Placeholder } from "./ViewShell";

<ViewShell eyebrow="Hoy toca" title="¿Qué como" accent="hoy?">
  {/* tu contenido */}
</ViewShell>
```

## Lógica de caducidad

En `frontend/src/lib/freshness.js`. No la reimplementes.

| Función | Devuelve |
| --- | --- |
| `daysUntil(fecha)` | Días hasta caducar, o `null` si no caduca |
| `freshnessOf(item)` | `{ level, days, label, dot, text }` con las clases de color ya resueltas |
| `sortByUrgency(items)` | Los que caducan antes, primero |
| `emojiFor(categoria)` | Emoji del alimento según su categoría |
| `categoryLabel(categoria)` | Nombre de categoría con acentos para mostrar |

Los alimentos se muestran **siempre ordenados por urgencia**. Es el argumento
anti-desperdicio del pitch y tiene que verse sin explicarlo.

## Animaciones

`animate-fade-up` para la entrada de elementos, escalonando con `animationDelay` inline:

```jsx
<div className="animate-fade-up" style={{ animationDelay: `${180 + index * 60}ms` }}>
```

Que el escalonado total no pase de ~500 ms, o la pantalla tarda demasiado en aparecer
durante la demo.

## Reglas

- Todo vive dentro del contenedor `max-w-md mx-auto` de `App.jsx`. No lo toques.
- No añadas dependencias de UI nuevas sin preguntar. El cristal es CSS puro a propósito.
- Nada de `bg-white` sólido a pantalla completa: taparía el fondo y rompería la estética.
- Radios: `rounded-3xl` para tarjetas, `rounded-full` para botones y badges.
- Emoji para los alimentos, no imágenes: Gemini puede devolver alimentos que no conocemos
  de antemano y con imágenes pregeneradas se rompería en directo.
