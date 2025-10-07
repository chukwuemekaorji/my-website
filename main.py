from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import smtplib
from email.message import EmailMessage

app = FastAPI()

# Allow frontend to connect
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/send-message")
async def send_message(
    name: str = Form(...),
    email: str = Form(...),
    message: str = Form(...)
):
    msg = EmailMessage()
    msg["Subject"] = f"Portfolio Contact Form: {name}"
    msg["From"] = "orjichukwuemeka6233@gmail.com" 
    msg["To"] = "orjichukwuemeka6233@gmail.com" 
    msg.set_content(f"Name: {name}\nEmail: {email}\nMessage:\n{message}")

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login("orjichukwuemeka6233@gmail.com", "your_app_password")
            smtp.send_message(msg)
        return {"status": "success", "message": "Email sent!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
