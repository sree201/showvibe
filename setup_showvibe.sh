#!/bin/bash

# 🏁 Define project root
PROJECT_NAME="showvibe"
mkdir -p $PROJECT_NAME && cd $PROJECT_NAME

# 📁 Create folders
mkdir -p backend/src/{models,routes,static,database}
mkdir -p frontend/{src,public}
mkdir -p docs

# 📄 Add README placeholders
touch backend/README.md frontend/README.md docs/deployment.md docs/api-documentation.md docs/user-guide.md README.md

# 🐍 Backend files
touch backend/src/main.py backend/requirements.txt backend/.env.example

# 🧩 Frontend files
touch frontend/package.json frontend/vite.config.js

# 🐳 Docker Compose
touch docker-compose.yml

# 🚫 Create .gitignore
cat <<EOF > .gitignore
__pycache__/
*.py[cod]
env/
venv/
node_modules/
npm-debug.log*
dist/
*.db
.env
.vscode/
.idea/
.DS_Store
logs/
*.log
EOF

# 🧬 Initialize Git
git init
git add .
git commit -m "Initial commit: ShowVibe booking platform"#!/bin/bash

# 🏁 Define project root
PROJECT_NAME="showvibe"
mkdir -p $PROJECT_NAME && cd $PROJECT_NAME

# 📁 Create folders
mkdir -p backend/src/{models,routes,static,database}
mkdir -p frontend/{src,public}
mkdir -p docs

# 📄 Add README placeholders
touch backend/README.md frontend/README.md docs/deployment.md docs/api-documentation.md docs/user-guide.md README.md

# 🐍 Backend files
touch backend/src/main.py backend/requirements.txt backend/.env.example

# 🧩 Frontend files
touch frontend/package.json frontend/vite.config.js

# 🐳 Docker Compose
touch docker-compose.yml

# 🚫 Create .gitignore
cat <<EOF > .gitignore
__pycache__/
*.py[cod]
env/
venv/
node_modules/
npm-debug.log*
dist/
*.db
.env
.vscode/
.idea/
.DS_Store
logs/
*.log
EOF

# 🧬 Initialize Git
git init
git add .
git commit -m "Initial commit: ShowVibe booking platform"
