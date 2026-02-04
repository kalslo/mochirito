# Implementation Plan: Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-02-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add visual indicators and automatic prioritization for overdue todos. Users will immediately identify incomplete todos past their due date through red text, warning icons (⚠️), and bold styling. Overdue todos automatically appear at the top of the list. The system calculates overdue status on the frontend using JavaScript Date API, displays duration text (e.g., "< 1 day overdue", "2 days overdue"), and recalculates status on page load and window focus events. No backend or schema changes required - uses existing dueDate field.

## Technical Context

**Language/Version**: JavaScript (Node.js 18+ for backend, ES6+ for frontend)
**Primary Dependencies**: React 18, Express.js, Jest, React Testing Library  
**Storage**: Backend in-memory/file-based (no changes needed)  
**Testing**: Jest with React Testing Library (frontend), Jest (backend)  
**Target Platform**: Web browser (desktop-focused, Chrome/Firefox/Safari/Edge)
**Project Type**: Web application (monorepo with packages/frontend and packages/backend)  
**Performance Goals**: Overdue calculation <50ms for 100 todos, visual indicators render immediately (<1s)  
**Constraints**: Client-side date calculation only, no timezone support, WCAG AA color contrast compliance  
**Scale/Scope**: Single-user desktop app, estimated 10-50 todos typical, max 1000 todos edge case

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with the following principles from `.specify/memory/constitution.md`:

- [x] **Code Quality**: Solution follows DRY, KISS, SOLID principles with clear single responsibilities
  - Utility functions for date calculations (DRY)
  - Simple date comparison logic (KISS)
  - TodoCard handles display, utility calculates overdue status (Single Responsibility)
- [x] **Test-Driven Development**: Testing strategy defined with 80%+ coverage target, tests before/alongside implementation
  - Unit tests for date utility functions
  - Component tests for visual indicators
  - Integration tests for list ordering
- [x] **Component Architecture**: Clear separation between UI components, services, and utilities
  - Utils: date calculation functions
  - Components: TodoCard displays indicators, TodoList handles ordering
  - No new services needed (frontend-only feature)
- [x] **Simplicity and Scope**: Feature aligns with core requirements, no premature optimization or speculative features
  - No backend changes
  - No new dependencies
  - Uses existing dueDate field
  - Automatic prioritization only (no user-controlled filters)
- [x] **Design Consistency**: Follows Material Design principles with defined theme, spacing, and accessibility standards (if UI changes)
  - Uses existing danger colors (#c62828 / #ef5350)
  - Warning icon ⚠️ with existing typography
  - Bold weight from existing font stack
  - WCAG AA contrast verified
- [x] **Error Handling**: All async operations have error handling with user feedback
  - N/A - No async operations (synchronous date calculations)
  - Graceful handling of missing/invalid due dates
- [x] **Monorepo Organization**: Changes respect packages/frontend and packages/backend boundaries
  - All changes in packages/frontend only
  - No backend modifications

**Complexity Justification Required If**:
- Adding new dependencies not in current stack → ✅ None added
- Introducing architectural patterns beyond current structure → ✅ Using existing patterns
- Deviating from established conventions → ✅ Following all conventions
- Adding features outside functional requirements scope → ✅ Fully aligned with spec

**Result**: ✅ All gates passed. No complexity justification needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (below)
├── data-model.md        # Phase 1 output (below)
├── quickstart.md        # Phase 1 output (below)
└── checklists/
    └── requirements.md  # Quality validation checklist
```

### Source Code (repository root)

```text
packages/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── TodoCard.js          # MODIFY: Add overdue indicators
│       │   ├── TodoList.js          # MODIFY: Add ordering logic
│       │   └── __tests__/
│       │       ├── TodoCard.test.js # MODIFY: Add overdue tests
│       │       └── TodoList.test.js # MODIFY: Add ordering tests
│       ├── utils/
│       │   ├── dateUtils.js         # CREATE: Date calculation functions
│       │   └── __tests__/
│       │       └── dateUtils.test.js # CREATE: Date utility tests
│       └── styles/
│           └── theme.css            # VERIFY: Danger colors present
└── backend/
    └── (no changes needed)
```

**Structure Decision**: Web application (Option 2). This is a frontend-only feature that adds visual indicators and list ordering logic to existing React components. All changes confined to `packages/frontend/src/`. New utility module for date calculations follows existing convention of colocating tests with source code.

---

## Phase 0: Research & Decisions

*All NEEDS CLARIFICATION items from Technical Context resolved. See research.md for details.*
