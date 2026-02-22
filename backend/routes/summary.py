from fastapi import APIRouter, HTTPException, Query
from models.schemas import SummaryResponse
from services import cache_service, openrouter_service

router = APIRouter()

@router.get("/api/summary", response_model=SummaryResponse)
async def get_summary(article_id: str = Query(...)):
    # Check cache first
    cached = cache_service.get_summary(article_id)
    if cached:
        return cached
    
    # Get article from cache
    article = cache_service.get_article(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Call OpenRouter
    result = await openrouter_service.summarize(article)
    if not result:
        raise HTTPException(status_code=502, detail="Unable to generate summary")
    
    # Store in cache and return
    cache_service.store_summary(article_id, result)
    return result