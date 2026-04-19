# Functional Programming — 60 Advanced MCQ

> Tricky questions designed to expose common reasoning mistakes（思维漏洞）and deepen understanding. Covers subtle edge cases, look-alike code traps, and conceptual distinctions that careless readers miss.

---

**Q1.** Consider this function. Is it pure?

```python
def greet(name):
    print(f"Hello {name}")
    return f"Hello {name}"
```

- A) Yes — it always returns the same value for the same input
- B) No — `print()` is a side effect, even though the return value is deterministic
- C) Yes — `print()` is not a side effect because it doesn't modify any variable
- D) It depends on whether anyone reads the screen

<details>
<summary>Answer</summary>

**B.** `print()` is I/O — it interacts with the outside world. A pure function must have NO side effects, not just a deterministic return value. Many students forget that I/O counts as a side effect.（print 是副作用，即使返回值是确定的）

</details>

---

**Q2.** What is the output?

```python
def f(x): return x + 1
def g(x): return x * 2

result = g(f(3))
print(result)
```

- A) 7
- B) 8
- C) 9
- D) 6

<details>
<summary>Answer</summary>

**B.** Right-to-left: `f(3) = 4`, then `g(4) = 8`. A common mistake is to apply `g` first because it appears first in reading order.（从内到外：先 f(3)=4，再 g(4)=8）

</details>

---

**Q3.** Now with `pipe()`:

```python
result = pipe(3, g, f)
```

What is the result?

- A) 8
- B) 7
- C) 9
- D) 6

<details>
<summary>Answer</summary>

**B.** Left-to-right: `g(3) = 6`, then `f(6) = 7`. Tricky because Q2 gives `g(f(3)) = 8`, but `pipe(3, g, f)` applies `g` FIRST. The nested form and pipe form with same function names give DIFFERENT results when order is swapped.（pipe 从左到右，先 g 后 f，结果不同于 g(f(3))）

</details>

---

**Q4.** Which expression makes `pipe(3, g, f)` produce the same result as `g(f(3))`?

- A) `pipe(3, g, f)`
- B) `pipe(3, f, g)`
- C) `pipe(3, f)`
- D) `pipe(g, f, 3)`

<details>
<summary>Answer</summary>

**B.** `g(f(3))` means f first, then g. In pipe, left-to-right: `pipe(3, f, g)` = f first, then g. The pipe order is the REVERSE of the nesting order.（嵌套读内到外，pipe 读左到右；要等价需反转顺序）

</details>

---

**Q5.** What is the output?

```python
user = {"name": "Alice", "scores": [90, 85]}
new_user = {**user, "name": "Bob"}
new_user["scores"].append(70)
print(user["scores"])
```

- A) `[90, 85]`
- B) `[90, 85, 70]`
- C) `[70]`
- D) Error

<details>
<summary>Answer</summary>

**B.** `{**user}` creates a SHALLOW copy. The `"scores"` list is NOT copied — both `user` and `new_user` share the SAME list object. Appending to `new_user["scores"]` also modifies `user["scores"]`. This is a critical trap: `{**dict}` does NOT deep-copy nested mutable objects.（浅拷贝陷阱：嵌套的可变对象仍然共享）

</details>

---

**Q6.** Is the following function pure?

```python
import time

def slow_double(x):
    time.sleep(1)
    return x * 2
```

- A) Yes — same input always gives the same output
- B) No — `time.sleep()` is a side effect on system resources
- C) Both answers are defensible — the mapping is deterministic, but `time.sleep()` is technically a side effect
- D) No — it's too slow to be pure

<details>
<summary>Answer</summary>

**C.** This is the debatable case from the course. The return value IS deterministic, but `time.sleep()` affects system timing. In practice, most treat the mapping as pure, but strictly speaking it has a side effect. The course explicitly calls this "debatable."（这是可辩论的情况：返回值确定，但 sleep 严格来说是副作用）

</details>

---

**Q7.** What is the output?

```python
grades = (85, 92, 78)
new_grades = grades + (90)
print(new_grades)
```

- A) `(85, 92, 78, 90)`
- B) TypeError
- C) `(85, 92, 78, (90))`
- D) `(175, 92, 78)`

<details>
<summary>Answer</summary>

**B.** `(90)` is just the integer `90`, not a tuple. You cannot concatenate a tuple with an int. You need `(90,)` with a trailing comma. This is one of the most common Python traps.（(90) 是整数不是元组，需要 (90,) 才是元组）

</details>

---

**Q8.** What is the output?

