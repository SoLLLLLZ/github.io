const API_BASE = 'https://personal-website-khgr.onrender.com';

const feedList = document.getElementById('feedList');
const feedRefresh = document.getElementById('feedRefresh');
const previewCard = document.getElementById('newsPreviewCard');

let currentRequest = null;

// ─── Fetch & Render News ───────────────────────────────────────────────────

async function loadNews() {
    feedRefresh.disabled = true;
    feedRefresh.textContent = '⟳ Loading...';
    feedList.innerHTML = '<div class="data-feed-status">Loading...</div>';
    hidePreviewCard();

    try {
        const res = await fetch(`${API_BASE}/api/news?limit=5&_=${Date.now()}`);
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();

        if (!data.articles || data.articles.length === 0) {
            feedList.innerHTML = '<div class="data-feed-status">No articles found</div>';
            return;
        }

        renderArticles(data.articles);
    } catch (err) {
        feedList.innerHTML = '<div class="data-feed-status">Unable to load news</div>';
    } finally {
        feedRefresh.disabled = false;
        feedRefresh.textContent = '⟳ Refresh Feed';
    }
}

function createArticleItem(article) {
    const item = document.createElement('a');
    item.className = 'data-feed-item';
    item.href = '#';

    item.innerHTML = `
        <div class="data-feed-item-source">${article.source || 'Unknown'}</div>
        <div class="data-feed-item-title">${article.title}</div>
    `;

    item.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(article.url, '_blank');
    });

    item.addEventListener('mouseenter', (e) => handleHover(e, article.id));
    item.addEventListener('mouseleave', handleMouseLeave);

    return item;
}

function renderArticles(articles) {
    const scrollInner = document.createElement('div');
    scrollInner.className = 'data-feed-scroll-inner';

    // Duplicate articles so CSS animation loops seamlessly
    [...articles, ...articles].forEach(article => {
        scrollInner.appendChild(createArticleItem(article));
    });

    feedList.innerHTML = '';
    feedList.appendChild(scrollInner);
}

// ─── Preview Card ──────────────────────────────────────────────────────────

function showPreviewCard(y) {
    const cardHeight = 250;
    const maxY = window.innerHeight - cardHeight - 20;
    const clampedY = Math.min(y, maxY);
    previewCard.style.top = `${clampedY}px`;
    previewCard.classList.add('visible');
}

function hidePreviewCard() {
    previewCard.classList.remove('visible');
    if (currentRequest) {
        currentRequest.abort();
        currentRequest = null;
    }
}

function handleMouseLeave() {
    setTimeout(() => {
        if (!previewCard.matches(':hover')) {
            hidePreviewCard();
        }
    }, 100);
}

async function handleHover(e, articleId) {
    if (currentRequest) {
        currentRequest.abort();
        currentRequest = null;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    showPreviewCard(rect.top);
    previewCard.innerHTML = '<div class="news-preview-loading">Loading...</div>';

    const controller = new AbortController();
    currentRequest = controller;

    try {
        const res = await fetch(`${API_BASE}/api/summary?article_id=${articleId}`, {
            signal: controller.signal
        });
        if (!res.ok) throw new Error('Failed to fetch summary');
        const data = await res.json();

        previewCard.innerHTML = `
            <div class="news-preview-summary">${data.summary}</div>
            <div class="news-preview-tags">
                ${data.macro_tags.map(tag => `<span class="news-tag">${tag}</span>`).join('')}
            </div>
        `;
    } catch (err) {
        if (err.name === 'AbortError') return;
        previewCard.innerHTML = '<div class="news-preview-loading">Unable to load summary</div>';
    }
}

// ─── Event Listeners ───────────────────────────────────────────────────────

feedRefresh.addEventListener('click', loadNews);
previewCard.addEventListener('mouseleave', () => { hidePreviewCard(); });

// ─── Init ──────────────────────────────────────────────────────────────────

loadNews();