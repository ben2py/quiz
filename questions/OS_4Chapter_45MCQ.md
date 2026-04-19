# OS Review — 45 MCQ (Multi-Level PT, 3+ Levels, Concurrency, File Systems)

## Part A: Multi-Level Page Tables & More Than Two Levels (Q1–Q15)

---

**Q1.** A linear page table for a 32-bit address space with 4KB pages and 4-byte PTEs is:

- A) 1 MB per process
- B) 4 MB per process
- C) 16 MB per process
- D) 4 KB per process

<details>
<summary>Answer</summary>

**B.** VPN = 20 bits → 2²⁰ entries × 4 bytes = 4 MB. Most entries are invalid for a typical process, wasting megabytes of RAM.

</details>

---

**Q2.** A multi-level page table saves space by:

- A) Compressing all PTEs into fewer bits
- B) Not allocating pages of PTEs that are entirely invalid
- C) Storing the page table on disk instead of in memory
- D) Using larger pages to reduce the number of entries

<details>
<summary>Answer</summary>

**B.** The linear table is chopped into page-sized chunks. A page directory tracks which chunks exist. If a chunk has no valid PTEs, it is never allocated — only its PDE costs memory.

</details>

---

**Q3.** A PDE with valid = 0 means:

- A) The corresponding data page is swapped to disk
- B) That chunk of PTEs has no valid mappings and was never allocated
- C) The page directory itself is corrupted
- D) The TLB must be flushed before continuing

<details>
<summary>Answer</summary>

**B.** An invalid PDE means the entire page of PTEs it represents would be all invalid. The OS saves memory by skipping allocation entirely.

</details>

---

**Q4.** In a two-level table with 14-bit addresses, 64-byte pages, and 4-byte PTEs, the VPN is split as:

- A) 6-bit PDIndex + 2-bit PTIndex
- B) 4-bit PDIndex + 4-bit PTIndex
- C) 2-bit PDIndex + 6-bit PTIndex
- D) 8-bit PDIndex + 0-bit PTIndex

<details>
<summary>Answer</summary>

**B.** Each page holds 64 ÷ 4 = 16 PTEs → PTIndex = 4 bits. Page directory = 16 entries → PDIndex = 4 bits. Total = 8-bit VPN. ✅

</details>

---

**Q5.** On a TLB miss, a two-level page table costs how many memory accesses (before the data access)?

- A) 1
- B) 2
- C) 3
- D) 0

<details>
<summary>Answer</summary>

**B.** One to read the PDE, one to read the PTE. A linear table costs only 1, so this is the time-space trade-off.

</details>

---

**Q6.** On a TLB hit, does the number of page table levels matter?

- A) Yes — more levels always add latency
- B) No — the TLB provides the PFN directly without consulting the page table
- C) Yes — the page directory is still checked for validity
- D) No — but only because modern CPUs prefetch all levels

<details>
<summary>Answer</summary>

**B.** A TLB hit bypasses the page table entirely. The multi-level structure is only walked on a miss.

</details>

---

**Q7.** 30-bit address space, 512-byte pages, 4-byte PTEs. A two-level table puts 14 bits in the PDIndex. The page directory would be:

- A) 512 bytes — fits in one page
- B) 64 KB — spans 128 pages
- C) 4 KB — spans 8 pages
- D) 128 bytes — fits easily

<details>
<summary>Answer</summary>

**B.** 2¹⁴ entries × 4 bytes = 64 KB. At 512 bytes/page, that's 128 pages. Way too big — we need three levels.

</details>

---

**Q8.** The three-level fix for the 30-bit example splits the 21-bit VPN as:

- A) 10 + 4 + 7
- B) 7 + 7 + 7
- C) 14 + 7 (stays two levels)
- D) 5 + 5 + 11

<details>
<summary>Answer</summary>

**B.** Each page holds 128 entries → 7 bits per index. Three levels: 7+7+7 = 21. Top-level directory = 128 entries = 512 bytes = 1 page. ✅

