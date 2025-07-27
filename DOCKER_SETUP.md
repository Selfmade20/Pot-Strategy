# Docker Setup Guide for ShortLink

## Prerequisites

### Install Docker Desktop
1. **Download Docker Desktop** from [docker.com](https://www.docker.com/products/docker-desktop/)
2. **Install and start** Docker Desktop
3. **Verify installation:**
   ```bash
   docker --version
   docker-compose --version
   ```

## Quick Start

### 1. Set Environment Variables
```bash
# Copy the example environment file
cp docker.env.example .env

# Edit .env with your Supabase credentials
# Replace the placeholder values with your actual Supabase URL and key
```

### 2. Build and Run
```bash
# Build and start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### 3. Access the Application
- Open http://localhost:3000 in your browser
- The app should be fully functional with your Supabase backend

## Docker Commands

### Build the Image
```bash
docker build -t shortlink-app .
```

### Run Container
```bash
docker run -p 3000:3000 --env-file .env shortlink-app
```

### View Running Containers
```bash
docker ps
```

### Stop and Remove
```bash
docker-compose down
docker system prune -f
```

## Environment Variables

The following environment variables are required:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_BASE_URL` | Application base URL | `http://localhost:3000` |

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# Change the port in docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Build Issues
```bash
# Clean build
docker-compose down
docker system prune -f
docker-compose up --build
```

### Environment Variables Not Loading
```bash
# Check if .env file exists
ls -la .env

# Verify environment variables
docker-compose config
```

## Production Deployment

For production deployment:

1. **Update VITE_BASE_URL** in your environment file
2. **Use a reverse proxy** (nginx) for SSL termination
3. **Set up proper logging** and monitoring
4. **Use Docker volumes** for persistent data if needed

## Security Notes

- Never commit `.env` files to version control
- Use Docker secrets for sensitive data in production
- Regularly update base images for security patches
- Run containers with non-root users in production 