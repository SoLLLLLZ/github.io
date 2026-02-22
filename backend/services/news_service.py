import httpx
import hashlib
import random
import os
from dotenv import load_dotenv
from models.schemas import Article
from services import cache_service

load_dotenv()

NEWS_DATA_API_KEY = os.getenv("NEWS_DATA_API_KEY")
NEWS_DATA_URL = "https://newsdata.io/api/1/latest"

BLOCKED_DOMAINS = [
    "watchlistnews", "tickerreport", "platodata", "globenewswire"
]

BLOCKED_TITLE_KEYWORDS = [
    "hiring", "job", "technician", "salary", "position", "career",
    "quarterly dividend", "to issue dividend", "ex-dividend"
]

def is_valid_article(item: dict) -> bool:
    description = item.get("description") or ""
    title = item.get("title") or ""
    url = item.get("link") or ""
    source = item.get("source_id") or ""

    if len(description.strip()) < 80:
        return False

    if "news.google.com" in url:
        return False

    if any(blocked in source.lower() for blocked in BLOCKED_DOMAINS):
        return False

    if any(keyword in title.lower() for keyword in BLOCKED_TITLE_KEYWORDS):
        return False

    return True

def deduplicate(articles: list[Article]) -> list[Article]:
    seen_titles = []
    unique = []

    for article in articles:
        title_words = set(article.title.lower().split())
        is_duplicate = False

        for seen in seen_titles:
            seen_words = set(seen.lower().split())
            overlap = len(title_words & seen_words) / max(len(title_words), 1)
            if overlap > 0.6:
                is_duplicate = True
                break

        if not is_duplicate:
            unique.append(article)
            seen_titles.append(article.title)

    return unique

async def fetch_news(q: str = "", limit: int = 5) -> list[Article]:
    params = {
        "apikey": NEWS_DATA_API_KEY,
        "country": "us",
        "language": "en",
        "category": "business",
        "excludedomain": "news.google.com",
        "size": 10
    }

    if q:
        params["q"] = q

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                NEWS_DATA_URL,
                params=params,
                headers={"Cache-Control": "no-cache"}
            )
            response.raise_for_status()
            data = response.json()

            articles = []
            for item in data.get("results", []):
                if not is_valid_article(item):
                    continue

                article_id = hashlib.md5(item["link"].encode()).hexdigest()
                article = Article(
                    id=article_id,
                    title=item.get("title", "No title"),
                    description=item.get("description", None),
                    url=item["link"],
                    source=item.get("source_id", None),
                    published_at=item.get("pubDate", None)
                )
                articles.append(article)

            articles = deduplicate(articles)

            # Pick 5 random from the fresh pool
            if len(articles) > 5:
                articles = random.sample(articles, 5)

            cache_service.store_articles(articles)
            return articles

    except httpx.TimeoutException:
        print("NewsData.io request timed out")
        return []
    except Exception as e:
        print(f"NewsData.io error: {e}")
        return []