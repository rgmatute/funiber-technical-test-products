# Usar la imagen de PHP
FROM php:7.4-cli

# Instalar extensiones de PHP necesarias
RUN docker-php-ext-install pdo pdo_mysql

# Configurar el directorio de trabajo
WORKDIR /var/www/html

# Copiar los archivos del proyecto al contenedor
COPY . .

# Exponer el puerto 1902
EXPOSE 1902

# Comando para iniciar el servidor PHP
CMD ["php", "-S", "0.0.0.0:1902", "-t", "public"]
