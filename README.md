# AeroLux - Backend

El frontend está en un repositorio aparte: https://github.com/celealbuerne/Frontend-app

## Contenidos

- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)

## Tecnologías

| Tecnología | Versión |
| --- | --- |
| PNPM | 11.27.0 |
| Node.js | 24 |
| TypeScript | 5.9.3 |
| Express | 5.2.1 |
| MySQL | 8.4 |
| MikroORM (core + mysql) | 6.6.16 |
| Multer | 2.2.0 |
| Sharp | 0.34.5 |
| Bcrypt | 6.0.0 |
| JWT (jsonwebtoken) | 9.0.3 |
| CORS | 2.8.6 |
| ESLint | 10.7.0 |
| Prettier | 3.9.6 |

## Requisitos previos

- Node.js 24
- PNPM 11
- MySQL Server 8.4 en ejecución

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/celealbuerne/Backend-app
cd Backend-app
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Crear la base de datos

Creá una base de datos vacía en MySQL:

```sql
CREATE DATABASE backend;
```
La conexión está configurada en `orm.ts` (host `127.0.0.1`, puerto `3306`, base `backend`). Las tablas se generan automáticamente al iniciar el servidor.

### 4. Configurar variables de entorno

 Creá un archivo `.env` en la raíz del proyecto y reemplazá los valores:

```env
JWT_SECRET=tu-secreto-super-seguro
JWT_EXPIRES_IN=1d

TZ='America/Argentina/Buenos_Aires'
```

> Para generar un secreto seguro: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 5. Ejecutar el proyecto

```bash
pnpm dev
```

La API estará disponible en `http://localhost:3000/api`.

## Ejecución

### Modo desarrollo

```bash
pnpm dev
```

### Modo producción

```bash
pnpm build
pnpm start
```

## Scripts Disponibles

| Script | Comando | Descripción |
| --- | --- | --- |
| dev | `pnpm dev` | Inicia el servidor en modo desarrollo con hot-reload (lee el archivo `.env`) |
| build | `pnpm build` | Compila TypeScript a la carpeta `dist` |
| start | `pnpm start` | Inicia el servidor compilado (`node dist/index.js`) |
| lint | `pnpm lint` | Ejecuta ESLint para verificar la calidad del código |
| format | `pnpm format` | Formatea el código con Prettier |

## Estructura del proyecto

Cada entidad tiene su propia carpeta dentro de `src`, con su entity, DTO, service, controller, middleware y rutas:

```
src/
├── localidad/
├── aeropuerto/
├── aeronave/
├── publicacion/
├── reserva/
├── usuario/
└── ...
```
