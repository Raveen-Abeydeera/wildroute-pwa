# 🌍 Wildroute PWA

Wildroute is a full-stack Progressive Web Application (PWA) built with the MERN stack designed for dynamic route mapping, location tracking, and geographic data management. It features interactive maps, secure user authentication, and reliable media handling. 

## ✨ Key Features

* **Interactive Mapping:** Dynamic map rendering and location tracking using **Leaflet** and **Mapbox**.
* **Progressive Web App (PWA):** Fully installable on desktop and mobile devices with offline capabilities.
* **Secure Authentication:** Robust user login and registration secured with **JWT** (JSON Web Tokens) and **bcrypt**.
* **Media Management:** Seamless image uploading and cloud storage powered by **Cloudinary** and **Multer**.
* **RESTful API:** A custom-built backend using Express and MongoDB to handle scalable data queries and user reporting.
* **Responsive UI:** A modern, mobile-first frontend styled with **Tailwind CSS**.

## 🛠️ Tech Stack

**Frontend (Client)**
* React.js (Vite)
* Tailwind CSS
* React Router DOM
* Leaflet & React-Leaflet
* Mapbox GL
* Axios

**Backend (Server)**
* Node.js & Express.js
* MongoDB & Mongoose
* JSON Web Tokens (JWT) & bcryptjs
* Cloudinary & Multer (Image Storage)
* CORS & Dotenv


## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (Local or Atlas)
* A [Cloudinary](https://cloudinary.com/) account for image uploads

### 1. Clone the Repository

git clone [https://github.com/Raveen-Abeydeera/wildroute-pwa.git](https://github.com/Raveen-Abeydeera/wildroute-pwa.git)
cd wildroute-pwa

2. Backend Setup
Navigate to the server directory, install dependencies, and set up your environment variables.
cd server
npm install


Create a .env file in the server directory and add the following variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Start the backend server: npm run dev

3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies.
cd client
npm install


Create a .env file in the client directory (if you are using Mapbox APIs):
VITE_MAPBOX_TOKEN=your_mapbox_access_token
VITE_API_URL=http://localhost:5000/api

Start the frontend development server: npm run dev


📂 Folder Structure

wildroute-pwa/
├── client/                 # React Frontend
│   ├── public/             # PWA assets (icons, manifest)
│   ├── src/                # React components, pages, context, and styles
│   ├── package.json        
│   └── vite.config.js      # Vite & PWA configuration
│
└── server/                 # Node/Express Backend
    ├── models/             # Mongoose schemas (User, Sighting, RiskZone)
    ├── routes/             # Express API routes
    ├── index.js            # Server entry point
    └── package.json        

👨‍💻 Author
Raveen Abeydeera

Website: raveenabeydeera.me

LinkedIn: Raveen Abeydeera

GitHub: @Raveen-Abeydeera
