import os
import joblib
import numpy as np
import json
import random
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq 
from dotenv import load_dotenv

load_dotenv()
# Initialize the App
app = FastAPI()

# ==========================================
# 1. ENABLE CORS
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 2. LOAD MODELS
# ==========================================
try:
    model = joblib.load('career_model.joblib')
    mlb = joblib.load('mlb.joblib')
    edu_map = joblib.load('edu_map.joblib')
    print("✅ Career Models Loaded Successfully")
except Exception as e:
    print(f"⚠️ Warning: Could not load ML models. Prediction will fail. Error: {e}")

# ==========================================
# 3. CONFIGURE GROQ
# ==========================================
# PASTE YOUR GROQ API KEY HERE
GROQ_API_KEY = os.getenv("GROQ_API_KEY") 


try:
    client = Groq(api_key=GROQ_API_KEY)
    has_api_access = True
    print("✅ Groq AI Connected")
    
except:
    has_api_access = False
    print("⚠️ Warning: Groq API Key missing or invalid. Using MOCK mode.")

# ==========================================
# 4. DATA MODELS
# ==========================================
class UserInput(BaseModel):
    education: str
    skills: list
    interests: list

class TopicRequest(BaseModel):
    topic: str

class AnswerSubmission(BaseModel):
    topic: str
    qa_list: list

# ==========================================
# 5. API ENDPOINTS
# ==========================================

@app.get("/")
def home():
    return {"message": "Smart Career AI Service is Running"}

# --- FEATURE A: PREDICTION ---
@app.post("/predict")
def predict_career(data: UserInput):
    try:
        edu_val = edu_map.get(data.education, 1)
        clean_skills = [s.strip().lower().replace(".", "") for s in data.skills]
        clean_interests = [i.strip().lower() for i in data.interests]
        combined = clean_skills + clean_interests
        encoded_multi = mlb.transform([combined])
        final_input = np.hstack(([[edu_val]], encoded_multi))
        prediction = model.predict(final_input)
        return {"recommended_career": prediction[0]}
    except Exception as e:
        print(f"Prediction Error: {e}")
        return {"recommended_career": "Software Engineer (Fallback)"}

# --- FEATURE B: GENERATE QUESTIONS (UPDATED MODEL) ---
@app.post("/generate-questions")
def generate_questions(req: TopicRequest):
    if has_api_access:
        try:
            prompt = f"""
            Generate 5 technical interview questions for the topic: {req.topic}.
            - Make them RANDOM and UNIQUE.
            - Random seed: {random.random()} 
            Return ONLY a raw JSON list of strings. Example: ["Q1", "Q2"]
            """

            # UPDATED MODEL NAME HERE
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile", 
                messages=[
                    {"role": "system", "content": "You are a creative technical interviewer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.9,
                max_tokens=250,
            )
            
            response_text = completion.choices[0].message.content
            start = response_text.find('[')
            end = response_text.rfind(']') + 1
            if start != -1 and end != -1:
                questions_str = response_text[start:end]
                return {"questions": eval(questions_str)}
                
        except Exception as e:
            print(f"Groq Gen Error: {e}")

    # Fallback
    return {"questions": [f"What is {req.topic}?", f"Explain features of {req.topic}", f"Pros/Cons of {req.topic}", f"History of {req.topic}", f"Future of {req.topic}"]}

# --- FEATURE C: EVALUATE (UPDATED MODEL) ---
@app.post("/evaluate-interview")
def evaluate_interview(sub: AnswerSubmission):
    if has_api_access:
        try:
            conversation = ""
            for item in sub.qa_list:
                conversation += f"Q: {item['question']}\nA: {item['user_answer']}\n\n"

            prompt = f"""
            Act as a technical interviewer. Evaluate these answers for the topic: {sub.topic}.
            TRANSCRIPT:
            {conversation}
            Grading Rules:
            - If answers are gibberish/random text -> Score 0.
            - If answers are correct -> Score high.
            Return a JSON object exactly like this:
            {{
                "score": 0,
                "is_ready": false,
                "feedback": "Reason...",
                "resources": ["Resource 1", "Resource 2"]
            }}
            """

            # UPDATED MODEL NAME HERE
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2, 
            )
            
            content = completion.choices[0].message.content
            start_index = content.find('{')
            end_index = content.rfind('}') + 1
            
            if start_index == -1 or end_index == 0:
                raise ValueError("AI output was not valid JSON")
                
            json_str = content[start_index:end_index]
            return json.loads(json_str)
            
        except Exception as e:
            print(f"❌ Eval Error: {e}")

    # Fallback
    return {
        "score": 0,
        "is_ready": False,
        "feedback": "System Error: Unable to evaluate answers.",
        "resources": ["Check Internet"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)