</details>

---

**Q9.** x86-64 (48-bit virtual addresses, 4KB pages, 8-byte PTEs) uses how many page table levels?

- A) 2
- B) 3
- C) 4
- D) 5

<details>
<summary>Answer</summary>

**C.** Entries/page = 4096 ÷ 8 = 512 → 9 bits/index. VPN = 36 bits. 36 ÷ 9 = 4 levels.

</details>

---

**Q10.** Each additional page table level adds ___ memory access(es) per TLB miss.

- A) 0
- B) 1
- C) 2
- D) It depends on the page size

<details>
<summary>Answer</summary>

**B.** Each level requires exactly one memory read. Two levels = 2 accesses, three = 3, four = 4.

</details>

---

**Q11.** An inverted page table has one entry per:

- A) Virtual page in each process
- B) Physical frame in the system
- C) TLB slot in the CPU
- D) Page table level

<details>
<summary>Answer</summary>

**B.** A single system-wide table indexed by physical frame number. Each entry records which (pid, VPN) occupies that frame.

</details>

---

**Q12.** An inverted page table uses a hash table because:

- A) Hashing compresses the entries to save disk space
- B) The table is indexed by PFN, so finding a (pid, VPN) match requires a search
- C) It encrypts translations for security purposes
- D) Hash tables are required by the x86 specification

<details>
<summary>Answer</summary>

**B.** You have (pid, VPN) but the table is indexed by PFN. Without hashing, you'd scan millions of entries. A hash table gives O(1) average lookup.

</details>

---

**Q13.** Swapping page tables to disk is risky because:

- A) Disk firmware cannot store page tables
- B) A TLB miss may trigger a disk I/O, causing extreme slowdown or thrashing
- C) It permanently corrupts the page directory
- D) The CPU halts if a page-table page is not in RAM

<details>
<summary>Answer</summary>

**B.** If a needed PT page is on disk, one TLB miss triggers a disk read — orders of magnitude slower. Under memory pressure, the system may thrash.

</details>

---

**Q14.** A process uses 8 MB in a 4 GB (32-bit) space with a two-level table (4KB pages, 4-byte PTEs). Roughly how many pages does its multi-level page table occupy?

- A) ~1024 (same as linear)
- B) ~4–5 pages
- C) Exactly 1 page
- D) ~256 pages

<details>
<summary>Answer</summary>

**B.** 8 MB = ~2048 pages across a few regions. Each PT page covers 1024 VPNs (4 MB). ~2 PT pages + 1 page directory ≈ 3–5 total. A linear table would be 1024 pages.

</details>

---

**Q15.** Multi-level page tables vs segmentation — which avoids external fragmentation?

- A) Segmentation
- B) Multi-level page tables
- C) Both avoid it
- D) Neither avoids it

<details>
<summary>Answer</summary>

**B.** Both skip unused regions. But segmentation uses variable-sized pieces (external fragmentation). Multi-level tables use fixed-size pages — no external fragmentation.

</details>

---

## Part B: Concurrency (Q16–Q33)

---

**Q16.** Threads within the same process share:

- A) Stack, registers, and program counter
- B) Code, heap, and global variables
- C) Page tables with other processes
- D) Nothing — each thread is fully independent

<details>
<summary>Answer</summary>

**B.** Threads share the address space (code, heap, globals) but each has its own PC, registers, and stack.

</details>

---

**Q17.** Context switching between two threads of the same process is cheaper than switching between two processes because:

- A) Thread stacks are smaller
- B) No page table switch is needed — only registers and PC change
- C) Threads don't use the TLB
- D) The OS doesn't save thread state

<details>
<summary>Answer</summary>

**B.** Threads share the address space, so the page table (and PTBR/PDBR) stays the same. Only registers and the PC are saved/restored.

</details>

---

**Q18.** `counter++` executed by two threads concurrently can produce wrong results because:

- A) The compiler optimizes away one increment
- B) It compiles to three instructions (load, add, store) that can interleave between threads
- C) The hardware doesn't support addition on shared variables
- D) Threads cannot access global variables

<details>
<summary>Answer</summary>

**B.** Both threads may load the same old value, add 1, and store — one update is lost. This is a race condition.

</details>

---

**Q19.** A critical section is:

- A) The section of code that initializes the OS kernel
- B) Code that accesses shared data and must run with mutual exclusion
- C) Any code inside a loop
- D) The main() function of a multi-threaded program

<details>
<summary>Answer</summary>

**B.** A critical section accesses shared resources and must not be executed by more than one thread at a time.

</details>

---

**Q20.** Test-and-set is:

- A) A software algorithm that requires no hardware support
- B) An atomic hardware instruction that reads and writes a memory location in one step
- C) A compiler optimization for lock-free code
- D) A scheduling policy for threads

<details>
<summary>Answer</summary>

**B.** TAS atomically reads the old value and sets a new value, returning the old one. Used to build spin locks.

</details>

---

**Q21.** A spin lock's main disadvantage is:

- A) It does not provide mutual exclusion
- B) It wastes CPU cycles busy-waiting
- C) It requires kernel mode to use
- D) It can only be held by one thread total in the system

<details>
<summary>Answer</summary>

**B.** The spinning thread loops endlessly checking the flag, consuming CPU without doing useful work. A sleeping lock (mutex) avoids this by putting the thread to sleep.

</details>

---

**Q22.** When should a spin lock be preferred over a mutex?

- A) When the critical section may take a long time
- B) When the critical section is extremely short (nanoseconds)
- C) When fairness is the top priority
- D) When there are hundreds of threads contending

<details>
<summary>Answer</summary>

**B.** If the lock is held for only a few nanoseconds, the cost of sleeping and waking (context switch overhead) exceeds the cost of spinning briefly. Spin locks are also used inside the OS kernel where sleeping may not be possible.

</details>

---

**Q23.** `wait(cond, mutex)` atomically does two things:

- A) Acquires the mutex and signals the condition
- B) Releases the mutex and puts the thread to sleep
- C) Checks the condition and spins until it is true
- D) Increments a semaphore and wakes a thread

<details>
<summary>Answer</summary>

**B.** It releases the lock (so other threads can make progress) and sleeps. When woken, it re-acquires the lock before returning.

</details>

---

**Q24.** Why must you use `while` (not `if`) around `wait()`?

- A) `if` is a syntax error in pthreads
- B) After waking, another thread may have changed the condition (Mesa semantics)
- C) `while` makes the code run faster
- D) `if` causes a deadlock in all cases

<details>
<summary>Answer</summary>

**B.** Mesa semantics: a signaled thread is put on the ready queue but may not run immediately. Another thread can run first and invalidate the condition. The `while` loop re-checks.

</details>

---

**Q25.** The producer/consumer problem uses two condition variables because:

- A) One CV is for the mutex, the other for the semaphore
- B) With one CV, a consumer might wake another consumer instead of a producer (and vice versa)
- C) Two CVs are required by the POSIX standard
- D) One CV handles reads, the other handles writes

<details>
<summary>Answer</summary>

**B.** With one CV, `signal()` might wake the wrong type of thread. Two CVs (e.g., `empty` and `fill`) ensure producers wake consumers and consumers wake producers.

</details>

---

**Q26.** A semaphore initialized to 1 acts as:

- A) A counter for available resources
- B) A lock (binary semaphore)
- C) An ordering mechanism
- D) A thread-safe queue

<details>
<summary>Answer</summary>

**B.** `sem_wait` decrements from 1 to 0 (acquire); the next `sem_wait` blocks. `sem_post` increments back to 1 (release). This is mutual exclusion.

</details>

---

**Q27.** A semaphore initialized to 0 is used for:

- A) Mutual exclusion
- B) Bounded buffer management
- C) Ordering — one thread waits until another signals
- D) Preventing deadlock

