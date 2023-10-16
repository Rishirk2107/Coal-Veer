from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from urllib.parse import unquote
import pymongo
from pydantic import BaseModel

app = FastAPI()


myclient = pymongo.MongoClient("mongodb+srv://Minebot:chatbotmines123@chatbot.yes8jb1.mongodb.net/")
mydb = myclient["chatbots"]
users=mydb["users"]

app.mount("/static", StaticFiles(directory="./static"), name="static")  # Serve static files from the "static" directory
templates = Jinja2Templates(directory="templates")

class EmailData(BaseModel):
    emailAddress: str
    subjectInput: str
    bodyInput: str

@app.get("/", response_class="HTMLResponse")
async def signup_form(request: Request):
    return templates.TemplateResponse("complaint.html", {"request": request})

