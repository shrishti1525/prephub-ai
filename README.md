# 🚀 PrepHub AI — Intelligent Campus Placement Preparation Platform

> **PrepHub AI** is an all-in-one, developer-first placement readiness platform that replaces fragmented spreadsheets, Telegram groups, and random PDFs with an integrated workspace powered by **Google Gemini AI** and interactive **3D WebGL animations**.

![PrepHub AI Platform](https://img.shields.io/badge/Status-Active-emerald?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-3D-black?style=for-the-badge&logo=three.js)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-3.5%20Core-blue?style=for-the-badge&logo=google)

---

## ✨ Key Features

### 1. ⚡ DSA Algorithm Placement Tracker & AI Mentor
- **LeetCode & Striver Problem Organization**: Track problems across Arrays, Two Pointers, Sliding Window, Trees, Dynamic Programming, and Graphs.
- **Dynamic Metric Ribbon**: Real-time counter for Total, Easy, Medium, Hard, Solved, and Starred problems.
- **✨ Gemini AI Algorithm Mentor**: On-demand structured hints breaking down **Core Intuition**, **Step-by-Step Approach**, **Optimal Time & Space Complexities** ($O(N)$, $O(1)$), and **Common Pitfalls** without giving away the direct code.

### 2. 🎯 Placement Aptitude Engine & Speed Sprint
- **Online Assessment (OA) Speed Sprint**: 5-question timed mock test with a strict 5-minute countdown, simulating initial rounds of TCS NQT, Infosys, Cognizant, Capgemini, and product firms.
- **Multi-Category Coverage**: Quantitative Aptitude, Logical Reasoning, Verbal Ability, and Mixed Placement Mocks.
- **Comprehensive Question Bank**: Filterable question browser with instant step-by-step formula explanations and shortcuts.
- **Attempt History**: Tracks test scores, accuracy percentages, and duration over time.

### 3. 📄 AI Resume ATS Compliance Scanner & Optimizer
- **Dual Input Modes**: Drag-and-drop PDF/TXT parser or direct text paste.
- **Corporate ATS Simulation**: Evaluates resumes against target roles (SDE, Frontend, Backend, Full Stack, Data/ML, DevOps) matching Workday, Taleo, and Greenhouse screening filters.
- **Deep Diagnostics**: Circular ATS score gauge, sub-metrics for Skills Match, Quantifiable Impact, and Readability.
- **Actionable Optimization**: Detects missing industry keywords with a 1-click copy cloud, and suggests bullet improvements using the Google **STAR methodology** (Situation, Task, Action, Result).

### 4. 🧭 Personalized AI Placement Coach & Study Planner
- **Target Company & Tier Roadmaps**: Tailored preparation for FAANG/MNCs, Unicorn Startups, or IT Service Giants (TCS/Infosys/Wipro).
- **Flexible Timelines**: 7-Day Crash Course, 15-Day Sprint, or 30-Day Mastery roadmap.
- **Day-by-Day Milestone Plan**: Morning DSA core topics, Afternoon Aptitude focus, Evening System Design / Projects, and Night revision checkpoints.
- **Interactive Checkbox Tracking**: Auto-calculates completion percentage and persists progress to MongoDB.

### 5. 💼 Campus Interview Experiences Archive
- **Community Sourced Debriefs**: Real candidate experiences filterable by company (Google, Amazon, Microsoft, TCS, Infosys, Goldman Sachs, etc.).
- **Round-by-Round Timeline**: Online Assessment $\rightarrow$ Technical Round 1 $\rightarrow$ Technical Round 2 $\rightarrow$ HR/Managerial.
- **Peer Collaboration**: Community upvoting counter and instant share modal.

### 6. 🌐 3D WebGL Visual Experience
- **Interactive Three.js 3D Hero Tech Orb**: Wireframe icosahedron, glowing purple octahedron crystal, orbiting neon torus rings, data satellite nodes, and a 450-particle constellation reacting to mouse parallax.
- **Placement Readiness 3D Tech Core**: Dynamic 3D spinning energy core colored by candidate tier (Level 1 Amber, Level 2 Cyan, Level 3 Emerald).
- **Physics Tilt Cards**: Real-time perspective transforms (`rotateX`, `rotateY`, `translateZ`) and cursor-tracking specular glare.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **3D Graphics & Animations**: Three.js WebGL
- **Styling**: Modern Cyber-Dark Glassmorphic UI with CSS Variables
- **Routing**: React Router v7
- **Charts & Data Visualization**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt password hashing
- **File Parsing**: Multer & pdf-parse
- **AI Engine**: Google Gemini API (`@google/genai` & REST)

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local daemon or MongoDB Atlas URI)
- [Google Gemini API Key](https://aistudio.google.com/) (free tier available)

### 1. Clone the Repository
```bash
git clone https://github.com/shrishti1525/prephub-ai.git
cd prephub-ai
```

### 2. Configure Backend Environment
Create a `.env` file in the `backend/` directory based on `.env.example`:
```bash
cd backend
cp .env.example .env
```
Populate your credentials:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/prephub
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 4. Run the Development Servers

**Start Backend Server:**
```bash
cd backend
node index.js
# Backend runs on http://localhost:5000
```

**Start Frontend Development Server:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📁 Project Structure

```
prephub-ai/
├── backend/
│   ├── middleware/      # JWT authentication middleware
│   ├── models/          # Mongoose schemas (User, Problem, Aptitude, Resume, StudyPlan, Experience)
│   ├── routes/          # Express REST API routes
│   ├── seeds/           # Aptitude questions & interview experience seeders
│   ├── services/        # Gemini AI integration service
│   ├── .env.example     # Environment template
│   ├── index.js         # Backend server entry point
│   └── package.json
├── frontend/
│   ├── public/          # Static assets & icons
│   ├── src/
│   │   ├── components/  # Hero3DCanvas, ReadinessOrb3D, TiltCard3D, Navbar, Sidebar
│   │   ├── pages/       # Home, Dashboard, DsaTracker, Aptitude, ResumeManager, AiCoach, Experiences
│   │   ├── App.jsx      # Main application routing & auth guard
│   │   └── main.jsx     # Vite DOM entry
│   ├── index.html       # Single page HTML
│   └── vite.config.js
├── .gitignore           # Global git ignore configuration
└── README.md
```

---

## 🔒 Security & Privacy
- All API keys and secrets are strictly excluded via `.gitignore`.
- Authentication is secured via industry-standard salted bcrypt password hashing and signed JSON Web Tokens.
- Gemini AI fallbacks are implemented to guarantee zero downtime even if rate limits occur.

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
