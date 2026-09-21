# Contexto del Proyecto

## El pitch

Dos estudiantes de master en Inteligencia Artificial recien mudados a Maastricht descubren que
planificar, comprar y cocinar sano consume demasiado tiempo. El resultado es siempre el mismo:
monotonia, arroz con pollo cinco dias por semana y comida que se pudre en la nevera.

**Nuestra solucion** es una PWA mobile-first, esteticamente impecable (UI/UX estilo iOS), que
digitaliza la nevera escaneando tickets de compra con IA. Genera recetas hiper-personalizadas
basadas en el tiempo disponible, el perfil de salud del usuario y la caducidad de los alimentos,
evitando el desperdicio.

## Usuario objetivo

Estudiante o joven profesional con poco tiempo, presupuesto ajustado y necesidades nutricionales
concretas (dieta, alergias, fase hormonal).

## Propuesta de valor

1. Cero friccion para digitalizar la compra: una foto del ticket y listo.
2. Recomendaciones que respetan salud, tiempo real disponible y lo que ya tienes en casa.
3. Menos desperdicio: lo que caduca antes se cocina antes.

## Happy Path (4 pasos)

### 1. Onboarding / Perfil
Pantalla para fijar dieta, alergias, tiempo disponible para cocinar y fase hormonal. Estos datos
condicionan todas las recomendaciones nutricionales posteriores.
Persistencia: `backend/data/profile.json`.

### 2. Mi Nevera
Dashboard visual con el inventario actual. Alertas de caducidad mediante codigo de colores:
- Rojo: caduca hoy o ya caduco.
- Ambar: caduca en 1-3 dias.
- Verde: mas de 3 dias.
Persistencia: `backend/data/inventory.json`.

### 3. Escaner de Tickets
El usuario sube una foto del ticket (multipart). El backend llama a Gemini Vision para extraer
los items, inferir categoria y calcular una fecha de caducidad estimada, y actualiza el inventario.

**Critico para la demo:** el frontend incluye un boton oculto de "Demo/Bypass" que inyecta un JSON
mockeado directamente, por si la API falla durante la grabacion del pitch.

### 4. "Que como hoy?"
Un boton cruza el inventario actual (priorizando alimentos a punto de caducar) con el perfil del
usuario y llama a Gemini para devolver 2 recetas optimizadas: adaptadas al tiempo disponible, sin
alergenos y coherentes con la dieta y la fase hormonal.

## Extra
Generacion de lista de la compra con los ingredientes que faltan para las recetas propuestas.

## Restricciones del hackathon
- 4 horas de desarrollo, 2 desarrolladores en paralelo.
- Persistencia en archivos JSON, sin base de datos.
- Todo debe poder demostrarse en local: backend en `:8000`, frontend en `:5173`.
