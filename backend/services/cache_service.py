from models.schemas import SummaryResponse

_article_store: dict = {}
_summary_cache: dict = {}

def store_articles(articles: list) -> None:
    for article in articles:
        _article_store[article.id] = article

def get_article(article_id: str) -> dict | None:
    article = _article_store.get(article_id)
    if article:
        return article.dict()
    return None

def store_summary(article_id: str, summary: SummaryResponse) -> None:
    _summary_cache[article_id] = summary

def get_summary(article_id: str) -> SummaryResponse | None:
    return _summary_cache.get(article_id)

def clear_articles() -> None:
    _article_store.clear()