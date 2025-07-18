# Git/Gitea Deployment Guide for ShowVibe

## Overview

This guide provides step-by-step instructions for deploying your ShowVibe booking platform using Git version control and Gitea (or GitHub) for continuous deployment.

## Repository Setup

### 1. Initialize Git Repository

```bash
# Navigate to your project directory
cd /path/to/showvibe

# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: ShowVibe booking platform"
```

### 2. Create Repository Structure

```
showvibe/
├── backend/
│   ├── src/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routes/
│   │   ├── static/
│   │   └── database/
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── docs/
│   ├── deployment.md
│   ├── api-documentation.md
│   └── user-guide.md
├── .gitignore
├── docker-compose.yml
└── README.md
```

### 3. Configure .gitignore

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
env.bak/
venv.bak/

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Build outputs
dist/
build/
*.egg-info/

# Database
*.db
*.sqlite
*.sqlite3

# Environment variables
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
```

## Gitea Setup

### 1. Create Gitea Repository

1. **Access Gitea Instance**: Navigate to your Gitea server
2. **Create New Repository**: Click "+" → "New Repository"
3. **Repository Settings**:
   - Repository Name: `showvibe`
   - Description: "ShowVibe - Movie, Event & Restaurant Booking Platform"
   - Visibility: Private (recommended for production)
   - Initialize with README: No (we already have files)

### 2. Add Remote Origin

```bash
# Add Gitea remote
git remote add origin https://your-gitea-server.com/username/showvibe.git

# Push to Gitea
git branch -M main
git push -u origin main
```

### 3. Configure Webhooks (Optional)

For automatic deployment on push:

1. Go to Repository Settings → Webhooks
2. Add webhook URL: `https://your-deployment-server.com/webhook`
3. Select events: Push, Pull Request
4. Set content type: `application/json`

## Deployment Strategies

### Strategy 1: Manual Deployment

```bash
# On your server
git clone https://your-gitea-server.com/username/showvibe.git
cd showvibe

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
npm run build

# Deploy
cp -r dist/* ../backend/src/static/
cd ../backend
python src/main.py
```

### Strategy 2: Docker Deployment

Create `Dockerfile` for backend:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/
COPY static/ ./src/static/

EXPOSE 5000

