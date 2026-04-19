# FP 进阶 40 题 — 重点覆盖 Course 09-13 + Project 02 (Track C)

涵盖：pipe/pipeline、HuggingFace `datasets`、pytest、decorators & `@lru_cache`、error handling (`@make_safe` / validator factories)、Track C AI inference。

**设计原则**：正确答案位置均衡分布；正确选项的长度不固定（错误选项经常和正确答案一样长甚至更长），避免靠"选最长的"蒙对。

---

**Q1.** Which of the following is the actual 2-line implementation of `pipe`?

- A) `def pipe(data, *fns): return reduce(lambda acc, f: f(acc), fns, data)`
- B) `def pipe(data, *fns): return reduce(lambda acc, f: acc(f), fns, data)`
- C) `def pipe(data, *fns): return reduce(lambda f, acc: f(acc), data, fns)`
- D) `def pipe(data, *fns): return reduce(lambda acc, f: f(acc), data, fns)`

<details>
<summary>Answer</summary>

**A.** Order matters: `reduce(combiner, iterable, initial)` — `fns` is the iterable, `data` is the initial.

</details>

---

**Q2.** `pipe(3, lambda x: x+1, lambda x: x*2, lambda x: x-1)` returns?

- A) 6
- B) 8
- C) 7
- D) 9

<details>
<summary>Answer</summary>

**C.** `3+1=4`, `4*2=8`, `8-1=7`.

</details>

---

**Q3.** The key conceptual difference between `pipe` and `pipeline`:

- A) `pipeline` returns a callable waiting for data; `pipe` runs immediately
- B) `pipe` returns a callable waiting for data; `pipeline` runs immediately
- C) `pipeline` is strictly faster than `pipe` because of caching internally
- D) `pipe` only works with lambdas; `pipeline` only works with `def` functions

<details>
<summary>Answer</summary>

**A.** `pipeline(*fns)` captures the steps; you call the result on data later.

</details>

---

**Q4.** What does this print?

```python
from functools import reduce
def pipeline(*fns):
    return lambda d: reduce(lambda a, f: f(a), fns, d)

p = pipeline(str.strip, str.lower, lambda s: s.replace(" ", "_"))
print(p("  Hello World  "))
```

- A) `Hello_World`
- B) `hello_world`
- C) `  hello_world  `
- D) `hello world`

<details>
<summary>Answer</summary>

**B.** strip → "Hello World", lower → "hello world", replace → "hello_world".

</details>

---

**Q5.** Why must each function inside `pipe`/`pipeline` take exactly ONE argument?

- A) Because the reduce step passes only the accumulator to each function
- B) Python's multi-arg syntax costs runtime performance for each extra parameter
- C) Python's lambda syntax syntactically forbids more than one argument
- D) `functools.reduce` unpacks tuples but not positional arguments

<details>
<summary>Answer</summary>

**A.** Each step gets the previous result — that's all.

</details>

---

**Q6.** `pipe(42)` with no functions returns?

- A) `42`
- B) Raises a TypeError because `*fns` is empty
- C) `None`
- D) `[]`

<details>
<summary>Answer</summary>

**A.** `reduce` over an empty iterable returns the initial value.

</details>

---

**Q7.** Given `process = pipeline(f, g, h)`, calling `process(x)` is equivalent to:

- A) `f(g(h(x)))`
- B) `h(g(f(x)))`
- C) `h(x) then g(x) then f(x)` in sequence
- D) `f(x); g(x); h(x)` run in parallel and combined

<details>
<summary>Answer</summary>

**B.** Left-to-right: `f` first, `g` on the result, then `h`.

</details>

---

**Q8.** In HuggingFace `datasets`, the pipeline concept is expressed through:

- A) Repeatedly calling `pipe(ds, f, g, ...)` on the dataset object
- B) `Pipeline([...])`, as in scikit-learn
- C) `reduce(combine_fn, step_list, ds)` applied to the dataset
- D) Method chaining: `ds.filter(f).map(g).map(h)`

<details>
<summary>Answer</summary>

**D.** Same underlying concept, different API style.

</details>

---

**Q9.** Why can `datasets.map` safely parallelize across many CPU cores?

- A) It uses Python's thread pool, which lifts the GIL for pure functions
- B) It copies the data into each worker's local memory before mapping
- C) Because the mapped functions are pure — no shared state
- D) Because Apache Arrow memory-mapping is thread-safe by design

