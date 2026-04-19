# Functional Programming — 120 MCQs

覆盖范围：FP 入门、纯函数、表达式、不可变性、map/filter/reduce、pipe/pipeline、datasets、pytest、venv、decorators & memoization、error handling、AI inference (Track C)。

---

**Q1.** What is the core difference between imperative and functional programming?

- A) Imperative is faster than functional
- B) Imperative describes HOW, functional describes WHAT
- C) Functional programming has no variables
- D) Imperative uses only loops, functional uses only recursion

<details>
<summary>Answer</summary>

**B.** Imperative tells the computer step-by-step HOW to do things; functional describes WHAT the result should be via transformations.

</details>

---

**Q2.** Which of the following is the most functional-style rewrite of a loop that filters even numbers and doubles them?

- A) `result = []; for n in nums: if n%2==0: result.append(n*2)`
- B) `[n*2 for n in nums if n%2 == 0]`
- C) `while n: result += n*2`
- D) `result.extend(n*2 for n in nums)` with a global `result`

<details>
<summary>Answer</summary>

**B.** A list comprehension is a declarative, functional-style expression — no mutable container, no manual append.

</details>

---

**Q3.** A function is called "deterministic" when:

- A) It runs on a specific machine
- B) Same input always produces the same output
- C) It never raises exceptions
- D) It has a fixed number of arguments

<details>
<summary>Answer</summary>

**B.** Determinism means `f(x)` yields the same result no matter when, where, or how often it is called.

</details>

---

**Q4.** Which function violates the "no side effects" rule?

- A) `def add(a, b): return a + b`
- B) `def square(x): return x * x`
- C) `def add_to_total(x): global total; total += x; return total`
- D) `def greet(name): return f"Hi {name}"`

<details>
<summary>Answer</summary>

**C.** It mutates a global variable — that is a side effect that reaches outside the function.

</details>

---

**Q5.** "Referential transparency" means:

- A) Functions are documented with references
- B) You can replace `f(x)` with its value without changing program behaviour
- C) The function body is visible to the caller
- D) Arguments are passed by reference

<details>
<summary>Answer</summary>

**B.** If a call always returns the same result, substituting the call with that result anywhere is safe.

</details>

---

**Q6.** Which scenario is NOT a good fit for functional programming?

- A) Cleaning a CSV before training a model
- B) Computing a shopping cart total
- C) A real-time GUI where widget state must mutate on click
- D) Processing log files into aggregated stats

<details>
<summary>Answer</summary>

**C.** UIs are inherently stateful; forcing pure FP everywhere is awkward. Use the right tool for the job.

</details>

---

**Q7.** What does the following print?

```python
def double(x): return x * 2
result = double(3) + double(3)
print(result)
```

- A) 6
- B) 9
- C) 12
- D) Error

<details>
<summary>Answer</summary>

**C.** `double(3)` is 6; `6 + 6 = 12`. This also illustrates referential transparency.

</details>

---

**Q8.** Which statement about FP in industry is TRUE?

- A) FP is only used in academic research
- B) Alibaba, ByteDance, and Tencent use FP patterns in production
- C) Python cannot do FP
- D) FP requires a pure FP language like Haskell

<details>
<summary>Answer</summary>

**B.** Major tech companies use FP patterns at massive scale for reliability and parallelism.

</details>

---

**Q9.** Which is NOT one of the "4 superpowers" of FP listed in the notes?

- A) Easier debugging
- B) Immutability
- C) Object inheritance
- D) Readable code

<details>
<summary>Answer</summary>

**C.** Inheritance is an OOP concept. The four FP superpowers are debugging, immutability, readability, maintainability.

</details>

---

**Q10.** Which statement about FP misconceptions is CORRECT?

- A) FP forbids giving names to values
- B) FP means variables don't change once set
- C) Python has no FP features
- D) FP is objectively harder than imperative

<details>
<summary>Answer</summary>

**B.** You can still bind names; you just don't rebind/mutate them.

</details>

---

**Q11.** Why are pure functions easier to test than impure ones?

- A) They run faster
- B) You just provide input and check output — no mocks, no setup
- C) pytest auto-generates their tests
- D) They never fail

<details>
<summary>Answer</summary>

**B.** Pure = input → output only, so tests are trivial: call, assert.

</details>

---

**Q12.** Which of these is a pure function?

- A) `def now(): return datetime.now()`
- B) `def read(): return open("f.txt").read()`
- C) `def add(a, b): return a + b`
- D) `def log(msg): print(msg); return msg`

<details>
<summary>Answer</summary>

**C.** `add` depends only on its args and has no side effects.

</details>

---

**Q13.** What is the result?

```python
numbers = [1, 2, 3, 4, 5]
result = list(map(lambda x: x * 2, filter(lambda x: x > 2, numbers)))
```

- A) `[2, 4, 6, 8, 10]`
- B) `[6, 8, 10]`
- C) `[4, 6, 8, 10]`
- D) `[3, 4, 5]`

<details>
<summary>Answer</summary>

**B.** `filter` keeps 3, 4, 5; `map` doubles each → `[6, 8, 10]`.

</details>

---

**Q14.** In the recipe analogy, `pipe()` is like:

- A) Cooking on the spot — steps and ingredient given together
- B) Writing down a recipe card for later use
- C) Buying pre-made food
- D) A single kitchen tool

<details>
<summary>Answer</summary>

**A.** `pipe()` processes immediately; `pipeline()` is the reusable recipe card.

</details>

---

**Q15.** In math, `(f ∘ g)(x)` equals:

- A) `g(f(x))`
- B) `f(g(x))`
- C) `f(x) * g(x)`
- D) `f(x) + g(x)`

<details>
<summary>Answer</summary>

**B.** Composition applies `g` first, then `f` — right-to-left reading.

</details>

---

**Q16.** What does this print?

```python
add1   = lambda x: x + 1
double = lambda x: x * 2
print(double(add1(3)))
```

- A) 7
- B) 8
- C) 6
- D) 9

<details>
<summary>Answer</summary>

**B.** `add1(3)=4`; `double(4)=8`.

</details>

---

**Q17.** Why does the industry prefer left-to-right chaining?

- A) It executes faster
- B) Reading order matches execution order
- C) It uses less memory
- D) Python only supports left-to-right

<details>
<summary>Answer</summary>

**B.** `.filter().map().reduce()` reads top-down like a recipe; nesting scans inside-out.

</details>

---

**Q18.** What does `reduce(lambda acc, x: acc * x, [2, 3, 4], 1)` return?

- A) 9
- B) 24
- C) 10
- D) 14

<details>
<summary>Answer</summary>

**B.** `1*2=2`, `2*3=6`, `6*4=24`.

</details>

---

**Q19.** What does this print?

```python
from functools import reduce
fns = [lambda x: x + 1, lambda x: x * 2, lambda x: x - 3]
print(reduce(lambda acc, f: f(acc), fns, 5))
```

- A) 7
- B) 9
- C) 11
- D) 12

<details>
<summary>Answer</summary>

**B.** `5+1=6`, `6*2=12`, `12-3=9`.

</details>

---

**Q20.** What is the key insight that turns `reduce` into `pipe`?

- A) Change the initial value
- B) Replace `acc OP x` with `f(acc)` — call the element (a function) on the accumulator
- C) Use a dict instead of a list
- D) Reverse the list order

<details>
<summary>Answer</summary>

**B.** Elements become functions; the combiner becomes function application.

</details>

---

**Q21.** Given the 2-line `pipe`:

```python
from functools import reduce
def pipe(data, *fns):
    return reduce(lambda acc, f: f(acc), fns, data)
```

What type is `fns` inside the function?

- A) list
- B) dict
- C) tuple
- D) set

<details>
<summary>Answer</summary>

**C.** `*args` collects extra positional arguments as a tuple.

</details>

---

**Q22.** What does `pipe(42)` return when no functions are passed?

- A) `None`
- B) An error
- C) `42`
- D) `[]`

<details>
<summary>Answer</summary>

**C.** `reduce` over an empty iterable returns the initial value unchanged.

</details>

---

**Q23.** What does this print?

```python
add_tax        = lambda p: p * 1.2
apply_discount = lambda p: p * 0.9
round_price    = lambda p: round(p, 2)
print(pipe(100, add_tax, apply_discount, round_price))
```

- A) 100
- B) 108.0
- C) 120.0
- D) 90.0

<details>
<summary>Answer</summary>

**B.** `100*1.2=120`, `120*0.9=108`, `round(108,2)=108.0`.

</details>

---

**Q24.** What error arises here?

```python
add1 = lambda x: x + 1
pipe(3, add1(), add1())
```

- A) SyntaxError
- B) TypeError: `add1()` missing 1 required positional argument
- C) ValueError
- D) Returns 5 silently

<details>
<summary>Answer</summary>

**B.** You called `add1()` with no args instead of passing the function itself.

</details>

---

**Q25.** What does `pipe(5, lambda x, y: x + y)` raise?

- A) Nothing — returns 5
- B) TypeError — the lambda needs 2 args but gets 1
- C) SyntaxError
- D) ZeroDivisionError

<details>
<summary>Answer</summary>

**B.** Each function in a pipe must accept exactly one argument.

</details>

---

**Q26.** Which line correctly adds a `"vat"` field without mutating the original dict?

- A) `p["vat"] = p["price"] * 0.2; return p`
- B) `return {**p, "vat": p["price"] * 0.2}`
- C) `p.update(vat=p["price"] * 0.2); return p`
- D) `p.vat = p["price"] * 0.2; return p`

<details>
<summary>Answer</summary>

**B.** Spread creates a new dict; the other options mutate in place.

</details>

---

**Q27.** The main difference between `pipe(data, f, g)` and `pipeline(f, g)` is:

- A) `pipe` is faster than `pipeline`
- B) `pipe` returns a value now; `pipeline` returns a function waiting for data
- C) `pipeline` accepts only pure functions
- D) `pipe` supports dicts; `pipeline` only supports numbers

<details>
<summary>Answer</summary>

**B.** `pipeline` packages the process as a reusable callable.

</details>

---

**Q28.** What does this print?

```python
from functools import reduce
def pipeline(*fns):
    return lambda data: reduce(lambda acc, f: f(acc), fns, data)

proc = pipeline(lambda x: x + 1, lambda x: x * 2)
print(proc(3), proc(10))
```

- A) `8 22`
- B) `7 21`
- C) `6 20`
- D) `9 23`

<details>
<summary>Answer</summary>

**A.** `(3+1)*2=8` and `(10+1)*2=22`.

</details>

---

**Q29.** A "higher-order function" is a function that:

- A) Runs at a higher priority
- B) Takes functions as arguments, returns functions, or both
- C) Is defined at module top level
- D) Inherits from another function

<details>
<summary>Answer</summary>

**B.** HOFs treat functions as values. `pipeline`, `map`, `filter`, decorators are all HOFs.

</details>

---

**Q30.** "Functions are first-class citizens" means:

- A) Functions execute before variables
- B) Functions can be assigned, passed, and returned like any value
- C) The first function defined has priority
- D) Functions are stored in read-only memory

<details>
<summary>Answer</summary>

**B.** This is what makes higher-order functions possible.

</details>

---

**Q31.** Which is the best use case for `pipeline()` over `pipe()`?

- A) A one-off computation on a single input
- B) Applying the same transformation to many items via `map`
- C) Transforming a constant
- D) Printing a value once

<details>
<summary>Answer</summary>

**B.** Define the process once, `map` it over the whole collection.

</details>

---

**Q32.** Why does HuggingFace `datasets` scale better than a Python list for 50M rows?

- A) It uses C-based lists
- B) It stores data in Apache Arrow and can memory-map from disk
- C) It compresses every row with gzip
- D) It skips rows to save memory

<details>
<summary>Answer</summary>

**B.** Arrow is columnar, binary, and memory-mappable — no full load into RAM.

</details>

---

**Q33.** Why can `datasets.map` safely run on multiple CPU cores?

- A) Python threading is very efficient
- B) The GIL is disabled automatically
- C) Because the mapped functions are pure — no shared state, no race conditions
- D) Because `datasets` copies all data to each core

<details>
<summary>Answer</summary>

**C.** Purity removes the coordination problems that normally plague parallel code.

</details>

---

**Q34.** Which syntax does `datasets` use to chain transformations?

- A) `pipe(ds, f, g)`
- B) `pipeline(f, g)(ds)`
- C) `ds.filter(f).map(g).map(h)` — method chaining
- D) `reduce(ds, [f, g, h])`

<details>
<summary>Answer</summary>

**C.** Same left-to-right concept, expressed through method chaining.

</details>

---

**Q35.** What does `load_dataset("json", data_files="x.json", split="train")` return?

- A) A Python list
- B) A `Dataset` object (not a dataset dictionary, thanks to `split="train"`)
- C) A pandas DataFrame
- D) A dict of strings

<details>
<summary>Answer</summary>

**B.** Without `split`, you'd get a `DatasetDict`; with it, a flat `Dataset`.

</details>

---

**Q36.** What does `filter` keep?

- A) Rows where the function returns `None`
- B) Rows where the function returns `True`
- C) Rows with non-empty fields only
- D) Rows sorted by the function

<details>
<summary>Answer</summary>

**B.** `filter` keeps rows for which the predicate returns `True`.

</details>

---

**Q37.** Inside a `map` function that enriches rows, the safest pattern is:

- A) `row["new"] = v; return row`
- B) `return {**row, "new": v}` or `row = row.copy()` then assign
- C) Modify a global dict
- D) Return just the new value

<details>
<summary>Answer</summary>

**B.** Avoid mutating the input; return a new dict.

</details>

---

**Q38.** To access HuggingFace from mainland China without a VPN, set:

- A) `HF_HUB=cn`
- B) `HF_ENDPOINT=https://hf-mirror.com`
- C) `HF_PROXY=china`
- D) `HF_MIRROR=1`

<details>
<summary>Answer</summary>

**B.** Set `HF_ENDPOINT` before importing `datasets`/downloading models.

</details>

---

**Q39.** `ds.train_test_split(test_size=0.2, seed=42)` returns:

- A) A tuple `(train, test)`
- B) A dict-like with keys `"train"` and `"test"`
- C) A single shuffled `Dataset`
- D) The training set only

<details>
<summary>Answer</summary>

**B.** You access the splits via `result["train"]` and `result["test"]`.

</details>

---

**Q40.** Which `datasets` method REMOVES columns?

- A) `.drop_columns(...)`
- B) `.remove_columns(...)`
- C) `.delete(...)`
- D) `.pop(...)`

<details>
<summary>Answer</summary>

**B.** Use `remove_columns` (or `select_columns` for the opposite).

</details>

---

**Q41.** Why test at all?

- A) Tests are required by Python syntax
- B) To catch edge cases before running a multi-hour pipeline on 50M rows
- C) To replace documentation
- D) To slow down deployment

<details>
<summary>Answer</summary>

**B.** Tests are the fire alarm you install before the fire.

</details>

---

**Q42.** What is `assert`?

- A) A Python function from the `unittest` module
- B) A statement that raises `AssertionError` when the condition is False
- C) A pytest-only keyword
- D) A way to print errors silently

<details>
<summary>Answer</summary>

**B.** Built-in statement. Silent if True, raises `AssertionError` if False.

</details>

---

**Q43.** The canonical way to run pytest from a project root is:

- A) `pytest`
- B) `python -m pytest`
- C) `run pytest`
- D) `pip pytest`

<details>
<summary>Answer</summary>

**B.** Ensures pytest runs with the current Python interpreter (e.g. inside the venv).

</details>

---

**Q44.** To run only one specific test function:

- A) `python -m pytest tests/test_x.py -only test_foo`
- B) `python -m pytest tests/test_x.py::test_foo`
- C) `python -m pytest tests/test_x.py/test_foo`
- D) `python -m pytest test_foo`

<details>
<summary>Answer</summary>

**B.** The `file::function` syntax targets a single test.

</details>

---

**Q45.** pytest discovers test files by:

- A) Reading a `tests.cfg` file
- B) Looking for functions decorated with `@pytest.test`
- C) Collecting files named `test_*.py` and functions named `test_*`
- D) Running every `.py` file

<details>
<summary>Answer</summary>

**C.** Default discovery is by filename and function-name prefix.

</details>

---

**Q46.** What does this test do?

```python
def double(x): return x * 2
def test_double():
    assert double(4) == 8
```

