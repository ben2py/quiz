# MCQ Markdown 格式规范

网页解析器（`parser.js`）要求以下三点，缺一不可：

---

## 1. 题目行

```markdown
**Q1.** 题干文字
```

## 2. 选项（必须用 `-` 列表）

```markdown
- A) 选项文字
- B) 选项文字
- C) 选项文字
- D) 选项文字
```

## 3. 答案块（解释首行必须以 `**X.**` 开头）

```markdown
<details>
<summary>Answer</summary>

**B.** 解释文字……

</details>
```

---

## 完整单题示例

```markdown
**Q1.** What does "Limited Direct Execution" achieve?

- A) Option A
- B) Option B
- C) Option C
- D) Option D

<details>
<summary>Answer</summary>

**B.** Explanation text here.

</details>

---
```