<details>
<summary>Answer</summary>

**C.** Purity is what makes parallelism safe — no races.

</details>

---

**Q10.** Which call correctly loads a local JSON file as a flat `Dataset`?

- A) `load_dataset("example.json")`
- B) `load_dataset("json", path="example.json", split="train")`
- C) `load_dataset(data_files="example.json", split="train", format="json")`
- D) `load_dataset("json", data_files="example.json", split="train")`

<details>
<summary>Answer</summary>

**D.** First arg is the loader name `"json"`; use `data_files=` for the path.

</details>

---

**Q11.** Inside a `.map()` function, the safe way to add a field is:

- A) `return {**row, "new": v}`
- B) `row["new"] = v; return row`
- C) Set `row.new = v` since `row` is already a copy at this stage
- D) Use `global ROW` and update the shared dictionary in place

<details>
<summary>Answer</summary>

**A.** Immutable update — never mutate the input row.

</details>

---

**Q12.** From mainland China without a VPN, you set:

- A) `HF_MIRROR=cn.huggingface.co`
- B) `HF_PROXY=https://hf-mirror.com`
- C) `HF_ENDPOINT=https://hf-mirror.com`
- D) `HUGGINGFACE_HUB_CHINA_MIRROR=true`

<details>
<summary>Answer</summary>

**C.** Must be set BEFORE importing `datasets` or downloading anything.

</details>

---

**Q13.** What does `python -m pytest tests/test_x.py::test_foo` do?

- A) Runs every test in the `tests/` folder in alphabetical order
- B) Runs only `test_foo` inside that file
- C) Displays the list of tests without running any of them
- D) Creates a new empty test file named `test_foo` in `tests/`

<details>
<summary>Answer</summary>

**B.** The `file::function` syntax targets exactly one test.

</details>

---

**Q14.** When `assert normalize_score("2.0") == 3` fails, pytest reports:

- A) Just the single word "FAILED" without any other detail
- B) The source of `normalize_score` with line numbers highlighted in red
- C) The full Python interpreter stack trace with internal C calls
- D) `AssertionError: assert 2 == 3`

<details>
<summary>Answer</summary>

**D.** Actual vs expected is printed on the `E` line — that's the feedback loop.

</details>

---

**Q15.** How many test cases does this run?

```python
@pytest.mark.parametrize("v, e", [
    ("5", 5), ("2.0", 2), ("4/5", 4), ("", None), (None, None),
])
def test_norm(v, e):
    assert normalize_score(v) == e
```

- A) 1
- B) 5
- C) 2
- D) Depends on whether earlier test cases pass or fail

<details>
<summary>Answer</summary>

**B.** One row = one independent test; all 5 run even if some fail.

</details>

---

**Q16.** A pytest fixture is used when:

- A) You want a test to be skipped until some condition is met later
- B) Several tests need the same input data
- C) A test function must be executed concurrently with other tests
- D) You need to replace a database connection with an in-memory mock

<details>
<summary>Answer</summary>

**B.** Defined once with `@pytest.fixture`, injected by parameter name.

</details>

---

**Q17.** To assert a function raises `ValueError`:

- A) Decorate the test with `@pytest.raises(ValueError)` and call the function
- B) Call `pytest.check_raises(ValueError, func, *args)` on the function
- C) Use `assert func() raises ValueError` inline in the test body
- D) `with pytest.raises(ValueError): func()`

<details>
<summary>Answer</summary>

**D.** Context manager for expected exceptions.

</details>

---

**Q18.** Why are pure functions trivially testable?

- A) Input and output are all you need — no mocks
- B) They never raise so every test passes
- C) Because pytest auto-generates test cases for them from their type hints
- D) Because Python optimizes pure-function calls, making tests terminate quicker

<details>
<summary>Answer</summary>

**A.** No external state means no setup, teardown, or mocking.

</details>

---

**Q19.** Unit vs integration tests — which describes the distinction?

- A) Unit tests are fast; integration tests are slow and should be avoided
- B) Unit tests don't use `assert`; integration tests use `assert` only
- C) They are synonyms — different communities prefer different words
- D) Unit tests check one function alone; integration tests check multiple together

<details>
<summary>Answer</summary>

**D.** Brick test vs. house test — you need both.

</details>

---

**Q20.** What does `@decorator` above a function definition do?

