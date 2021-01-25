FROM node:alpine

WORKDIR /app
#Add the private package credential
COPY .npmrc .npmrc 

COPY package.json .

RUN npm install --only=prod

#Delete credential file
RUN rm -f .npmrc

COPY . .

CMD ["npm","start"]