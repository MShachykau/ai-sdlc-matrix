import type {
  MatrixData,
  MatrixCell,
  SDLCPhase,
  Role,
  InvolvementType,
} from "./types";

// ─── Developer × Development (seed data — exact) ─────────────────────────────
const developerDevelopmentCell: MatrixCell = {
  phase: "development",
  role: "developer",
  involvement: "lead",
  cards: {
    "ai-enabled": {
      title: "Feature development with AI assistant",
      tools: [
        {
          name: "GitHub Copilot",
          description:
            "In-IDE autocomplete and chat — works without switching your editor.",
          url: "https://github.com/features/copilot",
        },
        {
          name: "Cursor",
          description:
            "AI-native editor (VS Code fork) — understands the whole repo, edits multiple files at once.",
          url: "https://cursor.com",
        },
        {
          name: "Claude / ChatGPT",
          description:
            "For complex architecture questions, debugging, and understanding unfamiliar code.",
          url: "https://claude.ai",
        },
        {
          name: "Tabnine",
          description:
            "Privacy-first Copilot alternative — can run locally, no code leaves your machine.",
          url: "https://tabnine.com",
        },
      ],
      links: [
        {
          title: "GitHub Copilot vs Cursor: The Real Comparison (2026)",
          url: "https://www.digitalocean.com/resources/articles/github-copilot-vs-cursor",
          type: "article",
          duration: "10 min",
          why: "Understand the difference and when to choose which tool",
        },
        {
          title: "The Reality of AI-Assisted Software Engineering",
          url: "https://addyo.substack.com/p/the-reality-of-ai-assisted-software",
          type: "article",
          duration: "15 min",
          why: "Real data on where AI helps and where it slows you down",
        },
        {
          title: "Best Practices for AI-Assisted Coding",
          url: "https://engineering.axur.com/2025/05/09/best-practices-for-ai-assisted-coding.html",
          type: "article",
          duration: "8 min",
          why: "TDD workflow with AI agents — concrete and battle-tested",
        },
        {
          title: "AI For Developers: GitHub Copilot, Cursor & ChatGPT",
          url: "https://www.udemy.com/course/ai-for-developers-with-github-copilot-cursor-ai-chatgpt/",
          type: "course",
          duration: "5 h",
          why: "Hands-on practice, updated Jan 2026",
        },
      ],
      practices: [
        "Delegate boilerplate and template code (routers, models, CRUD, configs) — write only what requires business logic",
        "Write tests before the feature — let AI generate unit tests, verify they fail, then ask for implementation",
        "Give context, not commands — share the file, architecture, and goal; more context = more accurate output",
        "Generate in small increments — never ask for a whole module at once; review and commit each step",
        "Use AI for debugging — paste code + problem description + context; AI spots bugs you've been staring at for an hour",
      ],
      expectations: {
        minimum:
          "At least one AI tool installed and used in IDE. Know how to accept or reject a suggestion.",
        normal:
          "Consciously review all AI-generated code. Use chat for debugging and test generation.",
        advanced:
          "Build project-specific prompts with repo context, team style, and linter rules. Share effective prompts with the team.",
      },
      antipatterns: [
        "Don't accept AI code without review — AI doesn't understand your security context and can hardcode secrets, miss race conditions, or generate vulnerable patterns",
        "Don't generate large chunks and hope they work — hidden bugs surface in prod; small increments + tests are mandatory",
        "Don't use AI as a substitute for understanding — if you can't explain what the generated code does, it's still your responsibility in review and incidents",
      ],
    },
    "ai-first": {
      title: "AI as co-author: you set tasks, the agent builds solutions",
      shift:
        "You stop writing code line by line and start delegating entire tasks. Your role shifts to formulating goals, providing context, and reviewing output. The agent handles implementation.",
      tools: [
        {
          name: "Cursor Agent Mode",
          badge: "key",
          description:
            "Autonomously plans and edits across multiple files from a single task description. Use Plan Mode to see the full plan before any changes are made.",
          url: "https://cursor.com/blog/agent-best-practices",
        },
        {
          name: "GitHub Copilot Coding Agent",
          badge: "key",
          description:
            "Assign a GitHub Issue to Copilot — it plans, commits, and opens a draft PR. You review it like any other pull request.",
          url: "https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent",
        },
        {
          name: "AGENTS.md / .cursorrules",
          badge: "key",
          description:
            "File at the repo root with instructions for agents: code style, test strategy, build commands. A shared standard for the whole team across all AI tools.",
          url: "https://agents.md",
        },
        {
          name: "Claude Code",
          badge: "key",
          description:
            "CLI agent for long-running tasks: refactoring, migrations, changes across multiple modules. Reads CLAUDE.md for project context.",
          url: "https://claude.ai/code",
        },
      ],
      links: [
        {
          title: "Best practices for coding with agents",
          url: "https://cursor.com/blog/agent-best-practices",
          type: "docs",
          duration: "10 min",
          why: "Official guide: Plan Mode, Rules, Slash Commands, and how to review agent-generated code",
        },
        {
          title: "GitHub Copilot Coding Agent 101",
          url: "https://github.blog/ai-and-ml/github-copilot/github-copilot-coding-agent-101-getting-started-with-agentic-workflows-on-github/",
          type: "article",
          duration: "8 min",
          why: "How the agentic workflow works end-to-end: Issues → background execution → draft PR",
        },
        {
          title: "How to write PRDs for AI Coding Agents",
          url: "https://medium.com/@haberlah/how-to-write-prds-for-ai-coding-agents-d60d72efb797",
          type: "article",
          duration: "12 min",
          why: "How to write tasks so agents understand them and execute them correctly — covers all major platforms",
        },
        {
          title: "How to Setup a Dev Workflow Using Cursor with Agents",
          url: "https://www.bishoylabib.com/posts/cursor-agents-workflow-setup",
          type: "article",
          duration: "10 min",
          why: "Step-by-step AGENTS.md setup + branching strategy + CI integration for agentic workflows",
        },
      ],
      practices: [
        "Create an AGENTS.md in the repository — capture code style, test strategy, build commands, and architectural constraints; this is both the agent's constitution and onboarding docs for new teammates",
        "Delegate whole tasks, not individual lines — describe what needs to be achieved and the acceptance criteria, not the implementation steps; use Plan Mode in Cursor to review the plan before execution starts",
        "Use TDD as a contract for the agent — ask the agent to write tests first and confirm they fail, then implement; the agent uses tests as a spec for self-correction",
        "Review agent PRs with the same rigour as human PRs — all agent commits require human approval before CI/CD runs; never merge just because the tests passed",
        "Watch the agent in real time — in Cursor use the diff view to see changes as they happen; if the agent goes off track, stop and redirect rather than waiting for it to finish",
      ],
      expectations: {
        minimum:
          "Uses agent mode for at least routine tasks: tests, documentation, refactoring. Has a configured AGENTS.md in the project.",
        normal:
          "Delegates features to the agent end-to-end. Reviews agent PRs with the same rigour as human PRs. Iterates via review comments.",
        advanced:
          "Tracks agent PR acceptance rate. Iterates on AGENTS.md based on real agent failures. Shares working patterns and prompt templates with the team.",
      },
      antipatterns: [
        "Do not merge just because the tests passed — the agent wrote both the code and the tests; they may all pass while testing the wrong thing entirely",
        "Do not run an agent without AGENTS.md and project context — without instructions the agent produces generic code that does not fit your architecture or team conventions",
        "Do not give the agent vague tasks — 'improve this module' is a bad task; 'add pagination to the /users endpoint, unit tests required, max 20 records per page' is a good one",
      ],
    },
    "ai-native": {
      title: "Developer as orchestrator: humans guide, agents build",
      shift:
        "You no longer write or review individual lines of code as your primary activity. You design the system of agents, define quality gates, resolve ambiguities, and own outcomes. AI is not a tool you use — it is the team you manage.",
      tools: [
        {
          name: "Multi-agent orchestration (CrewAI, LangGraph)",
          badge: "key",
          description:
            "Coordinate specialized agents across a full delivery pipeline — planning, implementation, testing, and documentation agents working in parallel.",
          url: "https://www.crewai.com",
        },
        {
          name: "Cursor Background Agents",
          badge: "key",
          description:
            "Run up to 8 agents in parallel on isolated git worktrees — each handles a different aspect of a feature without file conflicts.",
          url: "https://cursor.com",
        },
        {
          name: "GitHub Copilot Coding Agent + MCP",
          description:
            "Agents connected to external tools via MCP servers — ticket systems, monitoring, internal knowledge bases, all in one agentic loop.",
          url: "https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent",
        },
        {
          name: "Custom internal agent pipelines",
          description:
            "Team-built agents wired into CI/CD, issue trackers, and monitoring — triage bugs, update docs, and flag regressions automatically.",
        },
      ],
      links: [
        {
          title:
            "From DevOps to AutoOps: Will AI-Native SDLC Run Itself in 2026?",
          url: "https://www.nitorinfotech.com/blog/from-devops-to-autoops-will-ai-native-sdlc-run-itself-in-2026/",
          type: "article",
          duration: "15 min",
          why: "Where the industry is heading — multi-agent platforms, agentic workflows, and real delivery metrics",
        },
        {
          title: "Building an AI-Native Engineering Team",
          url: "https://developers.openai.com/codex/guides/build-ai-native-engineering-team",
          type: "article",
          duration: "20 min",
          why: "Practical breakdown of how AI agents change each SDLC phase, with real examples from OpenAI's own teams",
        },
        {
          title: "AI-SDLC Maturity Model",
          url: "https://eleks.com/blog/ai-sdlc-maturity-model/",
          type: "article",
          duration: "10 min",
          why: "Structured framework for understanding what AI-Native level actually requires from individuals and teams",
        },
        {
          title: "Unlocking the value of AI in software development",
          url: "https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/unlocking-the-value-of-ai-in-software-development",
          type: "article",
          duration: "15 min",
          why: "McKinsey research: what separates top-performing AI-native teams from average adopters — data-backed",
        },
      ],
      practices: [
        "Design tasks for agents first — write specs and acceptance criteria as structured, agent-readable prompts before any implementation begins; the spec is the deliverable at this level",
        "Own the orchestration layer — your primary value is wiring agents together, defining quality gates, and resolving ambiguities agents cannot handle; stop measuring yourself by lines of code written",
        "Build observability into every agent pipeline — every agent decision must be traceable; if you cannot explain why an agent made a change, you cannot own the outcome in a production incident",
        "Invest harder in domain expertise — agents amplify what you know; shallow understanding gets amplified equally, and the errors become harder to spot at scale",
        "Track agent quality metrics, not just output speed — measure PR acceptance rate, defect rate per agent, and rework rate; iterate on agent configuration based on data, not intuition",
      ],
      metrics: [
        { label: "PR acceptance rate", target: "> 70%" },
        { label: "Agent defect rate", target: "vs human baseline" },
        { label: "Rework per agent PR", target: "review iterations" },
      ],
      expectations: {
        minimum:
          "Understands multi-agent concepts and can configure and run existing agent pipelines for a feature domain.",
        normal:
          "Builds and maintains agent workflows end-to-end. Monitors agent quality metrics. Handles failures and edge cases agents cannot resolve autonomously.",
        advanced:
          "Designs the agent orchestration architecture for the team. Contributes to internal agent tooling and shared prompt libraries. Defines team-wide agent quality standards.",
      },
      antipatterns: [
        "Do not assume AI-native means hands-off — oversight, course-correction, and domain judgment become more critical as agents take on more work, not less; more autonomy means more consequence per mistake",
        "Do not skip investing in domain knowledge — agents need a knowledgeable human to validate correctness in complex business contexts; your expertise is your primary value at this level, not your ability to write code",
        "Do not build agent pipelines without observability — blind pipelines create unauditable risk in production; you must be able to trace why an agent made a decision, especially when something goes wrong at 2am",
      ],
    },
  },
};