```python
from functools import reduce

result = reduce(lambda acc, x: acc + x, [10])
print(result)
```

- A) 10
- B) 0
- C) TypeError
- D) `[10]`

<details>
<summary>Answer</summary>

**A.** With a single element and no initial value, `reduce` returns that element directly — the function is NEVER called. Many students think this would crash or return 0.（单元素无初始值时，直接返回该元素，函数不会被调用）

</details>

---

**Q9.** What about this?

```python
from functools import reduce

result = reduce(lambda acc, x: acc * x, [10], 0)
print(result)
```

- A) 10
- B) 0
- C) TypeError
- D) `[0]`

<details>
<summary>Answer</summary>

**B.** With initial value 0: `acc=0, x=10 → 0 * 10 = 0`. The initial value matters enormously! Changing from `+` to `*` with initial value 0 gives 0 for ANY list. For multiplication, use initial value 1.（初始值为 0 时乘法永远得 0；乘法应用初始值 1）

</details>

---

**Q10.** What does `reduce` return on an empty list WITH an initial value?

```python
from functools import reduce
result = reduce(lambda acc, x: acc + x, [], 42)
print(result)
```

- A) 0
- B) 42
- C) TypeError
- D) `[]`

<details>
<summary>Answer</summary>

**B.** With an initial value and an empty iterable, `reduce` returns the initial value directly. The function is never called. This is why always providing an initial value prevents crashes.（空列表有初始值时直接返回初始值）

</details>

---

**Q11.** What is the output?

```python
data = [1, 2, 3]
mapped = map(lambda x: x * 10, data)
data.append(4)
print(list(mapped))
```

- A) `[10, 20, 30]`
- B) `[10, 20, 30, 40]`
- C) `[1, 2, 3, 4]`
- D) Error

<details>
<summary>Answer</summary>

**B.** `map()` returns a lazy iterator. It doesn't process elements until consumed. Since `data` was mutated BEFORE `list(mapped)` was called, the iterator sees the modified list including `4`. This is why mutating data used by lazy iterators is dangerous.（map 是惰性的，消费时才读取数据，此时 data 已被修改）

</details>

---

**Q12.** Which function is pure?

```python
# Function A
def process(row):
    row["text"] = row["text"].lower()
    return row

# Function B
def process(row):
    return {**row, "text": row["text"].lower()}
```

- A) Both are pure
- B) Only Function A
- C) Only Function B
- D) Neither is pure

<details>
<summary>Answer</summary>

**C.** Function A mutates the input dict (`row["text"] = ...` modifies the original). Function B creates a new dict with `{**row}`. Many students miss that `row["text"] = ...` is mutation even though the function returns the row.（A 修改了输入字典，B 创建了新字典）

</details>

---

**Q13.** What does `pipeline()` return?

```python
def pipeline(*fns):
    return lambda data: reduce(lambda acc, fn: fn(acc), fns, data)

result = pipeline(str.upper, str.strip)
print(type(result))
```

- A) `<class 'str'>`
- B) `<class 'function'>`
- C) `<class 'list'>`
- D) `<class 'NoneType'>`

<details>
<summary>Answer</summary>

**B.** `pipeline()` returns a function, not a value. The computation hasn't happened yet — it's waiting for data. This is the key difference from `pipe()`.（pipeline 返回函数而非值）

</details>

---

**Q14.** What is the output?

```python
add_vat = lambda p: {**p, "vat": round(p["price"] * 0.2, 2)}
product = {"name": "Coffee", "price": 30}

result = pipe(product, add_vat)
print(product)
```

- A) `{"name": "Coffee", "price": 30, "vat": 6.0}`
- B) `{"name": "Coffee", "price": 30}`
- C) Error
- D) `{"name": "Coffee", "price": 36}`

<details>
<summary>Answer</summary>

**B.** `add_vat` uses `{**p, ...}` which creates a NEW dict. The original `product` is never modified. Students often think pipe modifies the input — it does not, as long as the functions inside are pure.（纯函数不修改原始数据）

</details>

---

**Q15.** What is the output?

```python
items = []

def add(item):
    items.append(item)
    return items

print(add("a"))
print(add("b"))
print(add("a"))
```

- A) `["a"]`, `["b"]`, `["a"]`
- B) `["a"]`, `["a", "b"]`, `["a", "b", "a"]`
- C) `["a"]`, `["b"]`, `["a", "b", "a"]`
- D) Error

<details>
<summary>Answer</summary>

