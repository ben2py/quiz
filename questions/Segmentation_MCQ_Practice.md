# Segmentation — 15 MCQ Practice

---

## Part 1: Theory (Q1–8)

---

**Q1.** What problem does segmentation solve that a single base/bounds pair cannot?

- A) Address translation is too slow with a single base/bounds pair
- B) The entire address space (including the unused gap between heap and stack) must occupy contiguous physical memory, wasting space
- C) A single base/bounds pair cannot support more than one process
- D) A single base/bounds pair does not provide any protection

<details>
<summary>Answer</summary>

**B.** With a single base/bounds pair, the whole address space — including the large unused region between the heap and stack — must be allocated as one contiguous block in physical memory. This is **internal fragmentation**. Segmentation solves it by giving each logical segment (code, heap, stack) its own base/bounds, so segments are placed independently and the unused gap requires **zero** physical memory.

</details>

---

**Q2.** In a system using the **explicit** approach with 14-bit virtual addresses, the top 2 bits select the segment and the bottom 12 bits are the offset. What is the maximum size of any single segment?

- A) 16KB
- B) 8KB
- C) 4KB
- D) 2KB

<details>
<summary>Answer</summary>

**C.** The offset field is 12 bits, so it can represent values from 0 to 2^12 − 1 = 4095. Therefore, the maximum segment size is **4KB** (4096 bytes).

</details>

---

**Q3.** In the explicit approach, the top 2 bits of a 14-bit virtual address are `01`. Which segment does this refer to?

- A) Code
- B) Heap
- C) Stack
- D) OS kernel

<details>
<summary>Answer</summary>

**B.** The segment encoding is: `00` → Code, `01` → Heap, `11` → Stack. So `01` selects the **Heap** segment.

</details>

---

**Q4.** Why does the stack segment need a **growth direction bit** in the segment register, while code and heap do not?

- A) Because the stack is always larger than the heap
- B) Because the stack grows toward lower addresses (backwards), so the hardware must compute a negative offset during translation
- C) Because the stack cannot be shared between processes
- D) Because the stack uses different protection bits

<details>
<summary>Answer</summary>

**B.** Code and heap grow toward higher addresses (positive direction), so a simple `offset = raw_bits` works. The stack grows toward **lower** addresses, so the hardware must compute a **negative offset** (`raw_offset − max_segment_size`) and add it to the base. The growth direction bit tells the hardware which formula to use.

</details>

---

**Q5.** How do protection bits enable **code sharing** between processes?

- A) Protection bits allow the OS to compress code segments to save space
- B) By marking the code segment as Read-Execute (no write), the OS can safely point multiple processes' code base registers to the same physical memory
- C) Protection bits encrypt the code so that only authorized processes can read it
- D) Protection bits allow the code segment to grow dynamically

<details>
<summary>Answer</summary>

**B.** When the code segment is marked **Read-Execute** (no write allowed), no process can modify it. The OS can therefore map multiple processes' code base registers to the **same** physical memory safely. Each process believes it has its own private code, but the OS secretly shares one physical copy, saving memory.

</details>

---

**Q6.** What is the difference between **external** fragmentation and **internal** fragmentation?

- A) Internal fragmentation occurs inside the CPU; external fragmentation occurs in memory
- B) Internal fragmentation is wasted space inside allocated memory (e.g., the unused gap in base & bounds); external fragmentation is wasted space between allocated blocks (scattered free holes from variable-sized segments)
- C) They are the same thing with different names
- D) External fragmentation only happens on disk, not in memory

<details>
<summary>Answer</summary>

**B.** **Internal fragmentation** (base & bounds problem): the unused gap *inside* the allocated address space wastes physical memory. **External fragmentation** (segmentation problem): free physical memory is split into many small, non-contiguous holes *between* allocated segments, making it impossible to allocate a large contiguous block even when enough total free memory exists.

</details>

---

**Q7.** Physical memory has 24KB free, distributed across three 8KB holes. A new segment requires 20KB of contiguous memory. What happens?

- A) The allocation succeeds because 24KB > 20KB
- B) The allocation fails — no single hole is large enough, even though total free memory is sufficient
- C) The OS automatically splits the segment into three 8KB pieces
- D) The hardware merges the three holes into one 24KB block

