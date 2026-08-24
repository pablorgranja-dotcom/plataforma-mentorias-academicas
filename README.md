# Plataforma de Mentorías Académicas

Una solución web full-stack diseñada para conectar a estudiantes con mentores especializados, facilitando la reserva, gestión y seguimiento de asesorías académicas y técnicas en tiempo real.

---

## Demo en Vivo
* **URL Pública (Vercel):** [https://plataforma-mentorias-academicas.vercel.app/](https://plataforma-mentorias-academicas.vercel.app/)
* **Repositorio en GitHub:** [https://github.com/pablorgranja-dotcom/plataforma-mentorias-academicas](https://github.com/pablorgranja-dotcom/plataforma-mentorias-academicas)
* **Panel de Supabase:** [https://supabase.com/dashboard/project/hnvyfmgwcjkfzdarlsuz](https://supabase.com/dashboard/project/hnvyfmgwcjkfzdarlsuz)

---

## Capturas de Pantalla




---

## Stack Tecnológico

* **Framework:** Next.js `14.2.x` (App Router con Server Components y Server Actions)
* **Lenguaje:** TypeScript `5.x`
* **Estilos:** Tailwind CSS `3.4.x` con Lucide Icons
* **Base de Datos & Autenticación:** Supabase (PostgreSQL, Supabase Auth con SSR Helper, Row Level Security)
* **Integración:** GitHub REST API (Integración de avatares y perfiles)
* **Despliegue:** Vercel

---

## Roles de Usuario y Permisos

* **Aprendiz / Estudiante:**
  * Explorar el catálogo global de mentorías disponibles.
  * Buscar y filtrar mentorías por materia o temática.
  * Enviar solicitudes de mentoría con mensaje personalizado.
  * Visualizar el estado de sus solicitudes (Pendiente, Aceptada, Rechazada).
  * Cancelar solicitudes pendientes.

* **Mentor:**
  * Crear y publicar nuevas ofertas de mentoría (materia, horario, descripción).
  * Ver el listado de solicitudes recibidas por parte de los aprendices.
  * Aceptar o rechazar solicitudes de mentoría.
  * Gestionar sus publicaciones activas.

* **Administrador:**
  * Control total de la plataforma y visualización de métricas globales.
  * Gestión de usuarios y asignación/modificación de roles en `/dashboard/usuarios`.
  * Supervisión general de solicitudes y mentorías publicadas.

---

## Modelo de Datos

La base de datos en PostgreSQL (Supabase) está estructurada en tres tablas principales vinculadas mediante claves foráneas (`Foreign Keys`):

1. **`profiles`**: Almacena la información extendida de cada usuario registrado en `auth.users`.
   * `id` (UUID, Primary Key, FK a `auth.users`)
   * `full_name` (TEXT)
   * `email` (TEXT, UNIQUE)
   * `role` (TEXT: `'aprendiz'`, `'mentor'`, `'administrador'`)
   * `github_username` (TEXT, Opcional)
   * `created_at` (TIMESTAMPTZ)

2. **`mentorias`**: Registra las sesiones u ofertas académicas publicadas por los mentores.
   * `id` (UUID, Primary Key)
   * `mentor_id` (UUID, FK a `profiles.id`)
   * `titulo` (TEXT)
   * `materia` (TEXT)
   * `descripcion` (TEXT)
   * `created_at` (TIMESTAMPTZ)

3. **`solicitudes`**: Gestiona las postulaciones enviadas por los aprendices a una mentoría específica.
   * `id` (UUID, Primary Key)
   * `mentoria_id` (UUID, FK a `mentorias.id`)
   * `estudiante_id` (UUID, FK a `profiles.id`)
   * `mensaje` (TEXT)
   * `estado` (TEXT: `'PENDIENTE'`, `'ACEPTADA'`, `'RECHAZADA'`)
   * `created_at` (TIMESTAMPTZ)

---

## Instalación y Ejecución Local

Sigue estos pasos para clonar y ejecutar el proyecto en tu máquina local:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/pablorgranja-dotcom/plataforma-mentorias-academicas.git](https://github.com/pablorgranja-dotcom/plataforma-mentorias-academicas.git)
   cd plataforma-mentorias-academicas


## a) Instalar dependencias:
npm install

## b)Configurar las Variables de Entorno:
Crea un archivo llamado .env.local en la raíz del proyecto (puedes tomar como base el archivo .env.example).

## c)Iniciar el servidor de desarrollo:
npm run dev
Abrir http://localhost:3000 en el navegador.

## d)Variables de Entorno
Crear el archivo .env.local e ingresar las credenciales de Supabase:
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui

(Nota: Por razones de seguridad, las claves reales no se suben a GitHub y deben ser configuradas en las variables de entorno de Vercel en producción).

## e)Credenciales de Prueba para Evaluación
Para facilitar la revisión de los diferentes perfiles y flujos del sistema, puede utilizar las siguientes cuentas creadas en el entorno de producción:

Rol	Correo Electrónico	Contraseña	Permisos y Acceso
Aprendiz	aprendiz@test.com	Password123!	Explorar catálogo, enviar postulaciones y cancelar solicitudes.
Mentor	mentor@test.com	Password123!	Publicar mentorías y aceptar/rechazar postulaciones.
Administrador	admin@test.com	Password123!	Métricas generales y gestión global de usuarios (/dashboard/usuarios).

Checklist de Funcionalidades Implementadas
[ok] Autenticación y Autorización basada en Supabase Auth y Middleware de Next.js.

[ok] Control de Acceso Basado en Roles (RBAC: Aprendiz, Mentor, Administrador).

[ok] CRUD completo para la gestión de mentorías y solicitudes.

[ok] Integración de API pública externa (GitHub REST API para avatares y usuarios).

[ok] Panel de Control (Dashboard) dinámico según el rol autenticado.

[ok] Diseño responsivo adaptado con Tailwind CSS.

[ok] Despliegue continuo en Vercel vinculado a la rama main de GitHub.