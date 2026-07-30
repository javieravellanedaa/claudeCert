/* MODO CLOUD (opcional) — activa emails de verificación reales y grupos
   sincronizados entre dispositivos.

   Para activarlo (5 minutos, gratis, plan Spark):
   1. https://console.firebase.google.com → "Agregar proyecto" (ej.: claudecert)
   2. Build → Authentication → Sign-in method → habilitar "Email/Password"
      y dentro de esa opción activar "Email link (passwordless sign-in)".
      En Settings → Authorized domains agregar: javieravellanedaa.github.io
   3. Build → Firestore Database → Crear base (production mode) y en Rules pegar:
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /{document=**} {
              allow read, write: if request.auth != null;
            }
          }
        }
   4. Configuración del proyecto (⚙) → Tus apps → Web (</>) → registrar app
      → copiar el objeto firebaseConfig y pegarlo abajo reemplazando null.
   5. git commit + push. Listo: el login pasa a enviar un link de verificación
      por email real y los grupos/progreso se sincronizan vía Firestore.

   Sin config (null), el sitio funciona en MODO LOCAL: el código de
   verificación se muestra en pantalla y los grupos viven en este navegador. */
window.FIREBASE_CONFIG = null;
/* Ejemplo:
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "claudecert.firebaseapp.com",
  projectId: "claudecert",
  appId: "1:1234567890:web:abc123"
};
*/