- A) Passes silently
- B) Fails with `AssertionError`
- C) Raises `TypeError`
- D) Prints 8

<details>
<summary>Answer</summary>

**A.** `double(4)==8` is True; the test passes without output (unless `-v`).

</details>

---

**Q47.** What does this test report?

```python
def test_double():
    assert double(4) == 9
```

- A) PASSED
- B) FAILED with `assert 8 == 9`
- C) SKIPPED
- D) ERROR

<details>
<summary>Answer</summary>

**B.** pytest prints the actual value (8) vs expected (9).

</details>

---

**Q48.** Why is testing impure functions painful?

- A) Python forbids it
- B) You must create mocks, patches, fake DBs — boilerplate and brittleness
- C) `assert` doesn't work on impure functions
- D) pytest can't collect them

<details>
<summary>Answer</summary>

**B.** External dependencies force mocking; mocks drift from reality.

</details>

---

**Q49.** What does `@pytest.mark.parametrize` do?

- A) Makes a test run in parallel
- B) Turns one test function into many via a table of `(input, expected)` pairs
- C) Skips the test
- D) Measures runtime

<details>
<summary>Answer</summary>

**B.** Each row in the parametrize table becomes its own test case.

</details>

---

**Q50.** How many test cases run here?

```python
@pytest.mark.parametrize("v, e", [("5", 5), ("2.0", 2), ("", None)])
def test_norm(v, e):
    assert normalize_score(v) == e
```

- A) 1
- B) 3
- C) It depends on the input
- D) 0

<details>
<summary>Answer</summary>

**B.** One row = one test case; here three independent cases run.

</details>

---

**Q51.** What is a pytest fixture?

- A) A frozen test that never changes
- B) A reusable helper function (decorated with `@pytest.fixture`) that provides test data
- C) A way to force a test to pass
- D) A plugin for parallel execution

<details>
<summary>Answer</summary>

**B.** Fixtures centralise shared setup/data.

</details>

---

**Q52.** Given:

```python
@pytest.fixture
def sample_row():
    return {"text": " Hello <br> ", "lang": "en"}

def test_foo(sample_row):
    assert sample_row["lang"] == "en"
```

What does pytest do?

- A) Calls `sample_row()` explicitly inside the test
- B) Matches the parameter name `sample_row` to the fixture and injects its return value
- C) Raises an error — fixtures need manual calls
- D) Treats `sample_row` as a string

<details>
<summary>Answer</summary>

**B.** pytest injects fixtures by parameter-name matching.

</details>

---

**Q53.** How do you assert that a function raises `ZeroDivisionError`?

- A) `assert divide(10, 0) raises ZeroDivisionError`
- B) `with pytest.raises(ZeroDivisionError): divide(10, 0)`
- C) `assert_raises(ZeroDivisionError, divide, 10, 0)`
- D) `pytest.expect(ZeroDivisionError)`

<details>
<summary>Answer</summary>

**B.** `pytest.raises` is a context manager for expected exceptions.

</details>

---

**Q54.** `@pytest.mark.skip(reason="...")` is used when:

- A) A test is broken and should never run again
- B) A feature isn't ready yet — skip the test for now, but keep it visible
- C) The test is too slow
- D) The test should only run on Windows

<details>
<summary>Answer</summary>

**B.** Mark tests as pending; they show as skipped in the report.

</details>

---

**Q55.** Unit tests vs integration tests:

- A) Same thing, different name
- B) Unit = one function in isolation; integration = multiple functions working together
- C) Unit tests are slower
- D) Integration tests can't use `assert`

<details>
<summary>Answer</summary>

**B.** Brick test vs. house test. You need both.

</details>

---

**Q56.** The three categories of test cases to consider are:

- A) Fast, medium, slow
- B) Normal, edge, error
- C) Input, output, config
- D) Public, private, protected

<details>
<summary>Answer</summary>

**B.** Happy-path, edge cases, and error handling.

</details>

---

**Q57.** Why create a virtual environment?

- A) It makes Python faster
- B) It isolates per-project packages so versions don't clash and nothing goes global
- C) It encrypts your code
- D) It is required to run `pytest`

<details>
<summary>Answer</summary>

**B.** Each project gets its own package set; reproducible and safe.

</details>

---

**Q58.** Which command creates a venv called `.venv`?

- A) `pip install venv .venv`
- B) `python -m venv .venv`
- C) `python venv .venv`
- D) `virtualenv install`

<details>
<summary>Answer</summary>

**B.** `python -m venv .venv` creates the `.venv/` directory.

</details>

---

**Q59.** On macOS/Linux, how do you activate a venv?

- A) `activate .venv`
- B) `source .venv/bin/activate`
- C) `. .venv/activate.sh`
- D) `venv start`

<details>
<summary>Answer</summary>

**B.** Source the activation script; your prompt will show `(.venv)`.

</details>

---

**Q60.** To leave a venv you should run:

- A) `exit`
- B) `deactivate`
- C) `close venv`
- D) `venv stop`

<details>
<summary>Answer</summary>

**B.** `exit` closes the terminal; `deactivate` just leaves the venv.

</details>

---

**Q61.** How do you save a venv's installed packages to a file?

- A) `pip save > requirements.txt`
- B) `pip freeze > requirements.txt`
- C) `pip list > requirements.txt`
- D) `python -m pip export`

<details>
<summary>Answer</summary>

**B.** `pip freeze` outputs exact versions in the right format.

</details>

---

**Q62.** To restore dependencies from a requirements file:

- A) `pip restore requirements.txt`
- B) `pip install -r requirements.txt`
- C) `pip load requirements.txt`
- D) `pip import requirements.txt`

