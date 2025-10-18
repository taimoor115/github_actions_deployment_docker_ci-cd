FROM node:20
WORKDIR /var/www/html/github_actions_deployment_docker_ci-cd/server
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