**B.** `items` is a mutable external list. Each call appends to the SAME list. `add("a")` returns the same list object each time, which keeps growing. This demonstrates why shared mutable state makes function behavior unpredictable.（共享可变状态导致每次调用结果不同）

</details>

---

**Q16.** Is `calculate_price(100, 0.1)` pure even though calling it with `calculate_price(100, 0.2)` gives a different result?

```python
def calculate_price(base_price, tax_rate):
    return base_price * (1 + tax_rate)
```

- A) No — different outputs means it's not deterministic
- B) Yes — different INPUTS give different outputs, which is expected; same inputs always give the same output
- C) No — it depends on external variables
- D) It's only pure if tax_rate is a constant

<details>
<summary>Answer</summary>

**B.** Determinism means same INPUT → same OUTPUT. `(100, 0.1)` always → `110.0`. `(100, 0.2)` always → `120.0`. Different inputs giving different outputs is how functions WORK. Students confuse "different inputs" with "non-deterministic."（不同输入不同输出是正常的；确定性指同一输入总是同一输出）

</details>

---

**Q17.** What is the output?

```python
names = ["Alice", "Bob", "Carol"]
result = list(filter(lambda n: n.startswith("A"), names))
print(result)
```

- A) `[True, False, False]`
- B) `["Alice"]`
- C) `["Bob", "Carol"]`
- D) `["A"]`

<details>
<summary>Answer</summary>

**B.** `filter` KEEPS elements where the predicate returns True. It returns the original elements, NOT the boolean values. Many students confuse `filter` with `map` (which would return booleans).（filter 返回原始元素，不是布尔值）

</details>

---

**Q18.** What is the output?

```python
result = list(map(lambda n: n.startswith("A"), ["Alice", "Bob", "Carol"]))
print(result)
```

- A) `["Alice"]`
- B) `[True, False, False]`
- C) `["A"]`
- D) `["Bob", "Carol"]`

<details>
<summary>Answer</summary>

**B.** `map` applies the function and returns the RESULT of each call. The function returns a boolean → you get a list of booleans. If you wanted the actual names, use `filter`. This is the classic map/filter confusion.（map 返回函数返回值；要筛选元素用 filter）

</details>

---

**Q19.** What is the output?

```python
user = {"name": "Li", "age": 20}
same_user = user
print(user is same_user)
print(id(user) == id(same_user))
```

- A) `True`, `True`
- B) `True`, `False`
- C) `False`, `True`
- D) `False`, `False`

<details>
<summary>Answer</summary>

**A.** `same_user = user` creates an alias — both names point to the SAME object. `is` checks identity (same object), `id()` returns the memory address. Both confirm they are the same object.（赋值创建别名，is 和 id 都确认是同一对象）

</details>

---

**Q20.** What is the output?

```python
user = {"name": "Li", "age": 20}
copy = {**user}
print(user is copy)
print(user == copy)
```

- A) `True`, `True`
- B) `False`, `True`
- C) `False`, `False`
- D) `True`, `False`

<details>
<summary>Answer</summary>

**B.** `{**user}` creates a NEW dict (different `id`, so `is` → False), but with the same content (so `==` → True). The trap: `is` checks identity, `==` checks equality. They are NOT the same thing.（{**user} 创建新对象：is 为 False，== 为 True）

</details>

---

**Q21.** What happens here?

```python
def assign_segment(row, rules):
    for rule in rules:
        if matches_rule(row, rule):
            return {**row, "segment": rule["segment"]}
    return row    # ← no "segment" key
```

- A) Unmatched rows are silently skipped — no problem
- B) Unmatched rows lack a `"segment"` key, causing `KeyError` when `apply_process` tries to read it
- C) Unmatched rows get `segment = None`
- D) The function raises an error for unmatched rows

<details>
<summary>Answer</summary>

**B.** Without `return {**row, "segment": "drop"}`, unmatched rows have no `"segment"` key. Downstream code that reads `row["segment"]` will crash with `KeyError`. This is the trash bin pitfall.（缺少 "drop" 段名导致下游 KeyError）

</details>

---

**Q22.** In a Level 3 routing system, you find this code inside a pipeline:

```python
def process_all(row):
    if row["lang"] == "cn":
        return {**row, "prompt": f"中文：{row['text']}"}
    else:
        return {**row, "prompt": f"EN: {row['text']}"}
```

What is wrong?

- A) Nothing — this is correct functional code
- B) The function is impure because it uses `if/else`
- C) This is routing logic disguised as a pipeline — it should be split into separate pipelines and handled by the dispatch dict
- D) The function should use a `for` loop

