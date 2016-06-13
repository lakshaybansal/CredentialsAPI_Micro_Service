FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/credential-microservice
WORKDIR /usr/src/credential-microservice

# Install app dependencies
COPY package.json /usr/src/credential-microservice
RUN npm install

# Bundle app source
COPY . /usr/src/credential-microservice

CMD [ "npm", "start" ]
		
