# smstore-site

# Development using docker-compose

- Comment these lines in Dockerfile.local
```
# # expose 3000 on container
# EXPOSE 3000

# CMD ["yarn", "dev"]
```
- Run
```
docker-compose up
```

- Run this command to install dependencies
```
docker-compose run smstore-site yarn install
```

- Uncomment these lines
```
# expose 3000 on container
EXPOSE 3000

CMD ["yarn", "dev"]
```

- Ready to run
```
docker-compose up --build
docker-compose up -d
```

- Try to add new dependencies
```
docker-compose exec smstore-site yarn add ant-design-vue
```

deploy again