# Plan de migración progresiva AngularJS 1.8 → Angular 19 (Produ_V3)

## 1. Estructura inicial y estilos

- [x] Crear proyecto Angular 19 con SSR y rutas.
- [x] Instalar dependencias.
- [ ] Copiar y adaptar `main.css` a `src/styles.scss`.

## 2. Migración de vistas principales

- [ ] Crear componentes standalone para cada vista:
  - login
  - savings-accounts
  - create-savings (steps)
  - admin
  - user
  - error
- [ ] Replicar estructura visual y lógica de cada vista.

## 3. Servicios y lógica de negocio

- [ ] Migrar servicios de autenticación y backend:
  - authService
  - backendService
  - savingsService
- [ ] Implementar almacenamiento seguro de JWT (SSR/browser safe).

## 4. Rutas y protección

- [ ] Configurar rutas SPA y lazy loading.
- [ ] Proteger rutas según rol y autenticación.

## 5. Buenas prácticas y detalles técnicos

- [ ] Usar HttpClientModule correctamente.
- [ ] Encapsular acceso a localStorage.
- [ ] Manejar errores de backend y mostrar mensajes claros.
- [ ] Usar tipado estricto y separar lógica en servicios.

---

Este archivo se irá actualizando conforme avance la migración.
