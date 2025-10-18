# 📚 BookApp - Full Stack Application with Docker & CI/CD

A modern full-stack web application for managing books, built with React.js frontend and Node.js/Express backend, MongoDB database, and automated deployment using Docker and GitHub Actions CI/CD pipeline.

## 🏗️ Architecture Overview

```
├── client/          # React.js Frontend (Vite)
├── server/          # Node.js/Express Backend API
├── .github/
│   └── workflows/   # CI/CD Pipeline Configuration
├── compose.yml      # Docker Compose for Multi-Container Setup
└── README.md
```

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework**: React.js 19.1.1
- **Build Tool**: Vite 7.1.7
- **Package Manager**: npm
- **Linting**: ESLint
- **Port**: 4173

### Backend (Server)
- **Runtime**: Node.js 20
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Environment**: dotenv for configuration
- **Port**: 5000

### Database
- **Database**: MongoDB
- **Container**: Official MongoDB Docker image
- **Port**: 27017
- **Storage**: Persistent volume (`mongo-data`)

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Registry**: Docker Hub
- **Deployment**: Automated server deployment via SSH

## 📋 API Endpoints

The application provides a RESTful API for book management:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| POST | `/api/books` | Create a new book |
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get book by ID |
| PATCH | `/api/books/:id` | Update book by ID |
| DELETE | `/api/books/:id` | Delete book by ID |

### Book Model Schema
```javascript
{
  title: String (required),
  author: String (required),
  genre: String (required),
  publishedYear: Number (required),
  price: Number (required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🐳 Docker Configuration

### Individual Dockerfiles

#### Client Dockerfile
```dockerfile
FROM node:20
WORKDIR /var/www/html/github_actions_deployment_docker_ci-cd/client
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
```

#### Server Dockerfile
```dockerfile
FROM node:20
WORKDIR /var/www/html/github_actions_deployment_docker_ci-cd/server
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### Docker Compose Setup

The application uses Docker Compose for orchestrating multiple containers:

```yaml
services:
  client:    # React frontend
  server:    # Node.js backend
  db:        # MongoDB database
```

**Container Network:**
- Client depends on Server
- Server depends on Database
- Automatic service discovery via container names

## 🚀 Deployment Guide

### Prerequisites

