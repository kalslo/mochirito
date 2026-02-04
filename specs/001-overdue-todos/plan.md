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

### Key Decisions Made

1. **Date Comparison**: JavaScript Date object with timezone-naive comparison (no dependencies needed)
2. **Duration Calculation**: Millisecond difference divided by day constant with special case for < 1 day
3. **List Ordering**: Single array sort with overdue as primary key, creation date secondary
4. **Window Focus Detection**: Event listeners for `focus` and `visibilitychange` events
5. **Visual Indicators**: Conditional CSS classes + Unicode emoji ⚠️ (no icon library needed)

See [research.md](research.md) for full rationale and alternatives considered.

---

## Phase 1: Design & Contracts

### Data Model

**Summary**: No schema changes. Uses existing Todo entity's `dueDate` field. Overdue status calculated dynamically on frontend.

See [data-model.md](data-model.md) for complete entity definitions and state transitions.

### Contracts

**API Changes**: None - Frontend-only feature

**Component Interface Changes**:

#### TodoCard Props (Modified)
```typescript
interface TodoCardProps {
  todo: {
    id: string;
    title: string;
    dueDate?: string;      // Existing - ISO 8601 date
    completed: boolean;
    createdAt: string;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Todo>) => void;
}
// Adds visual indicators when isOverdue(todo.dueDate, todo.completed) is true
```

#### DateUtils Module (New)
```typescript
// utils/dateUtils.js

export function isOverdue(dueDate: string | null, completed: boolean): boolean;
// Returns true if dueDate is in the past and todo is not completed

export function getOverdueDays(dueDate: string): number;
// Returns number of full days overdue (0 for partial day)

export function getDurationText(dueDate: string): string;
// Returns formatted string: "< 1 day overdue", "1 day overdue", "N days overdue"

export function sortTodosByOverdue(todos: Todo[]): Todo[];
// Returns new array with overdue todos first, then non-overdue, by creation date
```

### Quick Start

See [quickstart.md](quickstart.md) for:
- Development setup instructions
- Manual test scenarios
- Key function APIs
- Troubleshooting guide

---

## Constitution Check (Post-Design Re-evaluation)

*Re-checking compliance after Phase 1 design decisions.*

- [x] **Code Quality**: ✅ Still compliant
  - DateUtils module encapsulates date logic (DRY)
  - Simple boolean/arithmetic functions (KISS)
  - Each function single purpose (Single Responsibility)
  
- [x] **Test-Driven Development**: ✅ Still compliant
  - Unit tests defined for dateUtils module
  - Component tests for visual indicators
  - Integration tests for list ordering
  - Coverage strategy documented in quickstart
  
- [x] **Component Architecture**: ✅ Still compliant
  - Utils: Pure functions for calculations
  - Components: TodoCard and TodoList for display
  - Clear boundaries maintained
  
- [x] **Simplicity and Scope**: ✅ Still compliant
  - Zero new dependencies
  - No backend changes
  - Frontend-only calculations
  - Aligns perfectly with spec
  
- [x] **Design Consistency**: ✅ Still compliant
  - Uses existing danger colors
  - Unicode emoji (platform standard)
  - Follows existing CSS patterns
  - WCAG AA verified
  
- [x] **Error Handling**: ✅ Still compliant
  - Graceful handling of null/invalid dates
  - No async operations to handle
  
- [x] **Monorepo Organization**: ✅ Still compliant
  - All changes in packages/frontend only
  - No cross-package violations

**Final Result**: ✅ All gates passed. Design maintains constitutional compliance.

---


## Implementation Summary

### Scope
- **Frontend Changes Only**: All modifications in `packages/frontend/src/`
- **No Backend Changes**: Existing API unchanged
- **No Schema Changes**: Uses existing Todo.dueDate field
- **No New Dependencies**: Uses native JavaScript Date API and existing React/Jest stack

### Files to Create
1. `packages/frontend/src/utils/dateUtils.js` - Date calculation functions
2. `packages/frontend/src/utils/__tests__/dateUtils.test.js` - Unit tests

### Files to Modify
1. `packages/frontend/src/components/TodoCard.js` - Add visual indicators
2. `packages/frontend/src/components/TodoList.js` - Add sorting logic
3. `packages/frontend/src/components/__tests__/TodoCard.test.js` - Add overdue tests
4. `packages/frontend/src/components/__tests__/TodoList.test.js` - Add sorting tests

### Files to Verify
1. `packages/frontend/src/styles/theme.css` - Confirm danger colors exist

### Complexity Assessment
- **Lines of Code**: ~200-300 total (including tests)
- **New Functions**: 4 (isOverdue, getOverdueDays, getDurationText, sortTodosByOverdue)
- **Modified Components**: 2 (TodoCard, TodoList)
- **Test Coverage Target**: 80%+
- **Estimated Effort**: 4-6 hours (including testing)

---

## Next Steps

### Phase 2: Tasks (Run `/speckit.tasks`)
Generate detailed task breakdown with specific implementation steps, test cases, and acceptance criteria for each user story.

### Phase 3: Implementation
1. Write failing tests for dateUtils functions (TDD)
2. Implement dateUtils with passing tests
3. Update TodoCard component with visual indicators
4. Update TodoList component with sorting
5. Verify all acceptance scenarios
6. Ensure 80%+ test coverage
7. Submit PR for review

### Documentation Complete ✅
- [x] Specification (spec.md)
- [x] Implementation Plan (plan.md)
- [x] Research (research.md)
- [x] Data Model (data-model.md)
- [x] Quick Start (quickstart.md)
- [x] Agent Context Updated

**Ready for `/speckit.tasks` command** to generate detailed task breakdown.
