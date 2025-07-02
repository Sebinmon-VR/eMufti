# 🕌 eMufti Chatbot – Flask + GPT-4o (Technical Setup)

A UAE-guided Islamic chatbot using Flask + GPT-4o with fatwa retrieval from SQLite and banned content filtering.

---

## ⚙️ Tech Stack

- **Backend**: Flask (Python)
- **LLM**: OpenAI GPT-4o
- **Database**: SQLite (`fatwas.db`)
- **Filtering**: Keyword-based (manual + DB-driven)
- **Deployment**: Local / Render / Railway / VPS

---

## 🚀 Getting Started

### 1. Clone

```bash
git clone https://github.com/yourusername/emufti.git
cd emufti
```
```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
Configure OpenAI API
```
OPENAI_API_KEY=your_openai_key

```

Chat Flow

User input (query) received via /chat endpoint.
Fatwas retrieved from fatwas.db using keyword match.
Prompt constructed using context + question .
GPT-4o called via OpenAI API .
Response filtered against banned keywords .
Final response returned (or fallback message shown).

Requirements
```
Flask
python-dotenv
openai

```
Install with:
```
pip install -r requirements.txt
```
Run Locally
```
flask run
Then visit: http://localhost:5000
```
