# OS Final Exam — 120 MCQ Comprehensive Review

## Part A: OS Foundations & Virtualization (Q1–Q10)

---

**Q1.** The three main responsibilities of an operating system are:

- A) Scheduling, paging, and file systems
- B) Virtualization, concurrency, and persistence
- C) Boot, login, and shutdown
- D) CPU, memory, and disk management

<details>
<summary>Answer</summary>

**B.** The three core OS responsibilities are virtualization (sharing limited resources among many processes), concurrency (handling many things happening at once), and persistence (keeping data safe across reboots).

</details>

---

**Q2.** What is the difference between a mechanism and a policy?

- A) A mechanism is fast; a policy is slow
- B) A mechanism is HOW to do something; a policy is WHAT decision to make
- C) A mechanism runs in kernel mode; a policy runs in user mode
- D) A mechanism is hardware; a policy is software

<details>
<summary>Answer</summary>

**B.** Mechanism = HOW (e.g., the context switch code). Policy = WHAT decision (e.g., which process to run next). Separating them lets the OS change scheduling policies without rewriting the context-switch mechanism.

</details>

---

**Q3.** Why does the OS separate mechanism from policy?

- A) To make the OS smaller
- B) To provide flexibility — you can change the policy without changing the mechanism
- C) Because the hardware requires it
- D) To reduce CPU usage

<details>
<summary>Answer</summary>

**B.** Separation enables flexibility. The context switch mechanism works the same regardless of whether the policy is FIFO, SJF, Round-Robin, or MLFQ. Policies can evolve independently.

</details>

---

**Q4.** "Virtualization" in operating systems means:

- A) Running the OS inside a virtual machine
- B) Creating the illusion that each process has its own CPU and memory
- C) Storing data on a virtual disk
- D) Running programs in a web browser

<details>
<summary>Answer</summary>

**B.** The OS virtualizes the CPU (making one CPU look like many through time-sharing) and virtualizes memory (giving each process the illusion of its own private address space).

</details>

---

**Q5.** Why is RAM called "volatile" memory?

- A) It can be read and written many times
- B) It loses all data when power is lost
- C) It is faster than disk
- D) It can be accessed randomly

<details>
<summary>Answer</summary>

**B.** Volatile = requires constant power to retain data. This motivates persistence — the OS must manage non-volatile storage (disk) to keep data across reboots and crashes.

</details>

---

**Q6.** Concurrency problems can occur even inside a single program because:

- A) The compiler generates bad code
- B) Multiple threads within one process share memory and can interfere with each other
- C) The OS is buggy
- D) The CPU is too fast

<details>
<summary>Answer</summary>

**B.** Threads within one process share the address space (heap, globals). When they access shared data simultaneously, race conditions arise — even without multiple processes being involved.

</details>

---

**Q7.** Which OS goal conflicts MOST directly with efficiency?

- A) Transparency
- B) Fairness
- C) Abstraction
- D) Modularity

<details>
<summary>Answer</summary>

**B.** Running one program for a long time is efficient (no switching overhead), but unfair. Sharing the CPU frequently is fair but requires context switches that waste CPU time. OS goals often conflict.

</details>

---

**Q8.** Match the problem to the OS responsibility: "Two threads increment the same counter at the same time."

- A) Resource management
- B) Persistence
- C) Concurrency
- D) Virtualization

<details>
<summary>Answer</summary>

**C.** Race conditions between threads are fundamentally a concurrency problem. The OS (and programmer) must use synchronization primitives to coordinate access to shared data.

</details>

---

**Q9.** Match the problem to the OS responsibility: "My file survives when I reboot the computer."

- A) Resource management
- B) Persistence
- C) Concurrency
- D) Virtualization

<details>
<summary>Answer</summary>

**B.** Persistence is the OS responsibility of keeping data safe across power loss and crashes. The file system and journaling are the primary mechanisms.

</details>

---

**Q10.** Match the problem to the OS responsibility: "Which process gets the CPU next?"

- A) Resource management (virtualization)
- B) Persistence
- C) Concurrency
- D) Networking

<details>
<summary>Answer</summary>

**A.** Scheduling is a resource management problem — deciding how to share the limited CPU resource among competing processes.

</details>

---

## Part B: Processes (Q11–Q25)

---

**Q11.** A process is:

- A) A program stored on disk
- B) A running program, including its memory, registers, and OS state
- C) A function inside the OS
- D) A file that contains executable code

<details>
<summary>Answer</summary>

**B.** A program is a static file on disk. A process is the dynamic instance: the program loaded into memory, with CPU state, memory state, and I/O state. One program can create many processes.

</details>

---

**Q12.** One program can correspond to:

- A) Only one process at a time
- B) Multiple processes running simultaneously
- C) Zero processes
- D) One thread only

<details>
<summary>Answer</summary>

**B.** If you open three Chrome windows, that's three processes from one chrome.exe program. Each is a separate instance with its own memory, registers, and state.

</details>

---

**Q13.** The process address space contains four main regions:

- A) Code, static data, heap, stack
- B) Kernel, user, system, library
- C) Read, write, execute, reserved
- D) Instructions, registers, flags, PC

<details>
<summary>Answer</summary>

**A.** Code (program instructions, fixed size, read-only), static data (global variables, fixed size), heap (malloc, grows up), stack (local variables and call frames, grows down).

</details>

---

**Q14.** In the typical address space layout, the stack and heap grow toward each other because:

- A) The hardware requires this arrangement
- B) They can share the free space between them and grow as needed
- C) It improves cache performance
- D) The compiler chose this design arbitrarily

<details>
<summary>Answer</summary>

**B.** By placing stack and heap at opposite ends growing toward each other, neither has a fixed cap. They share the free middle. Out-of-memory happens only when they collide.

</details>

---

**Q15.** In which direction does the stack grow?

- A) Toward lower addresses (downward)
- B) Toward higher addresses (upward)
- C) Neither — it has a fixed size
- D) It depends on the CPU architecture only

<details>
<summary>Answer</summary>

**A.** By convention (and in most architectures), the stack grows toward lower addresses. The heap grows toward higher addresses. Each function call pushes a frame to lower addresses.

</details>

---

**Q16.** The three main states a process can be in are:

- A) START, MIDDLE, END
- B) RUNNING, READY, BLOCKED
- C) FORK, EXEC, WAIT
- D) USER, KERNEL, SYSTEM

<details>
<summary>Answer</summary>

**B.** RUNNING (on a CPU right now), READY (wants to run, waiting for CPU), BLOCKED (waiting for I/O — cannot run even if CPU is free).

</details>

---

**Q17.** A process finishes a disk read. What state transition occurs?

- A) RUNNING → READY
- B) BLOCKED → READY
- C) BLOCKED → RUNNING (directly)
- D) READY → BLOCKED

<details>
<summary>Answer</summary>

