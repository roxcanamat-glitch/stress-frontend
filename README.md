Stress App — Frontend
Interfaz de usuario desarrollada con React y Vite para la aplicación de evaluación de ansiedad Stress App.
🌐 Deploy
La aplicación está desplegada en Netlify y accesible en:
https://boisterous-puppy-f3116b.netlify.app

🛠️ Tecnologías utilizadas
    • React 19 — librería para construir la interfaz de usuario 
    • Vite — herramienta de desarrollo y build ultrarrápida 
    • React Router DOM — para la navegación entre páginas sin recargar 
    • Axios — para hacer peticiones HTTP al backend 
    • jsPDF — para generar y descargar el historial en PDF 
    • EmailJS — para enviar emails desde el formulario de contacto sin backend 
    • ESLint — para mantener un código limpio y consistente 

📁 Estructura del proyecto
frontend/
└── frontend/          ← código fuente (ver nota sobre duplicidad)
    ├── src/
    │   ├── App.jsx              # Componente raíz, carga el router
    │   ├── main.jsx             # Punto de entrada de la app
    │   ├── index.css            # Estilos globales
    │   ├── pages/
    │   │   ├── Home.jsx         # Pantalla de inicio
    │   │   ├── Login.jsx        # Inicio de sesión
    │   │   ├── Register.jsx     # Registro de usuario
    │   │   ├── TestAnsiedad.jsx # Test de ansiedad completo
    │   │   └── Dashboard.jsx    # Historial de resultados
    │   ├── routes/
    │   │   ├── AppRouter.jsx    # Definición de rutas
    │   │   └── ProtectedRoute.jsx # Rutas protegidas por login
    │   └── services/
    │       └── api.js           # Configuración de Axios y token
    ├── index.html
    ├── vite.config.js
    ├── eslint.config.js
    └── package.json

📱 Páginas de la aplicación
/ — Inicio
Pantalla de bienvenida con botón para empezar el test, acceso al login y enlaces de contacto, privacidad y aviso legal. Incluye formulario de contacto funcional via EmailJS.
/test-ansiedad — Test
Test de 8 preguntas con 4 opciones de respuesta. Accesible sin login. Al terminar muestra el resultado con nivel de ansiedad, recomendaciones y links a playlists de música relajante en Spotify y YouTube. Si el usuario está logueado puede guardar el resultado.
/login — Inicio de sesión
Formulario de login con email y contraseña. Redirige al dashboard al entrar.
/register — Registro
Formulario de registro con nombre, email y contraseña. Redirige al login al completarse.
/dashboard — Historial (ruta protegida)
Solo accesible con login. Muestra todos los tests guardados con fecha, puntuación, estado de ánimo y notas. Permite exportar el historial completo a PDF.

🔐 Autenticación
El token JWT se guarda en localStorage al hacer login y se elimina al cerrar sesión. El archivo api.js lo añade automáticamente en cada petición al backend mediante un interceptor de Axios.
Las rutas protegidas usan el componente ProtectedRoute que redirige al login si no hay token.

⚙️ Variables de entorno
Para proteger las claves de EmailJS crea un archivo .env en la raíz del frontend:
VITE_EMAILJS_SERVICE=tu_service_id
VITE_EMAILJS_TEMPLATE=tu_template_id
VITE_EMAILJS_KEY=tu_public_key

💻 Instalación y uso en local
1. Clona el repositorio:
git clone https://github.com/roxcanamat-glitch/stress-frontend.git
cd stress-frontend/frontend
2. Instala las dependencias:
npm install
3. Arranca el servidor de desarrollo:
npm run dev
La app estará disponible en http://localhost:5173
4. Para generar la versión de producción:
npm run build

⚠️ Nota sobre la estructura de carpetas
Durante el desarrollo del proyecto se generó una carpeta duplicada, resultando en una estructura anidada (frontend/frontend/).
Esta duplicidad fue detectada durante el desarrollo pero no se corrigió para evitar romper el deploy activo en Netlify, ya que mover los archivos hubiera requerido reconfigurar el servicio de despliegue.
Es una mejora pendiente para futuras versiones del proyecto.

👤 Autor
Desarrollado por Christian Lozano como Proyecto Final del Máster en Web Development Fullstack — Neoland.
