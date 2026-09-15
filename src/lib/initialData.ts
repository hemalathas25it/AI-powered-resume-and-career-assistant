import { ResumeData, Task, CareerGoal, PortfolioProject, ATSAnalysis, InterviewQuestion } from '../types';

export const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "Alex Rivera",
    headline: "Senior Full-Stack Engineer | Distributed Systems & Modern Web",
    email: "alex.rivera.dev@example.com",
    phone: "+1 (555) 234-8901",
    location: "San Francisco, CA (Open to Remote)",
    linkedin: "https://linkedin.com/in/alexrivera-tech",
    github: "https://github.com/alexrivera-builds",
    portfolio: "https://alexrivera.dev",
  },
  summary: "Results-driven Senior Full-Stack Engineer with 6+ years of expertise architecting high-throughput distributed web applications, event-driven microservices, and modern user experiences using React, TypeScript, Node.js, and Cloud Infrastructure. Proven track record reducing system latencies by 42% and scaling SaaS platforms to 2M+ monthly active users.",
  experiences: [
    {
      id: "exp-1",
      company: "Apex Cloud Technologies",
      role: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      description: "Leading core platform services and real-time collaboration architecture.",
      highlights: [
        "Architected an event-driven notification & telemetry pipeline using Kafka and Redis, processing 14M+ daily events with sub-100ms end-to-end latency.",
        "Spearheaded the migration of monolithic Node.js backend to modular microservices on Kubernetes, improving deployment frequency by 300% and system uptime to 99.99%.",
        "Pioneered frontend performance overhaul with Next.js & Web Vitals optimizations, cutting Time-to-Interactive (TTI) by 45% and boosting checkout conversion by 3.8%."
      ]
    },
    {
      id: "exp-2",
      company: "Vanguard Digital Labs",
      role: "Full-Stack Software Engineer",
      location: "Austin, TX",
      startDate: "2019-06",
      endDate: "2022-02",
      current: false,
      description: "Developed customer-facing analytics dashboards and payment integration workflows.",
      highlights: [
        "Designed and implemented interactive real-time analytics dashboard with React, D3, and WebSockets, adopted by 85 enterprise accounts.",
        "Refactored complex PostgreSQL query execution plans and implemented multi-layer Redis caching, slashing p95 response times from 840ms to 120ms.",
        "Mentored 4 junior engineers and authored comprehensive testing guidelines, elevating automated CI unit & integration test coverage from 61% to 92%."
      ]
    },
    {
      id: "exp-3",
      company: "Elevate Systems",
      role: "Associate Frontend Developer",
      location: "San Jose, CA",
      startDate: "2018-01",
      endDate: "2019-05",
      current: false,
      description: "Built responsive user interfaces and internal operational tooling.",
      highlights: [
        "Developed 20+ accessible, reusable React UI components conforming to WCAG 2.1 AA standards across the core customer portal.",
        "Partnered with UX researchers to conduct A/B testing on onboarding funnels, resulting in a 14% uplift in trial-to-paid subscriber conversion."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2014-08",
      endDate: "2018-05",
      gpa: "3.82 / 4.0",
      honors: "Dean's Honor List, Magna Cum Laude"
    }
  ],
  skills: [
    {
      category: "Languages & Frameworks",
      items: ["TypeScript", "JavaScript (ESNext)", "Python", "Go", "React", "Next.js", "Node.js", "Express", "Tailwind CSS"]
    },
    {
      category: "Backend & Databases",
      items: ["PostgreSQL", "Redis", "MongoDB", "GraphQL", "RESTful APIs", "Kafka", "gRPC", "Prisma ORM"]
    },
    {
      category: "DevOps & Cloud",
      items: ["Docker", "Kubernetes", "AWS (ECS, Lambda, S3)", "Google Cloud", "CI/CD (GitHub Actions)", "Terraform", "Prometheus/Grafana"]
    },
    {
      category: "Architecture & Practices",
      items: ["Microservices", "Event-Driven Systems", "System Design", "Agile/Scrum", "TDD", "Clean Code", "Technical Leadership"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "PulseFlow - Real-Time Distributed Telemetry Engine",
      role: "Creator & Lead Architect",
      description: "High-throughput open-source time-series telemetry aggregator and alert dispatcher.",
      techStack: ["Go", "TypeScript", "Redis Streams", "React", "Docker"],
      link: "https://pulseflow.dev",
      github: "https://github.com/alexrivera-builds/pulseflow",
      highlights: [
        "Handles 50,000 metrics/sec ingestion with minimal CPU memory footprint (<80MB).",
        "Featured on Hacker News front page; earned 1,400+ GitHub stars."
      ]
    },
    {
      id: "proj-2",
      title: "SynapseDoc - Collaborative Real-Time Markdown Workspace",
      role: "Full-Stack Developer",
      description: "CRDT-based offline-first collaborative editor with real-time peer presence and conflict resolution.",
      techStack: ["React", "TypeScript", "Yjs", "WebSockets", "Node.js"],
      link: "https://synapsedoc.app",
      github: "https://github.com/alexrivera-builds/synapsedoc",
      highlights: [
        "Employed Yjs CRDTs for seamless multi-user conflict-free editing across unsteady mobile networks.",
        "Benchmarked zero-latency typing experience with client-side optimistic updates."
      ]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023-08",
      credentialId: "AWS-SAA-98214"
    },
    {
      id: "cert-2",
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation (CNCF)",
      issueDate: "2024-02",
      credentialId: "CKA-77319"
    }
  ]
};

export const initialATSAnalysis: ATSAnalysis = {
  atsScore: 89,
  summary: "Exceptional technical profile with strong metric-driven accomplishments and clear modern stack alignment for Senior/Staff roles.",
  strengths: [
    "High density of quantified results (e.g. 42% latency cut, 14M daily events, 99.99% uptime).",
    "Clear architectural vocabulary demonstrating system-level ownership (event-driven, Kubernetes, Kafka, Next.js).",
    "Clean chronological structure with consistent typography and standard ATS headings."
  ],
  improvements: [
    "Target keywords for Staff-level roles like 'Strategic Roadmap', 'Cross-organizational Mentorship', and 'Budget Optimization' could be strengthened.",
    "Ensure earliest work experience bullets focus on impact rather than team assistance."
  ],
  actionVerbScore: 92,
  quantifiableMetricsScore: 88,
  formattingScore: 96,
  matchedKeywords: [
    "Distributed Systems", "Kubernetes", "TypeScript", "Microservices",
    "Event-Driven", "Kafka", "PostgreSQL", "Next.js", "Redis", "Cloud Architecture"
  ],
  missingKeywords: [
    "Staff Leadership", "Vendor Evaluation", "Capacity Planning", "SOC2 Compliance"
  ],
  bulletEnhancements: [
    {
      original: "Developed 20+ accessible, reusable React UI components across the core portal.",
      suggested: "Engineered scalable design system with 20+ WCAG 2.1 AA accessible React components, accelerating team feature delivery speed by 35%.",
      rationale: "Quantifies the business delivery velocity increase and emphasizes design system leadership."
    },
    {
      original: "Leading core platform services and real-time collaboration architecture.",
      suggested: "Directing technical roadmap for 4 core platform microservices, sustaining 99.99% SLA across 2M+ active global sessions.",
      rationale: "Uses active executive verbs and includes uptime SLA and scale metrics."
    }
  ]
};

export const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Tailor Resume Summary for Staff Systems Role at Stripe",
    description: "Incorporate payment rail keywords, high-availability architecture metrics, and distributed consensus experience.",
    category: "application",
    priority: "urgent",
    status: "todo",
    dueDate: "2026-09-17",
    estimatedMinutes: 45,
    aiSuggested: true,
    aiReasoning: "Application window closes in 48 hours; recruiter screen tentatively scheduled.",
    createdAt: "2026-09-14"
  },
  {
    id: "task-2",
    title: "Mock System Design: Distributed Rate Limiter & Token Bucket",
    description: "Practice sliding window counter algorithm, Redis cluster persistence, and client token coordination.",
    category: "interview",
    priority: "high",
    status: "in-progress",
    dueDate: "2026-09-18",
    estimatedMinutes: 60,
    aiSuggested: false,
    createdAt: "2026-09-13"
  },
  {
    id: "task-3",
    title: "Reach out to 2 Alumni at Datadog for Referral",
    description: "Draft personalized LinkedIn message referencing recent distributed tracing blog post.",
    category: "networking",
    priority: "high",
    status: "todo",
    dueDate: "2026-09-19",
    estimatedMinutes: 30,
    aiSuggested: true,
    aiReasoning: "Employee referrals increase interview conversion rate by 4.2x compared to cold applications.",
    createdAt: "2026-09-14"
  },
  {
    id: "task-4",
    title: "Deploy Live Benchmarks to PulseFlow Documentation",
    description: "Record k6 load test results (100k req/sec) and embed interactive latency graphs in README.",
    category: "portfolio",
    priority: "medium",
    status: "completed",
    dueDate: "2026-09-15",
    estimatedMinutes: 90,
    aiSuggested: false,
    createdAt: "2026-09-12"
  },
  {
    id: "task-5",
    title: "Review STAR stories for 'Managing Cross-functional Conflict'",
    description: "Refine talking points for the product roadmap dispute at Apex Cloud with quantified resolution.",
    category: "interview",
    priority: "medium",
    status: "todo",
    dueDate: "2026-09-20",
    estimatedMinutes: 40,
    aiSuggested: true,
    aiReasoning: "Behavioral rounds frequently filter out candidates who cannot articulate compromise with product managers.",
    createdAt: "2026-09-14"
  },
  {
    id: "task-6",
    title: "Deep Dive: Go Memory Allocation & Garbage Collector Tuning",
    description: "Read official Go runtime specs on escape analysis and ballast allocation patterns.",
    category: "skill",
    priority: "low",
    status: "todo",
    dueDate: "2026-09-24",
    estimatedMinutes: 75,
    aiSuggested: false,
    createdAt: "2026-09-11"
  }
];