const developerTestingCell: MatrixCell = {
  phase: "testing",
  role: "developer",
  involvement: "active",
  cards: {
    "ai-enabled": {
      title: "Test",
      tools: [
        {
          name: "Capilot",
          description: "test description",
          badge: "key",
        },
      ],
      practices: ["test 1", "test 1", "test 3"],
      expectations: {
        minimum: "1",
        normal: "2",
        advanced: "43",
      },
      antipatterns: ["tes1", "tes 2", "tes 3"],
      links: [
        {
          title: "title 1",
          url: "https://godelonline.sharepoint.com/Divisions/DeliveryDivisions/JavaScript/SitePages/English-Quiz.aspx",
          type: "article",
          duration: "",
          why: "need",
        },
      ],
      shift: "noo nono nono n",
    },
    "ai-first": {
      title: "Editing content for AI-First",
      tools: [
        {
          name: "tol ",
          description: "sadasdasd",
          badge: "asdasd",
        },
        {
          name: "tol 3",
          description: "asdasd",
        },
      ],
      practices: [],
      expectations: {
        minimum: "sad",
        normal: "qwe",
        advanced: "sdf",
      },
      antipatterns: ["asdasdad", "weqewqe", "gdfgdfgf"],
      links: [
        {
          title: "tte1",
          url: "asda",
          type: "article",
          duration: "22h",
          why: "adsasda",
        },
      ],
      shift: "adssadsd ",
    },
    "ai-native": {
      title: "Editing content for AI Native",
      tools: [
        {
          name: "adsad1",
          description: "asdsada ",
          badge: "sada",
        },
      ],
      practices: ["adsdsd", "adsad1", "cascsad3"],
      expectations: {
        minimum: "asda",
        normal: "qweq",
        advanced: "dczdsda",
      },
      antipatterns: ["adasd 3", "asdads1", "asdasdas2"],
      links: [
        {
          title: "sdfsdfsf",
          url: "sdf",
          type: "video",
          duration: "22",
          why: "sdfsdffs",
        },
      ],
      shift: "asdasds",
    },
  },
};

