# Functional Programming — 80 MCQ Review Questions

> Covers all 8 chapters: FP Introduction, Pure Functions, Expressions, Immutability, map/filter/reduce, pipe/pipeline, Testing with pytest, Routing & Declarative Dispatch, plus datasets, pytest, and supplementary material (YAML, normalization, predicates, JSON output).

---

## Chapter 1: Introduction to Functional Programming

**Q1.** What is the main difference between imperative and functional programming?

- A) Imperative is faster; functional is slower
- B) Imperative tells the computer HOW; functional tells the computer WHAT
- C) Functional programming cannot use variables
- D) Imperative programming cannot use functions

<details>
<summary>Answer</summary>

**B.** Imperative focuses on step-by-step instructions (HOW), while functional focuses on describing transformations (WHAT).（命令式关注"怎么做"，函数式关注"要什么"）

</details>

---

**Q2.** Which of the following is a characteristic of functional programming?

- A) Variables change frequently over time
- B) `for` and `while` loops are the primary building blocks
- C) Same input always produces the same output
- D) Functions must modify global state to be useful

<details>
<summary>Answer</summary>

**C.** Determinism (same input → same output) is a core FP property.（确定性是 FP 的核心属性）

</details>

---

**Q3.** What does "referential transparency"（引用透明）mean?

- A) You can see the source code of any function
- B) You can replace `f(x)` with its result anywhere without changing program behavior
- C) All variables must be declared before use
- D) Functions must print their return values

<details>
<summary>Answer</summary>

**B.** If a function always returns the same result for the same input, `f(x)` can be substituted with its value.（可以用函数返回值替换函数调用）

</details>

---

**Q4.** In which scenario is FP generally NOT recommended?

- A) Data processing and transformation
- B) Business rule calculations
- C) Building a real-time game UI where state constantly changes
- D) Parallel data pipelines

<details>
<summary>Answer</summary>

**C.** When state IS the point (UIs, games), FP can be overkill.（当状态本身是核心时，FP 不太适合）

</details>

---

**Q5.** What is the output of the following code?

```python
numbers = [1, 2, 3, 4, 5, 6]
result = [n * 2 for n in numbers if n % 2 == 0]
print(result)
```

- A) `[2, 4, 6, 8, 10, 12]`
- B) `[4, 8, 12]`
- C) `[1, 3, 5]`
- D) `[2, 6, 10]`

<details>
<summary>Answer</summary>

**B.** Filter keeps even numbers [2, 4, 6], then each is doubled → [4, 8, 12].（先筛选偶数，再翻倍）

</details>

---

## Chapter 2: Pure Functions（纯函数）

**Q6.** A pure function must satisfy which two rules?

- A) Fast execution and low memory usage
- B) Deterministic output and no side effects
- C) No parameters and no return value
- D) Uses only global variables and prints results

<details>
<summary>Answer</summary>

**B.** Deterministic (same input → same output) and no side effects (doesn't change anything outside itself).（确定性 + 无副作用）

</details>

---

**Q7.** Which of the following is a pure function?

- A) `def f(x): print(x); return x`
- B) `def f(x): return x * 2`
- C) `def f(): return datetime.datetime.now()`
- D) `def f(x): global total; total += x; return total`

<details>
<summary>Answer</summary>

**B.** It depends only on its input and has no side effects. A has `print` (I/O side effect), C depends on external state (time), D modifies a global.（B 仅依赖输入，无副作用）

</details>

---

**Q8.** What is wrong with this function?

```python
tax_rate = 0.1

def calculate_price(base_price):
    return base_price * (1 + tax_rate)
```

- A) It doesn't return a value
- B) It reads from an external variable, making it impure
- C) It uses multiplication, which is not allowed in FP
- D) Nothing is wrong; it is a pure function

<details>
<summary>Answer</summary>

**B.** It depends on the external variable `tax_rate`. If `tax_rate` changes, the same `base_price` produces a different result.（依赖外部变量，不是纯函数）

</details>

---

**Q9.** What does the "Pure Core, Impure Shell" pattern mean?

- A) Write all I/O in the center of your program
- B) Keep the core logic pure; push side effects (I/O, database, print) to the edges
- C) Never use any side effects anywhere
- D) Use global variables in the core, local variables in the shell

<details>
<summary>Answer</summary>

