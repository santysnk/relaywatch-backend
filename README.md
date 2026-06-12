# RelayWatch — Backend

API REST para el monitoreo de **registradores eléctricos** (relés de protección y analizadores de red). Permite dar de alta equipos, configurar qué magnitudes mide cada uno (tensiones, corrientes, etc.), y generar/consultar sus lecturas periódicas.

Trabajo Práctico final del curso Full Stack — desarrollado por **Santiago** y **Vanina**.

> 🖥️ El cliente web está en su propio repositorio: [relaywatch-frontend](https://github.com/santysnk/relaywatch-frontend)

---

## Arquitectura

```
┌──────────────┐      HTTP/JSON       ┌──────────────┐      TypeORM       ┌─────────┐
│   Frontend   │  ─────────────────▶  │   Backend    │  ───────────────▶  │  MySQL  │
│ React + Vite │  ◀─────────────────  │    NestJS    │  ◀───────────────  │         │
└──────────────┘    JWT en headers    └──────────────┘                    └─────────┘
                                            │
                                      ┌─────┴──────┐
                                      │ Orquestador │  cron (cada 1 min): lee los
                                      │ + Simulador │  registradores activos y les
                                      └────────────┘  genera lecturas realistas
```

- **NestJS + TypeORM + MySQL**, validación con `class-validator`, documentación con **Swagger**.
- **Auth con JWT** y dos roles: `admin` (gestiona equipos y catálogos) e `invitado` (solo visualiza).
- **Simulador Modbus**: en lugar de conectarse a un relé real (ABB REF615), un servicio genera valores realistas en las mismas direcciones de registro que usa el equipo físico. El **orquestador** corre por cron cada minuto, procesa los registradores activos y aplica las relaciones de transformación (TT/TC) antes de guardar.
- **Soft delete de registradores**: eliminar un equipo no borra su histórico de lecturas (columna `deleted_at`); se puede restaurar desde la papelera.

## Requisitos

- [Node.js](https://nodejs.org/) 20+
- [MySQL](https://dev.mysql.com/downloads/) 8+ (probado también con 9.x)

## Puesta en marcha

```bash
# 1. Clonar e instalar dependencias
git clone https://github.com/santysnk/relaywatch-backend.git
cd relaywatch-backend
npm install

# 2. Crear la base de datos (desde MySQL Workbench o consola):
#    ejecutar el script database/schema.sql
#    → crea la base "relaywatch", todas las tablas y los datos iniciales

# 3. Configurar variables de entorno
#    copiar .env.example a .env y completar (password de MySQL, secreto JWT)

# 4. Levantar en modo desarrollo (recompila al guardar)
npm run start:dev
```

La API queda en `http://localhost:3000` y la documentación interactiva (Swagger) en **`http://localhost:3000/api`**.

### Usuario inicial

El `schema.sql` crea un administrador para poder entrar la primera vez:

| Email | Contraseña | Rol |
|---|---|---|
| `admin@relaywatch.com` | `12345678` | admin |

Los usuarios que se registran desde la app nacen con rol `invitado`.

> ⚠️ Credenciales de desarrollo para uso académico. En un despliegue real, el seed del admin se reemplaza por un proceso seguro de bootstrap.

## Endpoints

Todos requieren JWT (`Authorization: Bearer <token>`) salvo el registro y el login. Los marcados 🔒 son solo para rol `admin`.

| Módulo | Ruta | Descripción |
|---|---|---|
| Auth | `POST /auth/register` · `POST /auth/login` | Alta de usuario y login (devuelve el JWT) |
| Usuarios | `GET/PATCH/DELETE /usuarios/me` · 🔒 `GET /usuarios` | Perfil propio · listado completo |
| Registradores | `GET /registradores` · `GET /registradores/:id` | Equipos con su configuración completa |
| | 🔒 `POST` · `PATCH /:id` · `DELETE /:id` | Alta, edición y baja **lógica** (soft delete) |
| | 🔒 `GET /registradores/eliminados` · `PATCH /:id/restaurar` | Papelera: listar eliminados y restaurar |
| Catálogos 🔒 | `/parametros` · `/relaciones-transformacion` · `/titulos-paneles` | CRUD de magnitudes, relaciones TT/TC y títulos de panel |
| Lecturas | `GET /lecturas/registrador/:id/ultimas` | Última lectura de cada parámetro del equipo |

El detalle completo (cuerpos, validaciones, respuestas) está en Swagger.

## Modelo de datos

Script completo en [`database/schema.sql`](database/schema.sql). Las tablas principales:

- **usuarios** — cuentas con rol (`admin` / `invitado`).
- **registradores** — los equipos: IP, puerto, bloque de registros Modbus a leer, período de muestreo, paneles de visualización y flag `activo` (si el orquestador le genera lecturas). Soft delete vía `deleted_at`.
- **parametros** — catálogo de magnitudes medibles (nombre, unidad, dirección Modbus en el REF615).
- **relaciones_transformacion** — relaciones de TT/TC con formato `primario/secundario` (ej. `13800/110`).
- **config_registrador** — qué parámetros mide cada registrador, con su relación de transformación, panel (superior/inferior) y orden. Máximo 3 por panel.
- **lecturas** — el histórico de mediciones (valor + timestamp). Se conserva aunque el registrador se elimine.

## Reglas de negocio destacadas

- La validación de entrada es global (`ValidationPipe` con whitelist): los campos no declarados en los DTOs se rechazan.
- El título de panel `id=1` ("Sin determinar") es el default del sistema: no puede editarse ni borrarse; al borrar otro título, los registradores que lo usaban vuelven al default.
- Un parámetro **en uso** (por una configuración o una lectura) no puede eliminarse.
- Máximo **3 parámetros por panel** por registrador (validado también en el cliente).
- CORS restringido al origen del frontend (`FRONTEND_URL`).
