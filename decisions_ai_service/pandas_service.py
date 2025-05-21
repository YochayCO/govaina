from fastapi import FastAPI, Request
import pandasai as pai
from pandasai_openai import OpenAI
from dotenv import load_dotenv
import os

# Load env variables
load_dotenv(".env.local")

app = FastAPI()

# LLM setup
llm = OpenAI(api_token=os.getenv("OPENAI_API_KEY"))
pai.config.set({"llm": llm})
decisions_data = pai.load("govaina/decisions-data")

@app.post("/query")
async def query_llm(request: Request):
    body = await request.json()
    question = body["question"]

    # Query decisions table
    response = decisions_data.chat(question)
    if response.error:
        print(f"Error: {response.error}")
        return {"error": response.error}

    # Use the LLM to answer the question
    print(f"response type: {response.type}")
    print(f"response value: {str(response.value)}")
    return {"answer": str(response.value)}