<details>
<summary>Answer</summary>

**C.** Init=0 means `sem_wait` blocks immediately. Another thread calls `sem_post` to unblock it. This enforces an ordering: the waiter proceeds only after the poster.

</details>

---

**Q28.** An atomicity violation bug occurs when:

- A) A lock is acquired but never released
- B) Code assumes a multi-step sequence executes without interruption, but doesn't use a lock
- C) Two threads use different semaphores
- D) A thread calls `signal()` before `wait()`

<details>
<summary>Answer</summary>

**B.** Example: `if (ptr != NULL) ptr->doSomething()` — another thread sets `ptr = NULL` between the check and use. Fix: wrap both steps in a lock.

</details>

---

**Q29.** An order violation bug occurs when:

- A) Locks are acquired in the wrong order
- B) Code assumes Thread A runs before Thread B but doesn't enforce it
- C) A thread spins instead of sleeping
- D) The scheduler uses round-robin instead of MLFQ

<details>
<summary>Answer</summary>

**B.** Example: a worker thread uses an object before the init thread creates it. Fix: use a condition variable or semaphore to enforce ordering.

</details>

---

**Q30.** Deadlock requires all four Coffman conditions. Which is NOT one of them?

- A) Mutual exclusion
- B) Hold and wait
- C) Starvation
- D) Circular wait

<details>
<summary>Answer</summary>

**C.** The four Coffman conditions are: mutual exclusion, hold and wait, no preemption, and circular wait. Starvation is a different problem (a thread never gets the lock).

</details>

---

**Q31.** The simplest practical strategy to prevent deadlock is:

- A) Never use locks
- B) Lock ordering — always acquire locks in the same global order
- C) Kill one thread randomly when contention is detected
- D) Use spin locks instead of mutexes

<details>
<summary>Answer</summary>

**B.** A fixed total order on lock acquisition prevents circular wait. If Lock A always comes before Lock B, no cycle can form.

</details>

---

**Q32.** Thread 1 does `lock(A); lock(B)`. Thread 2 does `lock(B); lock(A)`. This can cause:

- A) A race condition but not a deadlock
- B) Deadlock — each holds one lock and waits for the other
- C) Starvation of Thread 1 only
- D) No problems if the critical sections are short

<details>
<summary>Answer</summary>

**B.** T1 holds A, waits for B. T2 holds B, waits for A. Circular wait → deadlock. Fix: both threads acquire A then B.

</details>

---

**Q33.** Two reasons to use threads (instead of separate processes) are:

- A) Better isolation and separate address spaces
- B) Parallelism across CPUs and overlapping I/O with computation
- C) Simpler debugging and no shared state
- D) Stronger protection and no race conditions

<details>
<summary>Answer</summary>

**B.** Threads enable true parallelism (splitting work across cores) and allow other threads to compute while one waits for I/O. Processes provide better isolation but at higher cost.

</details>

---

## Part C: File Systems (Q34–Q45)

---

**Q34.** At the lowest level, a file is:

- A) A database record with typed columns
- B) A linear array of bytes identified by an inode number
- C) A structured tree of directories
- D) A segment of virtual memory mapped to disk

<details>
<summary>Answer</summary>

**B.** The file system doesn't interpret contents. A file is just bytes (0 to N−1), identified internally by an inode number.

</details>

---

**Q35.** A directory contains:

- A) The actual byte contents of all its files
- B) A list of (name, inode number) pairs
- C) Pointers to physical disk sectors
- D) Encryption keys for each file

<details>
<summary>Answer</summary>

**B.** A directory maps human-readable names to inode numbers. It is itself a special file stored on disk.

</details>

---

**Q36.** A file descriptor returned by `open()` is:

- A) The inode number of the file
- B) A per-process integer handle tracking the file session (offset, inode)
- C) A physical disk block address
- D) A pointer to the file's data in memory

<details>
<summary>Answer</summary>