**B.** When I/O completes, the process becomes READY (not RUNNING directly). The OS then schedules it to RUNNING when it picks it to run. This gives the OS control over who runs next.

</details>

---

**Q18.** A timer interrupt fires while a process is running. What state transition occurs?

- A) RUNNING → BLOCKED
- B) RUNNING → READY
- C) RUNNING → RUNNING
- D) READY → RUNNING

<details>
<summary>Answer</summary>

**B.** When the OS deschedules a running process (e.g., after its time slice), the process goes from RUNNING to READY — it's still able to run, just waiting in line.

</details>

---

**Q19.** Can a process transition directly from BLOCKED to RUNNING?

- A) Yes — once I/O completes, the process runs immediately
- B) No — it must pass through the READY state so the OS chooses when to run it
- C) Yes — if it has high priority
- D) No — only user processes have this restriction

<details>
<summary>Answer</summary>

**B.** The OS mediates all scheduling decisions. When I/O completes, the process becomes READY; the scheduler later picks it to move to RUNNING. This preserves OS control.

</details>

---

**Q20.** The correct order of steps for process creation is:

- A) Load code → allocate stack → allocate heap → setup I/O → start at main()
- B) Start at main() → load code → allocate stack → setup I/O
- C) Setup I/O → start at main() → allocate memory
- D) Allocate heap → start at main() → load code → allocate stack

<details>
<summary>Answer</summary>

**A.** The OS first loads code and static data from disk, then allocates the stack (initialized with argc/argv), then allocates the initial heap, then sets up file descriptors 0/1/2, and finally jumps to main().

</details>

---

**Q21.** The Process Control Block (PCB) stores:

- A) The program's source code
- B) The process's identity, state, CPU context, memory info, and I/O info
- C) Only the program counter
- D) The output of the process

<details>
<summary>Answer</summary>

**B.** The PCB contains everything the OS needs to track a process: PID, state, saved registers (context), page table pointer, open file descriptors, priority, etc.

</details>

---

**Q22.** Process A writes to virtual address 0x1000. Process B also writes to virtual address 0x1000. Do they conflict?

- A) Yes — they share the same physical memory location
- B) No — each process has its own address space; their virtual addresses map to different physical locations
- C) Yes — but only if they run on the same CPU core
- D) It depends on the compiler

<details>
<summary>Answer</summary>

**B.** This is address space isolation. Each process's page table maps its virtual addresses to different physical frames. Virtual address 0x1000 in A is a totally different physical location than 0x1000 in B.

</details>

---

**Q23.** Why does the OS maintain a separate page table per process?

- A) To save memory
- B) So each process has an isolated view of memory — same virtual address maps to different physical frames per process
- C) Because the hardware requires it
- D) To support multi-core CPUs

<details>
<summary>Answer</summary>

**B.** Per-process page tables give each process its own private address space. This enables isolation (A can't read B's memory) and transparency (each process thinks it has memory starting at 0).

</details>

---

**Q24.** Multiprogramming improves CPU utilization by:

- A) Running programs faster
- B) While one process is BLOCKED on I/O, another READY process can run
- C) Using multiple CPUs simultaneously
- D) Compressing programs into less memory

<details>
<summary>Answer</summary>

**B.** CPU is much faster than I/O. When a process blocks waiting for disk/network, the CPU would sit idle. Multiprogramming switches to another ready process, keeping the CPU busy.

</details>

---

**Q25.** When a process calls `exit()`, its PCB is:

- A) Kept forever in the system
- B) Cleaned up by the OS (though may linger briefly for the parent to collect its status)
- C) Transferred to another process
- D) Written to disk

<details>
<summary>Answer</summary>

**B.** The OS frees the process's memory, closes its files, and removes its PCB. In Unix, a "zombie" state briefly exists until the parent calls `wait()` to retrieve the exit status.

</details>

---

## Part C: Limited Direct Execution & Context Switching (Q26–Q40)

---

**Q26.** What problem does Limited Direct Execution (LDE) solve?

- A) How to compile programs efficiently
- B) How to run programs fast on the CPU while maintaining OS control
- C) How to allocate memory quickly
- D) How to save files to disk

<details>
<summary>Answer</summary>

**B.** LDE balances two opposing goals: performance (run directly on hardware for speed) and control (OS must retain the ability to intervene). Hardware support (modes, traps, timer) enables both.

</details>

---

**Q27.** In user mode, a process cannot:

- A) Perform arithmetic
- B) Access shared variables
- C) Directly execute privileged instructions like disabling interrupts or accessing hardware
- D) Call functions

<details>
<summary>Answer</summary>

**C.** User mode restricts privileged operations (I/O, interrupt control, page-table updates, etc.). The CPU hardware enforces this — attempting a privileged instruction in user mode raises a trap.

</details>

---

**Q28.** To request an OS service (like reading a file), a user program must:

- A) Call the OS function directly
- B) Execute a trap instruction (system call) that transitions to kernel mode
- C) Access kernel memory directly
- D) Reboot the system

<details>
<summary>Answer</summary>

**B.** System calls use a special trap instruction. The hardware saves state, raises the privilege to kernel mode, and jumps to a predefined handler in the OS. Return-from-trap restores user mode.

</details>

---

**Q29.** The naive "direct execution" approach (no limits) is dangerous because:

- A) Programs run too slowly
- B) A program could run forever, access any memory, and take over the machine
- C) The CPU overheats
- D) Programs cannot make system calls

<details>
<summary>Answer</summary>

**B.** Without limits, nothing prevents a program from running in an infinite loop, reading other processes' memory, or disabling the OS entirely. The "Limited" in LDE provides the safety.

</details>

---

**Q30.** The cooperative scheduling approach (trusting programs to yield) fails because:

- A) Programs are too slow
- B) A buggy or malicious program can run an infinite loop that never yields, freezing the system
- C) Yielding is too expensive
- D) User mode doesn't support it

<details>
<summary>Answer</summary>

**B.** Cooperative scheduling requires trust. One misbehaving program can freeze the entire machine (like classic Mac OS before OS X). The solution: non-cooperative scheduling via timer interrupts.

</details>

---

**Q31.** The timer interrupt enables the OS to regain control by:

- A) Asking programs politely to stop
- B) Having hardware periodically interrupt whatever is running, jumping to OS code
- C) Using a special software flag
- D) Running the OS on a separate CPU

<details>
<summary>Answer</summary>

**B.** The hardware timer counts down; when it reaches zero, it raises an interrupt. The CPU stops the current program mid-instruction, saves state, and jumps to the OS interrupt handler. OS now has control.

</details>

---

**Q32.** Starting and stopping the timer are privileged operations because:

- A) They require a lot of power
- B) If user programs could disable the timer, they could prevent the OS from ever regaining control
- C) Only the BIOS can touch the timer
- D) They are too slow for user mode

<details>
<summary>Answer</summary>

