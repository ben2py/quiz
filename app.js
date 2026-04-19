/**
 * app.js — Main quiz application logic.
 * Handles: file loading, quiz rendering, answer checking,
 *          scoring, theme toggle, local storage for recent files,
 *          question collection & export.
 */

// ═══════ State ═══════
let quizData = null;   // { title, questions }
let rawMarkdown = '';   // raw markdown text for re-export
let state = [];        // [{ selected, confirmed }]
let collected = new Set(); // indices of collected questions
const LETTERS = ['A', 'B', 'C', 'D'];
const STORAGE_KEY = 'mcq_quiz_recent';
const COLLECT_FILE_KEY = 'mcq_collect_file';
const SESSION_PREFIX = 'mcq_session_';

// ═══════ DOM refs ═══════
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// ═══════ Session Persistence ═══════
function sessionKey(text) {
  // Simple hash from markdown content for a stable key
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  }
  return SESSION_PREFIX + h;
}

function saveSession() {
  if (!quizData || !rawMarkdown) return;
  const allDone = state.every(s => s.confirmed);
  const key = sessionKey(rawMarkdown);
  if (allDone) {
    // Quiz finished — clear session
    localStorage.removeItem(key);
    return;
  }
  const data = {
    state,
    collected: Array.from(collected),
    title: quizData.title,
    ts: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(data));
}

function loadSession(text) {
  const key = sessionKey(text);
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function clearSession() {
  if (!rawMarkdown) return;
  localStorage.removeItem(sessionKey(rawMarkdown));
}

// ═══════ Theme ═══════
function initTheme() {
  const saved = localStorage.getItem('mcq_theme') || 'dark';
  document.body.setAttribute('data-theme', saved);
}
function toggleTheme() {
  const cur = document.body.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  localStorage.setItem('mcq_theme', next);
}
$('#themeToggle').addEventListener('click', toggleTheme);
initTheme();

// ═══════ File Handling ═══════
const dropZone = $('#dropZone');
const fileInput = $('#fileInput');

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) loadFile(file);
});
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) loadFile(fileInput.files[0]);
});

function loadFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result;
    const parsed = parseMCQMarkdown(text);
    if (!parsed.questions.length) {
      alert('未能解析出任何题目，请检查 Markdown 格式。');
      return;
    }
    saveRecent(file.name, parsed.questions.length, text);
    startQuiz(parsed, text);
  };
  reader.readAsText(file);
}

function loadFromRecent(name) {
  const recent = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const item = recent.find(r => r.name === name);
  if (item && item.content) {
    const parsed = parseMCQMarkdown(item.content);
    if (parsed.questions.length) startQuiz(parsed, item.content);
  }
}

// ═══════ Recent Files ═══════
function saveRecent(name, count, content) {
  let recent = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  recent = recent.filter(r => r.name !== name);
  recent.unshift({ name, count, content, ts: Date.now() });
  if (recent.length > 5) recent.length = 5;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
}
function showRecent() {
  const recent = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const wrap = $('#recentFiles');
  const list = $('#recentList');
  if (!recent.length) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  list.innerHTML = '';
  recent.forEach(r => {
    const session = r.content ? loadSession(r.content) : null;
    const hasProgress = session && session.state && session.state.some(s => s.confirmed);
    const answered = hasProgress ? session.state.filter(s => s.confirmed).length : 0;

    const d = document.createElement('div');
    d.className = 'recent-item';
    let badge = `<span class="ri-count">${r.count} 题</span>`;
    if (hasProgress) {
      badge = `<span class="ri-progress">⏳ ${answered}/${r.count}</span>` + badge;
    }
    d.innerHTML = `<span class="ri-name">📄 ${r.name}</span>${badge}`;
    d.onclick = () => loadFromRecent(r.name);
    list.appendChild(d);
  });
}
showRecent();

