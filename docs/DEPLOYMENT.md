# Deployment - Llevar a Producción

Guía completa para desplegar AlecTours a un servidor de producción.

---

## 🎯 Checklist Pre-Deployment

### Código

- [ ] Sin console.log() o print() de debug
- [ ] Sin datos sensibles hardcodeados
- [ ] Todos los tests pasando
- [ ] Linter sin errores
- [ ] README.md actualizado

### Configuración

- [ ] `.env` con valores de producción
- [ ] `SECRET_KEY` generado de forma segura
- [ ] CORS configurado correctamente
- [ ] Logging apropiado

### Base de Datos

- [ ] Migraciones aplicadas
- [ ] Backup de datos previo
- [ ] Índices creados en columnas clave
- [ ] Contraints validados

### Seguridad

- [ ] HTTPS/SSL habilitado
- [ ] Contraseñas seguras
- [ ] Variables de entorno en servidor, no en archivo
- [ ] CORS restrictivo
- [ ] Rate limiting implementado

---

## 🐳 Deployment con Docker

### 1. Crear Dockerfile Optimizado

`backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY app/ ./app/
COPY alembic/ ./alembic/
COPY alembic.ini .

# Usuario no-root
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Comando
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Docker Compose para Producción

`docker-compose.prod.yml`:
```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16
    container_name: postgres_db
    restart: always
    environment:
      POSTGRES_DB: alektours_db
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - alectours-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    image: alectours-backend:latest
    container_name: fastapi_backend
    restart: always
    environment:
      DATABASE_URL: postgresql+psycopg://${DB_USER}:${DB_PASSWORD}@postgres:5432/alektours_db
      SECRET_KEY: ${SECRET_KEY}
      ALGORITHM: HS256
      ACCESS_TOKEN_EXPIRE_MINUTES: 30
      MAIL_USERNAME: ${MAIL_USERNAME}
      MAIL_PASSWORD: ${MAIL_PASSWORD}
      MAIL_FROM: ${MAIL_FROM}
      MAIL_PORT: ${MAIL_PORT}
      MAIL_SERVER: ${MAIL_SERVER}
      MAIL_FROM_NAME: AlecTours
      MAIL_STARTTLS: ${MAIL_STARTTLS}
      MAIL_SSL_TLS: ${MAIL_SSL_TLS}
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - alectours-net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: nginx_reverse_proxy
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl/:/etc/nginx/ssl/:ro
    depends_on:
      - backend
    networks:
      - alectours-net

volumes:
  postgres_data:
    driver: local

networks:
  alectours-net:
    driver: bridge
```

### 3. Ejecutar en Producción

```bash
# Construir imagen
docker build -t alectours-backend:latest ./backend

# Iniciar servicios
docker compose -f docker-compose.prod.yml up -d

# Ejecutar migraciones
docker compose -f docker-compose.prod.yml exec backend alembic upgrade head

# Ver logs
docker compose -f docker-compose.prod.yml logs -f backend
```

---

## 🚀 Deployment en Heroku

### 1. Crear Procfile

`Procfile`:
```
web: cd backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### 2. Instalar Heroku CLI

```bash
# Linux/Mac
brew install heroku

# Windows
# Descargar desde https://devcenter.heroku.com/articles/heroku-cli
```

### 3. Deploy

```bash
# Login
heroku login

# Crear app
heroku create alectours-app

# Agregar BD PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Configurar variables
heroku config:set SECRET_KEY=<generar_seguro>
heroku config:set MAIL_USERNAME=<tu_email>
heroku config:set MAIL_PASSWORD=<tu_password>

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

---

## ☁️ Deployment en AWS

### 1. Crear EC2 Instance

```bash
# Conectarse
ssh -i key.pem ec2-user@your-instance.compute.amazonaws.com

# Instalar dependencias
sudo apt update
sudo apt install docker.io python3.11 git
sudo usermod -aG docker $USER
```

### 2. Clonar y desplegar

```bash
# Clonar repositorio
git clone <repo-url>
cd proyecto-be-fe-alectours

# Crear .env con variables de producción
nano .env

# Build y start
docker compose -f docker-compose.prod.yml up -d

# Ver logs
docker compose logs -f backend
```

### 3. Configurar RDS (Base de Datos Remota)

```bash
# En AWS Console:
# 1. Crear RDS PostgreSQL instance
# 2. Copiar endpoint
# 3. Actualizar DATABASE_URL en .env

# Conectarse a RDS
psql -h <rds-endpoint> -U admin -d alektours_db
```

---

## 🔒 HTTPS/SSL con Let's Encrypt

### 1. Nginx con Certbot

```bash
sudo apt install certbot python3-certbot-nginx

sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Certificado estará en: /etc/letsencrypt/live/yourdomain.com/
```

### 2. Configurar Nginx

`nginx.conf`:
```nginx
upstream backend {
    server backend:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 📊 Monitoring y Logging

### 1. Health Endpoint

`app/main.py`:
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.now()
    }
```

### 2. Logging Centralizado

`app/main.py`:
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"{request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response
```

### 3. Monitoreo con Prometheus

```bash
# Ver en: prometheus:9090
# Métricas en: http://localhost:8000/metrics
```

---

## 📝 Variables de Producción

Crear `.env.production` con valores seguros:

```env
DATABASE_URL=postgresql+psycopg://user:secure@db.example.com:5432/alektours_db
SECRET_KEY=<generar_con_secrets>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
MAIL_USERNAME=noreply@alectours.com
MAIL_PASSWORD=<SendGrid_API_Key>
MAIL_FROM=noreply@alectours.com
MAIL_PORT=587
MAIL_SERVER=smtp.sendgrid.net
MAIL_FROM_NAME=AlecTours
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
DEBUG=False
```

---

## 🔄 CI/CD con GitHub Actions

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t alectours-backend:latest ./backend

      - name: Push to Docker Hub
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push alectours-backend:latest

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /app
            docker compose pull
            docker compose up -d
            docker compose exec backend alembic upgrade head
```

---

## 🚨 Troubleshooting

### Error: "502 Bad Gateway"
```bash
# Backend no responde
docker compose logs backend

# Reiniciar backend
docker compose restart backend
```

### Error: "Database connection failed"
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Verificar conectividad a BD
pg_isready -h <host> -U <user>
```

### Error: "Certificate not found"
```bash
# Renovar certificado SSL
sudo certbot renew

# O manual
sudo certbot certonly --nginx -d yourdomain.com
```

---

**Ver también:** [INDEX.md](INDEX.md) | [ENV_VARIABLES.md](ENV_VARIABLES.md) | [CORE_README.md](CORE_README.md)
