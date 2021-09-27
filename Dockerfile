FROM node:14

WORKDIR /usr/src/app

COPY server/package*.json ./
COPY client/package*.json ./
#RUN /bin/bash -c cd client && npm install
#RUN /bin/bash -c cd server && npm install
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["npm", "start" ,"--prefix", "server"]
#CMD [ "node", "server/index.js" ]