**B.** The architecture separates pure logic (core) from I/O and side effects (shell/boundary).（纯核心处理逻辑，不纯外壳处理 I/O）

</details>

---

**Q10.** Which action is NOT a side effect?

- A) Printing to the screen
- B) Writing to a file
- C) Returning a computed value
- D) Modifying a global variable

<details>
<summary>Answer</summary>

**C.** Returning a value is what a pure function does. All others change the outside world.（返回计算值不是副作用）

</details>

---

**Q11.** What will happen when this code runs?

```python
def add_item(item, basket=[]):
    basket.append(item)
    return basket

print(add_item("apple"))
print(add_item("banana"))
```

- A) `["apple"]` then `["banana"]`
- B) `["apple"]` then `["apple", "banana"]`
- C) Error: list index out of range
- D) `["apple", "banana"]` then `["apple", "banana"]`

<details>
<summary>Answer</summary>

**B.** The default `[]` is created once and shared across all calls. This is the default argument trap.（默认参数陷阱：默认列表在所有调用间共享）

</details>

---

**Q12.** How do you fix the default argument trap?

- A) Use `basket=()` instead
- B) Use `basket=None` and create a new list inside the function
- C) Use `global basket`
- D) Add `basket.clear()` at the end

<details>
<summary>Answer</summary>

**B.** Use `None` as default, then `current = basket if basket is not None else []` and return `[*current, item]`.（用 None 作默认值，函数内创建新列表）

</details>

---

## Chapter 3: Expressions Over Statements（表达式优于语句）

**Q13.** What is the key difference between an expression and a statement?

- A) Expressions are longer than statements
- B) Expressions evaluate to a value; statements perform an action but produce no value
- C) Statements can be nested; expressions cannot
- D) Expressions use loops; statements use functions

<details>
<summary>Answer</summary>

**B.** An expression "is" a value; a statement "does" something.（表达式产生值，语句执行动作）

</details>

---

**Q14.** How can you quickly test if something is an expression in Python?

- A) Check if it uses the `return` keyword
- B) Try wrapping it in `print()` — if no SyntaxError, it's an expression
- C) Check if it uses `=`
- D) Expressions always start with `lambda`

<details>
<summary>Answer</summary>

**B.** `print(3 + 4)` works (expression), `print(x = 5)` fails (statement).（能放进 print() 里就是表达式）

</details>

---

**Q15.** What does this expression evaluate to?

```python
label = "adult" if 15 >= 18 else "minor"
print(label)
```

- A) `"adult"`
- B) `"minor"`
- C) `True`
- D) SyntaxError

<details>
<summary>Answer</summary>

**B.** 15 >= 18 is False, so the else branch is taken → "minor".（15 < 18，走 else 分支）

</details>

---

**Q16.** What is the output?

```python
students = [("Alice", 85), ("Bob", 92), ("Carol", 55)]
result = [name for name, score in students if score >= 60]
print(result)
```

- A) `[("Alice", 85), ("Bob", 92)]`
- B) `["Alice", "Bob"]`
- C) `[85, 92]`
- D) `["Alice", "Bob", "Carol"]`

<details>
<summary>Answer</summary>

**B.** The comprehension unpacks each tuple, filters by score >= 60, and collects names only.（元组解包 + 过滤 + 只取名字）

</details>

---

**Q17.** What does `key=` do in `max(students, key=lambda s: s["score"])`?

- A) It modifies the students list
- B) It tells `max()` which value to use for comparison, without changing the data
- C) It filters out students with low scores
- D) It sorts the list in ascending order

<details>
<summary>Answer</summary>

**B.** `key=` provides the comparison criteria. The original items are returned unchanged.（key= 指定比较标准，不改变数据）

</details>

---

**Q18.** What is the output?

```python
grades = {"Li": 85, "Zhang": 92, "Wang": 55}
result = {name: "pass" if score >= 60 else "fail" for name, score in grades.items()}
print(result)
```

- A) `{"Li": 85, "Zhang": 92, "Wang": 55}`
- B) `{"Li": "pass", "Zhang": "pass", "Wang": "fail"}`
- C) `["pass", "pass", "fail"]`
- D) SyntaxError

<details>
<summary>Answer</summary>

**B.** Dict comprehension with ternary expression applied to each key-value pair.（字典推导式 + 三元表达式）

