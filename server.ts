import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const PORT = 3000;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // AI Chat endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history = [], context = {} } = req.body;
      const ai = getGenAI();

      if (!ai) {
        // Fallback intelligent simulated assistant when no API key is yet configured
        const fallbackReply = generateFallbackChatReply(message, context);
        return res.json({ reply: fallbackReply.text, suggestions: fallbackReply.suggestions });
      }

      const systemInstruction = `You are "CareerCraft Copilot", an elite AI Career Strategist, Executive Resume Writer, and Interview Coach.
You provide high-impact, actionable, and personalized career advice.
Current User Context:
- Current / Target Role: ${context.targetRole || context.currentRole || 'Software Engineer / Tech Professional'}
- ATS Resume Score: ${context.atsScore ?? 'Not yet calculated'}/100
- Active Tasks Count: ${context.tasksCount ?? 0}
- Career Goals: ${JSON.stringify(context.goals || [])}
- Primary Mode: ${context.mode || 'general'} (options: 'resume', 'prioritization', 'interview', 'goals', 'summary')

Guidelines:
1. Always be constructive, metric-driven (encourage Google's XYZ formula: Accomplished [X], measured by [Y], by doing [Z]).
2. Format responses with clean Markdown, bold highlights, bullet points, and practical next steps.
3. For interview practice: evaluate answers using the STAR method (Situation, Task, Action, Result) with constructive critique.
4. Keep responses punchy, encouraging, and tailored to modern hiring bars.
5. Provide 2-3 quick follow-up prompt suggestions at the very end formatted as:
---SUGGESTIONS---
["Suggestion 1", "Suggestion 2", "Suggestion 3"]`;

      const promptContent = `User History:
${history.slice(-4).map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n')}

User Question: ${message}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContent,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const fullText = response.text || "I'm here to help you advance your career. Could you please specify your question?";
      
      let replyText = fullText;
      let suggestions: string[] = [
        "How can I tailor my resume for a Senior role?",
        "Give me a behavioral interview question",
        "Help me prioritize today's career tasks"
      ];

      if (fullText.includes('---SUGGESTIONS---')) {
        const parts = fullText.split('---SUGGESTIONS---');
        replyText = parts[0].trim();
        try {
          const parsed = JSON.parse(parts[1].trim());
          if (Array.isArray(parsed)) suggestions = parsed;
        } catch {
          // keep defaults
        }
      }

      return res.json({ reply: replyText, suggestions });
    } catch (error: any) {
      console.error('Chat error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to process AI chat request',
      });
    }
  });

  // Resume ATS Analyzer endpoint
  app.post('/api/ai/analyze-resume', async (req, res) => {
    try {
      const { resume, targetRole = 'Software Engineer', targetJobDescription = '' } = req.body;
      const ai = getGenAI();

      if (!ai) {
        const fallback = generateFallbackResumeAnalysis(resume, targetRole);
        return res.json(fallback);
      }

      const prompt = `Analyze this resume critically for ATS compatibility, impact verbs, metrics, and role fit for "${targetRole}".
Target Job Description / Industry Keywords: ${targetJobDescription || 'Standard modern tech industry benchmark'}

Resume Content:
${JSON.stringify(resume, null, 2)}