export const initialCareerGoal: CareerGoal = {
  id: "goal-1",
  title: "Transition to Staff Software Engineer / Tech Lead",
  targetRole: "Staff Software Engineer / Engineering Lead",
  currentRole: "Senior Software Engineer",
  targetSalary: "$210,000 - $260,000 Base + Equity",
  timeline: "Q1 - Q3 2027",
  overallProgress: 68,
  milestones: [
    {
      id: "m-1",
      title: "Scale Open-Source PulseFlow & Author Tech Paper",
      targetQuarter: "Q4 2026",
      status: "completed",
      progress: 100,
      keyDeliverables: [
        "Achieved 1,400+ GitHub stars",
        "Authored blog on zero-copy Redis streaming read by 25k engineers"
      ]
    },
    {
      id: "m-2",
      title: "Master High-Scale System Architecture & Distributed Consensus",
      targetQuarter: "Q1 2027",
      status: "in-progress",
      progress: 75,
      keyDeliverables: [
        "Completed 15 advanced system design mock loops",
        "Deep-dived Raft and Paxos consensus models in Go"
      ]
    },
    {
      id: "m-3",
      title: "Executive Behavioral & Staff Leadership Interview Mastery",
      targetQuarter: "Q2 2027",
      status: "in-progress",
      progress: 50,
      keyDeliverables: [
        "Documented 8 structured STAR case studies for multi-team alignment",
        "Conduct 4 mock interviews with calibrated Staff Bar Raisers"
      ]
    },
    {
      id: "m-4",
      title: "Targeted Pipeline: 6 Tier-1 Staff Interviews & Offer Negotiation",
      targetQuarter: "Q3 2027",
      status: "pending",
      progress: 20,
      keyDeliverables: [
        "Secure warm referrals at Stripe, Datadog, Cloudflare, and Airbnb",
        "Negotiate competitive multi-offer package exceeding target band"
      ]
    }
  ],
  skillGaps: [
    { skill: "Organizational Influence & Multi-Team Alignment", currentLevel: 7, targetLevel: 9, priority: "critical" },
    { skill: "Large-Scale Distributed Consensus & Partitioning", currentLevel: 8, targetLevel: 9, priority: "high" },
    { skill: "Budgetary & Cloud Infrastructure Cost Governance", currentLevel: 6, targetLevel: 8, priority: "medium" },
    { skill: "Engineering Mentorship & Sponsorship Programs", currentLevel: 7, targetLevel: 9, priority: "high" }
  ]
};