<details>
<summary>Answer</summary>

**C.** If a pipeline function checks row properties to decide WHAT to do, that is routing logic leaking into a pipeline. The dispatch dict should handle routing; each pipeline should do ONE thing.（路由逻辑混入管道函数，应拆分到分派字典中）

</details>

---

**Q23.** What is the output?

```python
from functools import reduce

def pipe(data, *fns):
    return reduce(lambda acc, f: f(acc), fns, data)

result = pipe(
    "  Hello <br> World  ",
    str.strip,
    str.lower,
    lambda s: s.replace("<br>", " ")
)
print(result)
```

- A) `"hello   world"`
- B) `"hello  world"`
- C) `"  hello <br> world  "`
- D) `"hello <br> world"`

<details>
<summary>Answer</summary>

**B.** Step by step: `"  Hello <br> World  "` → strip → `"Hello <br> World"` → lower → `"hello <br> world"` → replace → `"hello  world"` (note: two spaces where `<br>` was, since `<br>` is replaced by one space, yielding `" "` between existing spaces → `"hello  world"`).（逐步执行：strip→lower→replace，<br> 替换为空格后有两个空格）

</details>

---

**Q24.** A student writes this test:

```python
def test_pipeline():
    raw = "  Hello<br>World  "
    result = full_pipeline(raw)
    assert result == "hello world"
```

The test fails. All unit tests for individual functions pass. What is the most likely cause?

- A) The test framework is broken
- B) A coordination bug — one function's output type/format doesn't match the next function's expected input
- C) The `assert` statement is wrong
- D) Pure functions cannot be tested together

<details>
<summary>Answer</summary>

**B.** When all brick tests pass but the house test fails, the bug is in how the bricks connect — a coordination bug. For example, one function might output extra whitespace that the next function doesn't handle. This is why both unit AND integration tests are needed.（所有单元测试通过但集成测试失败，说明是函数之间的衔接问题）

</details>

---

**Q25.** Which edge case is MOST likely to crash a data pipeline processing millions of rows?

- A) `"hello world"` (normal text)
- B) `"4/5"` (fraction-style score)
- C) `"PYTHON"` (all caps)
- D) `"banana"` (fruit name)

<details>
<summary>Answer</summary>

**B.** Edge cases like `"4/5"` cause `int("4/5")` to crash with `ValueError`. Normal inputs work fine at any scale. It's the one unexpected format at row 49,999,999 that kills the pipeline.（"4/5" 这样的边界输入会导致 int() 崩溃）

</details>

---

**Q26.** What does this `@pytest.mark.parametrize` test produce?

```python
@pytest.mark.parametrize("value, expected", [
    ("5", 5),
    ("2.0", 2),
    ("", None),
])
def test_normalize(value, expected):
    assert normalize_score(value) == expected
```

- A) 1 test case
- B) 3 independent test cases
- C) 3 test cases that stop at the first failure
- D) A single test that checks all values at once

<details>
<summary>Answer</summary>

**B.** Each row becomes an independent test. If one fails, the others still run. This is the key advantage: you see exactly which input causes the problem.（每行是独立测试用例，互不影响）

</details>

---

**Q27.** A fixture `sample_row` is defined as:

```python
@pytest.fixture
def sample_row():
    return {"text": " Hello ", "lang": "en"}
```

How do you use it in a test?

- A) `result = sample_row()` inside the test body
- B) Pass `sample_row` as a parameter name in the test function signature — pytest injects it automatically
- C) Import `sample_row` from the source code
- D) Call `pytest.fixture(sample_row)` before each test

<details>
<summary>Answer</summary>

**B.** You do NOT call `sample_row()` yourself. Pytest sees the parameter name, matches it to the fixture, and injects the return value automatically. Many students write `sample_row()` inside the test — that's wrong.（不要自己调用 fixture，pytest 自动注入）

</details>

---

**Q28.** What does `all()` return when given an empty list?

```python
print(all([]))
```

- A) `True`
- B) `False`
- C) `None`
- D) Error

<details>
<summary>Answer</summary>

**A.** `all([])` returns `True`. This is vacuous truth: "all zero items satisfy the condition" is True. This can be surprising in validation — if your checks list is accidentally empty, `all([])` says everything is valid!（空列表的 all 返回 True，这是空真值）

</details>

---

**Q29.** What is the output?

```python
data = {"name": "Alice", "score": 95}
data = {"name": "Bob", "score": 42}
print(data["name"])
```