Return ONLY valid JSON matching this structure without markdown fences:
{
  "atsScore": 88,
  "summary": "Overall assessment statement (2-3 sentences)",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"],
  "actionVerbScore": 85,
  "quantifiableMetricsScore": 78,
  "formattingScore": 92,
  "matchedKeywords": ["React", "TypeScript", "System Architecture", "Cloud Infrastructure"],
  "missingKeywords": ["Kubernetes", "GraphQL", "CI/CD Pipeline Optimization"],
  "bulletEnhancements": [
    {
      "original": "Worked on the API to make it faster",
      "suggested": "Architected and optimized high-throughput RESTful endpoints using Redis caching, reducing p99 response latency by 42%",
      "rationale": "Incorporated measurable metrics and specific architectural methods using Google XYZ formula."
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('Analyze resume error:', error);
      const fallback = generateFallbackResumeAnalysis(req.body.resume, req.body.targetRole);
      return res.json(fallback);
    }
  });

  // Optimize Single Bullet Point
  app.post('/api/ai/optimize-bullet', async (req, res) => {
    try {
      const { bullet, role = 'Software Engineer', context = '' } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          optimized: `Spearheaded ${bullet.toLowerCase().replace(/^managed |^worked on |^helped /, '')}, resulting in a 35% efficiency increase across cross-functional engineering teams.`,
          alternatives: [
            `Architected and deployed scalable solution for ${bullet}, boosting system reliability to 99.98% uptime.`,
            `Partnered with product stakeholders to deliver ${bullet}, driving $140K in annual operational savings.`
          ],
          formulaBreakdown: {
            actionVerb: "Spearheaded",
            metric: "35% efficiency increase",
            context: "Cross-functional engineering workflow"
          }
        });
      }

      const prompt = `Rewrite this resume bullet point using Google's XYZ formula (Accomplished [X], measured by [Y], by doing [Z]).
Target Role: ${role}
Context: ${context}
Original Bullet: "${bullet}"

Return ONLY valid JSON matching this schema:
{
  "optimized": "Primary polished bullet string with strong action verb and quantified metric",
  "alternatives": ["Alternative variation 1", "Alternative variation 2"],
  "formulaBreakdown": {
    "actionVerb": "string",
    "metric": "string",
    "context": "string"
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('Optimize bullet error:', error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Prioritize Tasks
  app.post('/api/ai/prioritize-tasks', async (req, res) => {
    try {
      const { tasks, careerGoals = [] } = req.body;
      const ai = getGenAI();

      if (!ai || !tasks || tasks.length === 0) {
        return res.json({
          summary: "Tasks prioritized based on application deadlines, interview readiness, and high-leverage skill building.",
          prioritizedTasks: (tasks || []).map((t: any, idx: number) => ({
            id: t.id,
            suggestedPriority: idx === 0 ? 'urgent' : idx < 3 ? 'high' : 'medium',
            score: Math.max(95 - idx * 8, 40),
            aiReasoning: t.category === 'interview' ? 'Immediate direct payoff for upcoming recruiting rounds.' : 'Compounds career progress.',
            suggestedAction: `Allocate 45 minutes of focused deep work to make tangible progress on "${t.title}".`
          }))
        });
      }

      const prompt = `Act as an executive productivity coach. Prioritize these career and job search tasks based on career goals: ${JSON.stringify(careerGoals)}.
Tasks:
${JSON.stringify(tasks, null, 2)}