export const initialProjects: PortfolioProject[] = [
  {
    id: "port-1",
    name: "PulseFlow",
    tagline: "Ultra-low-latency real-time distributed telemetry engine",
    description: "An event-driven time-series metrics aggregator built in Go and TypeScript that ingests 50k events/sec with sub-millisecond dispatch.",
    techStack: ["Go", "TypeScript", "Redis Streams", "React", "Docker", "Prometheus"],
    status: "completed",
    demoUrl: "https://pulseflow.dev",
    githubUrl: "https://github.com/alexrivera-builds/pulseflow",
    stars: 1420,
    impactMetrics: [
      "50,000 req/sec sustained throughput",
      "< 1.2ms p99 ingestion latency",
      "1,400+ GitHub community stars"
    ],
    resumeBullets: [
      "Architected PulseFlow, an open-source distributed telemetry aggregator in Go, achieving 50K event/sec throughput with sub-2ms latency.",
      "Engineered memory-optimized streaming ring-buffers reducing GC pauses by 80% under peak load conditions."
    ]
  },
  {
    id: "port-2",
    name: "SynapseDoc",
    tagline: "Offline-first collaborative document editor with CRDTs",
    description: "Peer-to-peer and client-server collaborative editor utilizing Yjs conflict-free replicated data types, WebSockets, and encrypted local persistence.",
    techStack: ["React", "TypeScript", "Yjs", "WebSockets", "Node.js", "IndexedDB"],
    status: "completed",
    demoUrl: "https://synapsedoc.app",
    githubUrl: "https://github.com/alexrivera-builds/synapsedoc",
    stars: 480,
    impactMetrics: [
      "Zero merge conflicts across 100+ concurrent typers",
      "Full offline sync with optimistic UI updates"
    ],
    resumeBullets: [
      "Built SynapseDoc, an offline-first collaborative rich-text editor using CRDTs (Yjs) and WebSockets, enabling real-time multi-cursor collaboration.",
      "Optimized DOM rendering with virtualized node trees, maintaining 60 FPS scrolling across documents exceeding 50,000 words."
    ]
  },
  {
    id: "port-3",
    name: "Aegis Gate",
    tagline: "Intelligent API Rate Limiter & Token Bucket Proxy",
    description: "Reverse proxy middleware with adaptive rate limiting, DDoS anomaly detection, and Redis distributed lock algorithms.",
    techStack: ["Go", "Redis", "eBPF", "gRPC", "Grafana"],
    status: "in-development",
    githubUrl: "https://github.com/alexrivera-builds/aegis-gate",
    impactMetrics: [
      "Under 0.4ms proxy overhead",
      "Supports 10M token bucket rules across clusters"
    ],
    resumeBullets: [
      "Developing Aegis Gate, a high-throughput Go reverse proxy implementing sliding window counter algorithms with distributed Redis state."
    ]
  }
];

