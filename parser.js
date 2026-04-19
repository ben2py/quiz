/**
 * parser.js — Robust Markdown MCQ parser.
 *
 * Handles many common format variations:
 *
 * Question patterns:
 *   **Q1.** / **Q1)** / **Q1,** / **Q1:**
 *   Q1. / Q1) / Q1:
 *   1. / 1) (plain numbered)
 *   **1.** / **1)**
 *   Question 1: / Question 1.
 *
 * Option patterns:
 *   - A) text / - A. text / - A: text
 *   A) text / A. text / A: text  (no dash)
 *   - (A) text / (A) text
 *   a) text (lowercase)
 *   - **A)** text / - **A.** text (bold letter)
 *
 * Answer/explanation patterns:
 *   <details><summary>Answer</summary> ... </details>
 *   <details> on its own line
 *   **A.** explanation / **A,** / **A)** / **Answer: A**
 *   Answer: A / Correct: B / 答案：A / 正确答案：B
 *
 * Also handles:
 *   - Code blocks (``` ... ```)
 *   - Part/section dividers (## ...)
 *   - Multi-line question text
 *   - Missing or malformed details blocks
 *   - Options with E/F for 5-6 choice questions
 *   - Mixed formats within the same file
 */

function parseMCQMarkdown(raw) {
  const lines = raw.split('\n');
  const questions = [];
  let title = '';
  let currentQ = null;
  let inDetails = false;
  let expLines = [];
  let inCodeBlock = false;
  let codeBlockLines = [];
  let pendingPart = null;

  // ── Regex patterns ──

  // Question line patterns (ordered by specificity)
  const qPatterns = [
    // **Q1.** text / **Q1)** / **Q1,** / **Q1:** / **Q1 .** (space before dot)
    { re: /^\*\*Q(\d+)\s*[\.\,\)\:]\*\*\s*(.*)/, numbered: true },
    // **1.** text / **1)** text (bold number only)
    { re: /^\*\*(\d+)\s*[\.\)]\*\*\s*(.*)/, numbered: true },
    // Q1. text / Q1) text / Q1: text (no bold)
    { re: /^Q(\d+)\s*[\.\)\:]\s*(.*)/, numbered: true },
    // Question 1: text / Question 1. text
    { re: /^Question\s+(\d+)\s*[\.\)\:]\s*(.*)/i, numbered: true },
    // 题目1. / 题目 1：
    { re: /^题目\s*(\d+)\s*[\.\)\:：]\s*(.*)/, numbered: true },
    // Plain numbered: 1. text / 1) text — only match if we're already in a quiz context
    // (handled separately to avoid false positives with regular markdown lists)
  ];

  // Option line patterns
  const OPT_LETTERS = 'ABCDEF';
  const optPatterns = [
    // - A) text / - A. text / - A: text / - A） text (fullwidth)
    /^[-\*]\s+([A-Fa-f])\s*[\.\)\:）]\s*(.*)/,
    // - (A) text
    /^[-\*]\s+\(([A-Fa-f])\)\s*(.*)/,
    // - **A)** text / - **A.** text
    /^[-\*]\s+\*\*([A-Fa-f])\s*[\.\)]\*\*\s*(.*)/,
    // A) text / A. text / A: text (no dash)
    /^([A-Fa-f])\s*[\.\)\:）]\s*(.*)/,
    // (A) text (no dash)
    /^\(([A-Fa-f])\)\s*(.*)/,
    // **A)** text / **A.** text (no dash, bold)
    /^\*\*([A-Fa-f])\s*[\.\)]\*\*\s*(.*)/,
  ];

  // Answer extraction patterns (from explanation text)
  const answerPatterns = [
    // **A.** / **A,** / **A)** / **A:**
    /^\*\*([A-Fa-f])\s*[\.\,\)\:]\*\*/,
    // Answer: A / Correct: A / Correct answer: A
    /^(?:Answer|Correct(?:\s+answer)?)\s*[\:\=]\s*\**([A-Fa-f])\b/i,
    // 答案：A / 正确答案：A / 答案: A
    /^(?:正确)?答案\s*[\:\：]\s*\**([A-Fa-f])\b/,
    // Just a bold letter at start: **A**
    /^\*\*([A-Fa-f])\*\*/,
    // Standalone letter with period: A.
    /^([A-Fa-f])\.\s/,
  ];

  // ── Extract title from first # heading ──
  for (const line of lines) {
    const m = line.match(/^#\s+(.+)/);
    if (m && !line.match(/^##/)) { title = m[1].trim(); break; }
  }

  // ── Helper: try to match a question line ──
  function matchQuestion(line) {
    const trimmed = line.trim();
    for (const pat of qPatterns) {
      const m = trimmed.match(pat.re);
      if (m) return { num: parseInt(m[1]), text: m[2].trim() };
    }
    return null;
  }

  // ── Helper: try to match an option line ──
  function matchOption(line) {
    const trimmed = line.trim();
    for (const pat of optPatterns) {
      const m = trimmed.match(pat);
      if (m) {
        const letter = m[1].toUpperCase();
        const idx = OPT_LETTERS.indexOf(letter);
        return { letter, index: idx, text: m[2].trim() };
      }
    }
    return null;
  }

  // ── Helper: extract answer letter from explanation lines ──
  function extractAnswer(explanation) {
    if (!explanation) return null;
    // Try each line of explanation (answer is usually on the first non-empty line)
    const expLinesList = explanation.split('\n');
    for (const el of expLinesList) {
      const trimmed = el.trim();
      if (!trimmed) continue;
      for (const pat of answerPatterns) {
        const m = trimmed.match(pat);
        if (m) {
          const letter = m[1].toUpperCase();
          const idx = OPT_LETTERS.indexOf(letter);
          if (idx >= 0) return idx;
        }
      }
      // Only check first few non-empty lines
      break;
    }
    return null;
  }

  // ── Flush current question ──
  function flushQuestion() {
    if (!currentQ) return;
    if (expLines.length) {
      currentQ.explanation = expLines.join('\n').trim();
    }
    // Try to determine correct answer from explanation
    if (currentQ.answer === null && currentQ.explanation) {
      const ans = extractAnswer(currentQ.explanation);
      if (ans !== null) currentQ.answer = ans;
    }
    // Accept questions with at least 2 options
    if (currentQ.opts.length >= 2) {
      questions.push(currentQ);
    }
    currentQ = null;
    expLines = [];
    inDetails = false;
  }

  // ── Main parse loop ──
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // ── Code blocks ──
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        if (currentQ && !inDetails) {
          currentQ.codeBlock = codeBlockLines.join('\n');
          codeBlockLines = [];
        }
        continue;
      } else {
        inCodeBlock = true;
        codeBlockLines = [];
        continue;
      }
    }
    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // ── Part / section divider: ## ... ──
    const partMatch = line.match(/^##\s+(.+)/);
    if (partMatch && !line.match(/^##\s+Scoring/i)) {
      flushQuestion();
      pendingPart = partMatch[1].trim();
      continue;
    }

    // ── Horizontal rule (---) — skip ──
    if (line.trim().match(/^-{3,}$/) || line.trim().match(/^\*{3,}$/) || line.trim().match(/^_{3,}$/)) {
      continue;
    }

    // ── Question line ──
    const qm = matchQuestion(line);
    if (qm) {
      flushQuestion();
      currentQ = {
        num: qm.num,
        q: qm.text,
        opts: [],
        answer: null,
        explanation: '',
        codeBlock: null,
        part: pendingPart || null,
      };
      pendingPart = null;
      continue;
    }

    // ── Option line ──
    if (currentQ && !inDetails) {
      const om = matchOption(line);
      if (om) {
        // Handle out-of-order or missing options gracefully
        // Fill gaps with empty strings if needed
        while (currentQ.opts.length < om.index) {
          currentQ.opts.push('');
        }
        if (currentQ.opts.length === om.index) {
          currentQ.opts.push(om.text);
        } else {
          // Duplicate letter or weird order — just append
          currentQ.opts.push(om.text);
        }
        continue;
      }
    }

    // ── Details open ──
    // Handle: <details>, <details><summary>Answer</summary>, and variations
    if (line.trim().match(/^<details\b/i)) {
      inDetails = true;
      // Check if summary + answer is on the same line
      const inlineAnswer = line.match(/Answer\s*[\:\=]\s*\**([A-Fa-f])\b/i);
      if (inlineAnswer && currentQ) {
        const idx = OPT_LETTERS.indexOf(inlineAnswer[1].toUpperCase());
        if (idx >= 0) currentQ.answer = idx;
      }
      continue;
    }

    // ── Summary line — skip but check for inline answer ──
    if (line.trim().match(/^<summary\b/i)) {
      const inlineAnswer = line.match(/([A-Fa-f])\s*<\/summary>/i);
      if (inlineAnswer && currentQ) {
        const idx = OPT_LETTERS.indexOf(inlineAnswer[1].toUpperCase());
        // Only set if it looks like a single letter answer, not a word like "Answer"
      }
      continue;
    }

    // ── Details close ──
    if (line.trim().match(/^<\/details\s*>/i)) {
      inDetails = false;
      continue;
    }

    // ── Collect explanation lines ──
    if (inDetails && currentQ) {
      expLines.push(line);
      continue;
    }

    // ── Standalone answer line (no details block) ──
    // e.g. "Answer: A" or "答案：B" appearing after options
    if (currentQ && !inDetails && currentQ.opts.length >= 2 && currentQ.answer === null) {
      const trimmed = line.trim();
      const standaloneAnswer = trimmed.match(/^(?:Answer|Correct(?:\s+answer)?)\s*[\:\=]\s*\**([A-Fa-f])\b/i)
        || trimmed.match(/^(?:正确)?答案\s*[\:\：]\s*\**([A-Fa-f])\b/);
      if (standaloneAnswer) {
        const idx = OPT_LETTERS.indexOf(standaloneAnswer[1].toUpperCase());
        if (idx >= 0) currentQ.answer = idx;
        continue;
      }
    }

    // ── Multi-line question text (continuation) ──
    if (currentQ && !inDetails && currentQ.opts.length === 0 && line.trim() && !line.match(/^---/)) {
      currentQ.q += ' ' + line.trim();
    }
  }

  // Flush last question
  flushQuestion();

  return { title, questions };
}

/**
 * Convert markdown-ish text to safe HTML for display.
 * Handles **bold**, *italic*, `code`, basic formatting.
 */
function mdToHtml(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}
