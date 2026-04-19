/**
 * ai.js — AI tutor chat & weakness analysis.
 * Communicates with the backend proxy at /api/chat and /api/analyze.
 */

const AI_BASE = localStorage.getItem('mcq_ai_server') || 'http://localhost:3001';
let aiChatHistory = []; // { role, content }
let aiChatQuestionIndex = null; // which question the chat is about

// ═══════ AI Chat Panel ═══════

function openAiChat(qi) {
  const q = quizData.questions[qi];
  const s = state[qi];
  if (!s.confirmed) return;

  aiChatQuestionIndex = qi;
  const correct = LETTERS[q.answer];
  const yours = LETTERS[s.selected];
  const isCorrect = s.selected === q.answer;

  // Build system prompt with question context
  const systemMsg = {
    role: 'system',
    content: `你是一个耐心的 AI 辅导老师。学生刚做了一道选择题，请根据他的作答情况进行辅导。

题目: ${q.q}
选项:
${q.opts.map((o, j) => `${LETTERS[j]}) ${o}`).join('\n')}
正确答案: ${correct}
学生选择: ${yours} (${isCorrect ? '正确' : '错误'})
${q.explanation ? '参考解析: ' + q.explanation : ''}

要求：
- 用中文回答
- 如果学生答错了，先解释为什么他的选择是错的，再解释正确答案
- 如果学生答对了，可以深入拓展相关知识
- 鼓励学生提问，用苏格拉底式追问帮助理解
- 回答简洁清晰，避免过长`
  };

  aiChatHistory = [systemMsg];

  // Auto-generate first message
  const firstUser = isCorrect
    ? '我答对了这道题，能帮我深入理解一下相关知识点吗？'
    : `我选了 ${yours}，但正确答案是 ${correct}。能帮我分析一下为什么我选错了吗？`;

  aiChatHistory.push({ role: 'user', content: firstUser });

  // Show panel
  const panel = $('#aiChatPanel');
  panel.classList.add('show');
  $('#aiChatMessages').innerHTML = '';
  appendChatBubble('user', firstUser);
  appendChatBubble('ai', '思考中…', true);

  sendAiChat();
}

function closeAiChat() {
  $('#aiChatPanel').classList.remove('show');
  aiChatHistory = [];
  aiChatQuestionIndex = null;
}

function appendChatBubble(role, text, isLoading) {
  const container = $('#aiChatMessages');
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble chat-${role}`;
  if (isLoading) bubble.id = 'aiLoading';
  bubble.innerHTML = `<div class="chat-role">${role === 'user' ? '🧑 你' : '🤖 AI'}</div><div class="chat-text">${mdToHtml(text)}</div>`;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function removeLoading() {
  const el = document.getElementById('aiLoading');
  if (el) el.remove();
}

async function sendAiChat() {
  try {
    const resp = await fetch(AI_BASE + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: aiChatHistory }),
    });

    removeLoading();

    if (!resp.ok) {
      appendChatBubble('ai', '⚠️ AI 服务暂时不可用，请检查后端是否启动。');
      return;
    }

    const data = await resp.json();
    const reply = data.reply || '（无回复）';
    aiChatHistory.push({ role: 'assistant', content: reply });
    appendChatBubble('ai', reply);
  } catch (e) {
    removeLoading();
    appendChatBubble('ai', '⚠️ 无法连接 AI 服务。请确认后端已启动：`cd server && npm start`');
  }
}

function handleAiInput(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendUserMessage();
  }
}

function sendUserMessage() {
  const input = $('#aiChatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  aiChatHistory.push({ role: 'user', content: text });
  appendChatBubble('user', text);
  appendChatBubble('ai', '思考中…', true);
  sendAiChat();
}

// ═══════ AI Weakness Analysis ═══════

async function requestAnalysis() {
  if (!quizData) return;

  const wrongs = [];
  let correctCount = 0;
  state.forEach((s, i) => {
    if (!s.confirmed) return;
    if (s.selected === quizData.questions[i].answer) {
      correctCount++;
    } else {
      const q = quizData.questions[i];
      wrongs.push({
        question: q.q,
        yourAnswer: LETTERS[s.selected] + ') ' + q.opts[s.selected],
        correctAnswer: LETTERS[q.answer] + ') ' + q.opts[q.answer],
        explanation: q.explanation || '',
      });
    }
  });

  if (!wrongs.length) {
    alert('🎉 没有错题，无需分析！');
    return;
  }

  // Show analysis panel
  const panel = $('#aiAnalysisPanel');
  panel.classList.add('show');
  $('#analysisContent').innerHTML = '<div class="analysis-loading">🔍 AI 正在分析你的错题模式…</div>';

  try {
    const resp = await fetch(AI_BASE + '/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wrongQuestions: wrongs,
        totalCount: quizData.questions.length,
        correctCount,
      }),
    });

    if (!resp.ok) {
      $('#analysisContent').innerHTML = '<div class="analysis-error">⚠️ AI 服务暂时不可用，请检查后端是否启动。</div>';
      return;
    }

    const data = await resp.json();
    $('#analysisContent').innerHTML = `<div class="analysis-text">${mdToHtml(data.analysis || '（无分析结果）')}</div>`;
  } catch (e) {
    $('#analysisContent').innerHTML = '<div class="analysis-error">⚠️ 无法连接 AI 服务。请确认后端已启动：<code>cd server && npm start</code></div>';
  }
}

function closeAnalysis() {
  $('#aiAnalysisPanel').classList.remove('show');
}

// ═══════ AI Server Config ═══════

function configureAiServer() {
  const current = localStorage.getItem('mcq_ai_server') || 'http://localhost:3001';
  const url = prompt('AI 后端地址：', current);
  if (url !== null) {
    localStorage.setItem('mcq_ai_server', url.replace(/\/+$/, ''));
    location.reload();
  }
}