- A) `"Alice"`
- B) `"Bob"`
- C) Error — cannot reassign
- D) `["Alice", "Bob"]`

<details>
<summary>Answer</summary>

**B.** Rebinding: `data` now points to the Bob dict. Alice's dict is GONE — no variable references it anymore. This looks like "modification" but is actually creating a new object and losing the old one.（重新绑定：data 指向新对象，旧对象丢失）

</details>

---

**Q30.** In the immutable pattern, how do you preserve history?

```python
# Version A
cart = create_cart()
cart = add_to_cart(cart, "Laptop", 8999)
cart = add_to_cart(cart, "Mouse", 199)

# Version B
cart_v0 = create_cart()
cart_v1 = add_to_cart(cart_v0, "Laptop", 8999)
cart_v2 = add_to_cart(cart_v1, "Mouse", 199)
```

- A) Both preserve history equally
- B) Version A preserves history; Version B does not
- C) Version B preserves all versions; Version A loses previous versions through rebinding
- D) Neither preserves history

<details>
<summary>Answer</summary>

**C.** Version A rebinds `cart` each time — `cart_v0` and `cart_v1` are lost forever. Version B gives each version a unique name, so all three versions remain accessible.（B 保留所有版本，A 通过重新绑定丢失了旧版本）

</details>

---

**Q31.** Which of the following is the correct way to remove a field from a dict immutably?

- A) `del original["b"]`
- B) `{k: v for k, v in original.items() if k != "b"}`
- C) `original.pop("b")`
- D) `original.remove("b")`

<details>
<summary>Answer</summary>

**B.** A dict comprehension creates a NEW dict excluding key `"b"`. `del` and `pop` mutate the original. `remove` doesn't exist on dicts.（字典推导式创建新字典，del 和 pop 是原地修改）

</details>

---

**Q32.** What does `HuggingFace datasets` use under the hood that allows it to process 50 million rows without loading them all into RAM?

- A) Python lists with garbage collection
- B) Apache Arrow with memory-mapping
- C) SQLite database
- D) Compressed ZIP files

<details>
<summary>Answer</summary>

**B.** Apache Arrow is a columnar binary format that supports memory-mapping — the program reads slices directly from disk without loading the full file into RAM.（Apache Arrow 支持内存映射，无需全部加载到 RAM）

</details>

---

**Q33.** Why can `datasets` safely run `.map()` on 16 CPU cores simultaneously?

- A) Because it uses locks on each row
- B) Because the map functions are pure — no shared state, so parallel execution is safe
- C) Because Python has no Global Interpreter Lock
- D) Because it copies the entire dataset for each core

<details>
<summary>Answer</summary>

**B.** Pure functions guarantee: same row → same result, no shared variables read or written. This is exactly WHY FP was designed — parallelism without race conditions.（纯函数无共享状态，并行安全）

</details>

---

**Q34.** What is the output?

```python
from functools import reduce

reduce(lambda acc, f: f(acc), [lambda x: x + 1, lambda x: x * 2, lambda x: x - 3], 5)
```

- A) 5
- B) 9
- C) 12
- D) 7

<details>
<summary>Answer</summary>

**B.** This IS `pipe` in raw form. acc=5 → (x+1)(5)=6, acc=6 → (x*2)(6)=12, acc=12 → (x-3)(12)=9. The insight: `pipe()` is just `reduce` over functions.（这就是 pipe 的底层实现：对函数列表做 reduce）

</details>

---

**Q35.** What does `pipe(data)` with no functions return?

- A) Error — at least one function is required
- B) `None`
- C) `data` unchanged — it's the identity function
- D) An empty list

<details>
<summary>Answer</summary>

**C.** `reduce` over an empty iterable returns the initial value. So `pipe(42)` = 42. Pipe with no functions is the identity.（空函数列表时 reduce 返回初始值，即 pipe 是恒等函数）

</details>

---

**Q36.** What is wrong with this code?

```python
add = lambda x, y: x + y
result = pipe(5, add)
```

- A) `lambda` cannot be used in `pipe`
- B) `add` requires two arguments, but `pipe` passes only one (the accumulated value)
- C) `pipe` doesn't accept lambdas
- D) The initial value should be 0

<details>
<summary>Answer</summary>

**B.** Each function in pipe must accept exactly ONE argument. `add` needs two. Fix: `add5 = lambda x: x + 5`.（pipe 中每个函数必须接受一个参数）

</details>

---