**B.** If user programs could turn off the timer, they could run forever. Only the OS kernel, running in kernel mode, can configure or disable the timer. This is essential for preemption.

</details>

---

**Q33.** During a context switch from Process A to Process B, the OS:

- A) Saves A's register state and loads B's register state
- B) Only saves A's program counter
- C) Clears all CPU registers
- D) Reloads the entire program from disk

<details>
<summary>Answer</summary>

**A.** The OS saves all relevant CPU state (PC, SP, general registers) of A into A's PCB, then loads B's saved state from B's PCB into the CPU. When the CPU resumes, it runs B from where B left off.

</details>

---

**Q34.** During a timer-interrupt-triggered context switch, the hardware automatically saves:

- A) Nothing — the OS does everything
- B) The user registers onto the kernel stack, BEFORE OS code begins running
- C) The page table
- D) All OS data structures

<details>
<summary>Answer</summary>

**B.** When a trap occurs, the hardware automatically saves critical registers (at minimum PC and flags) onto the kernel stack. Only then does the OS handler run. This is "Save #1."

</details>

---

**Q35.** A full context switch from Process A to B involves how many register saves?

- A) One (done by the OS)
- B) Two — hardware saves on trap entry ("Save #1"), then OS saves kernel context during switch ("Save #2")
- C) Three
- D) Zero, if using hardware support

<details>
<summary>Answer</summary>

**B.** Save #1: hardware saves A's user registers to A's kernel stack when the interrupt fires. Save #2: OS calls switch() to save A's kernel context to A's PCB and load B's kernel context from B's PCB.

</details>

---

**Q36.** The correct order of events during a timer-triggered context switch is:

- A) Timer fires → OS handler runs → hardware saves registers → switch()
- B) Timer fires → hardware saves registers to kernel stack → OS handler runs → switch() saves/loads kernel context → return-from-trap restores new process registers
- C) OS decides to switch → timer fires → hardware saves → switch()
- D) Hardware saves → timer fires → OS decides → return

<details>
<summary>Answer</summary>

**B.** Correct order: (1) timer interrupt, (2) hardware auto-saves user regs to kernel stack, (3) mode switch user→kernel, (4) OS handler runs, (5) OS calls switch() to save A's kernel context and load B's, (6) return-from-trap restores B's user regs and resumes B.

</details>

---

**Q37.** Which of the following is NOT a direct cost of a context switch?

- A) Saving and restoring registers
- B) Switching kernel stacks
- C) The cost of the trap itself
- D) Increasing the CPU's clock frequency

<details>
<summary>Answer</summary>

**D.** Context switch does not change CPU frequency. Direct costs include register save/restore, stack switch, and the trap overhead.

</details>

---

**Q38.** Beyond direct register save/restore, context switches have hidden costs because:

- A) The operation takes many seconds
- B) The TLB and CPU caches are often cold after a switch, causing many cache/TLB misses on the new process
- C) The OS must restart the computer
- D) Registers get corrupted

<details>
<summary>Answer</summary>

**B.** After switching processes (different address space), the TLB entries for the old process are wrong for the new one. Cache contents are also less useful. The new process suffers many misses until caches warm up.

</details>

---

**Q39.** Context switching between two threads of the same process is cheaper than between two processes because:

- A) Threads are faster than processes
- B) No page table (PTBR) switch is needed — the address space is shared
- C) Threads don't use CPU registers
- D) The OS skips saving state for threads

<details>
<summary>Answer</summary>

**B.** Threads share the page table. On a thread switch, only registers and PC change — the PTBR stays the same, and (with ASIDs) the TLB doesn't need to be flushed. Less work, fewer misses.

</details>

---

**Q40.** The OS code that performs context switches is typically written in:

- A) High-level Python for readability
- B) Assembly language, because it needs precise control over registers
- C) JavaScript
- D) HTML

<details>
<summary>Answer</summary>

**B.** The switch routine must directly manipulate every CPU register. High-level languages hide registers, so the switch code is written in assembly for precise control.

</details>

---

## Part D: Scheduling — FIFO, SJF, Round Robin (Q41–Q52)

---

**Q41.** Turnaround time is defined as:

- A) T_completion − T_arrival
- B) T_firstrun − T_arrival
- C) T_completion − T_firstrun
- D) CPU time used by the job

<details>
<summary>Answer</summary>

**A.** Turnaround = completion time − arrival time. It measures the total time a job spends in the system. Lower is better.

</details>

---

**Q42.** Response time is defined as:

- A) T_completion − T_arrival
- B) T_firstrun − T_arrival
- C) Time spent waiting in the ready queue
- D) CPU service time

<details>
<summary>Answer</summary>

**B.** Response = time of first execution − arrival time. It measures how long the user waits before seeing any progress. Crucial for interactive systems.

</details>

---

**Q43.** Three jobs A=100s, B=10s, C=10s all arrive at t=0. Under FIFO, the average turnaround time is:

- A) 40s
- B) 50s
- C) 110s
- D) 60s

<details>
<summary>Answer</summary>

**C.** FIFO runs A first (finishes at 100), then B (finishes at 110), then C (finishes at 120). Average = (100+110+120)/3 = 110s. This is the convoy effect — short jobs stuck behind a long one.

</details>

---

**Q44.** The "convoy effect" in FIFO scheduling refers to:

- A) Multiple processes running simultaneously
- B) Short jobs being stuck waiting behind a long-running job
- C) Jobs arriving in groups
- D) CPU running below capacity

<details>
<summary>Answer</summary>

**B.** Like short cars stuck behind a slow truck, short jobs wait a long time if a long job arrived first. FIFO's ordering is unfair to short jobs in this case.

</details>

---

**Q45.** Three jobs A=100s, B=10s, C=10s all arrive at t=0. Under SJF, the average turnaround time is:

- A) 110s
- B) 60s
- C) 50s
- D) 40s

<details>
<summary>Answer</summary>

**C.** SJF runs B (finishes at 10), then C (finishes at 20), then A (finishes at 120). Average = (10+20+120)/3 = 50s. SJF is optimal for turnaround when all jobs arrive together.

</details>

---

**Q46.** SJF is optimal for turnaround time when:

- A) Jobs have different priorities
- B) All jobs arrive at the same time and run lengths are known
- C) The CPU is very fast
- D) There are fewer than 10 jobs

<details>
<summary>Answer</summary>

**B.** SJF minimizes average turnaround time ONLY when all jobs arrive simultaneously and the scheduler knows their lengths. If jobs arrive at different times or lengths are unknown, SJF may not be optimal.

</details>

---

**Q47.** Under non-preemptive SJF, a long job A arrives at t=0 and runs. Short jobs B and C arrive at t=10. What happens?

- A) B and C preempt A immediately
- B) B and C must wait for A to finish — the convoy effect returns
- C) The scheduler switches to B, interrupting A
- D) B and C are rejected

<details>
<summary>Answer</summary>