</details>

---

**Q19.** Which is a valid lambda expression?

- A) `lambda x: if x > 0: return x`
- B) `lambda x: x * 2 + 1`
- C) `lambda x: print(x); return x`
- D) `lambda x, y: x = y`

<details>
<summary>Answer</summary>

**B.** Lambda body must be a single expression. A, C, D contain statements.（Lambda 主体必须是单个表达式）

</details>

---

**Q20.** What is the output?

```python
words = ["banana", "apple", "cherry"]
result = sorted(words, key=lambda w: w[-1])
print(result)
```

- A) `["apple", "banana", "cherry"]`
- B) `["banana", "apple", "cherry"]`
- C) `["cherry", "banana", "apple"]`
- D) `["apple", "cherry", "banana"]`

<details>
<summary>Answer</summary>

**B.** Sorted by last letter: banana→"a", apple→"e", cherry→"y". Alphabetical order of last letters: a, e, y.（按最后一个字母排序）

</details>

---

## Chapter 4: Immutability（不可变性）

**Q21.** Which Python types are immutable?

- A) `list`, `dict`, `set`
- B) `int`, `str`, `tuple`
- C) `list`, `tuple`, `str`
- D) `dict`, `tuple`, `frozenset`

<details>
<summary>Answer</summary>

**B.** `int`, `str`, and `tuple` are all immutable. Lists and dicts are mutable.（int、str、tuple 不可变）

</details>

---

**Q22.** What is the output?

```python
user = {"name": "Li Wei", "age": 20}
new_user = {**user, "age": 21}
print(user["age"])
print(new_user["age"])
```

- A) `21` and `21`
- B) `20` and `21`
- C) `20` and `20`
- D) Error

<details>
<summary>Answer</summary>

**B.** `{**user, "age": 21}` creates a NEW dict. The original `user` is untouched.（{**user} 创建新字典，原始不变）

</details>

---

**Q23.** What is the "aliasing bug"（别名 bug）?

- A) A function that returns the wrong type
- B) Two variables pointing to the same mutable object — modifying one affects the other
- C) A variable name that is too long
- D) A function that has too many parameters

<details>
<summary>Answer</summary>

**B.** `b = a` does not copy a list; both names point to the same object.（两个变量指向同一个可变对象）

</details>

---

**Q24.** What is the output?

```python
original = [1, 2, 3]
backup = original
backup.append(4)
print(original)
```

- A) `[1, 2, 3]`
- B) `[1, 2, 3, 4]`
- C) `[4]`
- D) Error

<details>
<summary>Answer</summary>

**B.** `backup = original` creates an alias, not a copy. Both point to the same list.（别名，不是复制）

</details>

---

**Q25.** What is `(90)` in Python?

- A) A tuple with one element
- B) Just the integer `90`
- C) A list with one element
- D) A set with one element

<details>
<summary>Answer</summary>

**B.** `(90)` is just parentheses around an integer. A single-element tuple requires a trailing comma: `(90,)`.（单元素元组需要逗号：(90,)）

</details>

---

**Q26.** What does `id()` help you check?

- A) The type of a variable
- B) Whether two variables point to the same object in memory
- C) The length of a collection
- D) Whether a function is pure

<details>
<summary>Answer</summary>

**B.** Same `id()` = same object = mutation in place. Different `id()` = new object was created.（同 id 说明是同一个对象）

</details>

---

**Q27.** How do you "add" an element to a tuple immutably?

- A) `my_tuple.append(4)`
- B) `my_tuple + (4,)`
- C) `my_tuple[3] = 4`
- D) `my_tuple.insert(3, 4)`

<details>
<summary>Answer</summary>

**B.** Tuples are immutable. You create a new tuple via concatenation: `my_tuple + (4,)`.（通过拼接创建新元组）

</details>

---

**Q28.** What is the immutable way to create a new list with an extra item?

- A) `items.append("cherry")`
- B) `[*items, "cherry"]`
- C) `items += ["cherry"]`
- D) `items.insert(0, "cherry")`

<details>
<summary>Answer</summary>

**B.** `[*items, "cherry"]` creates a new list without modifying the original.（展开创建新列表）

</details>

---

**Q29.** What is a TOCTOU bug?