// Only the one seed cell has card content
const allCells: MatrixCell[] = [developerDevelopmentCell, developerTestingCell];

// ─── Main export ───────────────────────────────────────────────────────────────
export const matrixData: MatrixData = {
  phases: [
    { id: "planning", label: "Planning" },
    { id: "requirements", label: "Requirements" },
    { id: "design-architecture", label: "Design / Architecture" },
    { id: "development", label: "Development" },
    { id: "testing", label: "Testing" },
    { id: "deployment-release", label: "Deployment / Release" },
    { id: "maintenance", label: "Maintenance" },
  ],
  roles: [
    { id: "link", label: "Link", group: "management" },
    { id: "po", label: "PO", group: "management" },
    { id: "pm", label: "PM", group: "management" },
    { id: "scrum-master", label: "Scrum Master", group: "management" },
    { id: "ba", label: "BA", group: "analysis-design" },
    { id: "ux-ui", label: "UX / UI", group: "analysis-design" },
    { id: "architect", label: "Architect", group: "architecture" },
    { id: "tech-lead", label: "Tech Lead", group: "architecture" },
    { id: "developer", label: "Developer", group: "implementation" },
    { id: "dba", label: "DBA", group: "implementation" },
    { id: "qa", label: "QA", group: "quality" },
    { id: "devops", label: "DevOps", group: "infra" },
    { id: "tech-writer", label: "Tech Writer", group: "docs" },
  ],
  cells: allCells,
};

export const rawInvolvementMatrix = allCells.map(
  (cell) => [cell.phase, cell.role, cell.involvement] as [SDLCPhase, Role, InvolvementType]
);