**Q37.** In `datasets`, what does `.filter().map().map()` express?

- A) Three separate datasets
- B) A left-to-right pipeline using method chaining — same concept as `pipe`, different syntax
- C) A right-to-left composition
- D) A loop that runs three times

<details>
<summary>Answer</summary>

**B.** Method chaining is how `datasets` (and Pandas, Spark, etc.) express pipelines. The concept is identical to `pipe()` — chain pure functions left-to-right. The syntax differs.（方法链与 pipe 概念相同，语法不同）

</details>

---

**Q38.** What is the output?

```python
a = [1, 2, 3]
b = [*a, 4]
a.append(5)
print(b)
```

- A) `[1, 2, 3, 4, 5]`
- B) `[1, 2, 3, 4]`
- C) `[1, 2, 3, 5]`
- D) Error

<details>
<summary>Answer</summary>

**B.** `[*a, 4]` creates a NEW list at the time of creation. Later mutations to `a` do NOT affect `b`. This is the correct immutable pattern — unlike `b = a` which creates an alias.（[*a, 4] 创建新列表，之后修改 a 不影响 b）

</details>

---

**Q39.** A student says: "Comprehensions make `map` and `filter` obsolete." Is this correct?

- A) Yes — comprehensions can replace everything
- B) No — `reduce` has no comprehension equivalent, and lazy chaining of `map → filter → reduce` avoids intermediate lists
- C) No — comprehensions are slower
- D) Yes — comprehensions also handle aggregation

<details>
<summary>Answer</summary>

**B.** Comprehensions cannot aggregate into a single value (that's `reduce`). Also, comprehensions are eager (build full lists), while `map`/`filter` are lazy (zero intermediate lists when chained).（推导式无法聚合为单一值，且是即时求值非惰性）

</details>

---

**Q40.** In a lazy pipeline `map → filter → reduce`, how many intermediate lists are created?

- A) 2 (one for map output, one for filter output)
- B) 1 (only filter creates a list)
- C) 0 — items flow one at a time through the entire chain
- D) 3 (one per step)

<details>
<summary>Answer</summary>

**C.** `map` and `filter` return iterators. Items flow through one at a time: each item goes map → filter → reduce before the next item starts. Zero intermediate lists.（零中间列表，逐项流过整个链）

</details>

---

**Q41.** What is the output?

```python
scores = {"Li": 85, "Zhang": 92, "Wang": 55}
top = max(scores, key=lambda name: scores[name])
print(top)
```

- A) `92`
- B) `"Zhang"`
- C) `{"Zhang": 92}`
- D) `("Zhang", 92)`

<details>
<summary>Answer</summary>

**B.** When you call `max()` on a dict, it iterates over KEYS. `key=` tells it to compare by the VALUE, but it returns the KEY. Many students expect 92 or a tuple.（max 在字典上迭代键，key= 指定比较标准，返回键而非值）

</details>

---

**Q42.** What is the difference between `"25".isdigit()` and checking if a value is a valid integer?

- A) No difference — `isdigit()` covers all cases
- B) `isdigit()` returns `False` for negative numbers like `"-5"` and floats like `"2.5"`
- C) `isdigit()` only works on lists
- D) `isdigit()` converts the string to an integer

<details>
<summary>Answer</summary>

**B.** `"-5".isdigit()` → `False`, `"2.5".isdigit()` → `False`. `isdigit()` only checks if ALL characters are digits (0-9). It's a predicate, not a converter.（isdigit 只检查是否全是数字字符，负数和小数返回 False）

</details>

---

**Q43.** In `json.dump()`, what happens if you omit `ensure_ascii=False`?

- A) The file will be empty
- B) Non-ASCII characters like `"好吃"` are escaped to `"\u597d\u5403"`
- C) The program crashes
- D) Nothing — the output is identical

<details>
<summary>Answer</summary>

**B.** Without `ensure_ascii=False`, Python escapes non-ASCII characters to Unicode escape sequences. The data is preserved but becomes unreadable for humans.（非 ASCII 字符被转义为 \uXXXX）

</details>

---

**Q44.** What is "normalization" in a data pipeline?

- A) Scaling numbers to 0-1 range
- B) Renaming fields from different sources to common names so all rows have the same structure
- C) Sorting data alphabetically
- D) Removing duplicate rows

<details>
<summary>Answer</summary>

**B.** When System A has `"first_name"` and System B has `"student"`, normalization renames both to `"name"`. This allows one function to process all rows regardless of source.（将不同来源的字段名统一为通用名称）

