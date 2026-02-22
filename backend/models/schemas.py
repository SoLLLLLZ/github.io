from pydantic import BaseModel
from typing import Optional

class Article(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    url: str
    source: Optional[str] = None
    published_at: Optional[str] = None

class NewsResponse(BaseModel):
    articles: list[Article]

class SummaryResponse(BaseModel):
    summary: str
    macro_tags: list[str]