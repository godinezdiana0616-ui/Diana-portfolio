import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
# 1. Eto ang bagong paraan ng pag-import
from google import genai
from google.genai import types
from fastapi import FastAPI, HTTPException, Header

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
    return {"status": "Buhay na buhay ang Python AI server mo, Diana!"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=request.message,
            config=types.GenerateContentConfig(
                system_instruction="You are a helpful AI assistant for Diana's portfolio website. Answer questions about her projects and skills professionally.",
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