# Etapa de construcción
FROM node:18 AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el código fuente al contenedor
COPY ../ /app

# Instalar dependencias
RUN npm install

# Compilar la aplicación
RUN npm run build

# Etapa final: usar una imagen ligera de Nginx para servir la aplicación
FROM nginx:stable-alpine

# Copiar los archivos construidos desde la etapa de compilación al directorio de Nginx
COPY --from=builder /app/target/build /usr/share/nginx/html

# Exponer el puerto 80 para que Nginx pueda servir la aplicación
EXPOSE 80