<details>
<summary>Answer</summary>

**B.** `-r` reads the file and installs every listed package.

</details>

---

**Q63.** A decorator is essentially:

- A) Python magic that only works in classes
- B) A wrapper: `function = decorator(function)` — just shorthand via `@`
- C) A way to make a function run twice
- D) A type annotation

<details>
<summary>Answer</summary>

**B.** `@d` above `def f` is equivalent to `f = d(f)`. No magic.

</details>

---

**Q64.** What does this print?

```python
def shout(fn):
    def wrapper(*a, **kw):
        return fn(*a, **kw).upper()
    return wrapper

@shout
def greet(name):
    return f"hello, {name}"

print(greet("Alice"))
```

- A) `hello, Alice`
- B) `HELLO, ALICE`
- C) `hello, ALICE`
- D) TypeError

<details>
<summary>Answer</summary>

**B.** The wrapper calls `greet` then uppercases the result.

</details>

---

**Q65.** Why use `*args, **kwargs` in a wrapper?

- A) They speed up the call
- B) They make the wrapper universal — it works with any function signature
- C) Python requires them in every function
- D) They silence exceptions

<details>
<summary>Answer</summary>

**B.** Capture any positional/keyword arguments and forward them via `fn(*args, **kwargs)`.

</details>

---

**Q66.** What is `*args` stored as?

- A) List
- B) Dict
- C) Tuple
- D) Set

<details>
<summary>Answer</summary>

**C.** Positional extras → tuple. Keyword extras (`**kwargs`) → dict.

</details>

---

**Q67.** Given:

```python
def add_exclamation(fn):
    def w(*a, **k): return fn(*a, **k) + "!"
    return w

def shout(fn):
    def w(*a, **k): return fn(*a, **k).upper()
    return w

@add_exclamation
@shout
def greet(name):
    return f"hello, {name}"

print(greet("Alice"))
```

- A) `HELLO, ALICE`
- B) `HELLO, ALICE!`
- C) `hello, alice!`
- D) `hello, Alice!`

<details>
<summary>Answer</summary>

**B.** Bottom-up: `shout` first uppercases → `"HELLO, ALICE"`, then `add_exclamation` appends `!`.

</details>

---

**Q68.** `@a @b def f` is equivalent to:

- A) `f = a(f); f = b(f)`
- B) `f = a(b(f))`
- C) `f = b(a(f))`
- D) `f = a(f) + b(f)`

<details>
<summary>Answer</summary>

**B.** The decorator closest to `def` applies first; outer wraps the result.

</details>

---

**Q69.** Why does this crash?

```python
def make_counter():
    count = 0
    def inc():
        count += 1
        return count
    return inc
```

- A) Indentation error
- B) `UnboundLocalError` — assignment makes `count` local inside `inc`
- C) `count` is out of scope for reading
- D) Missing `return`

<details>
<summary>Answer</summary>

**B.** Any assignment inside the function marks the name as local — you can't `+=` a captured variable without `nonlocal`.

</details>

---

**Q70.** The fix is:

- A) Add `global count`
- B) Add `nonlocal count` inside `inc`
- C) Rename the variable
- D) Use a class

<details>
<summary>Answer</summary>

**B.** `nonlocal` tells Python the name lives in the enclosing (not global) scope.

</details>

---

**Q71.** What does this print?

```python
def make_counter():
    count = 0
    def inc():
        nonlocal count
        count += 1
        return count
    return inc

c = make_counter()
print(c(), c(), c())
```

- A) `1 1 1`
- B) `1 2 3`
- C) `3 3 3`
- D) `0 1 2`

<details>
<summary>Answer</summary>

**B.** Each call increments the shared closure variable.

</details>

---

**Q72.** Why does `@retry(max_attempts=3)` need THREE layers?

- A) To make it run faster
- B) Layer 1 receives config, layer 2 receives `fn`, layer 3 is the wrapper
- C) Python syntax requires it
- D) To handle exceptions

<details>
<summary>Answer</summary>

**B.** `retry(3)` must return a decorator, which must return a wrapper.

</details>

---

**Q73.** `@lru_cache(maxsize=128)` works safely only on:

- A) Async functions
- B) Pure functions with hashable arguments
- C) Methods of a class
- D) Functions that print to stdout

<details>
<summary>Answer</summary>

**B.** Same input → same output is required, and args must be hashable for cache keys.

</details>

---

**Q74.** What does LRU stand for?

- A) Last Recent Update
- B) Least Recently Used
- C) Linear Recursive Unit
- D) Long Running Utility

<details>
<summary>Answer</summary>

**B.** When the cache is full, the least-recently-used entry is evicted.

</details>

---

**Q75.** Why does this crash?

```python
from functools import lru_cache
@lru_cache
def process(row):
    return {**row, "ok": True}
process({"a": 1})
```

- A) Missing `maxsize`
- B) `TypeError` — dicts are not hashable, can't be cache keys
- C) `lru_cache` can't wrap row-processors
- D) Return value is too big

<details>
<summary>Answer</summary>

**B.** Cache keys must be hashable; dicts aren't. Use a tuple or `frozenset`.

</details>

---

**Q76.** Why is caching an API-call function with `@lru_cache` DANGEROUS?

- A) API calls are too fast to benefit
- B) The cached value may be stale — the real resource can change
- C) `lru_cache` can't handle strings
- D) It's forbidden by Python

<details>
<summary>Answer</summary>

**B.** Impure functions can return different values for the same input; caching locks in an outdated one.

</details>

---