- A) Replaces `f` with `decorator(f)` after the function is defined
- B) Marks the function as private to its module, like a leading underscore
- C) Runs the function twice, once for warmup and once for the real result
- D) Automatically adds runtime type-checking based on annotations

<details>
<summary>Answer</summary>

**A.** Just shorthand for `f = decorator(f)` — no magic involved.

</details>

---

**Q21.** What does this print?

```python
def shout(fn):
    def w(*a, **k): return fn(*a, **k).upper()
    return w

def bang(fn):
    def w(*a, **k): return fn(*a, **k) + "!"
    return w

@bang
@shout
def greet(name): return f"hi {name}"

print(greet("ana"))
```

- A) `HI ANA!`
- B) `hi ana!`
- C) `HI ANA`
- D) `hi ANA!`

<details>
<summary>Answer</summary>

**A.** Bottom-up: `shout` first → `"HI ANA"`; then `bang` appends `"!"`.

</details>

---

**Q22.** Why do decorators use `*args, **kwargs`?

- A) To make the wrapper usable with any function signature
- B) Required by Python — all wrappers must declare variadic parameters
- C) Because positional arguments alone are faster to unpack at call time
- D) To automatically catch any exception raised inside the wrapped function

<details>
<summary>Answer</summary>

**A.** Capture anything, forward everything.

</details>

---

**Q23.** This code:

```python
def make_counter():
    count = 0
    def inc():
        count += 1
        return count
    return inc
```

When you call `make_counter()()`, what happens?

- A) NameError: name 'count' is not defined in the inner scope
- B) SyntaxError caught at module import time
- C) Works fine, returns 1 on the first call
- D) UnboundLocalError

<details>
<summary>Answer</summary>

**D.** Assignment makes `count` local to `inc`; fix with `nonlocal count`.

</details>

---

**Q24.** A decorator factory (one that takes arguments) needs how many layers of function?

- A) 1
- B) 2
- C) 3
- D) 4

<details>
<summary>Answer</summary>

**C.** Config → decorator → wrapper.

</details>

---

**Q25.** Why is `@lru_cache` DANGEROUS on impure functions?

- A) It consumes too much memory when arguments are large strings or lists
- B) Because the hash of the arguments collides more often than pure inputs
- C) Python's garbage collector may evict live entries mid-computation
- D) Cached values become stale when the underlying resource changes

<details>
<summary>Answer</summary>

**D.** Same input no longer guarantees same output — cache lies.

</details>

---

**Q26.** Which call will crash?

- A) `@lru_cache\ndef f(x: str): ...` called with `f("abc")`
- B) `@lru_cache\ndef f(x: int): ...` called with `f(42)`
- C) `@lru_cache\ndef f(x): ...` called with `f({"a": 1})`
- D) `@lru_cache\ndef f(x: tuple): ...` called with `f((1, 2, 3))`

<details>
<summary>Answer</summary>

**C.** Dicts are not hashable and cannot be cache keys → `TypeError`.

</details>

---

**Q27.** What does `@make_safe` do when a row already contains `"_error"`?

- A) Retries the wrapped function up to 3 times before giving up
- B) Re-raises the original exception with a more informative message
- C) Returns the row unchanged
- D) Logs the error and removes the row from the dataset

<details>
<summary>Answer</summary>

**C.** Skip rule — avoids cascading error checks in every downstream step.

</details>

---

**Q28.** Given:

```python
@make_safe
def parse_int(row):
    return {**row, "n": int(row["n"])}

parse_int({"n": "abc"})
```

What is the result?

- A) Returns `{"n": "abc", "_error": "parse_int: ..."}`
- B) Returns `{"n": "abc"}` with `n` left untouched
- C) Raises `ValueError: invalid literal for int()`
- D) Returns `{"n": None}` silently

<details>
<summary>Answer</summary>

**A.** Exception is caught and stamped into the row.

</details>

---

**Q29.** Why normalize BEFORE validate?

- A) Normalization is slower, so you want to fail fast with validation first
- B) Strict validators would reject values that could have been saved (e.g. "english" → "en")
- C) Alphabetical order in the codebase — convention only
- D) Because pytest expects the normalize step to run first in test fixtures

<details>
<summary>Answer</summary>

**B.** Fixable values should be rescued before rejection.

</details>

---

**Q30.** A validator has signature:

