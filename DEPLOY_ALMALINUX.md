# Despliegue rápido en AlmaLinux 9

Archivos importantes añadidos en la raíz del repo:
- `Dockerfile` — multi-stage usando `node:20` builder y `node:20-alpine` runtime, asume `next.config.mjs` con `output: 'standalone'`.
- `docker-compose.yml` — levanta el servicio `frontend` en el puerto 3000.
- `.dockerignore` — ajustado para excluir `node_modules` y `.next`.

Pasos para desplegar en la VM (asumiendo el repo está en `/root/frontoptica`):

1) Instalar Docker (si no está):

   sudo dnf -y install dnf-plugins-core
   sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
   sudo dnf -y install docker-ce docker-ce-cli containerd.io docker-compose-plugin
   sudo systemctl enable --now docker

2) Construir y ejecutar con docker-compose:

   cd /root/frontoptica
   sudo docker compose up --build -d

3) Verificar:

   sudo docker compose ps
   sudo docker compose logs -f

Notas:
- Si el build falla por memoria, crear swap temporal: `sudo fallocate -l 4G /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`.
- Para producción es recomendable construir en CI y push a registry.