// ═══════ Question Bank ═══════
function loadQuestionBank() {
  const wrap = $('#questionBank');
  const list = $('#bankList');
  fetch('questions/index.json')
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(files => {
      if (!files.length) return;
      wrap.style.display = 'block';
      list.innerHTML = '';
      files.forEach(name => {
        const d = document.createElement('div');
        d.className = 'recent-item';
        const countSpan = `<span class="ri-count bank-loading">加载中…</span>`;
        d.innerHTML = `<span class="ri-name">📚 ${name.replace(/\.md$/, '')}</span>${countSpan}`;
        d.onclick = () => loadFromBank(name);
        list.appendChild(d);

        // Fetch to count questions
        fetch('questions/' + name)
          .then(r => r.ok ? r.text() : '')
          .then(text => {
            if (!text) return;
            const parsed = parseMCQMarkdown(text);
            const cnt = d.querySelector('.ri-count');
            if (cnt) {
              cnt.textContent = `${parsed.questions.length} 题`;
              cnt.classList.remove('bank-loading');
            }
          })
          .catch(() => {});
      });
    })
    .catch(() => { /* no bank available, e.g. local file:// */ });
}

function loadFromBank(name) {
  fetch('questions/' + name)
    .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(text => {
      const parsed = parseMCQMarkdown(text);
      if (!parsed.questions.length) {
        alert('未能解析出任何题目。');
        return;
      }
      saveRecent(name, parsed.questions.length, text);
      startQuiz(parsed, text);
    })
    .catch(() => alert('加载失败，请检查文件是否存在。'));
}

loadQuestionBank();

// ═══════ Quiz Start ═══════
function startQuiz(parsed, text) {
  quizData = parsed;
  rawMarkdown = text || '';
  collected = new Set();

  // Check for saved session
  const session = loadSession(rawMarkdown);
  if (session && session.state && session.state.length === parsed.questions.length) {
    const answered = session.state.filter(s => s.confirmed).length;
    if (answered > 0 && answered < parsed.questions.length) {
      if (confirm(`上次做到了 ${answered}/${parsed.questions.length} 题，是否继续？\n\n点"取消"将重新开始。`)) {
        state = session.state;
        collected = new Set(session.collected || []);
      } else {
        state = quizData.questions.map(() => ({ selected: null, confirmed: false }));
        clearSession();
      }
    } else {
      state = quizData.questions.map(() => ({ selected: null, confirmed: false }));
    }
  } else {
    state = quizData.questions.map(() => ({ selected: null, confirmed: false }));
  }

  $('#landingScreen').style.display = 'none';
  $('#quizScreen').style.display = 'block';
  $('#quizTitle').textContent = quizData.title || 'Quiz';
  $('#resultPanel').classList.remove('show');

  renderQuestions();
  restoreAnsweredUI();
  updateStats();
  updateExportBtn();
  updateCollectCount();
  window.scrollTo({ top: 0 });
}

function backToLanding() {
  saveSession();
  $('#quizScreen').style.display = 'none';
  $('#landingScreen').style.display = 'block';
  showRecent();
}

