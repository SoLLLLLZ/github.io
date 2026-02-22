from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from routes import news, summary

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://github.com/SoLLLLLZ/github.io"],
    allow_methods=["GET"],
    allow_headers=["*"]
)

app.include_router(news.router)
app.include_router(summary.router)

@app.get("/")
async def root():
    return RedirectResponse(url="/health")

@app.get("/health")
async def health():
    return {"status": "ok"}