export const initialInterviewQuestions: InterviewQuestion[] = [
  {
    id: "q-1",
    type: "Behavioral (Leadership & Influence)",
    question: "Describe a situation where you had to influence technical direction without having direct organizational authority over the team.",
    starTips: "Situation: complex initiative. Task: align hesitant stakeholders. Action: data benchmarks, interactive prototype, collaborative RFC. Result: successful adoption & team buy-in.",
    sampleAnswer: "At Apex Cloud, our infrastructure squad was hesitant to adopt Kubernetes for our microservices due to migration overhead. Rather than pushing top-down mandate, I built a 3-day proof-of-concept for one low-risk service, documented the automated zero-downtime deploy pipeline, and presented verifiable metrics showing 70% faster deployments. The team unanimously voted to adopt the blueprint across all 12 services over the next two quarters.",
    keyEvaluationCriteria: ["Empathetic communication", "De-risking through prototyping", "Data-driven advocacy", "Cross-functional humility"]
  },
  {
    id: "q-2",
    type: "System Architecture & Scalability",
    question: "How would you design a distributed, idempotent payment processing system that prevents double charges during network timeouts?",
    starTips: "Address client-generated UUID idempotency keys, atomic Redis distributed locking, transactional outbox pattern, and reconciliation jobs.",
    sampleAnswer: "I would mandate an Idempotency-Key header on all charge requests. The API gateway validates this key against an atomic Redis distributed lock with a 60-second TTL. The payment state is written in a single database transaction with 'PENDING' status using an Outbox table before calling the external payment gateway (e.g. Stripe). If a network timeout occurs, subsequent retries hit the cached transaction state rather than charging again.",
    keyEvaluationCriteria: ["Consistency vs Availability tradeoffs", "Idempotency key lifecycle", "Failure recovery & reconciliation"]
  },
  {
    id: "q-3",
    type: "Technical Problem Solving (Failure & Post-Mortem)",
    question: "Tell me about a time you introduced a critical bug into production. How did you triage it, remediate it, and prevent recurrence?",
    starTips: "Own the mistake directly without blaming others. Detail your fast rollback decision, blameless post-mortem, and systemic automated safeguard created.",
    sampleAnswer: "During a major release, an unindexed database query in my pull request caused CPU spikes to 100% on our primary PostgreSQL instance during Monday morning traffic peak. I identified the slow query within 4 minutes, executed our rollback procedure, and restored normal service within 7 minutes. In our blameless post-mortem, I added automated CI linting with pg_stat_statements query analysis that flags any new query missing index coverage before merge.",
    keyEvaluationCriteria: ["Speed of triage", "Psychological safety & blameless culture", "Systemic automation vs manual checklists"]
  }
];