**B.** Non-preemptive SJF cannot interrupt A once it starts. B and C wait, reintroducing convoy behavior. This motivates STCF (preemptive SJF) or Round Robin.

</details>

---

**Q48.** Round Robin (RR) scheduling works by:

- A) Running the shortest job to completion first
- B) Running each job for a time slice, then switching to the next job in the queue
- C) Running jobs in priority order
- D) Running only one job until it finishes

<details>
<summary>Answer</summary>

**B.** RR gives each ready job a fixed time slice (quantum) in cyclic order. After the quantum expires, the current job is preempted and moved to the back of the queue. This gives great response time.

</details>

---

**Q49.** A smaller time slice in Round Robin:

- A) Always improves turnaround time
- B) Improves response time but increases context-switch overhead
- C) Eliminates the need for context switches
- D) Works only for CPU-bound jobs

<details>
<summary>Answer</summary>

**B.** Shorter slices mean each job waits less for its turn (better response). But more switches mean more overhead (worse throughput/turnaround). The time slice must be tuned for the workload.

</details>

---

**Q50.** Three jobs A, B, C, each 5s, arrive at t=0. With RR and 1s time slice, what is the average response time?

- A) 0s
- B) 1s
- C) 2s
- D) 5s

<details>
<summary>Answer</summary>

**B.** A responds at t=0 (response 0), B at t=1 (response 1), C at t=2 (response 2). Average = (0+1+2)/3 = 1s. RR's response time is excellent.

</details>

---

**Q51.** Which scheduling goal does RR optimize well?

- A) Turnaround time
- B) Response time (interactive performance)
- C) Total CPU utilization
- D) Job completion order

<details>
<summary>Answer</summary>

**B.** RR ensures every job gets served quickly (bounded by number_of_jobs × time_slice). Great for interactive workloads where users expect fast responses. But turnaround suffers compared to SJF.

</details>

---

**Q52.** What is the fundamental limitation of both SJF and STCF in practice?

- A) They are too slow
- B) They require knowing job lengths in advance, which is usually unknown
- C) They don't support multiple CPUs
- D) They use too much memory

<details>
<summary>Answer</summary>

**B.** The "oracle" assumption — knowing job run times — is unrealistic. Jobs in real systems have unpredictable lengths. This is what motivates MLFQ: learning job behavior from observation.

</details>

---

## Part E: MLFQ (Q53–Q65)

---

**Q53.** MLFQ stands for:

- A) Multi-Level Feedback Queue
- B) Maximum Level Feedback Queue
- C) Minimum Latency Feedback Queue
- D) Multiple Linear Flow Queue

<details>
<summary>Answer</summary>

**A.** Multi-Level Feedback Queue — multiple queues at different priority levels, with "feedback" meaning the scheduler learns from each job's behavior and adjusts its queue placement.

</details>

---

**Q54.** MLFQ Rule 1 states:

- A) All jobs get equal priority
- B) If Priority(A) > Priority(B), A runs (B doesn't)
- C) Jobs always run to completion
- D) Higher priority means longer time slice

<details>
<summary>Answer</summary>

**B.** Rule 1 is strict priority: a higher-priority queue always runs before a lower-priority queue. Lower-priority jobs wait until all higher-priority queues are empty.

</details>

---

**Q55.** MLFQ Rule 2 states:

- A) When Priority(A) = Priority(B), one is chosen randomly
- B) When Priority(A) = Priority(B), they run in Round-Robin
- C) Equal-priority jobs merge into one
- D) Equal priorities are not allowed

<details>
<summary>Answer</summary>

**B.** Within a single queue (same priority), jobs share the CPU via Round-Robin — ensuring fairness among peers at the same level.

</details>

---

**Q56.** Why does MLFQ start new jobs at the HIGHEST priority queue (Rule 3)?

- A) Because new jobs are always important
- B) Because we don't know if the job is short (interactive) or long — assume short until proven otherwise
- C) Because the highest queue has the longest time slice
- D) Because of hardware requirements

<details>
<summary>Answer</summary>

**B.** "Innocent until proven guilty." Short jobs finish quickly at high priority (like SJF). Long jobs use up their allotment and sink down. This approximates SJF without knowing job lengths in advance.

</details>

---

**Q57.** MLFQ Rule 4 states that a job moves down one queue when:

- A) It issues a system call
- B) It uses up its time allotment at a level (regardless of I/O)
- C) Another job arrives
- D) The CPU is idle

<details>
<summary>Answer</summary>

**B.** Rule 4 (new version) tracks total CPU time used at a level. Once the allotment is exhausted — regardless of whether I/O interrupted it — the job is demoted. This prevents gaming.

</details>

---

**Q58.** The "allotment" in MLFQ refers to:

- A) The memory a job can use
- B) The total CPU time a job can accumulate at a priority level before being demoted
- C) The number of I/O operations allowed
- D) The job's priority number

<details>
<summary>Answer</summary>

**B.** Allotment = cumulative CPU time at a given queue level. It's tracked across time slices and across I/O waits. When the allotment is used up, the job moves down one queue.

</details>

---

**Q59.** Under the OLD MLFQ rules (4a/4b), how could a clever programmer "game" the scheduler?

- A) By running very fast code
- B) By issuing a tiny I/O just before the time slice ended, so the "stay at level" rule reset the allotment counter
- C) By calling exit() and restarting
- D) By using more memory

<details>
<summary>Answer</summary>

**B.** The old rules reset the allotment whenever a job released the CPU (for any reason, including I/O). An evil job would run 9.9ms, do a 0.1ms I/O, repeat — staying at high priority forever and monopolizing CPU.

</details>

---

**Q60.** How does the improved Rule 4 prevent gaming?

- A) By banning I/O in the high queue
- B) By tracking total allotment across I/O waits — time used is not reset when I/O occurs
- C) By using larger time slices
- D) By adding a hardware check

<details>
<summary>Answer</summary>

**B.** The new rule accumulates total CPU time at a level. Doing I/O doesn't reset the counter. After enough total CPU time (regardless of interruptions), the job is demoted. Gaming no longer works.

</details>

---

**Q61.** What problem does MLFQ Rule 5 (priority boost) solve?

- A) Starvation of low-priority jobs AND the "changing behavior" problem (a CPU-bound job becoming interactive)
- B) Gaming the scheduler
- C) Context switch overhead
- D) Memory leaks

<details>
<summary>Answer</summary>

**A.** Two problems: (1) A flood of interactive jobs can starve CPU-bound jobs at Q0 forever. (2) A job that was CPU-bound but becomes interactive is stuck at Q0. Periodic boosts fix both by refreshing all priorities.

</details>

---

**Q62.** Rule 5 (priority boost) works by:

- A) Giving more CPU time to low-priority jobs
- B) After period S, moving ALL jobs back to the highest-priority queue
- C) Deleting the low-priority queue
- D) Allowing jobs to choose their priority

