mkdir /var/www
mkdir /var/www/media
chown -R www-data:www-data /var/www/media

docker build -t ironbank_rest ./docker_images/ironbank_rest
docker build -t deposit ./docker_images/deposit
docker build -t transfer ./docker_images/transfer
docker build -t withdrawal ./docker_images/withdrawal
docker-compose -f ./docker_compose/docker-compose.yml up --build