Return ONLY valid JSON:
{
  "summary": "1-2 sentence high level rationale explaining current focus",
  "prioritizedTasks": [
    {
      "id": "task-id",
      "suggestedPriority": "urgent" | "high" | "medium" | "low",
      "score": 95,
      "aiReasoning": "Why this task should be done first",
      "suggestedAction": "Concrete next step to execute immediately"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('Prioritize tasks error:', error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Generate Career Goals & Milestones
  app.post('/api/ai/generate-goals', async (req, res) => {
    try {
      const { currentRole, targetRole, timelineMonths = 6, focusAreas = [] } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          title: `Roadmap from ${currentRole} to ${targetRole}`,
          timelineMonths,
          targetSalaryRange: "$150,000 - $185,000",
          milestones: [
            {
              id: "m1",
              title: "System Design & Architecture Mastery",
              targetQuarter: "Month 1-2",
              status: "in-progress",
              progress: 45,
              keyDeliverables: ["Complete distributed systems design case studies", "Build proof-of-concept event-driven service"]
            },
            {
              id: "m2",
              title: "High-Impact Portfolio Project",
              targetQuarter: "Month 3-4",
              status: "pending",
              progress: 10,
              keyDeliverables: ["Publish production-grade open-source repo with benchmarks", "Deploy live demo on Cloud Run"]
            },
            {
              id: "m3",
              title: "Mock Interviews & Targeted Applications",
              targetQuarter: "Month 5-6",
              status: "pending",
              progress: 0,
              keyDeliverables: ["Complete 12 mock technical & behavioral loops", "Submit 25 curated referrals"]
            }
          ],
          skillGaps: [
            { skill: "Cloud Native Architecture", currentLevel: 6, targetLevel: 9, priority: "critical" },
            { skill: "Technical Leadership & Mentorship", currentLevel: 5, targetLevel: 8, priority: "high" },
            { skill: "Performance Profiling & Observability", currentLevel: 7, targetLevel: 9, priority: "medium" }
          ]
        });
      }

      const prompt = `Generate a realistic, high-impact career development plan from "${currentRole}" to "${targetRole}" over ${timelineMonths} months.
Focus Areas: ${focusAreas.join(', ')}

Return ONLY valid JSON:
{
  "title": "Roadmap title",
  "timelineMonths": ${timelineMonths},
  "targetSalaryRange": "$X - $Y",
  "milestones": [
    {
      "id": "m1",
      "title": "Milestone title",
      "targetQuarter": "Month 1-2",
      "status": "pending",
      "progress": 0,
      "keyDeliverables": ["Deliverable 1", "Deliverable 2"]
    }
  ],
  "skillGaps": [
    { "skill": "Skill name", "currentLevel": 5, "targetLevel": 9, "priority": "critical" }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('Generate goals error:', error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Interview Prep Questions Generator & Grader
  app.post('/api/ai/interview-prep', async (req, res) => {
    try {
      const { targetRole = 'Senior Software Engineer', topic = 'Behavioral & System Design', userExperience = '' } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          role: targetRole,
          questions: [
            {
              id: "q1",
              type: "Behavioral (Leadership)",
              question: "Tell me about a time you had a fundamental technical disagreement with a senior teammate or tech lead. How did you resolve it?",
              starTips: "Situation: brief context. Task: what was at stake. Action: how you used data, prototypes, and respectful communication. Result: positive outcome and relationship preserved.",
              sampleAnswer: "At my previous company, we were deciding between monolithic GraphQL aggregation vs microservice gRPC endpoints. I built a 2-day benchmark comparing latency and developer ergonomic friction, presented data objectively, and aligned the team on a hybrid gateway approach.",
              keyEvaluationCriteria: ["Ego-free communication", "Data-driven advocacy", "Alignment with company goals"]
            },
            {
              id: "q2",
              type: "System Architecture",
              question: "How would you design a real-time notification engine supporting 50 million daily active users with sub-second delivery?",
              starTips: "Define requirements, estimate QPS and storage, select WebSocket/SSE protocols, message broker (Kafka/RabbitMQ), and fallback delivery mechanisms.",
              sampleAnswer: "I would divide the architecture into Ingestion Gateway, Fanout Router (Kafka topics partitioned by user cluster), Connection Pool servers managing WebSockets with Redis Pub/Sub, and an archival worker pool.",
              keyEvaluationCriteria: ["Scalability bounds", "Partitioning strategy", "Failure handling & retries"]
            },
            {
              id: "q3",
              type: "Project Impact",
              question: "Describe your proudest technical achievement where you directly influenced key business metrics.",
              starTips: "Lead with the metric outcome early, then describe the engineering complexity and team leadership required.",
              sampleAnswer: "Led the migration of our legacy checkout pipeline, reducing cart abandonment drop-offs by 18% and generating $1.2M incremental revenue within two quarters.",
              keyEvaluationCriteria: ["Business metric awareness", "Technical execution depth", "Ownership"]
            }
          ]
        });
      }

      const prompt = `Generate 4 top-tier interview practice questions for a candidate targeting "${targetRole}" specializing in "${topic}".
Candidate Background Summary: ${userExperience || 'Modern software development background'}

Return ONLY valid JSON matching this schema:
{
  "role": "${targetRole}",
  "questions": [
    {
      "id": "q1",
      "type": "Behavioral / Technical / System Design",
      "question": "The question prompt",
      "starTips": "How to structure an elite response using STAR",
      "sampleAnswer": "A benchmark high-scoring answer sample",
      "keyEvaluationCriteria": ["Criterion 1", "Criterion 2", "Criterion 3"]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('Interview prep error:', error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // In express 4.x:
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerCraft AI Server running on http://0.0.0.0:${PORT}`);
  });
}

function generateFallbackResumeAnalysis(resume: any, targetRole: string) {
  return {
    atsScore: 84,
    summary: `Your resume demonstrates strong technical depth for ${targetRole}. With minor formatting optimization and adding quantified outcomes to recent work experiences, your ATS match will exceed 92%.`,
    strengths: [
      "Clear chronological progression with recognizable modern tech stack",
      "Strong foundational skills in cloud computing, frontend, and API design",
      "Well-structured education and project credentials"
    ],
    improvements: [
      "3 bullet points lack quantifiable business metrics (e.g. latency, revenue, conversion)",
      "Add stronger action verbs such as 'Architected', 'Orchestrated', and 'Optimized'",
      "Include target keywords from recent job postings (e.g., CI/CD, Microservices)"
    ],
    actionVerbScore: 82,
    quantifiableMetricsScore: 76,
    formattingScore: 94,
    matchedKeywords: ["React", "TypeScript", "Node.js", "REST APIs", "Git", "Cloud Infrastructure"],
    missingKeywords: ["Distributed Systems", "Kubernetes", "Automated Testing", "Observability"],
    bulletEnhancements: [
      {
        original: resume?.experiences?.[0]?.highlights?.[0] || "Worked on migrating the core database to improve stability",
        suggested: "Engineered seamless zero-downtime migration of core PostgreSQL database to AWS Aurora, enhancing query throughput by 38% and saving $45K annually",
        rationale: "Quantified metric, specified modern tooling, and highlighted business cost impact."
      },
      {
        original: resume?.experiences?.[0]?.highlights?.[1] || "Helped build frontend components using React and TypeScript",
        suggested: "Spearheaded creation of shared design system with 30+ reusable React components, accelerating feature velocity across 4 cross-functional squads by 25%",
        rationale: "Transformed passive contribution into leadership impact and developer productivity metrics."
      }
    ]
  };
}

function generateFallbackChatReply(message: string, context: any) {
  const lower = message.toLowerCase();
  if (lower.includes('interview') || lower.includes('mock') || lower.includes('star')) {
    return {
      text: `### 🎯 Mock Interview & STAR Coaching
Great! When answering behavioral questions for **${context.targetRole || 'Engineering'}** roles, structure your response using the **STAR Method**:

1. **Situation**: Set the scene in 1-2 sentences. What was the company context, customer problem, or technical bottleneck?
2. **Task**: What was *your* explicit responsibility or assignment?
3. **Action**: The meat of your answer (~60%). Detail the technical decisions, stakeholder communication, and hurdles you navigated.
4. **Result**: Quantify the outcome (e.g., *latency reduced by 40%*, *delivered 2 weeks ahead of schedule*).

**Try practicing this question right now:**
> *"Tell me about a project that didn't go according to plan and how you adapted."*

Would you like me to evaluate your draft response?`,
      suggestions: [
        "I'm ready with my answer",
        "Give me a technical system design question",
        "Show me a top-tier STAR answer example"
      ]
    };
  }

  if (lower.includes('prioritize') || lower.includes('task')) {
    return {
      text: `### ⚡ Career Task Prioritization Strategy
To maximize your hiring momentum this week, I recommend applying the **Impact vs. Immediacy Matrix**:

- **🔥 Priority 1: High-Leverage Pipeline (Today)**
  - Reach out to 3 engineering peers or recruiters for internal referrals.
  - Tailor your resume summary & top 3 bullets for your target role: **${context.targetRole || 'Senior Engineer'}**.
- **🎯 Priority 2: Interview Readiness (Next 48h)**
  - Practice 1 system design walkthrough (e.g., Rate Limiter or Notification Service).
  - Polish your STAR stories for leadership and conflict resolution.
- **📚 Priority 3: Skill Compounding (Weekly)**
  - Complete 1 milestone on your active portfolio project.

Would you like me to automatically sort your current task backlog?`,
      suggestions: [
        "Prioritize my pending tasks now",
        "How do I ask for a referral effectively?",
        "Help me improve my resume bullets"
      ]
    };
  }

  return {
    text: `### 🚀 CareerCraft Copilot
I've analyzed your career profile for **${context.targetRole || 'your target role'}**.

Here is how we can accelerate your trajectory today:
- **Resume Optimization**: Boost your ATS score (currently ~${context.atsScore ?? 84}%) by infusing quantified business metrics and Google's XYZ formula.
- **Task Prioritization**: Focus on high-conversion job search activities (referrals, tailored submissions, active interview prep).
- **Interview Simulation**: Run realistic technical or behavioral rounds with instant STAR feedback.
- **Milestone Tracking**: Track your quarterly skill and portfolio goals.

What would you like to work on first?`,
    suggestions: [
      "Review my resume's weakest bullet points",
      "Generate interview questions for my target role",
      "Help me plan my quarterly career milestones"
    ]
  };
}

startServer();