- A) A typo in the code
- B) Data changes between the time you check it and the time you use it
- C) A function that takes too long to run
- D) A test that passes locally but fails in CI

<details>
<summary>Answer</summary>

**B.** Time Of Check to Time Of Use: mutable data changes while you're working with it. Immutability prevents this.（检查与使用之间数据被修改）

</details>

---

## Chapter 5: map, filter, reduce

**Q30.** What does `map(f, collection)` do?

- A) Keeps only elements where `f` returns True
- B) Transforms every element by applying `f` — output has the same length
- C) Combines all elements into a single value
- D) Sorts the collection by the result of `f`

<details>
<summary>Answer</summary>

**B.** `map` transforms each element. N items in → N items out.（map 转换每个元素，长度不变）

</details>

---

**Q31.** What does `filter(predicate, collection)` do?

- A) Transforms every element
- B) Keeps only elements where the predicate returns True
- C) Combines all elements into one value
- D) Reverses the collection

<details>
<summary>Answer</summary>

**B.** `filter` selects elements. N items in → ≤N items out.（filter 按条件筛选元素）

</details>

---

**Q32.** What is the output?

```python
result = list(map(lambda x: x % 2 == 0, [1, 2, 3, 4]))
print(result)
```

- A) `[2, 4]`
- B) `[False, True, False, True]`
- C) `[1, 3]`
- D) Error

<details>
<summary>Answer</summary>

**B.** `map` applies the function to each element. The function returns a boolean, so you get a list of booleans. Use `filter` to select elements.（map 返回函数结果，这里是布尔值）

</details>

---

**Q33.** What is the output?

```python
from functools import reduce
result = reduce(lambda acc, x: acc + x, [1, 2, 3, 4], 0)
print(result)
```

- A) `[1, 2, 3, 4]`
- B) `10`
- C) `24`
- D) `0`

<details>
<summary>Answer</summary>

**B.** 0+1=1, 1+2=3, 3+3=6, 6+4=10.（累加：0→1→3→6→10）

</details>

---

**Q34.** What happens if you call `reduce` on an empty list without an initial value?

- A) Returns `None`
- B) Returns `0`
- C) Raises `TypeError`
- D) Returns an empty list

<details>
<summary>Answer</summary>

**C.** `reduce(lambda acc, x: acc + x, [])` raises `TypeError: reduce() of empty iterable with no initial value`.（空列表无初始值会 TypeError）

</details>

---

**Q35.** Why should you always provide an initial value to `reduce`?

- A) It makes the code run faster
- B) It prevents `TypeError` on empty collections and makes the return type explicit
- C) It is required by Python syntax
- D) It determines the number of iterations

<details>
<summary>Answer</summary>

**B.** Without an initial value, empty lists crash and the starting type is unclear.（防止空列表报错，明确起始类型）

</details>

---

**Q36.** What does `map()` return in Python 3?

- A) A list
- B) A tuple
- C) An iterator (lazy, one-way)
- D) A dict

<details>
<summary>Answer</summary>

**C.** `map()` returns an iterator. Items are computed only when consumed. You need `list()` to get a concrete list.（返回迭代器，惰性求值）

</details>

---

**Q37.** What is the output?

```python
mapped = map(lambda x: x * 2, [1, 2, 3])
print(list(mapped))
print(list(mapped))
```

- A) `[2, 4, 6]` then `[2, 4, 6]`
- B) `[2, 4, 6]` then `[]`
- C) `[]` then `[2, 4, 6]`
- D) Error

<details>
<summary>Answer</summary>

**B.** An iterator is a one-way trip. Once consumed, it's empty.（迭代器是单向的，消费后为空）

</details>

---

**Q38.** Which of the following CANNOT be replaced by a list comprehension?

- A) `map(f, items)`
- B) `filter(pred, items)`
- C) `reduce(f, items, init)`
- D) Both A and B

<details>
<summary>Answer</summary>

**C.** `reduce` aggregates a collection into a single value. Comprehensions always produce a collection.（reduce 聚合为单一值，推导式无法做到）

</details>

---

**Q39.** In a lazy pipeline `map → filter → reduce`, when does computation actually happen?

- A) When `map()` is called
- B) When `filter()` is called
- C) When the final consumer (e.g., `reduce`) pulls values
- D) Immediately at each step

<details>
<summary>Answer</summary>

