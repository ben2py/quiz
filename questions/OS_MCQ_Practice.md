# Operating Systems — 20 MCQ Practice

Covers: **Limited Direct Execution** · **Address Spaces** · **Address Translation (Base & Bounds)**

---

## Part 1: Theory (Q1–10)

---

**Q1.** What does "Limited Direct Execution" achieve by combining "Direct" and "Limited"?

- A) Direct = run in an emulator for safety; Limited = restrict network access
- B) Direct = run the program directly on the CPU for speed; Limited = restrict privileges via hardware mechanisms like user/kernel mode
- C) Direct = give the program full kernel access; Limited = limit how much memory it can use
- D) Direct = interpret the program line by line; Limited = limit the number of system calls

<details>
<summary>Answer</summary>

**B.** "Direct Execution" means the program runs natively on the CPU at full speed — no emulator or interpreter. "Limited" means hardware mechanisms (mode bit, trap instructions, trap table) restrict what the program can do, ensuring the OS retains control. This gives us both **performance** and **safety**.

</details>

---

**Q2.** When the trap instruction executes, which of the following correctly describes what happens?

- A) User registers are saved to the user stack → mode switches to kernel → CPU jumps to an address chosen by the user program
- B) User registers are saved to the kernel stack → mode switches to kernel → CPU jumps to a pre-defined address from the trap table
- C) All registers are cleared → mode switches to kernel → OS restarts from its main function
- D) User registers are saved to the kernel stack → mode stays in user → CPU jumps to the trap table

<details>
<summary>Answer</summary>

**B.** The trap instruction atomically: (1) saves current state (PC, registers, flags) onto the **kernel stack** (not user stack), (2) changes the mode bit from user to kernel, and (3) jumps to a **pre-defined** handler address from the trap table. The user program cannot choose where to jump — that would be a security disaster.

</details>

---

**Q3.** Why do system calls use numbers (e.g., `read` = 0, `write` = 1) instead of letting user programs specify a kernel address to jump to?

- A) Because kernel addresses are too long to fit in a register
- B) Because using numbers is faster than using addresses
- C) Because it provides protection through indirection — the user cannot jump to arbitrary kernel code
- D) Because the kernel doesn't have fixed addresses

<details>
<summary>Answer</summary>

**C.** System call numbers provide **protection through indirection**. The user can only specify *which* service it wants (by number); the OS looks up the corresponding handler. If user programs could specify arbitrary kernel addresses, they could skip permission checks and execute any kernel code, taking over the system.

</details>

---

**Q4.** Which of the following is **NOT** one of the three goals of memory virtualization?

- A) Transparency — the process doesn't know it's using virtual addresses
- B) Efficiency — address translation must be fast
- C) Persistence — the address space survives after the process exits
- D) Protection — processes are isolated from each other

<details>
<summary>Answer</summary>

**C.** The three goals are **Transparency**, **Efficiency**, and **Protection**. Persistence is a goal of the *file system*, not memory virtualization. When a process exits, its address space is reclaimed by the OS.

</details>

---

**Q5.** What was the main problem with early 1950s computers that drove the development of multiprogramming?

- A) Programs were too large to fit in memory
- B) The CPU sat idle during I/O, wasting extremely expensive hardware
- C) There was no operating system at all
- D) Users needed graphical interfaces

<details>
<summary>Answer</summary>

**B.** Machines cost hundreds of thousands of dollars, yet the CPU sat idle whenever a program waited for I/O. Multiprogramming solved this by keeping multiple programs in memory so the CPU could switch to another program during I/O waits, dramatically improving utilization.

</details>

---

**Q6.** In the base and bounds mechanism, what is the correct translation formula?

- A) `physical = virtual - BASE` (if virtual < BOUNDS)
- B) `physical = virtual + BOUNDS` (if virtual < BASE)
- C) `physical = virtual + BASE` (if virtual < BOUNDS)
- D) `physical = BOUNDS - virtual + BASE`

<details>
<summary>Answer</summary>

**C.** The hardware computes `physical = virtual + BASE` after verifying that `virtual < BOUNDS`. BASE stores the starting physical address of the process; BOUNDS stores the size of the address space and is used for protection.

</details>

---

**Q7.** Why must instructions that modify the base and bounds registers be privileged?

- A) Because these registers are physically fragile and wear out with use
- B) Because if a user program could modify BASE to 0, it could directly access OS memory and break all protection
- C) Because only one process can use base and bounds at a time
- D) Because the base and bounds registers are stored on disk

<details>
<summary>Answer</summary>

**B.** If user programs could modify base/bounds, a malicious program could set `BASE = 0` to map its virtual addresses onto the OS's physical memory, reading kernel secrets or overwriting OS code. Only the OS (in kernel mode) is allowed to modify these registers.

</details>

---

**Q8.** During a context switch from Process A to Process B, what must the OS do with the base and bounds registers?

- A) Nothing — base and bounds are shared between all processes
- B) Clear them to zero and let Process B set them itself
- C) Save A's base/bounds to A's PCB, then restore B's base/bounds from B's PCB
- D) Copy A's base/bounds into B's PCB so both processes use the same mapping

