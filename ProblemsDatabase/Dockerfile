FROM mongo:7.0

ENV MONGO_INITDB_DATABASE=admin
ENV MONGO_INITDB_ROOT_USERNAME=admin
ENV MONGO_INITDB_ROOT_PASSWORD=password

COPY mongo-init.js /docker-entrypoint-initdb.d/

EXPOSE 27017