<details>
<summary>Answer</summary>

**B.** Periodically (every S time units), the scheduler pushes every job back to the top queue. This gives starved jobs a fresh chance and lets behavior-changed jobs re-earn their high-priority status.

</details>

---

**Q63.** A job runs 5ms at Q2 (allotment 10ms), does I/O for a long time, then returns. Under the new Rule 4, where is it now?

- A) Back at Q2 with full allotment
- B) Still at Q2, but only 5ms of allotment remains
- C) Demoted to Q1
- D) Demoted to Q0

<details>
<summary>Answer</summary>

**B.** The allotment is cumulative. 5ms was used before I/O; when the job becomes ready again, it's still at Q2 with 5ms of allotment remaining. If it uses another 5ms, it will be demoted.

</details>

---

**Q64.** In MLFQ, different queues often use different time slice lengths. Why?

- A) It's required by the POSIX standard
- B) High-priority queues use shorter slices (for responsive interactive jobs); low-priority queues use longer slices (fewer context switches for batch jobs)
- C) To maximize memory usage
- D) To save power

<details>
<summary>Answer</summary>

**B.** Interactive jobs benefit from frequent short quanta (fast response). Long-running batch jobs benefit from long quanta (amortizing context-switch overhead). Varying slices optimizes for both.

</details>

---

**Q65.** MLFQ achieves both good turnaround time AND good response time because:

- A) It uses 60 queues like Solaris
- B) Short jobs finish quickly at high priority (SJF-like behavior), while interactive jobs stay high (great response), and long jobs get the CPU periodically via boost
- C) It knows the length of every job
- D) It runs multiple jobs simultaneously

<details>
<summary>Answer</summary>

**B.** MLFQ approximates SJF (short jobs at top) for turnaround, keeps interactive jobs high for response time, and uses boost to prevent starvation of long jobs. It learns from behavior without an oracle.

</details>

---

## Part F: Memory — Base/Bounds and Segmentation (Q66–Q75)

---

**Q66.** Under base-and-bounds, the physical address is computed as:

- A) virtual_address × base
- B) virtual_address + base
- C) virtual_address − base
- D) virtual_address × base + bounds

<details>
<summary>Answer</summary>

**B.** Simple dynamic relocation: PA = VA + BASE. The hardware adds the base register to every virtual address, after verifying VA < BOUNDS.

</details>

---

**Q67.** The bounds register exists to provide:

- A) A speed optimization
- B) Protection — preventing a process from accessing memory outside its address space
- C) Compatibility with older CPUs
- D) A way to increase memory

<details>
<summary>Answer</summary>

**B.** Before adding the base, the hardware checks that VA < BOUNDS. If not, it raises an exception. This stops a process from reading or writing memory that doesn't belong to it.

</details>

---

**Q68.** Base = 32KB, Bounds = 16KB. A process accesses VA = 15KB. What is the physical address?

- A) 15KB
- B) 47KB
- C) 32KB
- D) Protection fault — access denied

<details>
<summary>Answer</summary>

**B.** 15KB < 16KB ✓ passes bounds check. PA = 15KB + 32KB = 47KB.

</details>

---

**Q69.** Base = 32KB, Bounds = 16KB. A process accesses VA = 20KB. What happens?

- A) PA = 20KB + 32KB = 52KB
- B) Protection fault — 20KB ≥ 16KB bounds check fails, OS terminates the process
- C) PA = 20KB (base is ignored)
- D) The access succeeds but is logged

<details>
<summary>Answer</summary>

**B.** Bounds check: 20KB ≥ 16KB → fail. Hardware raises an exception. The OS typically terminates the offending process with a "segmentation fault."

</details>

---

**Q70.** The main drawback of single base-and-bounds is:

- A) It's too slow
- B) Internal fragmentation — the entire address space (including unused gap between heap and stack) must be contiguous in physical memory
- C) It can't support multiple processes
- D) It doesn't provide protection

<details>
<summary>Answer</summary>

**B.** With one base/bounds, the whole address space (code + heap + free gap + stack) must be contiguous. The large free gap between heap and stack wastes physical memory.

</details>

---

**Q71.** Segmentation improves on base-and-bounds by:

- A) Using one pair of registers per process
- B) Giving each logical segment (code, heap, stack) its own base/bounds pair, so the free gap takes zero physical memory
- C) Eliminating the bounds check
- D) Using smaller pages

<details>
<summary>Answer</summary>

**B.** With multiple base/bounds pairs (one per segment), each segment can be placed independently in physical memory. The unused free gap between heap and stack is not allocated at all — a big memory saving.

</details>

---

**Q72.** The stack segment is special in segmentation because:

- A) It's always the largest segment
- B) It grows toward lower addresses, requiring a "grows negative" bit and negative-offset translation
- C) It cannot be protected
- D) It's stored on disk

<details>
<summary>Answer</summary>

**B.** Stack grows the opposite direction. The hardware needs a flag indicating growth direction; translation computes a negative offset (raw_offset − max_segment_size) and adds it to the base.

</details>

---

**Q73.** Segmentation's main weakness is:

- A) It's slower than paging
- B) External fragmentation — variable-sized segments leave scattered free holes, none large enough for a new segment
- C) It cannot enforce protection
- D) It requires a page table

<details>
<summary>Answer</summary>

**B.** Variable-sized allocations inevitably fragment free memory into mismatched holes. A request may fail even with plenty of total free space. No allocation algorithm (best-fit, first-fit, etc.) fully solves this.

</details>

---

**Q74.** 24KB free across three 8KB holes. A process needs a 20KB segment. Can it be allocated?

- A) Yes — total free memory is sufficient
- B) No — no single hole is large enough; segments must be contiguous in physical memory
- C) Yes — the OS will split the segment
- D) Maybe — depends on scheduling

<details>
<summary>Answer</summary>

**B.** Segments must be contiguous. Even though 24KB > 20KB total, the largest hole is only 8KB. This is external fragmentation. Paging (fixed-size units) solves this fundamentally.

</details>

---

**Q75.** Segmentation supports code sharing between processes by:

- A) Copying the code segment between processes
- B) Marking the code segment as Read-Execute and pointing both processes' code base registers to the same physical memory
- C) Using compression
- D) Storing code on a shared disk partition

<details>
<summary>Answer</summary>

**B.** A read-only (R-X) code segment can be safely shared — neither process can modify it, so they cannot interfere with each other. Each process sees it at the same virtual address but uses one physical copy.

</details>

---

## Part G: Paging — Basics, TLB, Multi-Level (Q76–Q95)

---

**Q76.** The main advantage of paging over segmentation is:

- A) Paging uses less memory
- B) Paging eliminates external fragmentation by using fixed-size pages/frames
- C) Paging is faster
- D) Paging requires less hardware

<details>
<summary>Answer</summary>

