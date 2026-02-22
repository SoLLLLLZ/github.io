from fastapi import APIRouter, HTTPException, Query
import re
from models.schemas import NewsResponse
from services import news_service, cache_service

router = APIRouter()

@router.get("/api/news", response_model=NewsResponse)
async def get_news(
    q: str = Query(default="", max_length=100),
    limit: int = Query(default=5, ge=1, le=5)
):
    if q and not re.match(r'^[a-zA-Z0-9 \-]+$', q):
        raise HTTPException(status_code=400, detail="Invalid characters in query")

    cache_service.clear_articles()
    articles = await news_service.fetch_news(q=q, limit=limit)
    return NewsResponse(articles=articles)