</details>

---

**Q45.** What does YAML use instead of braces and brackets?

- A) Parentheses and semicolons
- B) Indentation (2 spaces) for nesting and dashes (`-`) for list items
- C) XML tags
- D) Commas and colons only

<details>
<summary>Answer</summary>

**B.** YAML uses indentation to show nesting and `-` to mark list items. No braces, no brackets, no commas.（YAML 用缩进表示嵌套，用 - 表示列表项）

</details>

---

**Q46.** What is the output?

```python
process = lambda x: pipe(x, lambda s: s.upper(), lambda s: s + "!")
print(process("hello"))
print(process("world"))
```

- A) `"HELLO!"` then `"WORLD!"`
- B) `"hello!"` then `"world!"`
- C) `"HELLO!"` then `"HELLO!"`
- D) Error

<details>
<summary>Answer</summary>

**A.** `process` is a reusable lambda that pipes through upper then adds "!". Each call applies to its own input independently — this is effectively a pipeline built with pipe inside a lambda.（process 是可复用的函数，每次调用独立）

</details>

---

**Q47.** What is the output?

```python
students = [
    {"name": "Alice", "score": 85},
    {"name": "Bob", "score": 92},
]

result = sorted(students, key=lambda s: s["score"])
print(result[0]["name"])
```

- A) `"Bob"`
- B) `"Alice"`
- C) `92`
- D) Error

<details>
<summary>Answer</summary>

**B.** `sorted()` sorts ascending by default. Lowest score (85) comes first → `result[0]` is Alice. To get Bob first, use `reverse=True`. Students often forget that `sorted` is ascending by default.（sorted 默认升序，最低分在前）

</details>

---

**Q48.** In a YAML file, what Python object does `yaml.safe_load()` return?

- A) A YAML object
- B) A string
- C) A regular Python dict (or list)
- D) A DataFrame

<details>
<summary>Answer</summary>

**C.** `yaml.safe_load()` converts YAML to standard Python objects: dicts, lists, strings, numbers. From there, you access it like any Python dict.（返回标准 Python 字典/列表）

</details>

---

**Q49.** In `load_dataset("csv", data_files="data.csv", split="train")`, what happens if you omit `split="train"`?

- A) You get a `Dataset` object
- B) You get a `DatasetDict` with a `"train"` key, not a `Dataset` directly
- C) The function crashes
- D) It loads only the first 100 rows

<details>
<summary>Answer</summary>

**B.** Without `split="train"`, you get a `DatasetDict` (like `{"train": Dataset(...)}`). You need `split="train"` to get the `Dataset` directly.（不加 split 得到 DatasetDict 而非 Dataset）

</details>

---

**Q50.** What is the output?

```python
def add_tag(user, tag):
    user["tags"].append(tag)
    return user

alice = {"name": "Alice", "tags": ["vip"]}
new_alice = add_tag(alice, "premium")
print(alice is new_alice)
```

- A) `False`
- B) `True`
- C) Error
- D) `None`

<details>
<summary>Answer</summary>

**B.** The function mutates and returns the SAME dict. `alice` and `new_alice` are the same object. The function LOOKS like it creates a new version but secretly modifies the original — the "function that lies."（函数修改并返回同一个对象，alice 和 new_alice 是同一个字典）

</details>

---

**Q51.** Which command runs pytest with verbose output showing each test name?

- A) `python -m pytest`
- B) `python -m pytest -v`
- C) `python -m pytest --quiet`
- D) `python -m pytest --names`

<details>
<summary>Answer</summary>

**B.** The `-v` flag shows each test function name and its PASSED/FAILED status.（-v 显示每个测试的详细结果）

</details>

---

**Q52.** What is the output?

```python
from functools import reduce

words = ["map", "filter", "reduce"]
result = reduce(lambda acc, w: acc + len(w), words, 0)
print(result)
```

- A) `["map", "filter", "reduce"]`
- B) `15`
- C) `3`
- D) `"mapfilterreduce"`

<details>
<summary>Answer</summary>

**B.** acc starts at 0 (int). Each step adds the LENGTH of the word: 0+3=3, 3+6=9, 9+6=15. The accumulator type (int) differs from the element type (str). This is legal and powerful.（累加器类型可以与元素类型不同：int 累加器 + str 元素）

</details>

---

**Q53.** Why does the engine pass `rules` and `dispatch` as function arguments instead of importing them?

- A) Python doesn't support imports
- B) To keep engine functions pure — no hidden dependencies, testable with any rule table
- C) To save disk space
- D) Because global variables are faster