**B.** Since every page is the same size as every frame, any free frame can hold any page. No more mismatched holes — external fragmentation is gone. (Internal fragmentation still exists in partially-used pages.)

</details>

---

**Q77.** A virtual address in a paging system is divided into:

- A) A base and a bounds
- B) A Virtual Page Number (VPN) and an offset
- C) A segment and an offset
- D) A frame number and a page number

<details>
<summary>Answer</summary>

**B.** High bits = VPN (which page), low bits = offset (byte within page). The VPN is translated through the page table to a PFN; the offset is passed through unchanged.

</details>

---

**Q78.** With a 64-byte address space and 16-byte pages, how many bits are in the VPN and offset?

- A) VPN = 4 bits, offset = 2 bits
- B) VPN = 2 bits, offset = 4 bits
- C) VPN = 3 bits, offset = 3 bits
- D) VPN = 6 bits, offset = 0 bits

<details>
<summary>Answer</summary>

**B.** Total bits = log₂(64) = 6. Offset = log₂(16) = 4 (byte in page). VPN = 6 − 4 = 2 bits (4 pages total).

</details>

---

**Q79.** Page table: VPN 0→PFN 3, VPN 1→PFN 7, VPN 2→PFN 5, VPN 3→PFN 2. Page size = 16 bytes. Translate VA=21.

- A) 85
- B) 117
- C) 37
- D) 53

<details>
<summary>Answer</summary>

**B.** 21 = 010101₂. VPN = 01 = 1, offset = 0101 = 5. VPN 1 → PFN 7. PA = 7 × 16 + 5 = 117.

</details>

---

**Q80.** During translation, what part of the virtual address is NOT changed?

- A) The VPN
- B) The offset
- C) Both VPN and offset change
- D) Neither changes

<details>
<summary>Answer</summary>

**B.** The offset (byte within page) is unchanged. Only the VPN (which page) is replaced by the PFN (which frame). Offset passes through directly.

</details>

---

**Q81.** Paging can cause internal fragmentation because:

- A) Pages are too big to fit in memory
- B) If a process's last page is only partially used, the remaining bytes in that page are wasted
- C) The page table is too large
- D) Pages don't have protection bits

<details>
<summary>Answer</summary>

**B.** If a process uses 4097 bytes with 4KB pages, it needs 2 pages (8192 bytes allocated) — 4095 bytes wasted in page 2. This is internal fragmentation: unused space inside an allocated unit.

</details>

---

**Q82.** Why does a naïve paging system require TWO memory accesses per instruction?

- A) One for instruction fetch, one for data
- B) One to read the page table entry (to find the PFN), one to read the actual data
- C) One for the OS, one for the user
- D) One for the TLB, one for the cache

<details>
<summary>Answer</summary>

**B.** Before accessing the data, the hardware must consult the page table in memory to get the PFN. Then it accesses the actual data. This doubles memory traffic — motivating the TLB.

</details>

---

**Q83.** The TLB (Translation Lookaside Buffer) is:

- A) A disk cache
- B) A hardware cache inside the CPU that stores recent VPN→PFN translations
- C) A software data structure in the OS
- D) A region of RAM reserved for page tables

<details>
<summary>Answer</summary>

**B.** The TLB is a small, fast hardware cache (32–128 entries) on-chip. On a TLB hit, translation is ~1 cycle — no memory access for the page table needed. On a miss, the page table is consulted.

</details>

---

**Q84.** TLBs work well in practice because of:

- A) Larger page sizes
- B) Locality — programs tend to reuse the same pages many times (temporal) and access nearby pages (spatial)
- C) Faster CPUs
- D) More RAM

<details>
<summary>Answer</summary>

**B.** Once a translation is cached, future accesses to the same page (temporal locality) or nearby locations (spatial locality — same page) all hit the TLB without accessing memory.

</details>

---

**Q85.** Array `a[]` of 10 ints (4 bytes each) starts at VA 100, page size 16 bytes. Accessing a[0] through a[9] in order, how many TLB misses occur (empty TLB)?

- A) 1
- B) 3
- C) 7
- D) 10

<details>
<summary>Answer</summary>

**B.** Array spans 3 pages (VPN 6, 7, 8). First access to each page is a miss (3 misses). Subsequent accesses on the same page hit. 7 hits + 3 misses. Hit rate = 70%.

</details>

---

**Q86.** What is an ASID (Address Space Identifier)?

- A) A process's ID number
- B) A tag in each TLB entry identifying which process's translation it belongs to, avoiding TLB flush on context switch
- C) A disk address
- D) A file descriptor

<details>
<summary>Answer</summary>

**B.** ASIDs let the TLB hold translations for multiple processes simultaneously. On a context switch, the OS just changes the current ASID — no need to flush. Entries from other processes are simply ignored.

</details>

---

**Q87.** Without ASIDs, what must happen to the TLB on a context switch?

- A) Nothing
- B) It must be flushed (all entries invalidated) to prevent the new process from using the old process's translations
- C) It must be doubled in size
- D) The OS swaps it to disk

<details>
<summary>Answer</summary>

**B.** Without ASIDs, the TLB has no way to distinguish which process owns each entry. After switching from P1 to P2, P2 could accidentally use P1's translations. So the TLB must be flushed, paying a cold-start penalty.

</details>

---

**Q88.** For a 32-bit address space with 4KB pages and 4-byte PTEs, the linear page table size per process is:

- A) 4 KB
- B) 1 MB
- C) 4 MB
- D) 16 MB

<details>
<summary>Answer</summary>

**C.** VPN = 20 bits → 2²⁰ entries. Size = 2²⁰ × 4 bytes = 4 MB per process. Most entries are invalid — motivation for multi-level page tables.

</details>

---

**Q89.** Why is a linear page table wasteful for most processes?

- A) Page tables are stored on disk
- B) Most virtual address space is unused, so most entries are invalid — yet memory is still allocated for them
- C) The page table is too slow
- D) Each process needs its own TLB

<details>
<summary>Answer</summary>

**B.** A typical process uses a tiny fraction of its 4GB address space. The linear table still has ~1 million entries, mostly invalid. Multi-level page tables skip allocating entire sections of invalid PTEs.

</details>

---

**Q90.** A multi-level page table works by:

- A) Storing the page table on disk
- B) Splitting the page table into page-sized pieces; a page directory tracks which pieces exist, and pieces with only invalid PTEs are never allocated
- C) Using smaller pages
- D) Compressing PTEs

<details>
<summary>Answer</summary>

**B.** The table is divided into chunks. The page directory has one PDE per chunk. If a chunk would contain only invalid PTEs, the OS just marks the PDE invalid — no memory is allocated for the chunk.

</details>

---

**Q91.** A Page Directory Entry (PDE) with valid = 0 means:

- A) The page was swapped to disk
- B) The entire chunk of PTEs it represents is unused, and no memory was allocated for that chunk
- C) The directory is corrupted
- D) Access to this region is forbidden