// ═══════ Render ═══════
function renderQuestions() {
  const container = $('#questionsContainer');
  const dots = $('#navDots');
  container.innerHTML = '';
  dots.innerHTML = '';

  quizData.questions.forEach((q, i) => {
    // Part divider
    if (q.part) {
      const pd = document.createElement('div');
      pd.className = 'part-divider';
      pd.innerHTML = `<span class="part-label">${q.part}</span>`;
      container.appendChild(pd);
    }

    const card = document.createElement('div');
    card.className = 'card';
    card.id = `card-${i}`;

    // Code block
    let codeHtml = '';
    if (q.codeBlock) {
      codeHtml = `<div class="q-code">${escHtml(q.codeBlock)}</div>`;
    }

    const isCollected = collected.has(i);

    card.innerHTML = `
      <div class="q-head">
        <div class="q-num">${q.num || i+1}</div>
        <div class="q-text">${mdToHtml(q.q)}</div>
        <button class="btn-collect ${isCollected ? 'collected' : ''}" id="collect-${i}" onclick="toggleCollect(${i})" title="收藏此题">
          <span class="collect-icon">${isCollected ? '⭐' : '☆'}</span>
        </button>
      </div>
      ${codeHtml}
      <div class="opts" id="opts-${i}">
        ${q.opts.map((o, j) => `
          <div class="opt" id="opt-${i}-${j}" onclick="selectOpt(${i},${j})">
            <div class="opt-ltr">${LETTERS[j]}</div>
            <div class="opt-txt">${mdToHtml(o)}</div>
            <div class="opt-ico" id="ico-${i}-${j}"></div>
          </div>
        `).join('')}
      </div>
      <div class="card-actions">
        <button class="btn btn-primary" id="btn-${i}" onclick="submitAnswer(${i})" disabled>提交答案</button>
      </div>
      <div class="explanation" id="exp-${i}">
        <div class="exp-tag">💡 解析</div>
        <div>${mdToHtml(q.explanation)}</div>
      </div>
    `;
    container.appendChild(card);

    // Nav dot
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.id = `dot-${i}`;
    dot.title = `Q${q.num || i+1}`;
    dot.onclick = () => document.getElementById(`card-${i}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
    dots.appendChild(dot);
  });
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ═══════ Restore Answered UI ═══════
function restoreAnsweredUI() {
  state.forEach((s, qi) => {
    if (!s.confirmed) return;
    const correct = quizData.questions[qi].answer;
    const selected = s.selected;
    const isCorrect = selected === correct;

    const card = document.getElementById(`card-${qi}`);
    if (!card) return;
    card.classList.add(isCorrect ? 'correct-card' : 'wrong-card');

    quizData.questions[qi].opts.forEach((_, j) => {
      const el = document.getElementById(`opt-${qi}-${j}`);
      const ico = document.getElementById(`ico-${qi}-${j}`);
      if (!el) return;
      el.classList.add('locked');
      if (j === correct) { el.classList.add('is-correct'); ico.textContent = '✅'; }
      else if (j === selected && !isCorrect) { el.classList.add('is-wrong'); ico.textContent = '❌'; }
    });

    document.getElementById(`exp-${qi}`).classList.add('show');
    document.getElementById(`btn-${qi}`).disabled = true;

    const dot = document.getElementById(`dot-${qi}`);
    if (dot) dot.classList.add(isCorrect ? 'd-correct' : 'd-wrong');
  });
}

// ═══════ Collection ═══════
function toggleCollect(qi) {
  if (collected.has(qi)) {
    collected.delete(qi);
  } else {
    collected.add(qi);
  }
  const btn = document.getElementById(`collect-${qi}`);
  if (btn) {
    btn.classList.toggle('collected', collected.has(qi));
    btn.querySelector('.collect-icon').textContent = collected.has(qi) ? '⭐' : '☆';
  }
  updateCollectCount();
  saveSession();
}

function updateCollectCount() {
  const countEl = $('#collectCount');
  if (countEl) countEl.textContent = collected.size;
  const exportBtn = $('#btnCollectExport');
  if (exportBtn) exportBtn.style.display = collected.size > 0 ? 'inline-flex' : 'none';
}

function showCollectExportDialog() {
  if (collected.size === 0) {
    alert('还没有收藏任何题目。');
    return;
  }
  const modal = $('#collectModal');
  modal.classList.add('show');
  $('#collectModalCount').textContent = collected.size;
  const input = $('#collectFileName');
  // Restore last used filename
  const last = localStorage.getItem(COLLECT_FILE_KEY) || '';
  input.value = last;
  input.focus();
}

function closeCollectModal() {
  $('#collectModal').classList.remove('show');
}

function doCollectExport() {
  const input = $('#collectFileName');
  let filename = input.value.trim();
  if (!filename) {
    alert('请输入文件名');
    return;
  }
  // Ensure .md extension
  if (!filename.endsWith('.md')) filename += '.md';
  // Save for next time
  localStorage.setItem(COLLECT_FILE_KEY, filename);

  const indices = Array.from(collected).sort((a, b) => a - b);
  const title = quizData.title || 'Quiz';

  let md = `# 收藏题目 — ${title}\n\n`;
  md += `> 📅 ${new Date().toLocaleString('zh-CN')}  \n`;
  md += `> ⭐ 收藏数：${indices.length} / ${quizData.questions.length}\n\n`;
  md += `---\n\n`;

  indices.forEach((idx, i) => {
    const q = quizData.questions[idx];
    md += `**Q${i + 1}.** ${q.q}\n\n`;
    if (q.codeBlock) {
      md += '```\n' + q.codeBlock + '\n```\n\n';
    }
    q.opts.forEach((o, j) => {
      md += `- ${LETTERS[j]}) ${o}\n`;
    });
    md += `\n<details>\n<summary>Answer</summary>\n\n`;
    if (q.explanation) {
      md += `${q.explanation}\n\n`;
    } else if (q.answer !== null) {
      md += `**${LETTERS[q.answer]}.**\n\n`;
    }
    md += `</details>\n\n`;
    if (i < indices.length - 1) md += `---\n\n`;
  });

  // Download
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  closeCollectModal();
}

// ═══════ Interaction ═══════
function selectOpt(qi, oi) {
  if (state[qi].confirmed) return;
  state[qi].selected = oi;

  quizData.questions[qi].opts.forEach((_, j) => {
    const el = document.getElementById(`opt-${qi}-${j}`);
    if (el) el.classList.toggle('sel', j === oi);
  });
  document.getElementById(`btn-${qi}`).disabled = false;
}

function submitAnswer(qi) {
  if (state[qi].confirmed || state[qi].selected === null) return;
  state[qi].confirmed = true;

  const correct = quizData.questions[qi].answer;
  const selected = state[qi].selected;
  const isCorrect = selected === correct;

  const card = document.getElementById(`card-${qi}`);
  card.classList.add(isCorrect ? 'correct-card' : 'wrong-card');

  quizData.questions[qi].opts.forEach((_, j) => {
    const el = document.getElementById(`opt-${qi}-${j}`);
    const ico = document.getElementById(`ico-${qi}-${j}`);
    if (!el) return;
    el.classList.add('locked');
    el.classList.remove('sel');
    if (j === correct) { el.classList.add('is-correct'); ico.textContent = '✅'; }
    else if (j === selected && !isCorrect) { el.classList.add('is-wrong'); ico.textContent = '❌'; }
  });

  document.getElementById(`exp-${qi}`).classList.add('show');
  document.getElementById(`btn-${qi}`).disabled = true;

  const dot = document.getElementById(`dot-${qi}`);
  dot.classList.add(isCorrect ? 'd-correct' : 'd-wrong');

  updateStats();
  updateExportBtn();
  saveSession();

  // Auto-scroll to next unanswered question
  scrollToNextUnanswered(qi);
}

function scrollToNextUnanswered(afterIndex) {
  // Find next unanswered question
  for (let i = afterIndex + 1; i < state.length; i++) {
    if (!state[i].confirmed) {
      setTimeout(() => {
        document.getElementById(`card-${i}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600);
      return;
    }
  }
  // If none after, wrap around to find any unanswered
  for (let i = 0; i < afterIndex; i++) {
    if (!state[i].confirmed) {
      setTimeout(() => {
        document.getElementById(`card-${i}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600);
      return;
    }
  }
}

// ═══════ Export Button Visibility ═══════
function updateExportBtn() {
  const hasWrong = state.some((s, i) => s.confirmed && s.selected !== quizData.questions[i].answer);
  const btn = document.getElementById('btnExport');
  if (btn) btn.style.display = hasWrong ? 'inline-flex' : 'none';
}

// ═══════ Stats ═══════
function updateStats() {
  const total = quizData.questions.length;
  let correct = 0, wrong = 0;
  state.forEach((s, i) => {
    if (s.confirmed) {
      if (s.selected === quizData.questions[i].answer) correct++;
      else wrong++;
    }
  });
  const answered = correct + wrong;
  const left = total - answered;

  $('#statCorrect').textContent = `✅ ${correct}`;
  $('#statWrong').textContent = `❌ ${wrong}`;
  $('#statLeft').textContent = `⏳ ${left}`;
  $('#progressFill').style.width = (answered / total * 100) + '%';
  $('#progressLabel').textContent = `${answered}/${total}`;
}

// ═══════ Finish ═══════
function finishQuiz() {
  const unanswered = state.filter(s => !s.confirmed).length;
  if (unanswered > 0) {
    if (!confirm(`还有 ${unanswered} 题未作答，确定提交吗？`)) return;
  }
  showResult();
}

function showResult() {
  const total = quizData.questions.length;
  let correct = 0;
  state.forEach((s, i) => {
    if (s.confirmed && s.selected === quizData.questions[i].answer) correct++;
  });
  const pct = Math.round(correct / total * 100);

  let emoji, level, sub;
  if (pct >= 90) {
    emoji = '🏆'; level = 'Excellent!'; sub = '非常出色，对知识点的掌握非常扎实！';
  } else if (pct >= 70) {
    emoji = '👍'; level = 'Good!'; sub = '表现不错，回顾一下答错的题目。';
  } else if (pct >= 50) {
    emoji = '📖'; level = '需要复习'; sub = '建议重新阅读材料，多练习。';
  } else {
    emoji = '🆘'; level = '加油！'; sub = '建议逐步深入理解每个概念。';
  }

  $('#resultEmoji').textContent = emoji;
  $('#resultScore').textContent = `${correct} / ${total}`;
  $('#resultLevel').textContent = level;
  $('#resultSub').textContent = sub;

  const panel = $('#resultPanel');
  panel.classList.add('show');
  panel.scrollIntoView({ behavior: 'smooth' });
  clearSession();
}

function retryQuiz() {
  if (!quizData) return;
  state = quizData.questions.map(() => ({ selected: null, confirmed: false }));
  collected = new Set();
  clearSession();
  $('#resultPanel').classList.remove('show');
  renderQuestions();
  updateStats();
  updateExportBtn();
  updateCollectCount();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════ Export Wrong Answers ═══════
function exportWrongAnswers() {
  if (!quizData) return;

  const wrongs = [];
  state.forEach((s, i) => {
    if (s.confirmed && s.selected !== quizData.questions[i].answer) {
      wrongs.push({ index: i, selected: s.selected });
    }
  });

  if (!wrongs.length) {
    alert('🎉 没有错题！');
    return;
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  const title = quizData.title || 'Quiz';

  let md = `# 错题记录 — ${title}\n\n`;
  md += `> 📅 ${dateStr} ${timeStr}  \n`;
  md += `> ❌ 错题数：${wrongs.length} / ${quizData.questions.length}\n\n`;
  md += `---\n\n`;

  wrongs.forEach((w, idx) => {
    const q = quizData.questions[w.index];
    const correctLetter = LETTERS[q.answer];
    const yourLetter = LETTERS[w.selected];

    md += `**Q${q.num || w.index + 1}.** ${q.q}\n\n`;

    q.opts.forEach((o, j) => {
      let marker = '';
      if (j === q.answer) marker = ' ✅';
      else if (j === w.selected) marker = ' ❌';
      md += `- ${LETTERS[j]}) ${o}${marker}\n`;
    });

    md += `\n`;
    md += `> **你的选择：${yourLetter}** ❌ → **正确答案：${correctLetter}** ✅\n\n`;

    if (q.explanation) {
      md += `<details>\n<summary>解析</summary>\n\n`;
      md += `${q.explanation}\n\n`;
      md += `</details>\n\n`;
    }

    if (idx < wrongs.length - 1) md += `---\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeTitle = (title || 'quiz').replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_').substring(0, 30);
  a.href = url;
  a.download = `错题_${safeTitle}_${now.toISOString().slice(0,10)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ═══════ Modal keyboard ═══════
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCollectModal();
});

// ═══════ Mobile Swipe Navigation ═══════
(function initSwipe() {
  let touchStartX = 0;
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 80;
  const ANGLE_LIMIT = 30; // degrees — must be mostly horizontal

  function getVisibleCardIndex() {
    if (!quizData) return -1;
    const viewMid = window.innerHeight / 2;
    let best = -1, bestDist = Infinity;
    for (let i = 0; i < quizData.questions.length; i++) {
      const el = document.getElementById(`card-${i}`);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const cardMid = rect.top + rect.height / 2;
      const dist = Math.abs(cardMid - viewMid);
      if (dist < bestDist) { bestDist = dist; best = i; }
    }
    return best;
  }

  function scrollToCard(index) {
    if (index < 0 || !quizData || index >= quizData.questions.length) return;
    document.getElementById(`card-${index}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  document.addEventListener('touchstart', e => {
    if (!quizData) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (!quizData) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Must be a clear horizontal swipe
    if (absDx < SWIPE_THRESHOLD) return;
    const angle = Math.atan2(absDy, absDx) * 180 / Math.PI;
    if (angle > ANGLE_LIMIT) return;

    const current = getVisibleCardIndex();
    if (current < 0) return;

    if (dx < 0) {
      // Swipe left → next
      scrollToCard(Math.min(current + 1, quizData.questions.length - 1));
    } else {
      // Swipe right → prev
      scrollToCard(Math.max(current - 1, 0));
    }
  }, { passive: true });
})();
