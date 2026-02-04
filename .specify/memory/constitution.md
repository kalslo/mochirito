<!--
Sync Impact Report:
Version: 0.0.0 → 1.0.0
Changes: Initial constitution ratification
Modified Principles: All principles newly defined
Added Sections: All sections newly defined
Removed Sections: None
Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section aligns with principles
  ✅ spec-template.md - User story prioritization and requirements align
  ✅ tasks-template.md - Task organization reflects testing and quality principles
  ⚠️ No command templates found - none to update
Follow-up TODOs: None
-->

# Mochirito Todo App Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

**Rules**:
- DRY (Don't Repeat Yourself): Extract common code into shared functions, reusable components, and utilities. No duplicate logic across files.
- KISS (Keep It Simple, Stupid): Prefer simple, straightforward implementations. Code MUST be readable at first glance.
- Single Responsibility: Each module, component, or function MUST have one clear purpose and reason to change.
- Consistent naming: `camelCase` for variables/functions, `PascalCase` for components/classes, `UPPER_SNAKE_CASE` for constants.
- Linting compliance: All code MUST pass ESLint checks without warnings before commit.

**Rationale**: Quality code reduces bugs, accelerates development velocity, and enables sustainable long-term maintenance. Poor quality compounds technical debt exponentially.

### II. Test-Driven Development (NON-NEGOTIABLE)

**Rules**:
- Target 80%+ code coverage across all packages
- Tests MUST be written before or alongside implementation
- Tests describe expected behavior, not implementation details
- Each test MUST be independent, isolated, and use mocked dependencies
- Follow Arrange-Act-Assert pattern consistently
- Unit tests for individual components/functions, integration tests for interactions
- All tests MUST pass before creating pull requests

**Rationale**: TDD catches bugs early, documents behavior, enables confident refactoring, and ensures maintainable code. Testing after implementation leads to incomplete coverage and brittle tests.

### III. Component Architecture

**Rules**:
- React components follow single responsibility principle
- Components receive dependencies via props (dependency injection)
- Shared logic extracted to utility functions in `utils/` or services in `services/`
- File structure: Components colocated with tests in `__tests__/` subdirectories
- Components focused on UI, services handle business logic and API calls
- Props interfaces MUST be minimal and focused

**Rationale**: Clear separation of concerns enables component reusability, simplifies testing, and maintains predictable data flow throughout the application.

### IV. Simplicity and Scope

**Rules**:
- Focus on core features only: create, view, update status, edit, delete todos
- No premature optimization or speculative features
- YAGNI (You Aren't Gonna Need It): Build only what's required by functional specifications
- Desktop-focused, no mobile-specific optimization required
- No advanced features: no filtering, search, undo/redo, bulk operations, categories
- Single-user application: no authentication, authorization, or multi-user support

**Rationale**: Simplicity reduces complexity, accelerates delivery, and prevents feature creep. Core functionality must be rock-solid before considering extensions.

### V. Design Consistency

**Rules**:
- Follow Material Design principles with Halloween theme
- Use defined color palette strictly (light/dark mode support)
- Adhere to 8px spacing grid system for all layouts
- Typography hierarchy MUST be consistent (defined font sizes and weights)
- All interactive elements keyboard accessible
- Color contrast meets WCAG AA standards
- Icon buttons MUST have descriptive aria-labels

**Rationale**: Consistent design creates predictable, professional user experience. Accessibility ensures the application is usable by all users.

### VI. Error Handling and User Feedback

**Rules**:
- All async operations MUST be wrapped in try-catch blocks
- Display clear, actionable error messages to users
- Confirmation dialogs required for destructive actions (delete)
- Log errors to console for debugging
- Handle edge cases gracefully (empty states, loading states, error states)

**Rationale**: Robust error handling prevents crashes, guides users through problems, and accelerates debugging when issues occur.

### VII. Monorepo Organization

**Rules**:
- Packages organized as `packages/frontend/` and `packages/backend/`
- Use npm workspaces for dependency management
- Shared dependencies at root level
- Frontend and backend independently testable and runnable
- Clear separation between frontend (React) and backend (Express.js) code
- No cross-package direct imports except through defined service interfaces

**Rationale**: Monorepo structure keeps related code together while maintaining clear boundaries. Independent packages enable parallel development and isolated testing.

## Development Workflow

### Code Review Requirements
- All code changes MUST go through pull requests
- No direct commits to main branch
- Code reviews verify:
  - Linting passes without warnings
  - Tests written and passing (80%+ coverage maintained)
  - Follows naming conventions and code quality principles
  - No `console.log` statements in production code
  - Proper error handling implemented
  - Documentation/comments clear and helpful
  
### Git Practices
- Atomic commits: Each commit represents one logical change
- Clear commit messages: Explain the "why", follow conventional commits format
- Feature branches for new work: `feature/description-of-feature`
- Commits MUST be focused and well-described

### Testing Gates
- Unit tests MUST pass before implementation considered complete
- Integration tests MUST pass before PR approval
- No PR merges with failing tests or decreased coverage
- Tests for bug fixes MUST be written before fixing the bug

## Technology Constraints

### Frontend Stack
- React for UI components
- CSS for styling (no CSS-in-JS or preprocessors)
- Jest + React Testing Library for testing
- No state management library required (useState/useContext sufficient)

### Backend Stack
- Node.js with Express.js for REST API
- In-memory or file-based storage (no database required)
- Jest for testing
- No ORM or database migrations needed

### Development Tools
- ESLint for code quality enforcement
- npm for dependency management
- npm workspaces for monorepo management

## Governance

### Constitution Authority
- This constitution supersedes all conflicting practices and guidelines
- Documentation in `docs/` provides detailed guidance aligned with these principles
- When in doubt, these core principles take precedence

### Amendment Process
- Amendments require justification documenting why change is needed
- Version increments follow semantic versioning:
  - MAJOR: Backward incompatible principle changes or removals
  - MINOR: New principles added or material expansions
  - PATCH: Clarifications, wording fixes, non-semantic refinements
- All amendments MUST update version, last amended date, and sync impact report
- Amendments MUST verify alignment with templates in `.specify/templates/`

### Compliance Verification
- All PRs MUST verify compliance with these principles
- Code reviews explicitly check for violations
- Complexity additions MUST be justified against Simplicity principle
- Testing requirements enforced via coverage reports

### Reference Documents
- Detailed coding standards: `docs/coding-guidelines.md`
- Functional requirements: `docs/functional-requirements.md`
- Testing strategy: `docs/testing-guidelines.md`
- UI/UX standards: `docs/ui-guidelines.md`
- Architecture overview: `docs/project-overview.md`

**Version**: 1.0.0 | **Ratified**: 2026-02-04 | **Last Amended**: 2026-02-04