<details>
<summary>Answer</summary>

**B.** An invalid PDE means every PTE in the chunk would be invalid — so the OS doesn't allocate the chunk at all. A huge memory saving for sparse address spaces.

</details>

---

**Q92.** The time-space trade-off of multi-level page tables is:

- A) They save space but a TLB miss now requires more memory accesses (one per level)
- B) They use more space but translation is faster
- C) They are faster and smaller than linear
- D) They eliminate TLB misses

<details>
<summary>Answer</summary>

**A.** Less memory for the page table (unused regions cost only a PDE). But on a TLB miss, the walker must read the PDE AND the PTE — two accesses instead of one. TLB hits are unaffected.

</details>

---

**Q93.** On a TLB miss in a 4-level page table (like x86-64), how many total memory accesses happen for one memory reference?

- A) 1
- B) 4
- C) 5 (four for the page walk + one for the data)
- D) 8

<details>
<summary>Answer</summary>

**C.** Each level requires one memory access (4 total). Then the actual data access adds 1 more. This is why TLBs are critical — without them every reference would be 5× as expensive.

</details>

---

**Q94.** On a TLB hit, the number of page-table levels:

- A) Doubles the access time
- B) Does not matter — the TLB returns the PFN directly, so the page table is not walked
- C) Slows down the system proportionally
- D) Forces a flush

<details>
<summary>Answer</summary>

**B.** TLB hit = translation cached, no page walk. Multi-level structure is only traversed on misses. Thanks to locality, most accesses are hits, so the multi-level cost is rarely paid.

</details>

---

**Q95.** A process uses only 10MB in a 4GB (32-bit) address space. Roughly how many pages does its multi-level page table use (compared to a linear table)?

- A) About the same as a linear table (~1000 pages)
- B) A few pages (just the directory and a handful of PT pages for the used regions) — far less than linear's ~1000
- C) Exactly 1 page
- D) Zero pages

<details>
<summary>Answer</summary>

**B.** A linear table needs ~1000 pages (1M entries × 4 bytes = 4MB). A multi-level table only allocates PT pages for regions in use — maybe 3–5 pages total. Dramatic savings for sparse address spaces.

</details>

---

## Part H: Concurrency (Q96–Q110)

---

**Q96.** A thread differs from a process in that:

- A) Threads run faster
- B) Threads within a process share the same address space (code, heap, globals) but each has its own PC, registers, and stack
- C) Threads cannot access shared memory
- D) Threads have their own address space

<details>
<summary>Answer</summary>

**B.** Threads are lightweight — they share the address space (much cheaper context switch), but each has private execution state (PC, registers, stack). Processes are heavier (own address space).

</details>

---

**Q97.** Why does `counter++` produce incorrect results when two threads run it concurrently?

- A) The compiler optimizes one increment away
- B) It compiles to three machine instructions (load, add, store), and threads can interleave them, causing lost updates
- C) The CPU doesn't support addition
- D) Threads can't share variables

<details>
<summary>Answer</summary>

**B.** Both threads may load the same value, each add 1, each store 1 — losing one of the updates. This is a classic race condition.

</details>

---

**Q98.** A race condition is:

- A) When two processes compete for a file
- B) A situation where the outcome depends on the non-deterministic timing of thread execution
- C) A scheduling algorithm
- D) A network protocol

<details>
<summary>Answer</summary>

**B.** Race condition = timing-dependent bug. Different interleavings of threads produce different outcomes. The program might work sometimes and fail other times.

</details>

---

**Q99.** A critical section is:

- A) The most important function in the program
- B) A piece of code that accesses shared data and must not be executed by more than one thread at a time
- C) The OS kernel
- D) An error handler

<details>
<summary>Answer</summary>

**B.** Critical section = code that touches shared state. To avoid race conditions, only one thread should execute it at a time. That property is called mutual exclusion.

</details>

---

**Q100.** Mutual exclusion is:

- A) A scheduling policy
- B) The property that at most one thread is in the critical section at any time
- C) A hardware feature of all CPUs
- D) A type of deadlock

<details>
<summary>Answer</summary>

**B.** Mutex = "mutual exclusion." Locks are the primary mechanism for enforcing mutual exclusion in critical sections.

</details>

---

**Q101.** Test-and-Set (TAS) is:

- A) A compiler optimization
- B) An atomic hardware instruction that reads the old value and writes a new value in one indivisible operation
- C) A type of semaphore
- D) A networking protocol

<details>
<summary>Answer</summary>

**B.** TAS atomically: old = *ptr; *ptr = new; return old. This atomicity (a single hardware instruction) is what enables building correct locks. Without atomic hardware instructions, spin locks would be unreliable.

</details>

---

**Q102.** A spin lock implemented with TAS is:

- A) Always efficient
- B) Correct (provides mutual exclusion) but wastes CPU cycles if the lock is held for a long time
- C) Not correct
- D) Slower than a sleeping lock

<details>
<summary>Answer</summary>

**B.** Spin locks provide correctness but busy-wait. If the lock is held briefly (nanoseconds), spinning is fine. If held longer, a sleeping lock is better because it gives up the CPU.

</details>

---

**Q103.** A sleeping lock (mutex) differs from a spin lock because:

- A) A mutex doesn't really lock
- B) When the lock is held, waiting threads are put to sleep (placed on a wait queue); when released, the OS wakes one of them
- C) A mutex only works in the kernel
- D) A mutex prevents race conditions differently

<details>
<summary>Answer</summary>

**B.** Instead of burning CPU cycles spinning, the waiting thread blocks. The OS parks it on a queue associated with the lock. When the holder releases, the OS wakes a waiting thread. No CPU waste during long waits.

</details>

---

**Q104.** When should a spin lock be preferred over a sleeping lock?

- A) Always — spin locks are always faster
- B) When the critical section is very short, or inside the OS kernel where sleeping may not be possible
- C) When there are many waiting threads
- D) Never

<details>
<summary>Answer</summary>

**B.** The cost of sleeping/waking (context switches) exceeds the cost of brief spinning. For ns-scale critical sections, spin. In some kernel contexts, sleeping is forbidden, so spin is the only option.

</details>

---

**Q105.** Why must you use `while` (not `if`) when checking a condition before `wait()`?

- A) `if` is not a valid C keyword in pthreads
- B) Mesa semantics: after waking, another thread may have invalidated the condition — you must re-check
- C) `while` makes the code run faster
- D) `if` would cause a deadlock

<details>
<summary>Answer</summary>

**B.** A signaled thread is placed on the ready queue but may not run immediately. Another thread could run first and change the shared state. The while loop re-verifies the condition on wake-up.

</details>

---

**Q106.** The producer/consumer problem uses TWO condition variables because:

- A) The standard requires it
- B) With one CV, a consumer might wake another consumer instead of a producer (or vice versa), causing deadlock
- C) Two CVs are faster
- D) One CV can't handle multiple waiters