CMD ["python", "src/main.py"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  showvibe-backend:
    build: ./backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend/src/database:/app/src/database
    environment:
      - FLASK_ENV=production
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - showvibe-backend
    restart: unless-stopped
```

Deploy with Docker:

```bash
# Clone repository
git clone https://your-gitea-server.com/username/showvibe.git
cd showvibe

# Build and run
docker-compose up -d
```

### Strategy 3: CI/CD Pipeline

Create `.gitea/workflows/deploy.yml`:

```yaml
name: Deploy ShowVibe

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm install
        
    - name: Build frontend
      run: |
        cd frontend
        npm run build
        
    - name: Install backend dependencies
      run: |
        cd backend
        pip install -r requirements.txt
        
    - name: Copy frontend to backend
      run: |
        cp -r frontend/dist/* backend/src/static/
        
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/showvibe
          git pull origin main
          cd backend
          source venv/bin/activate
          pip install -r requirements.txt
          sudo systemctl restart showvibe
```

## Environment Configuration

### 1. Environment Variables

Create `.env.example`:

```env
# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
DEBUG=False

# Database
DATABASE_URL=sqlite:///database/app.db

# JWT Configuration
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRY_DAYS=7

# CORS Configuration
CORS_ORIGINS=https://showvibe.online,https://www.showvibe.online

# Email Configuration (Optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Payment Gateway (Future)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
```

### 2. Production Configuration

Update `backend/src/main.py` for production:

```python
import os
from dotenv import load_dotenv

load_dotenv()

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret')
app.config['DEBUG'] = os.getenv('DEBUG', 'False').lower() == 'true'
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///database/app.db')

# JWT Configuration
JWT_SECRET = os.getenv('JWT_SECRET', 'fallback-jwt-secret')

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])
```

## Server Setup

### 1. Ubuntu Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3 python3-pip python3-venv nodejs npm nginx git

# Install PM2 for process management
sudo npm install -g pm2

# Create application directory
sudo mkdir -p /var/www/showvibe
sudo chown $USER:$USER /var/www/showvibe
```

### 2. Clone and Setup

```bash
# Clone repository
cd /var/www
git clone https://your-gitea-server.com/username/showvibe.git
cd showvibe

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
npm run build

# Copy frontend build
cp -r dist/* ../backend/src/static/
```

### 3. Process Management with PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'showvibe',
    script: 'src/main.py',
    cwd: '/var/www/showvibe/backend',
    interpreter: '/var/www/showvibe/backend/venv/bin/python',
    env: {
      FLASK_ENV: 'production',
      PORT: 5000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/showvibe/error.log',
    out_file: '/var/log/showvibe/out.log',
    log_file: '/var/log/showvibe/combined.log',
    time: true
  }]
};
```

Start with PM2:

```bash
# Create log directory
sudo mkdir -p /var/log/showvibe
sudo chown $USER:$USER /var/log/showvibe

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

### 4. Nginx Configuration

Create `/etc/nginx/sites-available/showvibe`:

```nginx
server {
    listen 80;
    server_name showvibe.online www.showvibe.online;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name showvibe.online www.showvibe.online;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/showvibe.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/showvibe.online/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Static files
    location /static/ {
        alias /var/www/showvibe/backend/src/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API routes
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Frontend routes
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/showvibe /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 5. SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d showvibe.online -d www.showvibe.online

# Test auto-renewal
sudo certbot renew --dry-run
```

## Automated Deployment Script

Create `deploy.sh`:

```bash
#!/bin/bash

# ShowVibe Deployment Script
set -e

echo "🚀 Starting ShowVibe deployment..."

# Configuration
REPO_URL="https://your-gitea-server.com/username/showvibe.git"
DEPLOY_DIR="/var/www/showvibe"
BACKUP_DIR="/var/backups/showvibe"

# Create backup
echo "📦 Creating backup..."
sudo mkdir -p $BACKUP_DIR
sudo cp -r $DEPLOY_DIR $BACKUP_DIR/showvibe-$(date +%Y%m%d-%H%M%S)

# Pull latest changes
echo "📥 Pulling latest changes..."
cd $DEPLOY_DIR
git pull origin main

# Frontend build
echo "🏗️ Building frontend..."
cd frontend
npm install
npm run build

# Copy frontend to backend
echo "📋 Copying frontend files..."
cp -r dist/* ../backend/src/static/

# Backend dependencies
echo "🐍 Installing backend dependencies..."
cd ../backend
source venv/bin/activate
pip install -r requirements.txt

# Database migration (if needed)
echo "🗄️ Running database migrations..."
python -c "
from src.models.user import db
from src.main import app
with app.app_context():
    db.create_all()
    print('Database tables created/updated')
"

# Restart application
echo "🔄 Restarting application..."
pm2 restart showvibe

# Test deployment
echo "🧪 Testing deployment..."
sleep 5
curl -f http://localhost:5000/ > /dev/null && echo "✅ Application is running" || echo "❌ Application failed to start"

echo "🎉 Deployment completed successfully!"
```

Make executable and run:

```bash
chmod +x deploy.sh
./deploy.sh
```

## Monitoring and Maintenance

### 1. Log Management

```bash
# View application logs
pm2 logs showvibe

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View system logs
sudo journalctl -u nginx -f
```

### 2. Database Backup

Create `backup.sh`:

```bash
#!/bin/bash

# Database backup script
BACKUP_DIR="/var/backups/showvibe/database"
DB_FILE="/var/www/showvibe/backend/src/database/app.db"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p $BACKUP_DIR
cp $DB_FILE $BACKUP_DIR/app-$DATE.db

# Keep only last 30 backups
find $BACKUP_DIR -name "app-*.db" -mtime +30 -delete

echo "Database backup completed: app-$DATE.db"
```

Add to crontab:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /var/www/showvibe/backup.sh
```

### 3. Health Monitoring

Create `health-check.sh`:

```bash
#!/bin/bash

# Health check script
URL="https://showvibe.online"
EMAIL="admin@showvibe.online"

if ! curl -f $URL > /dev/null 2>&1; then
    echo "Website is down!" | mail -s "ShowVibe Alert: Website Down" $EMAIL
    pm2 restart showvibe
fi
```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   ```bash
   sudo chown -R $USER:$USER /var/www/showvibe
   chmod -R 755 /var/www/showvibe
   ```

2. **Database Lock Issues**
   ```bash
   sudo fuser -k /var/www/showvibe/backend/src/database/app.db
   ```

3. **Port Already in Use**
   ```bash
   sudo lsof -i :5000
   sudo kill -9 <PID>
   ```

4. **Nginx Configuration Errors**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

### Recovery Procedures

1. **Rollback Deployment**
   ```bash
   cd /var/www/showvibe
   git reset --hard HEAD~1
   ./deploy.sh
   ```

2. **Restore Database**
   ```bash
   cp /var/backups/showvibe/database/app-YYYYMMDD-HHMMSS.db /var/www/showvibe/backend/src/database/app.db
   pm2 restart showvibe
   ```

This comprehensive Git/Gitea deployment guide provides multiple deployment strategies and maintenance procedures for your ShowVibe platform.

