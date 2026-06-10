import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
# 1. Eto ang bagong paraan ng pag-import
from google import genai
from google.genai import types

# Basahin ang .env file
load_dotenv()

app = FastAPI(title="Diana's Portfolio AI Microservice")

# CORS Setup para makakonekta ang Java Backend mo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Siguraduhing may API Key
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("Missing GEMINI_API_KEY in environment variables.")

# 2. Dito mo i-initialize ang bagong Client ng Google GenAI
client = genai.Client(api_key=api_key)

# Pydantic Model para sa natatanggap na request mula sa Java
class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"status": "Python are open"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=request.message,
            config=types.GenerateContentConfig(
                system_instruction="""You are Diana Capellan's AI Assistant on her portfolio website.
                About Diana:
                - Full name: Diana Rose Capellan (Diana Capellan)
                - Age: 21 years old
                - Birthday: June 16, 2004
                - Bachelor Degree: BS Information Technology at Pambayang Dalubhasaan ng Marilao (Batch 2022-2026)
                - Awarded BEST CAPSTONE for SheltCare: A Pet Adoption and Shelter Monitoring with Temperature Reading and Humidifer Control using ESP32 for Maxx's Furry Friends Animal Shelter
                - SheltCare website: https://maxxfurryfriends.com/website/website_interface/MainPage.php
                - OJT: 500 Hours Onsite - Developed Production Downtime & Planning Systems

                About Me:
                - Hardworking and dedicated individual with a strong passion for technology and continuous learning
                - Flexible and adaptable in working independently or as part of a team
                - Experienced in both software development and hardware integration
                - Developed IoT-based systems involving sensors, microcontrollers, and web applications
                - Strong problem-solving and analytical skills
                - Committed to delivering quality projects and meeting deadlines
                - Eager to learn new technologies and enhance technical expertise
                                
                Technical Skills:
                - PHP, HTML, CSS, JavaScript, SQL Server, C#, C++, MIS, Excel/Access, Excel, Power BI, Python, Java, GitHub, Google GenAI API, Microsoft Azure AI Services
                
                Contact:
                - Email: godinezdiana0616@gmail.com
                - Mobile: +639653612008
                - Instagram: https://www.instagram.com/dianacapellan16/
                - Facebook: https://www.facebook.com/profile.php?id=100005964498895
                

                Answer questions about Diana professionally and helpfully. If asked something unrelated to Diana, politely redirect to her portfolio topics.""",
                temperature=0.7,
            )
        )
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) #  TAMAN ANG PAG-RAISE NG HTTPException PARA MAIPASA ANG ERROR SA JAVA
# Para direktang ma-run gamit ang python app.py (opsyonal pero madaling gamitin)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)