<details>
<summary>Answer</summary>

**C.** Each process has different base/bounds values corresponding to its location in physical memory. The OS saves the current values into the outgoing process's PCB and restores the incoming process's values. Without this, Process B's virtual addresses would be translated using A's mapping — accessing completely wrong memory.

</details>

---

**Q9.** What is "internal fragmentation" in the context of base and bounds?

- A) The OS wastes memory by keeping too many free list entries
- B) The space between the heap and stack within a process's address space is allocated in physical memory but unused
- C) Physical memory becomes fragmented into many small free blocks
- D) The base register wastes bits because addresses are too small

<details>
<summary>Answer</summary>

**B.** Base and bounds requires the entire address space to be contiguous in physical memory. If a 16KB address space only uses 2KB (1KB code + 1KB stack), the 14KB between heap and stack is allocated but wasted. This led to **segmentation**, which uses separate base/bounds for each segment so unused space doesn't need to be allocated.

</details>

---

**Q10.** Which of the following is an advantage of **dynamic** relocation (base and bounds) over **static** relocation (software-based address rewriting at load time)?

- A) Dynamic relocation doesn't require any hardware support
- B) Dynamic relocation is done at compile time, making it faster
- C) Dynamic relocation provides protection through bounds checking AND allows the OS to move a process at runtime
- D) Dynamic relocation eliminates internal fragmentation

<details>
<summary>Answer</summary>

**C.** Dynamic relocation happens at runtime via hardware, providing bounds-checked protection on every memory access. It also allows the OS to move a process (stop it, copy memory, update BASE, resume) without the process knowing. Static relocation offers no protection and cannot move processes after loading. However, dynamic relocation does NOT eliminate internal fragmentation — that requires segmentation.

</details>

---

## Part 2: Practical / Simulation (Q11–20)

---

**Q11.** A process has `BASE = 32KB (32768)` and `BOUNDS = 16KB (16384)`. The process accesses virtual address `128`. What is the physical address?

- A) 128
- B) 32640
- C) 32896
- D) 48KB

<details>
<summary>Answer</summary>

**C.** Bounds check: 128 < 16384 ✓. Translation: `physical = 128 + 32768 = 32896`. The process thinks it's accessing address 128 (an instruction in its code section), but the hardware actually accesses physical address 32896.

</details>

---

**Q12.** A process has `BASE = 32KB` and `BOUNDS = 16KB`. The process tries to access virtual address `20KB`. What happens?

- A) Physical address = 52KB, access succeeds
- B) Hardware raises an exception (out of bounds), OS terminates the process
- C) The OS automatically extends the address space to 20KB
- D) The access is silently ignored

<details>
<summary>Answer</summary>

**B.** Bounds check: 20KB ≥ 16KB → **FAULT!** The hardware raises an exception, the CPU switches to kernel mode, and the OS exception handler runs — typically terminating the offending process. This is how base and bounds provides protection. (This is the origin of "Segmentation Fault.")

</details>

---

**Q13.** MMU has `BASE = 20KB` and `BOUNDS = 8KB`. Which of the following virtual addresses is **valid**?

- A) 8KB
- B) 10KB
- C) 4KB
- D) 20KB

<details>
<summary>Answer</summary>

**C.** The valid range is `0 ≤ virtual < BOUNDS`, i.e., `0 ≤ virtual < 8KB`.

- 4KB: 4KB < 8KB ✓ → physical = 4KB + 20KB = 24KB ✅
- 8KB: 8KB < 8KB? No → FAULT ❌ (the check is strictly less than, not ≤)
- 10KB: 10KB < 8KB? No → FAULT ❌
- 20KB: 20KB < 8KB? No → FAULT ❌

</details>

---

**Q14.** Two processes are running: Process A (`BASE = 16KB, BOUNDS = 4KB`) and Process B (`BASE = 48KB, BOUNDS = 8KB`). Both access virtual address `2KB`. What are their physical addresses?

- A) Both map to 2KB
- B) A → 18KB, B → 50KB
- C) A → 14KB, B → 46KB
- D) A → 18KB, B → 18KB

<details>
<summary>Answer</summary>

**B.** Each process has a different BASE, so the same virtual address maps to different physical locations:

- Process A: 2KB + 16KB = **18KB**
- Process B: 2KB + 48KB = **50KB**

This is the essence of memory virtualization — every process thinks it starts at address 0, but the hardware maps each to a different physical location, providing isolation.

</details>

---

**Q15.** A process executes `y = y + 5;` which compiles to three instructions: `load y`, `add 5`, `store y`. How many **address translations** does the hardware perform during this statement?

- A) 3
- B) 4
- C) 5
- D) 6

<details>
<summary>Answer</summary>

**C.** Five translations:

1. **Fetch** the `load` instruction → 1 translation
2. **Execute** the load (read y from memory) → 1 translation
3. **Fetch** the `add` instruction → 1 translation
4. **Execute** the add → *no memory access* (register-only operation)
5. **Fetch** the `store` instruction → 1 translation
6. **Execute** the store (write y to memory) → 1 translation

Total: 5 memory accesses = 5 translations. The `add` executes entirely in registers with no memory access.

</details>

---

**Q16.** Physical memory has no protection. Process A (at 64KB–128KB) executes `char *p = (char*)200000; *p = 'X';`. Process B is at 192KB–256KB. What happens?

- A) The program crashes with a segmentation fault
- B) The write succeeds and overwrites Process B's data at physical address 200000
- C) The OS intercepts the write and blocks it
- D) The hardware redirects the write to Process A's own memory

<details>
<summary>Answer</summary>

**B.** Without memory protection, Process A directly accesses physical address 200000 (≈195KB), which falls inside Process B's region (192KB–256KB). The write succeeds and silently corrupts B's data. Process B may crash later or behave incorrectly. This scenario demonstrates exactly why hardware-enforced memory protection (like base and bounds) is essential.

</details>

---

**Q17.** A malicious user-mode program attempts three operations: (1) execute an `IN` instruction to read from a disk I/O port, (2) modify the mode bit from user to kernel directly, (3) call `read()` via a system call. Which operations succeed?

- A) All three succeed
- B) Only (3) succeeds
- C) (1) and (3) succeed
- D) None succeed

<details>
<summary>Answer</summary>

**B.** Only the system call succeeds:

1. `IN` is a privileged instruction → hardware detects user mode → **exception** → process terminated ❌
2. The mode bit cannot be changed directly by any user instruction → **fails** ❌
3. `read()` uses the SYSCALL/trap instruction, which is the legitimate mechanism for requesting OS services → **succeeds** ✅

LDE ensures the only way for user programs to perform privileged operations is through system calls.

</details>

---

**Q18.** The OS decides to move Process P from physical address 32KB to 64KB. Process P has `BOUNDS = 8KB`. What must the OS do?

- A) Notify Process P to update all its pointers, then change BASE
- B) Stop P → copy 8KB from physical 32KB to 64KB → update BASE to 64KB → resume P
- C) Recompile P with a new starting address
- D) Change BOUNDS from 8KB to 64KB

<details>
<summary>Answer</summary>

**B.** The OS: (1) stops the process, (2) copies the 8KB of data from physical 32KB to 64KB, (3) updates the BASE register to 64KB, and (4) resumes the process. Process P is completely unaware it moved because its *virtual* addresses haven't changed — only the BASE (translation offset) changed. This is why it's called **dynamic** relocation. No recompilation or pointer updates are needed.

</details>

---

**Q19.** Which of the following actions happens at **boot time** rather than at run time?

- A) The OS allocates memory for a new process from the free list
- B) The OS saves/restores base/bounds during a context switch
- C) The OS initializes the trap table and tells hardware where the handlers are
- D) The hardware performs bounds checking on a memory access

<details>
<summary>Answer</summary>

**C.** The trap table is initialized **once at boot time**, before any user program runs. This is a privileged operation — only the kernel can set it up. After boot, the trap table cannot be modified by user code.

Options A, B, and D all happen repeatedly at run time: A happens when processes are created, B happens on every context switch, and D happens on every single memory access.

</details>

---

**Q20.** A system has this physical memory layout:

```
 0KB  ┌──────────────┐
      │  OS          │
16KB  ├──────────────┤
      │  (free)      │
32KB  ├──────────────┤
      │  Process A   │  BASE=32KB, BOUNDS=16KB
48KB  ├──────────────┤
      │  (free)      │
64KB  └──────────────┘
```

The OS creates Process B (size 8KB) at physical address 16KB. Process A accesses virtual address 10KB; Process B accesses virtual address 10KB. Which statement is correct?

- A) Both accesses succeed: A → physical 42KB, B → physical 26KB
- B) Both accesses succeed: A → physical 42KB, B → physical 42KB
- C) A succeeds (→ 42KB) but B faults because 10KB ≥ 8KB (BOUNDS)
- D) Both accesses fault

<details>
<summary>Answer</summary>

**C.**

- Process A: `BASE = 32KB, BOUNDS = 16KB`. Virtual 10KB < 16KB ✓ → physical = 10KB + 32KB = **42KB**. Access succeeds.
- Process B: `BASE = 16KB, BOUNDS = 8KB`. Virtual 10KB < 8KB? **No** → **FAULT!** Hardware raises an out-of-bounds exception. The OS terminates Process B.

The same virtual address (10KB) has completely different outcomes for the two processes because they have different BOUNDS values. This demonstrates how base and bounds provides per-process protection.

</details>

---

## Scoring Guide

| Score | Level |
|-------|-------|
| 18–20 | 🏆 Excellent — thorough understanding of all three topics |
| 14–17 | 👍 Good — review the questions you missed |
| 10–13 | 📖 Needs work — re-read the materials and trace examples by hand |
| 0–9   | 🆘 Seek help — work through the concepts step by step with someone |