<details>
<summary>Answer</summary>

**B.** One CV mixes producers and consumers. Signaling might wake the wrong type of thread. Two CVs (e.g., `fill` and `empty`) ensure producers always wake consumers and vice versa.

</details>

---

**Q107.** A semaphore initialized to 1 acts as:

- A) A counter for resources
- B) A lock (binary semaphore) — only one thread at a time passes
- C) An ordering mechanism
- D) A timer

<details>
<summary>Answer</summary>

**B.** Init=1: first sem_wait decrements to 0 (acquire); next sem_wait blocks. sem_post increments back to 1 (release). This is mutual exclusion — a lock.

</details>

---

**Q108.** A semaphore initialized to 0 is typically used for:

- A) Mutual exclusion
- B) Enforcing ordering — one thread waits until another signals (e.g., parent waits for child to finish)
- C) Counting connections
- D) Preventing deadlock

<details>
<summary>Answer</summary>

**B.** Init=0: sem_wait blocks immediately. Another thread must sem_post to release the waiter. This enforces "poster happens before waiter continues" — an ordering/synchronization pattern.

</details>

---

**Q109.** The four Coffman conditions for deadlock are:

- A) Starvation, priority inversion, lock, and wait
- B) Mutual exclusion, hold-and-wait, no preemption, circular wait
- C) Spin, sleep, signal, wait
- D) Deadlock, livelock, starvation, race

<details>
<summary>Answer</summary>

**B.** All four must hold simultaneously for deadlock. Break any one to prevent deadlock. The most common prevention technique targets circular wait via lock ordering.

</details>

---

**Q110.** The simplest practical strategy to prevent deadlock is:

- A) Use no locks at all
- B) Lock ordering — always acquire locks in the same global order (prevents circular wait)
- C) Kill deadlocked threads randomly
- D) Use only spin locks

<details>
<summary>Answer</summary>

**B.** Fix a total order on locks. If Lock A comes before Lock B in the order, every thread acquires A first. No thread holds B while waiting for A → no cycle → no deadlock.

</details>

---

## Part I: File Systems (Q111–Q120)

---

**Q111.** At the lowest level, a file is:

- A) A structured record
- B) A linear array of bytes, identified internally by an inode number
- C) A directory with child files
- D) A program

<details>
<summary>Answer</summary>

**B.** The OS doesn't interpret file contents — a file is just bytes. The inode number identifies it internally. Human names like "report.txt" are stored in directories, not in files themselves.

</details>

---

**Q112.** A directory is:

- A) A special kind of file containing (name, inode number) pairs
- B) Just a path string
- C) A hardware block on disk
- D) A system call

<details>
<summary>Answer</summary>

**A.** A directory is itself a file (stored on disk like any other), but its contents are a list of (name, inode) pairs. To resolve `/a/b/c`, the FS walks these mappings step by step.

</details>

---

**Q113.** A file descriptor is:

- A) The inode number of a file
- B) A small integer returned by open(), used per-process to refer to an open file session (tracking offset and inode)
- C) The path string to a file
- D) A physical disk sector

<details>
<summary>Answer</summary>

**B.** `open()` returns a small integer (fd). The OS internally associates it with data including the current offset and which inode. Subsequent read/write/lseek calls use the fd to identify the session.

</details>

---

**Q114.** A hard link:

- A) Is a separate file storing a path string
- B) Creates another directory entry pointing to the SAME inode (reference-counted; file deleted when refcount hits 0)
- C) Cannot be deleted
- D) Works across file systems

<details>
<summary>Answer</summary>

**B.** A hard link adds a name that maps to an existing inode. The inode tracks how many names point to it. Removing a name decrements the count; the file's data is freed only when count reaches 0.

</details>

---

**Q115.** A symbolic link:

- A) Is the same as a hard link
- B) Is a small file storing the path of the target; follows the path at access time; becomes "dangling" if the target is deleted
- C) Can only point to files in the same directory
- D) Cannot be deleted

<details>
<summary>Answer</summary>

**B.** A symlink contains a path string to another file. It can cross file systems (since it's just a path). If the target is deleted, the symlink still exists but points to nothing (dangling).

</details>

---

**Q116.** In the VSFS layout, the order of regions on disk is:

- A) Data region, inode table, bitmaps, superblock
- B) Superblock, inode bitmap, data bitmap, inode table, data region
- C) Inode table, data region, superblock, bitmaps
- D) Only superblock and data region

<details>
<summary>Answer</summary>

**B.** The superblock (FS metadata) comes first, followed by bitmaps tracking free/used inodes and data blocks, then the inode table holding all inodes, and finally the data region holding file contents.

</details>

---

**Q117.** An inode in VSFS contains:

- A) The file's name
- B) File metadata (type, size, permissions, timestamps, link count) + pointers to data blocks
- C) The directory hierarchy
- D) The file's raw contents only

<details>
<summary>Answer</summary>

**B.** The inode stores everything about a file EXCEPT its name (names live in directories). This includes metadata and the pointers (direct, indirect, double indirect) that locate the file's data blocks.

</details>

---

**Q118.** Why does an inode use 12 direct pointers plus indirect pointers (imbalanced design)?

- A) The standard requires it
- B) Most files are small — 12 direct pointers (48KB with 4KB blocks) handle them with a single inode read; large files rarely exist and pay extra I/O cost
- C) Direct pointers are faster than indirect pointers
- D) Indirect pointers don't work on SSDs

<details>
<summary>Answer</summary>

**B.** Optimizing for the common case: most files fit within direct pointers (no indirect I/O needed). Rare large files use indirect/double indirect pointers, paying extra cost. An imbalanced design that matches real-world file-size distributions.

</details>

---

**Q119.** The crash consistency problem arises because:

- A) Files cannot be written at all
- B) A single logical update requires multiple disk writes (data block, inode, bitmap) — a crash between them leaves the FS inconsistent
- C) Disks are unreliable
- D) File systems don't support writes

<details>
<summary>Answer</summary>

**B.** Example: appending a block updates 3 things on disk (data block, inode, bitmap). If the system crashes after writing 2 of 3, the FS is in a partially-updated, inconsistent state. Must be handled carefully.

</details>

---

**Q120.** Why is journaling faster than fsck for crash recovery?

- A) Journaling is stored in RAM
- B) fsck must scan the entire disk (minutes to hours on terabyte disks); journaling only replays the small journal, finding committed transactions in seconds
- C) Journaling doesn't actually recover — it just ignores errors
- D) fsck only works on empty disks

<details>
<summary>Answer</summary>

**B.** fsck = full disk scan: check every inode, block, directory. Unacceptably slow on modern large disks. Journaling: only the journal is scanned. Committed transactions (TxE on disk) are replayed; uncommitted ones are discarded. Recovery time is bounded and fast.

</details>

---
