# Clone/Create directory
mkdir digital-divide-navigator && cd digital-divide-navigator

# Setup Backend
mkdir backend && cd backend
npm init -y
npm install express cors node-fetch dotenv
# (Copy backend files here)

# Setup Frontend
cd ..
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# (Copy frontend files here and configure tailwind.config.js)