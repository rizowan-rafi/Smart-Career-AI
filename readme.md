# 🚀 Smart Career AI

An intelligent, microservices-based career guidance ecosystem designed to bridge the gap between academic skills and industry requirements. This project integrates Machine Learning and Generative AI to provide personalized career predictions, automated resume generation, real-time job scraping, and dynamic mock interviews.

Developed as a Final Year Project for **CSE 3200** at Rajshahi University of Engineering & Technology (RUET).  
**Developer:** Rizowan Mahmud Rafi (ID: 2103073)

---

## ✨ Key Features

🧠 **Hybrid AI Core**  
Combines deterministic ML (Random Forest) for career classification with Generative AI (Llama-3) for intelligent interaction.

🎯 **Career Path Prediction**  
Recommends optimal career roles based on user skills and interests with high accuracy.

💬 **AI Mock Interviewer**  
Conducts dynamic technical interviews and provides structured feedback using Groq API.

💼 **Smart Job Proxy**  
Aggregates live entry-level jobs (focused on Bangladesh) using SerpApi with in-memory caching for fast response.

📄 **Resume Builder**  
Generates professional, ATS-friendly PDF resumes automatically from user profiles.

🛡️ **Resilience Engineering**  
Includes Mock Mode fallback system to ensure uninterrupted service during API failures or rate limits.

---

## 🛠️ Technology Stack

**Frontend:** React.js (Vite), Tailwind CSS, Lucide React  
**Backend:** Node.js, Express.js, MongoDB Atlas, JWT Authentication  
**AI/ML Service:** Python (FastAPI), Scikit-Learn (Random Forest), Pandas, NumPy  
**LLM Integration:** Groq API (Llama-3-70b-versatile)

---

## 🏗️ Microservices Architecture

```bash
graph TD
    User((User))

    subgraph Frontend [Port 5173]
        UI[React SPA]
    end

    subgraph API Gateway [Port 3500]
        Node[Node.js / Express]
        Auth[JWT Authentication]
    end

    subgraph AI Service [Port 8000]
        Python[FastAPI]
        RF[Random Forest Model]
        LLM[Groq API Handler]
    end

    DB[(MongoDB Atlas)]

    User --> UI
    UI -- "REST API" --> Node
    Node --> Auth
    Node --> DB
    Node -- "Proxy" --> Python
    Python --> RF
    Python -- "External" --> LLM
```

---
## ⚙️Local Setup & Installation
### 1. Prerequisites
```bash
Node.js (v18+)
Python (v3.10+)
MongoDB Atlas Account (or local MongoDB)
Groq API Key
```
---
### 2. Clone Repository
```bash
git clone https://github.com/rizowan-rafi/Smart-Career-AI.git
cd Smart-Career-AI
```
---
### 3.Setup Python AI Service (Root Directory)
```bash
# Create a virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate
# Activate it (Mac/Linux)
source venv/bin/activate

# Install dependencies 
pip install fastapi uvicorn groq python-dotenv pandas numpy scikit-learn pydantic

# Ensure your .env file in this root folder has your key:
# GROQ_API_KEY=your_groq_key_here

# Run the FastAPI server
uvicorn main:app --reload --port 8000
```
---
### 4. Setup Node.js API Gateway
```bash
cd "New folder/smart career choice server"
npm install

# Create a .env file here and add:
# PORT=3500
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_super_secret_key
# AI_SERVICE_URL=http://localhost:8000

# Run the Node server
npm run dev
```
---
### 5. Setup React Frontend
```bash
cd "New folder/smart career choice"
npm install

# Create a .env file here and add:
# VITE_API_URL=http://localhost:3500

# Start Vite dev server
npm run dev
```



---

## 👨‍💻 Author
#### Rizowan Mahmud Rafi
##### Undergraduate Student, Department of CSE, RUET.
##### Student ID: 2103073