1. **Docker & Docker Compose** installed on your machine
2. **Node.js 20+** (for local development)
3. **GitHub account** (for CI/CD)
4. **Docker Hub account** (for image registry)
5. **VPS/Server** with Docker installed (for production deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/taimoor115/github_actions_deployment_docker_ci-cd.git
   cd github_actions_deployment_docker_ci-cd
   ```

2. **Environment Configuration**
   
   Create `.env` file in the server directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://db:27017/bookapp
   ```

3. **Run with Docker Compose**
   ```bash
   docker compose up --build
   ```

4. **Access the Application**
   - Frontend: http://localhost:4173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

### Manual Docker Deployment

1. **Build Images**
   ```bash
   # Build client image
   cd client
   docker build -t your-username/bookapp-client .
   
   # Build server image
   cd ../server
   docker build -t your-username/bookapp-server .
   ```

2. **Push to Registry**
   ```bash
   docker push your-username/bookapp-client
   docker push your-username/bookapp-server
   ```

3. **Deploy on Server**
   ```bash
   docker compose up -d
   ```

## 🔄 CI/CD Pipeline with GitHub Actions

### Pipeline Features

- **Conditional Deployment**: Only builds and deploys changed services
- **Path-based Triggers**: Monitors `client/` and `server/` directories
- **Automated Docker Build**: Creates optimized production images
- **Registry Push**: Automatically pushes to Docker Hub
- **Zero-downtime Deployment**: Updates containers without service interruption

### Workflow Structure

```
Trigger (Push to main) 
    ↓
Check Changes (client/ or server/)
    ↓
Build Docker Images (Parallel)
    ↓
Push to Docker Hub
    ↓
Deploy to Production Server
```

### Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DOCKER_USERNAME` | Docker Hub username | `taimoorhussain` |
| `DOCKER_PASSWORD` | Docker Hub password/token | `your-docker-token` |
| `SERVER_USERNAME` | SSH username for deployment server | `root` or `ubuntu` |
| `SERVER_PASSWORD` | SSH password for deployment server | `your-ssh-password` |
| `SERVER_IP` | Production server IP address | `72.61.16.134` |

### Setting up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each required secret with its corresponding value

### Workflow Configuration

The pipeline automatically:

1. **Detects Changes**: Uses `dorny/paths-filter` to check if client or server code changed
2. **Builds Docker Images**: Only for changed services
3. **Pushes to Registry**: Uploads new images to Docker Hub
4. **Deploys to Server**: SSH into production server and updates containers

## 🖥️ Production Server Setup

### Server Requirements

- **OS**: Ubuntu 20.04+ or similar Linux distribution
- **Docker**: Latest version installed
- **Docker Compose**: V2 installed
- **SSH Access**: Enabled with password authentication
- **Ports Open**: 22 (SSH), 80/443 (HTTP/HTTPS), 4173 (Client), 5000 (API)

### Server Preparation

1. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

2. **Install Docker Compose**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Setup Application Directory**
   ```bash
   sudo mkdir -p /var/www/html/github_actions_deployment_docker_ci-cd
   sudo chown -R $USER:$USER /var/www/html/github_actions_deployment_docker_ci-cd
   cd /var/www/html/github_actions_deployment_docker_ci-cd
   ```

4. **Upload Docker Compose File**
   ```bash
   # Copy your compose.yml to the server
   scp compose.yml user@server:/var/www/html/github_actions_deployment_docker_ci-cd/
   ```

### First Deployment

```bash
# On your production server
cd /var/www/html/github_actions_deployment_docker_ci-cd
docker compose up -d
```

## 🔧 Configuration Options

### Environment Variables

#### Server Configuration
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string

#### Docker Compose Overrides
Customize `compose.yml` for your environment:

```yaml
services:
  server:
    environment:
      - NODE_ENV=production
      - PORT=5000
    # Add custom environment variables
```

### Scaling Services

Scale individual services:
```bash
docker compose up -d --scale server=3  # Run 3 server instances
```

## 🔍 Monitoring & Troubleshooting

### Checking Container Status
```bash
docker compose ps                    # Check running containers
docker compose logs -f server       # Follow server logs
docker compose logs -f client       # Follow client logs
```

### Common Issues & Solutions

1. **MongoDB Connection Issues**
   ```bash
   # Check if MongoDB is running
   docker compose logs db
   
   # Restart MongoDB
   docker compose restart db
   ```

2. **Port Conflicts**
   ```bash
   # Check which process is using the port
   sudo netstat -tulpn | grep :5000
   
   # Kill the process or change port in compose.yml
   ```

3. **Docker Build Failures**
   ```bash
   # Clear Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker compose build --no-cache
   ```

4. **SSH Deployment Issues**
   - Verify SSH credentials in GitHub secrets
   - Check server SSH configuration
   - Ensure Docker is running on the server

## 📈 Performance Optimization

### Production Optimizations

1. **Use Multi-stage Docker Builds**
2. **Implement Health Checks**
3. **Configure Resource Limits**
4. **Set up Reverse Proxy (nginx)**
5. **Enable HTTPS with SSL certificates**

### Example Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:4173;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000;
    }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Commit: `git commit -m 'Add new feature'`
5. Push: `git push origin feature/new-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Taimoor Hussain**
- GitHub: [@taimoor115](https://github.com/taimoor115)
- Docker Hub: [taimoorhussain](https://hub.docker.com/u/taimoorhussain)

## 🔗 Useful Links

- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)

---

**Happy Coding! 🚀**