<details>
<summary>Answer</summary>

**B.** Pure function discipline: the engine depends only on its inputs. You can test `assign_segment` with any custom rule table without touching config files.（保持引擎函数纯净，可用任意规则表测试）

</details>

---

**Q54.** What is the output?

```python
a = (1, 2, [3, 4])
a[2].append(5)
print(a)
```

- A) Error — tuples are immutable
- B) `(1, 2, [3, 4, 5])`
- C) `(1, 2, [3, 4])`
- D) `(1, 2, 3, 4, 5)`

<details>
<summary>Answer</summary>

**B.** The tuple itself is immutable (you can't reassign `a[2]`), but the LIST inside it is still mutable. `a[2].append(5)` modifies the list object, not the tuple's reference. This is a deep Python trap: immutable containers can hold mutable objects.（元组不可变但其中的列表仍可变）

</details>

---

**Q55.** What does `deactivate` do in a virtual environment?

- A) Deletes the `.venv` folder
- B) Leaves the virtual environment without closing the terminal
- C) Uninstalls all packages
- D) Restarts Python

<details>
<summary>Answer</summary>

**B.** `deactivate` exits the venv. `exit` would try to close the terminal session. The venv and installed packages remain intact.（退出虚拟环境，不删除任何东西）

</details>

---

**Q56.** In a `datasets` pipeline, what does `.select_columns(["id", "prompt"])` do?

- A) Renames the columns to "id" and "prompt"
- B) Keeps ONLY the specified columns and drops all others
- C) Adds new columns named "id" and "prompt"
- D) Selects specific rows

<details>
<summary>Answer</summary>

**B.** `select_columns` keeps only the listed columns. All other columns are dropped from the resulting dataset.（只保留指定列，删除其他列）

</details>

---

**Q57.** What is the output?

```python
result = [x for x in range(10) if x % 3 == 0]
print(result)
```

- A) `[3, 6, 9]`
- B) `[0, 3, 6, 9]`
- C) `[1, 2, 4, 5, 7, 8]`
- D) `[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]`

<details>
<summary>Answer</summary>

**B.** `0 % 3 == 0` is `True`, so 0 is included. Students often forget that 0 is divisible by every number. `range(10)` starts at 0.（0 能被 3 整除，range(10) 从 0 开始）

</details>

---

**Q58.** What is the output?

```python
def clean(row):
    return {**row, "text": row["text"].strip().lower()}

original = {"text": "  HELLO  ", "id": 1}
cleaned = clean(original)
print(original["text"])
print(cleaned["text"])
```

- A) `"hello"` and `"hello"`
- B) `"  HELLO  "` and `"hello"`
- C) `"  HELLO  "` and `"  HELLO  "`
- D) Error

<details>
<summary>Answer</summary>

**B.** `{**row, "text": ...}` creates a NEW dict. `original` is untouched because `str.strip()` and `str.lower()` return new strings (strings are immutable). This is the correct pure function pattern.（纯函数模式：原始数据不变，返回新字典）

</details>

---

**Q59.** What is "dictionary dispatch" in routing?

- A) Sorting a dictionary alphabetically
- B) Using a dict lookup (`dispatch.get(key)`) to select the correct route, replacing if/elif/else chains
- C) Creating a new dictionary for each row
- D) Dispatching errors to a log file

<details>
<summary>Answer</summary>

**B.** Instead of `if segment == "cn_urgent": ...`, you look up `DISPATCH["cn_urgent"]` to get the list of pipelines. Dict lookup replaces branching logic.（用字典查找代替 if/elif/else 分支）

</details>

---

**Q60.** A student writes:

```python
price_process = pipeline(add_tax, apply_discount, round_price)
prices = [100, 200, 50]
results = list(map(price_process, prices))
```

Why does this work well with `pipeline()` but would be awkward with `pipe()`?

- A) `pipe` doesn't work with numbers
- B) `pipeline` returns a reusable function that `map` can apply to each item; with `pipe`, you'd have to repeat the function list for every item
- C) `pipeline` is faster
- D) `map` only accepts `pipeline` functions

<details>
<summary>Answer</summary>

**B.** `pipeline(f, g, h)` returns a single function — perfect as `map`'s first argument. With `pipe`, you'd write `map(lambda p: pipe(p, f, g, h), prices)` — repeating the function list. Pipeline packages the process for reuse.（pipeline 返回可复用函数，直接传给 map；pipe 需要每次重复函数列表）

</details>
