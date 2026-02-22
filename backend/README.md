Financial News API – Backend
A FastAPI backend that powers the live news feed on my personal portfolio site. It fetches real-time US business news, generates AI-powered summaries, and serves them to the frontend via a REST API.

What the Backend Does
GET /api/news
- Fetches the latest US business news from NewsData.io
- Parameters: q (optional search string), limit (default 5, max 5)
- Returns a list of articles with id, title, description, url, source, and published date
- Filters out low-quality sources, job postings, and duplicate articles

GET /api/summary
- Generates an AI summary for a given article
- Parameters: article_id (required)
- Returns a 3-4 sentence summary and 3-6 macro/market theme tags
- Caches results in memory so the same article is never summarized twice

How the Frontend Communicates with the Backend
On page load, the frontend calls /api/news and renders the 5 articles as a scrolling feed
When the user clicks Refresh, /api/news is called again with a cache-busting timestamp
When the user hovers over a headline, the frontend calls /api/summary?article_id=... and displays the result in a preview card to the left of the feed
All API calls are made from newsFeed.js on the frontend

Authentication and Secrets
All API keys are stored as environment variables on the backend and are never exposed to the frontend. Locally they are loaded from a .env file (excluded from version control via .gitignore). In production they are set as environment variables in the Render dashboard.

Prompt History:
Used ChatGPT to iterate project idea, Cursor to generate the comprehensive implementation plan, and Claude for the actual implementation. 

Key Prompts That Shaped Implementation:

"Create a comprehesive implementation plan that I can feed into Claude. Include the techstack, architecture, and key phases to implement"
"What do you think of this implementation plan" 
"Let's start with the backend, walk me through 1.1" 
"Let's fix the issues with the articles first" 
"It still doesn't refresh, what's wrong" 
"Let's deploy to Render walk me through the process"