**C.** Nothing is computed until a consumer (reduce, list, next) requests values. Items flow one at a time.（最终消费者拉取值时才计算）

</details>

---

**Q40.** What is wrong with this code?

```python
def bad_add_tax(order):
    order["tax"] = order["price"] * 0.1
    return order

result = list(map(bad_add_tax, orders))
```

- A) `map` cannot work with dicts
- B) The function mutates the original dict instead of creating a new one
- C) `tax` should be calculated differently
- D) Nothing is wrong

<details>
<summary>Answer</summary>

**B.** `order["tax"] = ...` mutates the original dict. Should use `{**order, "tax": order["price"] * 0.1}`.（修改了原始字典，应创建新字典）

</details>

---

## Chapter 6: Function Composition — pipe & pipeline

**Q41.** What is the implementation of `pipe()`?

- A) `def pipe(data, *fns): return map(data, fns)`
- B) `def pipe(data, *fns): return reduce(lambda acc, f: f(acc), fns, data)`
- C) `def pipe(*fns): return lambda data: reduce(lambda acc, f: f(acc), fns, data)`
- D) `def pipe(data, fns): return fns(data)`

<details>
<summary>Answer</summary>

**B.** `pipe` takes data and functions, applies each function left-to-right using `reduce`.（pipe 用 reduce 从左到右应用函数）

</details>

---

**Q42.** What is the output?

```python
from functools import reduce

def pipe(data, *fns):
    return reduce(lambda acc, f: f(acc), fns, data)

add1 = lambda x: x + 1
double = lambda x: x * 2

print(pipe(3, add1, double))
```

- A) `7`
- B) `8`
- C) `9`
- D) Error

<details>
<summary>Answer</summary>

**B.** 3 → add1 → 4 → double → 8.（3+1=4, 4×2=8）

</details>

---

**Q43.** What is the output?

```python
print(pipe(3, double, add1))
```

- A) `7`
- B) `8`
- C) `9`
- D) `6`

<details>
<summary>Answer</summary>

**A.** 3 → double → 6 → add1 → 7. Order matters in pipe!（3×2=6, 6+1=7，顺序很重要）

</details>

---

**Q44.** What is the key difference between `pipe()` and `pipeline()`?

- A) `pipe` is slower than `pipeline`
- B) `pipe` returns a value; `pipeline` returns a function
- C) `pipeline` can only take one function
- D) `pipe` uses `map`; `pipeline` uses `filter`

<details>
<summary>Answer</summary>

**B.** `pipe(data, f, g)` → value. `pipeline(f, g)` → function (to be called later with data).（pipe 返回值，pipeline 返回函数）

</details>

---

**Q45.** What is a higher-order function（高阶函数）?

- A) A function defined at the top of a file
- B) A function that takes functions as arguments or returns a function
- C) A function that runs faster than other functions
- D) A function with more than 3 parameters

<details>
<summary>Answer</summary>

**B.** Higher-order functions operate on other functions. `pipeline()`, `map()`, `filter()`, `reduce()` are all HOFs.（接收或返回函数的函数）

</details>

---

**Q46.** What does `pipe(42)` return (no functions passed)?

- A) Error
- B) `None`
- C) `42`
- D) `0`

<details>
<summary>Answer</summary>

**C.** `reduce` over an empty iterable with initial value 42 returns 42. Pipe with no functions is the identity.（无函数时返回原始数据）

</details>

---

**Q47.** What is wrong with this code?

```python
add1 = lambda x: x + 1
double = lambda x: x * 2
pipe(3, add1(), double())
```

- A) `add1` and `double` need two arguments
- B) You are calling `add1()` and `double()` instead of passing them as functions
- C) `pipe` does not accept lambdas
- D) Nothing is wrong

<details>
<summary>Answer</summary>

**B.** `add1()` calls the function (TypeError since no argument), while `add1` passes the function itself.（传递了函数调用而非函数本身）

</details>

---

**Q48.** Each function inside `pipe()` must:

- A) Accept two arguments and return a list
- B) Accept exactly one argument and return exactly one value
- C) Return `None`
- D) Accept a dict and return a tuple

<details>
<summary>Answer</summary>

**B.** Each function receives the output of the previous one (one arg) and produces input for the next (one value).（接收一个参数，返回一个值）

</details>

---