<details>
<summary>Answer</summary>

**B.** Segments must be **contiguous** in physical memory. Even though 24KB total is free, the largest hole is only 8KB — not enough for a 20KB segment. This is **external fragmentation**. The OS could run **compaction** (rearranging existing segments to consolidate free space), but that is expensive because it requires stopping processes, copying memory, and updating all segment registers.

</details>

---

**Q8.** Which of the following correctly describes **coarse-grained** vs. **fine-grained** segmentation?

- A) Coarse-grained uses many small segments stored in a segment table; fine-grained uses a few large segments in hardware registers
- B) Coarse-grained uses a few large segments (code, heap, stack) stored in hardware registers; fine-grained uses many small segments managed via a segment table in memory
- C) Coarse-grained is slower because it uses more hardware; fine-grained is faster because it uses fewer segments
- D) There is no practical difference between them

<details>
<summary>Answer</summary>

**B.** Coarse-grained segmentation (most systems) uses a small number of large logical segments (code, heap, stack) with a few hardware registers. Fine-grained segmentation (e.g., Multics) supports many small segments via a **segment table** stored in memory, giving the OS finer control but requiring more complex hardware and management.

</details>

---

## Part 2: Practical / Simulation (Q9–15)

Use the following segment registers for Q9–Q12 unless stated otherwise:

| Segment | Base | Size | Grows Positive? |
|---------|------|------|:---------------:|
| Code (00) | 32K | 2K | 1 |
| Heap (01) | 34K | 3K | 1 |
| Stack (11) | 28K | 2K | 0 |

The system uses 14-bit virtual addresses: top 2 bits = segment selector, bottom 12 bits = offset. Max segment size = 4KB.

---

**Q9.** A process accesses virtual address **100**. What is the physical address?

- A) 32,868
- B) 34,196
- C) 28,100
- D) Segmentation fault

<details>
<summary>Answer</summary>

**A.**

1. Virtual address 100 in binary (14 bits): `00 000001100100`
2. Top 2 bits = `00` → **Code** segment
3. Offset = 100
4. Bounds check: 100 < 2048 (2K)? **YES** ✓
5. Physical address = 32K + 100 = 32768 + 100 = **32,868**

</details>

---

**Q10.** A process accesses virtual address **4200**. What is the physical address?

- A) 38,296 (just add 4200 to 34K)
- B) 34,920
- C) 32,868
- D) Segmentation fault

<details>
<summary>Answer</summary>

**B.**

1. 4200 in binary (14 bits): `01 000001101000`
2. Top 2 bits = `01` → **Heap** segment
3. Offset (bottom 12 bits) = 104 (not 4200!)
4. Bounds check: 104 < 3072 (3K)? **YES** ✓
5. Physical address = 34K + 104 = 34816 + 104 = **34,920**

Common mistake: adding the full virtual address 4200 to the heap base. You must extract the **offset** (bottom 12 bits) first. The top 2 bits select the segment, not contribute to the address.

</details>

---

**Q11.** A process accesses virtual address **7168** (7KB). What happens?

- A) Physical address = 37,888
- B) Physical address = 34,816
- C) Segmentation fault — the offset (3072) is not less than the heap size (3072)
- D) The access goes to the stack segment

<details>
<summary>Answer</summary>

**C.**

1. 7168 in binary (14 bits): `01 110000000000`
2. Top 2 bits = `01` → **Heap** segment
3. Offset (bottom 12 bits) = 3072
4. Bounds check: 3072 < 3072? **NO** ❌ (strictly less than, not ≤)
5. **Segmentation fault!** The hardware raises an exception and the OS terminates the process.

This is the origin of the famous "segmentation fault" error — accessing an address beyond the bounds of a segment.

</details>

---

**Q12.** A process accesses virtual address **15KB** (15360). This is a stack address. What is the physical address?

- A) 27KB
- B) 29KB
- C) 31KB
- D) Segmentation fault

<details>
<summary>Answer</summary>

**A.** The stack grows **backwards**, so translation is different:

1. 15360 in binary (14 bits): `11 110000000000`
2. Top 2 bits = `11` → **Stack** segment
3. Raw offset (bottom 12 bits) = 3072 (3KB)
4. Since the stack grows negative: **negative offset** = 3KB − 4KB (max segment size) = **−1KB**
5. Bounds check: |−1KB| = 1KB ≤ 2KB (stack size)? **YES** ✓
6. Physical address = 28KB + (−1KB) = **27KB**

The stack base (28K) is the *top* of the stack in physical memory. The negative offset reaches *below* the base, corresponding to data pushed onto the stack.

</details>

---

**Q13.** Two processes (P1 and P2) run the same program. Their segment registers are:

| | Code Base | Code Size | Heap Base | Heap Size | Stack Base | Stack Size |
|-|-----------|-----------|-----------|-----------|------------|------------|
| P1 | 32K | 2K | 34K | 3K | 28K | 2K |
| P2 | 32K | 2K | 40K | 4K | 24K | 2K |

Notice that P1 and P2 have the **same** Code Base. Both access virtual address 500 (a code fetch). What physical addresses do they get, and why is this safe?

- A) P1 → 33,268 and P2 → 33,268; safe because the code segment is marked Read-Execute, so neither can modify it
- B) P1 → 33,268 and P2 → 40,500; each gets a different copy
- C) P1 → 33,268 and P2 → 33,268; not safe — one could overwrite the other's code
- D) Both get a segmentation fault because code cannot be shared

<details>
<summary>Answer</summary>

**A.** Both processes translate virtual address 500 the same way: offset 500 + Code Base 32K = 32768 + 500 = **33,268**. They access the **same physical memory** — this is code sharing. It is safe because the code segment has **Read-Execute** protection: the hardware will raise an exception if either process tries to write to it. Each process still has its own private heap and stack.

</details>

---

**Q14.** A process calls `malloc()` and the heap needs to grow. The current heap segment has `Base = 34K` and `Size = 3K`. The physical memory immediately after the heap (37K–40K) is **free**. What does the OS do?

- A) The OS allocates a new, separate segment for the extra heap space
- B) The OS increases the heap segment's Size register (e.g., from 3K to 4K), expanding into the adjacent free space
- C) The OS triggers a segmentation fault because the heap is full
- D) The OS moves the entire heap to a larger free region and updates the Base register

<details>
<summary>Answer</summary>

**B.** When the heap needs to grow and there is adjacent free physical memory available, the simplest approach is to **update the heap segment's Size register** to a larger value (e.g., 3K → 4K). The `sbrk()` system call handles this. The heap can now use the extra space without moving any data.

If adjacent memory were **not** free, the OS might reject the request (return an error) or — less commonly — move the segment to a larger free region and update the Base (option D), though this is more expensive.

</details>

---

**Q15.** Segmentation solves the internal fragmentation problem of base and bounds, but introduces a new problem. What is it, and what is the fundamental architectural idea that solves it?

- A) Segmentation is too slow; the solution is to remove bounds checking
- B) Segmentation introduces external fragmentation (scattered free holes from variable-sized segments); the solution is **paging** — dividing memory into fixed-size chunks to eliminate external fragmentation
- C) Segmentation doesn't support protection bits; the solution is to add encryption
- D) Segmentation requires too many registers; the solution is to use only one segment

<details>
<summary>Answer</summary>

**B.** Because segments are **variable-sized**, allocating and freeing them creates scattered holes of different sizes in physical memory — **external fragmentation**. Even with smart allocation algorithms (best-fit, first-fit, etc.) or expensive compaction, the problem cannot be fully eliminated.

**Paging** solves this by dividing both virtual and physical memory into **fixed-size** chunks (pages and frames). Since every chunk is the same size, any free frame can hold any page — no external fragmentation is possible. This is the next major step in memory virtualization.

</details>

---

## Scoring Guide

| Score | Level |
|-------|-------|
| 14–15 | 🏆 Excellent — thorough understanding of segmentation |
| 11–13 | 👍 Good — review the questions you missed |
| 7–10  | 📖 Needs work — re-read the material and trace translations by hand |
| 0–6   | 🆘 Seek help — work through segment translations step by step |
