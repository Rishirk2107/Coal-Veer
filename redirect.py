from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse,JSONResponse
import pymongo
from pydantic import BaseModel
from typing import Dict

user="Atc"

myclient = pymongo.MongoClient("mongodb+srv://Minebot:chatbotmines123@chatbot.yes8jb1.mongodb.net/")
mydb = myclient["chatbots"]
history = mydb["user1"]



def clear():
    history.delete_many({"user":user})
data=[]
cursor=history.find({"user":user}).sort("timestamp",1)
for document in cursor:
    # Extract relevant fields from the document  # Assuming "_id" is one of the fields
    field1 = document["user_input"]
    field2 = document["bot_output"]
    # Add the extracted data to the dictionary using the document_id as the key
    data.append( {
        "user_input": field1,
        "bot_output": field2,
        # Add more fields as needed
    })
print(data)
class message(BaseModel):
    message: str
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")  # Serve static files from the "static" directory
templates = Jinja2Templates(directory="templates")

@app.get("/history", response_class=HTMLResponse)
async def read_form(request: Request):
    return templates.TemplateResponse("history.html", {"request": request})

# Create a route to handle chatbot communication
@app.post("/hist/")
async def chat(messag:message):
    msg=(messag.dict())
    if msg["message"]=="Clear":
        print("Clear")
        history.delete_many({"user":"Atc"})
    return JSONResponse(content=data)