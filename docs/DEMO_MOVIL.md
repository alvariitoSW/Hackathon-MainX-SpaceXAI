# Demo desde el movil

La app se sirve entera por el puerto **5173**: Vite hace de proxy de `/api` hacia el backend
(ver `server.proxy` en `frontend/vite.config.js`). Por eso solo hay que exponer una URL y no
existen problemas de CORS ni hay que tocar `services/api.js`.

Arranca siempre los dos servidores primero:

```powershell
# Terminal 1
cd backend; python -m uvicorn main:app --reload --port 8000

# Terminal 2
cd frontend; npm run dev
```

---

## Opcion A (recomendada): tunel HTTPS con cloudflared

Funciona en cualquier red, incluida UMnet, y da HTTPS. **La camara del movil y la instalacion
como PWA solo funcionan en HTTPS**, asi que esta es la opcion buena para el pitch.

```powershell
# Terminal 3
& "$env:LOCALAPPDATA\cloudflared\cloudflared.exe" tunnel --url http://localhost:5173
```

Imprime una URL tipo `https://algo-algo.trycloudflare.com`. Abre esa URL en el movil.

Notas:
- La URL cambia cada vez que reinicias el tunel. Generala una vez y no cierres esa terminal
  durante la demo.
- Si `cloudflared.exe` no existe, descargalo (no necesita admin):
  ```powershell
  $dir = "$env:LOCALAPPDATA\cloudflared"; New-Item -ItemType Directory -Force -Path $dir | Out-Null
  Invoke-WebRequest "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "$dir\cloudflared.exe" -UseBasicParsing
  ```

### Instalarla como PWA en el movil
- **iOS/Safari:** Compartir -> "Anadir a pantalla de inicio".
- **Android/Chrome:** menu de tres puntos -> "Instalar aplicacion".

Se abre a pantalla completa, sin barra de navegador. Mucho mejor para grabar el pitch.

---

## Opcion B: misma Wi-Fi por IP local

Mas rapida, pero **no funciona en UMnet** (red clasificada como Publica y con aislamiento de
clientes entre dispositivos). Sirve si os pasais al hotspot del movil.

1. Averigua la IP del portatil:
   ```powershell
   Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" } | Select-Object IPAddress, InterfaceAlias
   ```
2. En el movil abre `http://<IP-DEL-PORTATIL>:5173`.
3. Si no carga, es el Firewall de Windows. Abre el puerto (requiere terminal como Administrador):
   ```powershell
   New-NetFirewallRule -DisplayName "Vite 5173" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
   ```

Limitacion: va por HTTP, asi que el movil **no dejara usar la camara** para el escaner de tickets.
Tendras que usar el boton Demo/Bypass o subir una foto de la galeria.
