require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '100kb' }));

const API_KEY = process.env.API_KEY;
const API_BASE = (process.env.API_BASE || 'https://api.openai.com/v1').replace(/\/+$/, '');
const MODEL = process.env.MODEL || 'gpt-4o-mini';
const PORT = process.env.PORT || 3001;

if (!API_KEY) {
  console.error('Missing API_KEY in .env');
  process.exit(1);
}

console.log(`Using model: ${MODEL}`);
console.log(`API base: ${API_BASE}`);

// ── Shared: call any OpenAI-compatible chat completions API ──
async function chatCompletion(messages, maxTokens = 1024) {
  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('API error:', response.status, err);
    throw new Error(`API ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ── Chat endpoint (tutor agent) ──
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }
    const reply = await chatCompletion(messages, 1024);
    res.json({ reply });
  } catch (e) {
    res.status(502).json({ error: 'AI service error' });
  }
});

// ── Analysis endpoint (weakness analysis agent) ──
app.post('/api/analyze', async (req, res) => {
  try {
    const { wrongQuestions, totalCount, correctCount } = req.body;
    if (!wrongQuestions || !Array.isArray(wrongQuestions)) {
      return res.status(400).json({ error: 'wrongQuestions array required' });
    }

    const wrongSummary = wrongQuestions.map((w, i) =>
      `${i + 1}. 题目: ${w.question}\n   你选: ${w.yourAnswer}\n   正确: ${w.correctAnswer}\n   解析: ${w.explanation || '无'}`
    ).join('\n\n');

    const messages = [
      {
        role: 'system',
        content: `你是一个专业的学习分析师。用户刚完成一组选择题测试。
请分析他的错题模式，找出薄弱知识点，给出具体的复习建议。

要求：
1. 先总结整体表现（正确率、错题数）
2. 归纳错题涉及的知识点类别
3. 分析错误模式（是概念混淆、细节遗漏、还是理解偏差）
4. 给出针对性的复习建议，具体到应该重点看哪些内容
5. 用中文回答，语气友好鼓励`
      },
      {
        role: 'user',
        content: `测试结果：${correctCount}/${totalCount} 正确\n\n错题详情：\n${wrongSummary}`
      }
    ];

    const analysis = await chatCompletion(messages, 2048);
    res.json({ analysis });
  } catch (e) {
    res.status(502).json({ error: 'AI service error' });
  }
});

// ── Info endpoint ──
app.get('/api/info', (req, res) => {
  res.json({ model: MODEL, apiBase: API_BASE });
});

app.listen(PORT, () => {
  console.log(`MCQ Quiz AI server running on http://localhost:${PORT}`);
});
