# Nex.js Teslo Shop

Para correr localmente, se necesita la base de datos

```
docker-compose up -d
```

- El -d, significa **derached**

MongoDB URL Local:

```
mongodb://localhost:27017
```

- Recontruir los módulos de node e instalarlos

```
yarn install
yarn dev
```

## Configurar las variables de entorno

Renombrar el archivo **.env.template** a **.env**

## LLenar la base de datos con informacion de purbeas

Llamar a:

```
http://localhost:3000/api/seed
```
