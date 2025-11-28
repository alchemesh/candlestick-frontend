# Node.js
#
# docker run -itd \
#	--link rabbitmq:rabbitmq \
#	-p 3000:3000 \
#	-h jorrellsmith.com \
#	--name node-app \
#	sabatiel180/my-portfolio:v1
#

FROM node:lts-alpine

Label maintainer="Jorrell Smith <jorrells@linux.com>"

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
#RUN npm ci --only=production && npm cache clean --force

RUN npm install

# Copy source code
COPY . .

#RUN npm install

#COPY /html /var/www/html
#RUN rm /var/www/html/index.html
#RUN a2enmod ssl && a2ensite default-ssl
EXPOSE 3000
CMD ["node", "server.js"]

#ENTRYPOINT service apache2 restart && bash 


