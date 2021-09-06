FROM node:12.18.4

ENV LANG C.UTF-8
ENV TZ Asia/Ho_Chi_Minh
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# set the working directory in the container
WORKDIR /code

# copy all files to the work directory
COPY . .

# perform install
RUN yarn install --silent

# run the command
RUN yarn build

# expose 3000 on container
EXPOSE 3000

# start the app
CMD ["yarn", "start" ]