- A) `row -> new_row_with_corrections_applied`
- B) `row -> bool` (True if valid, False otherwise)
- C) `row -> str | None` (error message or None if valid)
- D) `row -> list[str]` (list of all error messages, possibly empty)

<details>
<summary>Answer</summary>

**C.** A single error string, or `None` when the row passes the check.

</details>

---

**Q31.** `require("email")({"email": None})` returns?

- A) `None`
- B) `False` because the field value is falsy
- C) `"missing_email"`
- D) Raises `KeyError("email")` because `None` is not a valid value

<details>
<summary>Answer</summary>

**C.** Field exists but is `None` → error emitted.

</details>

---

**Q32.** Why does `check(field, pred, msg)` return `None` when `row[field]` is `None`?

- A) It silently corrects the `None` into an empty string before checking
- B) A Python quirk — the `None` shortcut prevents predicate execution
- C) Because `None` is considered a valid value for every field by convention
- D) To avoid double-reporting — `require()` already handles the missing case

<details>
<summary>Answer</summary>

**D.** Separation of concerns — each validator has ONE job.

</details>

---

**Q33.** `validate(validators)` runs:

- A) Until the first error, then short-circuits to return the failure
- B) All validators, collecting every error in one list
- C) Only the first validator, as a sanity check
- D) The validators in random order, to surface flaky rules

<details>
<summary>Answer</summary>

**B.** Gives users the complete picture per row.

</details>

---

**Q34.** The walrus operator `:=` inside `validate()` is used to:

- A) Make the list comprehension syntax prettier and more compact
- B) Run validators concurrently in a single pass of the list
- C) Avoid calling each validator twice (once for `if`, once for the value)
- D) Skip empty rows before any validator is evaluated on them

<details>
<summary>Answer</summary>

**C.** `if (err := v(row)) is not None` — assigns and tests at once.

</details>

---

**Q35.** The full pipeline produces three final buckets. Which?

- A) `train`, `validation`, `test` in the usual ML split proportions
- B) `good`, `dirty`, `crashed`
- C) `raw`, `normalized`, `final` — one per pipeline phase
- D) `ok`, `warning`, `error` based on severity level

<details>
<summary>Answer</summary>

**B.** Nothing lost: valid rows, rejected rows, exception-tagged rows.

</details>

---

**Q36.** In Track C, zero-shot classification means:

- A) The model was trained on zero labeled examples and only learns at inference
- B) You classify into any candidate labels at inference, without task-specific training
- C) The prediction scores always sum to exactly zero across all labels
- D) The model supports only one candidate label at a time

<details>
<summary>Answer</summary>

**B.** Pre-trained entailment model + candidate labels supplied at call time.

</details>

---

**Q37.** Why build the `pipeline(...)` model only ONCE per process?

- A) The HuggingFace license restricts the number of times it can be instantiated
- B) Construction is slow (~3-5s plus the download) — rebuilding kills performance
- C) Python's garbage collector cannot free old pipeline instances reliably
- D) Two pipelines in the same process would compete for CUDA memory

<details>
<summary>Answer</summary>

**B.** Use a module-level singleton with an `if _clf is None` guard.

</details>

---

**Q38.** With `multi_label=False`, where is the best prediction in the output?

- A) `out["prediction"]`
- B) `out["labels"][-1]`
- C) `out["best"]`
- D) `out["labels"][0]`

<details>
<summary>Answer</summary>

**D.** Labels are sorted by descending score — index 0 is the top.

</details>

---

**Q39.** In `classify_batch(batch)` (with `batched=True, batch_size=16`), the argument `batch` is:

- A) A single row dict, the same shape as a non-batched `.map` call
- B) A list of 16 row dicts, one per item in the batch
- C) A tuple of 16 strings extracted from the main column
- D) A dict of lists, each list length 16 (e.g. `{"pitch": [...16 items...]}`)

<details>
<summary>Answer</summary>

**D.** You must return the same shape — a dict of equal-length lists.

</details>

---

**Q40.** Why does Track C ship a `mock` mode?

- A) To help students bypass the real model and receive partial credit during grading
- B) Because the real zero-shot model is known to be broken on macOS
- C) So the pipeline plumbing can be iterated on in <1s, without the AI download
- D) To compress the output file size by skipping the confidence scores

<details>
<summary>Answer</summary>

**C.** Mock isolates business bugs from AI bugs — if mock fails, real will too.

</details>

---
