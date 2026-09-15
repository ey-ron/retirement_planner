# Agent Guidelines & Rules

## Next.js Architecture & Boundary Guardrails
- **Workspace Router Detection:**
  - **This Workspace uses Pages Router (`src/pages/`)**:
    - Routing hooks: Strictly use `next/router` (`useRouter`), NEVER `next/navigation`.
    - API endpoints: Use `export default function handler(req, res)` inside `src/pages/api/`, not App Router route handlers.
    - Component boundaries: Do NOT write `'use client'` or `'use server'` pragmas in Pages Router files—they are App Router conventions and cause confusion.
  - **If encountering an App Router project (`app/`)**:
    - Default to React Server Components (RSC). Do not add `'use client'` unless using state, effects, event listeners, or browser APIs.
    - Never import client-only packages or hooks (`useState`, `useEffect`, `useRouter` from `next/navigation`) into Server Components.
    - Server actions must declare `'use server'` at file or function top.
    - App Router endpoints must use named HTTP exports (`GET`, `POST`, etc.) inside `route.ts`.

## Anti-Hallucination & Import Rules
- **Dependency Verification:** Inspect `package.json` before importing third-party libraries:
  - Icon libraries: verify exact package (e.g., `lucide-react` is installed; notice project also uses inline SVGs).
  - Styling: check whether Tailwind v3 (`tailwind.config.js`) or Tailwind v4 (`@import "tailwindcss";`) is installed (this project uses Tailwind v3).
  - Component libraries: check if UI components exist in `@/components/ui/` before inventing components.
- **Path Aliases:** Check `jsconfig.json` / `tsconfig.json` to confirm import aliases (e.g., `@/*` maps to `./src/*`) instead of guessing long relative paths.

## Token Conservation & Tool Scoping (CRITICAL)
- **Output Truncation on Shell Commands:**
  - NEVER dump thousands of lines into context. Always limit shell outputs (e.g., `git log -n 5`, `git diff --stat`, or piping through `head -n 50`).
- **Targeted File Inspection:**
  - When using `view_file`, ALWAYS specify tight line ranges (`StartLine` and `EndLine` for 30–80 lines). NEVER view huge multithousand-line files in indiscriminate bulk.
  - Read only the specific component file or route folder being modified. Do not read entire layouts or parent routes when debugging a leaf component.
- **Search Scoping:**
  - NEVER run broad recursive searches over `.next/`, `node_modules/`, or `public/`. Scope code searches strictly to `src/`.
- **Concise, Diff-Focused Responses:**
  - Output code diffs and changes directly. Skip conversational recaps, boilerplate theory, or unsolicited Next.js lifecycle lectures.

## Verification & Error Recovery
- **Smart Validation:**
  - Validate changes incrementally using fast type-checking/linting before full builds:
    - Lint: `npm run lint`
  - Do NOT run full `npm run build` for minor component or styling tweaks. Reserve full builds for routing changes, API modifications, or final verification before a push.
- **Max Retry Rule:**
  - If a build, lint, or runtime error persists across two consecutive attempts, STOP and halt execution immediately. Summarize the exact error message and file location for the user instead of burning tokens on hallucinated loops.

## Git & Version Control Rules
- **Always Allowed (Read-Only)**:
  - `git status`, `git diff`, `git log`, and `git branch` are ALWAYS allowed to be run autonomously at any time without requiring user confirmation. Use them freely to inspect repository state, verify changes, and check working tree status (with line limits like `-n 5` or `--stat`).
- **Requires User Confirmation (Modifying Operations)**:
  - `git add`, `git commit`, and `git push` REQUIRE explicit user confirmation or instruction before execution.
  - NEVER proactively stage, commit, or push code changes without the user explicitly instructing or confirming the action (e.g. user says "push to main", "commit and push", or explicitly approves a commit).
  - When the user explicitly instructs to push (e.g., "push to main", "push to git main"):
    - Always chain staging, committing, and pushing into a **single command** so the user only has to review and confirm once:
      `git add <files> && git commit -m "<type>: <detailed description>" && git push origin main` (or `git add . && ...` if staging all changes)
  - **Do NOT run `npx vercel ls`**: The user monitors deployments via their status bar; never invoke `npx vercel ls`.

## Command Execution & Terminal Rules
- **Always Allowed Commands**:
  - `node -e` commands are ALWAYS allowed to be run autonomously at any time without requiring user confirmation. Use them freely for inline calculations, quick evaluations, mathematical verification, and test scripts.

## Interaction & Output Rules
- **Token Usage Reporting**:
  - On every response moving forward, always provide a token count summary (Prompt Tokens, Response Tokens, and Total Tokens for the turn).