**Q49.** The insight behind `pipe()` is that:

- A) It uses `map` internally
- B) It is `reduce` over a list of functions instead of a list of numbers
- C) It requires recursion
- D) It only works with strings

<details>
<summary>Answer</summary>

**B.** Replace `acc * x` with `f(acc)` in reduce — same pattern, different operation.（对函数列表做 reduce，用 f(acc) 代替 acc*x）

</details>

---

## Chapter 7: Testing with pytest

**Q50.** What does `assert` do when the condition is `False`?

- A) Prints a warning
- B) Returns `False`
- C) Raises an `AssertionError` and stops execution
- D) Continues silently

<details>
<summary>Answer</summary>

**C.** `assert False` → crash. `assert True` → nothing happens.（条件为 False 时抛出 AssertionError）

</details>

---

**Q51.** Why are pure functions the easiest to test?

- A) They always return `None`
- B) They require no mocking — just provide input and check the output
- C) They don't need import statements
- D) They always pass

<details>
<summary>Answer</summary>

**B.** Pure functions depend only on their arguments. No database, no network, no setup needed.（纯函数只依赖输入，无需 mock）

</details>

---

**Q52.** What is the difference between a unit test and an integration test?

- A) Unit tests are longer; integration tests are shorter
- B) Unit tests check one function in isolation; integration tests check the full pipeline
- C) Integration tests don't use `assert`
- D) Unit tests only work with numbers

<details>
<summary>Answer</summary>

**B.** Test the bricks (unit), then test the house (integration).（单元测试测单个函数，集成测试测整个管道）

</details>

---

**Q53.** What does `@pytest.mark.parametrize` do?

- A) Runs a test function multiple times with different (input, expected) pairs
- B) Skips a test
- C) Makes a test run faster
- D) Creates a fixture

<details>
<summary>Answer</summary>

**A.** It separates data from logic: one test function, many input/output pairs.（参数化：一个函数多组输入输出）

</details>

---

**Q54.** What is a pytest fixture?

- A) A function that fixes broken code
- B) A reusable helper that provides shared test data to one or more tests
- C) A class that stores test results
- D) A command-line option

<details>
<summary>Answer</summary>

**B.** `@pytest.fixture` defines reusable test data; pytest injects it automatically into tests.（可复用的共享测试数据）

</details>

---

**Q55.** Which command runs a single test function?

- A) `python -m pytest`
- B) `python -m pytest tests/test_pipeline.py::test_clean_text`
- C) `python -m pytest --single`
- D) `python test_pipeline.py`

<details>
<summary>Answer</summary>

**B.** Use `file::function` syntax to run one specific test.（用 file::function 语法运行单个测试）

</details>

---

**Q56.** Which category of test cases is MOST important for data pipelines?

- A) Performance tests
- B) Edge cases (empty, None, unusual formats)
- C) UI tests
- D) Load tests

<details>
<summary>Answer</summary>

**B.** In data engineering, edge cases are where real data surprises you. They cause most production bugs.（边界情况是数据管道 bug 的主要来源）

</details>

---

**Q57.** What should you use to test that a function raises an exception?

- A) `assert raises(Exception)`
- B) `with pytest.raises(ExpectedException):`
- C) `try/except` inside the test
- D) `@pytest.mark.error`

<details>
<summary>Answer</summary>

**B.** `with pytest.raises(ZeroDivisionError): divide(10, 0)` verifies the exception is raised.（用 pytest.raises 测试异常）

</details>

---

## Chapter 8: Routing & Declarative Dispatch（路由与声明式分派）

**Q58.** What is the main problem that routing solves?

- A) Code runs too slowly
- B) Different rows need different processing paths based on their properties
- C) Data files are too large to open
- D) Functions have too many parameters

<details>
<summary>Answer</summary>

**B.** Heterogeneous data requires different processing per row.（异构数据需要不同的处理路径）

</details>

---

**Q59.** Why is Level 1 (giant if/elif/else) a bad approach?

- A) It is too fast
- B) It violates single responsibility, doesn't scale, and is hard to test
- C) Python doesn't support if/elif/else
- D) It uses too little memory

<details>
<summary>Answer</summary>

**B.** One function handles conditions, formatting, and routing simultaneously. Combinations explode.（违反单一职责，不可扩展，难以测试）

</details>

---