**B.** Each `open()` creates an OS-internal entry tracking the current offset and which inode is being accessed. The fd is a small integer the process uses to refer to this entry.

</details>

---

**Q37.** If a file has two hard links and one is deleted, the file:

- A) Is deleted immediately
- B) Still exists — the inode's reference count drops from 2 to 1
- C) Becomes a symbolic link
- D) Is moved to a trash directory

<details>
<summary>Answer</summary>

**B.** Hard links share an inode. The file is only deleted when the reference count reaches 0.

</details>

---

**Q38.** A symbolic link differs from a hard link because it:

- A) Stores a path string rather than pointing to the same inode
- B) Cannot cross directories
- C) Increases the inode's reference count
- D) Is faster to resolve

<details>
<summary>Answer</summary>

**A.** A symlink is a separate file containing the path to the target. It can cross file systems but becomes dangling if the target is deleted.

</details>

---

**Q39.** The VSFS disk layout includes (in order):

- A) Data region, inode table, bitmaps, superblock
- B) Superblock, inode bitmap, data bitmap, inode table, data region
- C) Superblock, data region, inode table
- D) Boot block, journal, data region only

<details>
<summary>Answer</summary>

**B.** The superblock holds FS metadata, the bitmaps track free/used inodes and blocks, the inode table stores all inodes, and the data region holds file contents.

</details>

---

**Q40.** An inode stores metadata and pointers to data blocks. Why does it use 12 direct pointers plus indirect pointers, rather than only indirect pointers?

- A) Hardware requires at least 12 direct pointers
- B) Most files are small — direct pointers handle them with no extra I/O
- C) Indirect pointers are slower than direct pointers on SSDs
- D) 12 is the maximum number the inode structure can hold

<details>
<summary>Answer</summary>

**B.** 12 direct pointers cover 48 KB. Since most files are small, they need only a single inode read. Large files use indirect/double indirect pointers but pay extra I/O — an acceptable cost since they are rare.

</details>

---

**Q41.** With 4KB blocks and 4-byte pointers, one indirect pointer covers:

- A) 4 KB
- B) 4 MB
- C) 4 GB
- D) 48 KB

<details>
<summary>Answer</summary>

**B.** One indirect block holds 4096 ÷ 4 = 1024 pointers × 4 KB each = 4 MB.

</details>

---

**Q42.** The crash consistency problem arises because:

- A) Files can only be read, not written
- B) A single logical operation requires multiple disk writes that can be interrupted by a crash
- C) The superblock is never updated
- D) Inodes do not store timestamps

<details>
<summary>Answer</summary>

**B.** Appending a block requires updating the data block, inode, and bitmap — three writes. A crash between any two leaves the disk in an inconsistent state.

</details>

---

**Q43.** `fsck` is impractical for modern systems because:

- A) It deletes all files during recovery
- B) It must scan the entire disk, taking minutes to hours on large disks
- C) It only works on FAT file systems
- D) It requires the disk to be physically disconnected

<details>
<summary>Answer</summary>

**B.** fsck checks every inode, block, and directory to find inconsistencies. On terabyte disks this is far too slow.

</details>

---

**Q44.** In journaling, the commit point of a transaction is:

- A) The TxB (Transaction Begin) block
- B) The TxE (Transaction End) block
- C) The checkpoint write
- D) The data block write

<details>
<summary>Answer</summary>

**B.** TxE is a single atomic block write. If TxE is on disk, the transaction is committed and can be replayed. If TxE is missing, the transaction is discarded.

</details>

---

**Q45.** After a crash, the file system replays committed journal entries. What does "committed" mean?

- A) The data was already written to its final location
- B) The TxE block is present on disk for that transaction
- C) The user called `fsync()` on the file
- D) The OS confirmed the write to the application

<details>
<summary>Answer</summary>

**B.** If TxE is on disk, the journal contains all the information needed to redo the update. The FS replays it to the final locations. If TxE is missing, the partial journal entry is discarded.

</details>

---
