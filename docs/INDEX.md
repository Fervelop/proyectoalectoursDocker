# 📚 Documentación - AlecTours

Índice completo de documentación del proyecto.

---

## 🚀 Inicio Rápido

- **[QUICKSTART.md](QUICKSTART.md)** — Guía paso a paso para empezar en 5 minutos
  - Setup inicial
  - Crear tu primer modelo
  - Crear tu primera ruta
  - Probar endpoints

---

## 📋 Estructura y Arquitectura

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — Arquitectura de la aplicación
  - Diagrama general
  - Flujo de datos
  - Componentes principales
  - Patrones de diseño

- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** — Estructura de directorios
  - Explicación de cada carpeta
  - Convenciones de nombres
  - Organización de archivos

---

## 🔐 Seguridad y Autenticación

- **[SECURITY.md](SECURITY.md)** — Guía completa de seguridad
  - JWT y tokens
  - Hashing de contraseñas
  - Autenticación
  - Autorización

- **[CORE_SECURITY.md](CORE_SECURITY.md)** — Módulo security.py
  - Funciones disponibles
  - Ejemplos de uso
  - Best practices

---

## 📧 Email y Notificaciones

- **[MAIL.md](MAIL.md)** — Módulo mail.py
  - Funciones de email
  - Plantillas HTML
  - Configuración SMTP
  - Testing de emails

---

## 🗄️ Base de Datos

- **[DATABASE.md](DATABASE.md)** — Configuración y uso de BD
  - Conexión a PostgreSQL
  - Migraciones con Alembic
  - Modelos ORM
  - Queries comunes

- **[SCHEMA.sql](SCHEMA.sql)** — Esquema completo de la BD
  - Definición de tablas
  - Relaciones
  - Constraints

---

## ⚙️ Configuración

- **[ENV_VARIABLES.md](ENV_VARIABLES.md)** — Variables de entorno
  - Lista completa
  - Descripción de cada variable
  - Valores por defecto
  - Como generar valores seguros

- **[.env.example](.env.example)** — Plantilla de .env
  - Copia para configurar

---

## 🛠️ Desarrollo

- **[BEST_PRACTICES.md](BEST_PRACTICES.md)** — Mejores prácticas
  - DO's y DON'Ts
  - Patrones recomendados
  - Errores comunes
  - Checklist de seguridad

- **[TESTING.md](TESTING.md)** — Testing y verificación
  - Unit tests
  - Integration tests
  - Mock de emails
  - Coverage

- **[CORE_README.md](CORE_README.md)** — Documentación del core
  - config.py
  - database.py
  - security.py
  - mail.py
  - examples.py

---

## 📦 Dependencias

- **[DEPENDENCIES.md](DEPENDENCIES.md)** — Gestión de dependencias
  - requirements.txt
  - Versiones pinned
  - Cómo actualizar

---

## 🚀 Deployment

- **[DEPLOYMENT.md](DEPLOYMENT.md)** — Desplegar a producción
  - Docker
  - Variables de entorno en producción
  - Health checks
  - Monitoring

---

## 🐛 Troubleshooting

- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** — Solución de problemas
  - Errores comunes
  - Cómo debuggear
  - Logs
  - Recovery

---

## 📚 Referencias

- **[GLOSSARY.md](GLOSSARY.md)** — Glosario de términos
  - JWT
  - ORM
  - SMTP
  - CRUD
  - etc.

- **[RESOURCES.md](RESOURCES.md)** — Enlaces útiles
  - Documentación oficial
  - Tutoriales
  - Librerías

---

## 🎯 Checklist

### Setup Inicial
- [ ] Leer QUICKSTART.md
- [ ] Clonar repositorio
- [ ] Crear .env
- [ ] `docker compose up -d`
- [ ] Verificar que todo funcione

### Antes de Commitar
- [ ] Leer BEST_PRACTICES.md
- [ ] Ejecutar `python verify_setup.py`
- [ ] Pasar tests
- [ ] Sin datos sensibles en Git
- [ ] Mensaje de commit claro

### Antes de Producción
- [ ] Leer DEPLOYMENT.md
- [ ] Cambiar SECRET_KEY
- [ ] Usar SMTP real
- [ ] Configurar CORS correctamente
- [ ] Setup de backups
- [ ] Monitoring activo

---

## 🔍 Búsqueda Rápida

| Quiero... | Ver... |
|-----------|--------|
| Empezar rápido | [QUICKSTART.md](QUICKSTART.md) |
| Entender la arquitectura | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Implementar autenticación | [SECURITY.md](SECURITY.md) + [CORE_SECURITY.md](CORE_SECURITY.md) |
| Enviar emails | [MAIL.md](MAIL.md) + [CORE_README.md](CORE_README.md) |
| Trabajar con BD | [DATABASE.md](DATABASE.md) + [SCHEMA.sql](SCHEMA.sql) |
| Mejores prácticas | [BEST_PRACTICES.md](BEST_PRACTICES.md) |
| Configurar variables | [ENV_VARIABLES.md](ENV_VARIABLES.md) |
| Hacer tests | [TESTING.md](TESTING.md) |
| Ir a producción | [DEPLOYMENT.md](DEPLOYMENT.md) |
| Resolver problemas | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |

---

**Última actualización**: Junio 2026

> 💡 **Tip**: Usa Ctrl+F para buscar en esta documentación