**Q77.** In the FP error-handling architecture, the THREE phases are:

- A) Input, logic, output
- B) Parse, compute, print
- C) Normalize, validate, process
- D) Lex, parse, eval

<details>
<summary>Answer</summary>

**C.** Fix what you can, then check what's left, then route clean data.

</details>

---

**Q78.** What does `@make_safe` do?

- A) Deletes broken rows
- B) Wraps a step: skip rows that already have `_error`, catch crashes and tag them, otherwise pass through
- C) Makes the function run on a separate thread
- D) Validates the row's schema

<details>
<summary>Answer</summary>

**B.** Three rules: skip, catch, pass through.

</details>

---

**Q79.** Why is the "skip" rule (return row if `_error` is already set) important?

- A) It saves memory
- B) Without it, every downstream step would need its own `if row.get("_error")` guard
- C) It speeds up Python imports
- D) It prevents type errors

<details>
<summary>Answer</summary>

**B.** Avoids cascading error checks through every function.

</details>

---

**Q80.** Why must normalization happen BEFORE validation?

- A) It's alphabetical order
- B) So fixable values (like `"english" → "en"`) aren't rejected by a strict validator first
- C) Validation is slower
- D) Normalize can access the database

<details>
<summary>Answer</summary>

**B.** Otherwise you'd drop rows that could have been saved.

</details>

---

**Q81.** Normalize is described as:

- A) Strict and rejecting
- B) Generous and best-effort
- C) Random
- D) Purely declarative

<details>
<summary>Answer</summary>

**B.** Fix what you can; mark what you can't fix for later.

</details>

---

**Q82.** Which describes a validator?

- A) A function `row -> new row`
- B) A function `row -> str | None` (error string or None if valid)
- C) A decorator
- D) A class

<details>
<summary>Answer</summary>

**B.** Simple signature — None means "ok", a string means "this error".

</details>

---

**Q83.** Given:

```python
def require(field):
    def validator(row):
        if row.get(field) is None:
            return f"missing_{field}"
        return None
    return validator
```

What does `require("email")({"email": None})` return?

- A) `None`
- B) `"missing_email"`
- C) `True`
- D) `False`

<details>
<summary>Answer</summary>

**B.** Field is `None`, so the validator emits the error tag.

</details>

---

**Q84.** Why does `check()` return `None` (no error) when the field value is `None`?

- A) To silently fix the row
- B) To avoid double-reporting — `require()` already handles the missing case
- C) Because `None` is always valid
- D) Historical reason

<details>
<summary>Answer</summary>

**B.** Separation of concerns: presence is `require`'s job, value checks are `check`'s job.

</details>

---

**Q85.** What does the walrus operator `:=` do?

- A) Compares two expressions
- B) Assigns and returns a value in the same expression
- C) Creates a generator
- D) Does integer division

<details>
<summary>Answer</summary>

**B.** E.g. `if (x := f()) > 0:` both assigns and tests.

</details>

---

**Q86.** In `validate()`, why use `[err for v in validators if (err := v(row)) is not None]`?

- A) It's shorter syntax
- B) It avoids calling each validator twice — once for the `if`, once for the value
- C) Required by pytest
- D) It runs validators in parallel

<details>
<summary>Answer</summary>

**B.** The walrus keeps the result and reuses it in the same comprehension.

</details>

---

**Q87.** `validate()` runs:

- A) Only until the first error
- B) ALL validators, collecting every error
- C) Randomly chosen validators
- D) Only the first validator

<details>
<summary>Answer</summary>

**B.** Collecting all errors gives users a complete picture per row.

</details>

---

**Q88.** The pipeline produces three final buckets. Which?

- A) `big`, `medium`, `small`
- B) `good`, `dirty`, `crashed`
- C) `train`, `val`, `test`
- D) `raw`, `clean`, `final`

<details>
<summary>Answer</summary>

**B.** Nothing is lost: valid rows, invalid rows, and exception-tagged rows.

</details>

---

**Q89.** The course-built `require`/`check` validators are the same concept as what production-grade library?

- A) NumPy
- B) Pydantic
- C) FastAPI
- D) SQLAlchemy

<details>
<summary>Answer</summary>

**B.** Pydantic expresses the same idea as declarative model fields.

</details>

---

**Q90.** What does HuggingFace (HF) host?

- A) Only datasets, not models
- B) Pre-trained models and datasets (NLP, vision, audio) — a "GitHub for neural net weights"
- C) Only Chinese-language models
- D) Python packages

<details>
<summary>Answer</summary>

**B.** Models and datasets, with Python libraries `transformers` and `datasets`.

</details>

---

**Q91.** Zero-shot classification:

- A) Requires thousands of labelled examples
- B) Lets you classify text into ANY labels at inference time, with no task-specific training
- C) Is always more accurate than supervised classification
- D) Only works on images

<details>
<summary>Answer</summary>

**B.** The model is pretrained on a generic entailment task; you supply candidate labels at call time.

</details>

---

**Q92.** In this call:

```python
out = clf(text, candidate_labels=[...], multi_label=False)
```

Which key of `out` holds the best prediction?

- A) `out["labels"][-1]`
- B) `out["labels"][0]` (labels are sorted by descending score)
- C) `out["best"]`
- D) `out["prediction"]`

<details>
<summary>Answer</summary>

**B.** And `out["scores"][0]` is the corresponding confidence.

</details>

---

**Q93.** Setting `multi_label=False` means:

- A) Each label scored independently
- B) Softmax across labels — scores sum to ~1
- C) Labels are ignored
- D) Only one label allowed in the candidates