**Q60.** In Level 3, what is the role of the rule table?

- A) It contains processing functions
- B) It is pure data mapping conditions to segment names — no logic
- C) It runs the pipeline
- D) It stores the final results

<details>
<summary>Answer</summary>

**B.** The rule table is a list of dicts: `{"conditions": {...}, "segment": "..."}`. No functions, no logic.（规则表是纯数据，映射条件到段名）

</details>

---

**Q61.** What does the dispatch dict map?

- A) Functions to conditions
- B) Segment names to a list of pipelines (the route)
- C) Row indices to processing order
- D) File paths to datasets

<details>
<summary>Answer</summary>

**B.** `DISPATCH = {"cn_urgent": [clean_pipeline, cn_prompt_pipeline, ...]}`.（分派字典将段名映射到管道列表）

</details>

---

**Q62.** What does `matches_rule(row, rule)` return?

- A) The segment name
- B) The transformed row
- C) `True` if ALL conditions in the rule match the row, else `False`
- D) A list of matching rules

<details>
<summary>Answer</summary>

**C.** Uses `all(row.get(k) == v for k, v in rule["conditions"].items())`.（所有条件匹配返回 True）

</details>

---

**Q63.** What is the "trash bin" pattern?

- A) Delete all processed rows
- B) Tag unmatched rows as `"drop"` and filter them out explicitly
- C) Send all rows to the same pipeline
- D) Ignore errors silently

<details>
<summary>Answer</summary>

**B.** Never silently ignore unmatched rows. Tag as "drop", then `.filter(lambda r: r["segment"] != "drop")`.（未匹配的行标记为 "drop" 后显式过滤）

</details>

---

**Q64.** What happens if you forget the trash bin (no default segment)?

- A) The pipeline runs faster
- B) Unmatched rows have no `"segment"` key → `KeyError` downstream
- C) All rows are processed
- D) Nothing — it works fine

<details>
<summary>Answer</summary>

**B.** Without `"segment": "drop"`, `apply_process` will crash when looking up a missing key.（缺少段名导致下游 KeyError）

</details>

---

**Q65.** Why are `rules` and `dispatch` passed as arguments to engine functions instead of imported directly?

- A) It makes the code slower
- B) To keep engine functions pure — they depend only on their inputs, making them testable
- C) Python doesn't allow imports inside functions
- D) To save memory

<details>
<summary>Answer</summary>

**B.** Pure function discipline: no hidden dependencies, testable with any rule table.（保持引擎函数纯净，无隐藏依赖）

</details>

---

**Q66.** What is "dictionary dispatch"?

- A) Sorting a dictionary by keys
- B) Using a dict lookup to select the correct route instead of if/elif/else
- C) Converting a dict to a list
- D) Dispatching messages via a network

<details>
<summary>Answer</summary>

**B.** `dispatch.get(row["segment"], [])` replaces conditional branching with a dict lookup.（用字典查找代替条件分支）

</details>

---

**Q67.** Adding a new language route to a Level 3 system requires:

- A) Rewriting the engine
- B) Adding one entry to RULES, one entry to DISPATCH, and the new pipeline functions
- C) Modifying every existing function
- D) Creating a new Python file for each row

<details>
<summary>Answer</summary>

**B.** The engine is generic and never needs modification. Changes are additive.（引擎不需修改，只需添加新规则和分派条目）

</details>

---

## HuggingFace datasets

**Q68.** What does `split="train"` do in `load_dataset("json", data_files="x.json", split="train")`?

- A) Splits the file into training and test sets
- B) Returns a `Dataset` object directly instead of a `DatasetDict`
- C) Only loads the first half of the data
- D) Filters rows where a "split" column equals "train"

<details>
<summary>Answer</summary>

**B.** Without `split="train"`, you get a `DatasetDict`. With it, you get a `Dataset` directly.（直接返回 Dataset 对象）

</details>

---

**Q69.** In HuggingFace `datasets`, what is method chaining?

- A) Calling the same method repeatedly in a loop
- B) Chaining transformations left-to-right: `ds.filter(f).map(g).map(h)`
- C) Importing multiple modules in one line
- D) Using `+` to combine strings

<details>
<summary>Answer</summary>

**B.** Each method returns a new dataset, allowing `.filter().map().map()` chains.（方法链：每个方法返回新数据集）

