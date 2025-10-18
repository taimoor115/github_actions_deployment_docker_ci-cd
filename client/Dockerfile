FROM node:20
WORKDIR /var/www/html/github_actions_deployment_docker_ci-cd/client
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

CMD ["npm", "run", "preview"]