<details>
<summary>Answer</summary>

**B.** Use `True` when multiple labels can apply simultaneously.

</details>

---

**Q94.** Why should `pipeline(...)` be built ONCE per process, not per row?

- A) Python crashes otherwise
- B) Construction is slow (~3-5s + download); rebuilding every call destroys performance
- C) HF license forbids it
- D) The result is random on each build

<details>
<summary>Answer</summary>

**B.** Store it in a module-level variable behind an `if _classifier is None` guard.

</details>

---

**Q95.** Where does HuggingFace cache downloaded models by default?

- A) `/tmp/hf`
- B) `~/.cache/huggingface/hub/`
- C) The current working directory
- D) `/var/hf`

<details>
<summary>Answer</summary>

**B.** The first run downloads (~280MB for DeBERTa v3 base); later runs read from cache.

</details>

---

**Q96.** Why use `Dataset.map(batched=True, batch_size=16)` for inference?

- A) Python is faster when batch size is odd
- B) Batching vectorises internally, ~10× faster on GPU, still faster on CPU
- C) It's required by `transformers`
- D) It compresses the data

<details>
<summary>Answer</summary>

**B.** Also composable, streamable, cacheable — unlike a plain `for` loop.

</details>

---

**Q97.** In `classify_batch`, the input `batch` is:

- A) A single row dict
- B) A dict of lists — e.g. `{"pitch": ["p1", "p2", ..., "p16"]}`
- C) A tuple of dicts
- D) A list of tuples

<details>
<summary>Answer</summary>

**B.** `batched=True` hands you a dict-of-lists batch.

</details>

---

**Q98.** Why does the Track C project ship a `mock` mode?

- A) To cheat on grading
- B) No download, runs in under a second — lets you iterate on plumbing without AI overhead
- C) Because the real model is broken
- D) To compress the output

<details>
<summary>Answer</summary>

**B.** Mock isolates business bugs from AI bugs; pytest runs in mock by default.

</details>

---

**Q99.** Which is NOT a benefit of `Dataset.map` over a plain for-loop?

- A) Built-in batching
- B) Automatic disk caching
- C) Automatic GPU driver installation
- D) Streams and can be uploaded to the HF hub

<details>
<summary>Answer</summary>

**C.** GPU drivers are a separate system concern — map won't install them.

</details>

---

**Q100.** What does this print (assume functions defined correctly)?

```python
from functools import reduce
def pipe(d, *fns): return reduce(lambda a, f: f(a), fns, d)

inc   = lambda x: x + 1
trpl  = lambda x: x * 3
print(pipe(2, inc, trpl, inc))
```

- A) 9
- B) 10
- C) 11
- D) 13

<details>
<summary>Answer</summary>

**B.** `2+1=3`, `3*3=9`, `9+1=10`.

</details>

---

**Q101.** Which of these IS a higher-order function?

- A) `len`
- B) `map`
- C) `print`
- D) `abs`

<details>
<summary>Answer</summary>

**B.** `map` takes a function as an argument — classic HOF.

</details>

---

**Q102.** In `datasets`, method chaining expresses pipelines. Which reads correctly?

- A) `ds.map(f).filter(g).map(h)` — apply all three, left to right
- B) Execution is right-to-left; `h` runs first
- C) Only one `.map` is allowed per chain
- D) `.filter` must come last

<details>
<summary>Answer</summary>

**A.** Same concept as `pipe`, different syntax.

</details>

---

**Q103.** Which command runs with more details?

- A) `python -m pytest --debug`
- B) `python -m pytest -v`
- C) `python -m pytest --verbose-max`
- D) `python -m pytest -d`

<details>
<summary>Answer</summary>

**B.** `-v` shows each test name and its pass/fail status.

</details>

---

**Q104.** What does this test output?

```python
from functools import reduce

def test_pipe_empty():
    assert reduce(lambda a, f: f(a), (), 7) == 7
```

- A) FAILED
- B) PASSED (reduce over empty iterable returns initial value)
- C) ERROR — reduce needs a non-empty iterable
- D) SKIPPED

<details>
<summary>Answer</summary>

**B.** With an initial value, reduce on `()` returns it unchanged.

</details>

---

**Q105.** The validator `check("age", lambda a: a >= 18, "too_young")` applied to `{"age": 12}` returns:

- A) `None`
- B) `"too_young"`
- C) `12`
- D) `False`

<details>
<summary>Answer</summary>

**B.** Value 12 fails the predicate; the error message is emitted.

</details>

---

**Q106.** What does this return?

```python
validators = [require("email"), check("age", lambda a: a >= 18, "too_young")]
validate_row = validate(validators)
validate_row({"email": "a@b.com", "age": 12})
```

- A) `{"_valid": True}`
- B) `{..., "_valid": False, "_errors": ["too_young"]}`
- C) `{"_errors": ["missing_email"]}`
- D) `{"_valid": False, "_errors": ["missing_email", "too_young"]}`

<details>
<summary>Answer</summary>

**B.** Email is present, so only `too_young` is collected.

</details>

---

**Q107.** In the FP course's validator factories, which "returned value" pattern is used?

- A) Classes with an `__init__` method
- B) Closures — the outer function captures config; the inner function is the actual validator
- C) Global variables
- D) Metaclasses

<details>
<summary>Answer</summary>

**B.** Exactly what you saw in Course 10 / make_counter.

</details>

---

**Q108.** Which is true about `@lru_cache` and pure functions?

- A) Purity is optional but recommended
- B) Purity is REQUIRED for correctness — impure functions may return stale values
- C) `lru_cache` works only on impure functions
- D) Purity makes caching slower

