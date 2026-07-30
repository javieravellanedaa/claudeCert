# claudeCert — Claude Certified Architect (CCA-F) Study Site

Sitio de estudio para la certificación **Claude Certified Architect – Foundations** de Anthropic.
Live: **https://javieravellanedaa.github.io/claudeCert/**

## Features

- **157 preguntas** en inglés (nivel certificación) organizadas por el blueprint oficial:
  5 dominios → 31 subdominios (task statements), con tags de **subdominio**, **dificultad**
  (basic/intermediate/advanced) y **fuente**.
- **Estudio adaptativo**: la próxima pregunta se elige por repetición espaciada
  (repasos vencidos → nunca vistas → ponderado por tus puntos débiles), no por lista estática.
- **Exámenes formato certificación**: 60 o 30 preguntas con la distribución oficial por dominio
  (27% / 18% / 20% / 20% / 15%), sin puntos negativos, corte 72% (≈720/1000), con desglose
  de resultado por dominio como el score report real.
- **Snippets de API/SDK y diagramas SVG** embebidos en las preguntas donde aplican
  (requests/responses reales: `stop_reason`, `tool_choice`, hooks, `cache_control`, batches…).
- **Memoria**: juego de matching concepto ↔ definición (80 pares).
- **Sesiones por email con verificación** y **grupos de estudio** (2+ estudiantes) con
  código/link de invitación y tabla comparativa de progreso.
- **Recordatorios**: notificaciones del navegador si pasás >20 h sin estudiar.

## Modos de operación

| | Modo local (default) | Modo cloud (Firebase) |
|---|---|---|
| Verificación de email | código mostrado en pantalla (demo) | **link real enviado por email** |
| Progreso | localStorage por usuario | sincronizado en Firestore |
| Grupos | dentro del mismo navegador | **entre dispositivos/personas** |

## Activar el modo cloud (5 minutos, gratis)

1. [console.firebase.google.com](https://console.firebase.google.com) → **Agregar proyecto**.
2. **Authentication → Sign-in method** → habilitar *Email/Password* y, dentro,
   *Email link (passwordless sign-in)*. En *Settings → Authorized domains* agregar
   `javieravellanedaa.github.io`.
3. **Firestore Database** → crear base y pegar estas reglas:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} { allow read, write: if request.auth != null; }
     }
   }
   ```
4. ⚙ **Configuración del proyecto → Tus apps → Web** → registrar app → copiar el
   objeto `firebaseConfig` y pegarlo en [`firebase-config.js`](firebase-config.js)
   reemplazando `null`.
5. Commit + push. El sitio detecta la config automáticamente.

## Estructura

```
index.html          app completa (estudio / memoria / examen / grupos)
data/questions.js   banco de preguntas (5 dominios, tags sub/lvl/src)
data/matches.js     pares para el modo memoria
data/enrich.js      snippets de código y diagramas SVG por pregunta
js/cloud.js         capa de sync: Firebase si hay config, localStorage si no
firebase-config.js  config del modo cloud (null = modo local)
```

## Fuentes

Temario oficial (60 preguntas / 120 min / 720 de 1000 / Pearson VUE) + recursos comunitarios:
índice del practice exam de OlivierAlter, guía dnacenta, claudecertificationguide.com,
practical test de paullarionov, repos avidevelops/hamzafarooq y dos videos de práctica de
YouTube (preguntas indexadas por concepto). Todas las preguntas fueron redactadas
originalmente cubriendo esos conceptos.
