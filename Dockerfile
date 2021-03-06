FROM node:10.15

COPY package.json package.json
RUN npm install
COPY /src /src
COPY /test /test

EXPOSE  3000

CMD ["npm", "start"]