<details>
<summary>Answer</summary>

**B.** Same-input/same-output is the prerequisite for safe memoization.

</details>

---

**Q109.** What does this print?

```python
from functools import lru_cache
calls = 0

@lru_cache
def f(x):
    global calls
    calls += 1
    return x * x

f(2); f(2); f(3); f(2)
print(calls)
```

- A) 4
- B) 2
- C) 1
- D) 3

<details>
<summary>Answer</summary>

**B.** First call for 2 and first call for 3 count; repeats are cache hits. (Side effects like this are a warning sign, but the question is about the count.)

</details>

---

**Q110.** Why does VS Code Shift+Enter sometimes send code to zsh instead of the Python REPL?

- A) A zsh bug
- B) `python.REPL.sendToNativeREPL` setting is unchecked
- C) The venv is corrupted
- D) Anaconda blocks it

<details>
<summary>Answer</summary>

**B.** Enable that setting so selections go to the interactive Python interpreter.

</details>

---

**Q111.** What does `pipeline(to_lower, strip_html)("Hi <br> X")` return, given obvious implementations?

- A) `"hi <br> x"`
- B) `"Hi  X"`
- C) `"hi  x"`
- D) `"Hi <br> X"`

<details>
<summary>Answer</summary>

**C.** Lowercased then `<br>` replaced by a space (two spaces remain).

</details>

---

**Q112.** Which of these is an integration test?

- A) `assert normalize_whitespace("a  b") == "a b"`
- B) `assert clean_price("  $10  ") == 10`
- C) `assert pipeline("  Hi<br>World  ") == "hi world"` — testing multiple steps together
- D) `assert double(3) == 6`

<details>
<summary>Answer</summary>

**C.** An end-to-end pipeline call through multiple transformations is an integration test.

</details>

---

**Q113.** Given:

```python
def make_safe(fn):
    def wrapper(row):
        if "_error" in row: return row
        try: return fn(row)
        except Exception as e: return {**row, "_error": f"{fn.__name__}: {e}"}
    return wrapper

@make_safe
def parse_score(row): return {**row, "score": int(row["score"])}

print(parse_score({"score": "abc"}))
```

- A) Crashes with ValueError
- B) Returns `{"score": "abc", "_error": "parse_score: invalid literal for int() with base 10: 'abc'"}`
- C) Returns `{"score": None}`
- D) Returns `{}`

<details>
<summary>Answer</summary>

**B.** The wrapper catches the exception and tags the row.

</details>

---

**Q114.** What does this return?

```python
@make_safe
def parse_score(row): return {**row, "score": int(row["score"])}

parse_score({"score": "5", "_error": "prior"})
```

- A) `{"score": 5, "_error": "prior"}`
- B) `{"score": "5", "_error": "prior"}` — skipped because `_error` is already set
- C) Raises
- D) `{"score": None}`

<details>
<summary>Answer</summary>

**B.** The first rule of `@make_safe`: skip rows that already have an error.

</details>

---

**Q115.** Which statement about `first-class citizens` and FP is TRUE?

- A) They are only a C++ concept
- B) Because functions are first-class, we can build HOFs like `pipeline` and decorators
- C) They are a memory-allocation category
- D) They apply only to integers

<details>
<summary>Answer</summary>

**B.** First-class → pass/return/assign → HOFs → pipeline, map, decorators.

</details>

---

**Q116.** What is the equivalent of `pipe(100, add_tax, apply_discount, round_price)` in nested form?

- A) `round_price(apply_discount(add_tax(100)))`
- B) `add_tax(apply_discount(round_price(100)))`
- C) `apply_discount(add_tax(round_price(100)))`
- D) `round_price(add_tax(apply_discount(100)))`

<details>
<summary>Answer</summary>

**A.** Right-to-left nesting of the same order of application.

</details>

---

**Q117.** Which statement about method chaining in pandas / sklearn / PyTorch / datasets is TRUE?

- A) They reject FP ideas
- B) They all encode the universal "pipeline of pure steps" concept with their own syntax
- C) Only pandas uses chaining
- D) Chaining is deprecated in modern Python

<details>
<summary>Answer</summary>

**B.** Same idea, different API — once you understand `pipe/pipeline`, you can read them all.

</details>

---

**Q118.** Which test best covers edge cases for `normalize_score`?

- A) Only `("5", 5)`
- B) `("5", 5), ("2.0", 2), ("4/5", 4), ("", None), (None, None)`
- C) Only `(None, None)`
- D) `(None, 0)`

<details>
<summary>Answer</summary>

**B.** Covers normal, float string, fraction form, empty string, and None.

</details>

---

**Q119.** What does this print?

```python
def count_calls(fn):
    count = 0
    def w(*a, **k):
        nonlocal count
        count += 1
        print(count)
        return fn(*a, **k)
    return w

@count_calls
def f(x): return x

f(1); f(2); f(3)
```

- A) `0 1 2`
- B) `1 1 1`
- C) `1 2 3`
- D) `3 3 3`

<details>
<summary>Answer</summary>

**C.** The closure variable persists across calls thanks to `nonlocal`.

</details>

---

**Q120.** Taking the whole course together, the unifying mental model is:

- A) "Everything is a class"
- B) "Small pure functions, chained together, packaged as reusable pipelines, protected by decorators, validated separately, tested in isolation"
- C) "Use global variables for clarity"
- D) "Always prefer OOP"

<details>
<summary>Answer</summary>

**B.** That sentence is essentially the course in one line — from FP intro through testing to error handling and AI inference.

</details>

---