</details>

---

**Q70.** Why can HuggingFace `datasets` safely parallelize `.map()` across 16 CPU cores?

- A) Because it uses global variables
- B) Because the map functions are pure — no shared state, no side effects
- C) Because it locks each row before processing
- D) Because Python has no GIL

<details>
<summary>Answer</summary>

**B.** Pure functions are safe to run in parallel: same row → same result, no interference.（纯函数可安全并行：无共享状态）

</details>

---

**Q71.** What format does HuggingFace `datasets` use under the hood for storage?

- A) CSV
- B) JSON
- C) Apache Arrow
- D) SQLite

<details>
<summary>Answer</summary>

**C.** Apache Arrow is a columnar binary format that supports memory-mapping for efficient data access.（Apache Arrow 列式格式，支持内存映射）

</details>

---

## Supplementary Material: YAML, Normalization, Predicates, JSON

**Q72.** What is YAML primarily used for?

- A) Storing images
- B) Storing structured configuration data in a human-readable format
- C) Compiling Python code
- D) Encrypting passwords

<details>
<summary>Answer</summary>

**B.** YAML is a text format for structured data, like JSON but more readable. Used in Docker, GitHub Actions, K8s.（YAML 用于存储结构化配置数据）

</details>

---

**Q73.** In Python, what does `yaml.safe_load(f)` return?

- A) A YAML string
- B) A Python dict (or list) representing the YAML content
- C) A DataFrame
- D) A binary file

<details>
<summary>Answer</summary>

**B.** `safe_load` parses YAML and returns standard Python objects (dicts, lists, strings, numbers).（返回 Python 字典/列表）

</details>

---

**Q74.** What is "normalization" in a data pipeline?

- A) Making all numbers between 0 and 1
- B) Renaming fields from different sources to common names so one function can process all rows
- C) Sorting data alphabetically
- D) Removing all empty rows

<details>
<summary>Answer</summary>

**B.** When multiple sources use different field names for the same data, normalization unifies them.（将不同来源的字段名统一为通用名称）

</details>

---

**Q75.** What does `"25".isdigit()` return?

- A) `25`
- B) `True`
- C) `"25"`
- D) `False`

<details>
<summary>Answer</summary>

**B.** `.isdigit()` returns `True` if all characters are digits. It is a predicate for validating numeric strings.（isdigit() 检查字符串是否全是数字）

</details>

---

**Q76.** What does `all([True, True, False, True])` return?

- A) `True`
- B) `False`
- C) `3`
- D) `[True, True, True]`

<details>
<summary>Answer</summary>

**B.** `all()` returns `True` only if ALL elements are True. One `False` → result is `False`.（all 只在全部为 True 时返回 True）

</details>

---

**Q77.** What does `ensure_ascii=False` do in `json.dump()`?

- A) Prevents writing to the file
- B) Writes non-ASCII characters as-is (e.g., 中文) instead of escaping them as `\uXXXX`
- C) Converts all text to ASCII
- D) Adds line numbers to the output

<details>
<summary>Answer</summary>

**B.** Without it, `"好吃"` becomes `"\u597d\u5403"`. With it, characters are preserved.（非 ASCII 字符直接写入而非转义）

</details>

---

## Virtual Environment

**Q78.** What is the purpose of a Python virtual environment?

- A) To make Python run faster
- B) To create an isolated Python installation with its own packages, independent of the system
- C) To compile Python to machine code
- D) To encrypt your source code

<details>
<summary>Answer</summary>

**B.** Each project can have its own package versions without affecting the global Python installation.（隔离的 Python 环境，独立管理包）

</details>

---

**Q79.** After activating a venv, which command runs all pytest tests reliably?

- A) `pytest --all`
- B) `python -m pytest`
- C) `run tests`
- D) `python test.py`

<details>
<summary>Answer</summary>

**B.** `python -m pytest` ensures pytest runs with the current interpreter inside the venv.（确保使用当前虚拟环境的解释器运行 pytest）

</details>

---

**Q80.** How do you leave a virtual environment?

- A) `exit`
- B) `quit`
- C) `deactivate`
- D) `close`

<details>
<summary>Answer</summary>

**C.** `deactivate` leaves the venv. `exit` tries to close the terminal session and causes errors.（用 deactivate 退出，不是 exit）

</details>
