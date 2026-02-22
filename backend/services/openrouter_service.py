import httpx
import json
import os
from dotenv import load_dotenv
from models.schemas import SummaryResponse

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "openai/gpt-4o"

async def summarize(article: dict) -> SummaryResponse | None:
    title = article.get("title", "")
    description = article.get("description", "")

    prompt = f"""You are a financial news analyst. Analyze this article and respond with ONLY valid JSON, no other text.

Article Title: {title}
Article Description: {description}

Respond in this exact format:
{{
    "summary": "3-4 sentence summary of the article and its market implications",
    "macro_tags": ["tag1", "tag2", "tag3"]
}}

Rules:
- summary must be 3-4 sentences
- macro_tags must be 3-6 relevant market/economic themes (e.g. "Monetary Policy", "Inflation", "Tech Sector")
- respond with JSON only, no markdown, no explanation"""

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                OPENROUTER_URL,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.2,
                    "max_tokens": 300
                }
            )

            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            parsed = json.loads(content)

            return SummaryResponse(
                summary=parsed["summary"],
                macro_tags=parsed["macro_tags"]
            )

    except httpx.TimeoutException:
        print("OpenRouter request timed out")
        return None
    except (json.JSONDecodeError, KeyError) as e:
        print(f"Failed to parse OpenRouter response: {e}")
        return None
    except Exception as e:
        print(f"OpenRouter error: {e}")
        return None