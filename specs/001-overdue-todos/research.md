# Research: Overdue Todo Items

**Feature**: 001-overdue-todos  
**Date**: 2026-02-04  
**Purpose**: Resolve technical unknowns and establish implementation patterns

## Research Questions

All technical context items were already clear from existing project setup. No NEEDS CLARIFICATION markers present. This document captures best practices and patterns for the chosen approach.

## Decisions

### Decision 1: Date Comparison Approach

**Chosen**: JavaScript Date object with timezone-naive comparison

**Rationale**:
- Specification explicitly states "no timezone support required"
- Single-user desktop app uses local system time
- JavaScript `Date` object provides `getTime()` for millisecond comparison
- Setting hours to 00:00:00 normalizes dates for day-level comparison

**Alternatives Considered**:
- **date-fns library**: Rejected - adds unnecessary dependency for simple date math
- **moment.js**: Rejected - large bundle size, deprecated
- **dayjs**: Rejected - overkill for basic date comparison
- **ISO string comparison**: Rejected - prone to timezone issues

**Implementation Pattern**:
```javascript
function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  return due.getTime() < today.getTime();
}
```

---

### Decision 2: Duration Calculation Method

**Chosen**: Millisecond difference divided by day constant

**Rationale**:
- Simple arithmetic: `(today - dueDate) / (1000 * 60 * 60 * 24)`
- Specification requires day-level granularity only
- Handles "< 1 day overdue" case explicitly
- Floor function for full days, special case for partial

**Alternatives Considered**:
- **Calendar day counting**: Rejected - more complex, same result for single timezone
- **Date-fns differenceInDays**: Rejected - unnecessary dependency

**Implementation Pattern**:
```javascript
function getOverdueDays(dueDate) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffMs = today.getTime() - due.getTime();
  const diffDays = Math.floor(diffMs / MS_PER_DAY);
  
  if (diffDays === 0 && diffMs > 0) return '< 1 day';
  return diffDays;
}
```

---

### Decision 3: List Ordering Strategy

**Chosen**: Array sort with overdue status as primary key, creation date as secondary

**Rationale**:
- Specification requires: "overdue todos at top, then non-overdue by creation date"
- Single sort operation more performant than filter+concat
- Stable sort preserves creation date order within each group
- React re-renders on state change handle updates automatically

**Alternatives Considered**:
- **Filter and concat**: Rejected - two array iterations less efficient
- **Memoized separate arrays**: Rejected - premature optimization
- **CSS-only visual grouping**: Rejected - doesn't meet "at top" requirement

**Implementation Pattern**:
```javascript
function sortTodos(todos) {
  return [...todos].sort((a, b) => {
    const aOverdue = isOverdue(a.dueDate, a.completed);
    const bOverdue = isOverdue(b.dueDate, b.completed);
    
    // Primary: overdue first
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    // Secondary: creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}
```

---

### Decision 4: Window Focus Detection

**Chosen**: Reuse existing effect with window focus event listener

**Rationale**:
- Specification requires: "recalculate on window regains focus"
- `visibilitychange` event detects tab switches
- `focus` event detects window activation
- Combine with existing state update triggers

**Alternatives Considered**:
- **setInterval polling**: Rejected - unnecessary CPU usage, battery drain
- **Page visibility API only**: Rejected - doesn't cover all focus scenarios
- **No focus handling**: Rejected - violates FR-008 requirement

**Implementation Pattern**:
```javascript
useEffect(() => {
  const handleFocus = () => {
    // Trigger re-render by updating state
    setRefreshKey(prev => prev + 1);
  };
  
  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleFocus);
  
  return () => {
    window.removeEventListener('focus', handleFocus);
    document.removeEventListener('visibilitychange', handleFocus);
  };
}, []);
```

---

### Decision 5: Visual Indicator Implementation

**Chosen**: Conditional CSS classes + inline warning icon

**Rationale**:
- Specification requires: red text + ⚠️ icon + bold weight
- Existing theme.css has danger colors defined
- React conditional className for overdue state
- Unicode emoji ⚠️ for cross-platform compatibility

**Alternatives Considered**:
- **Inline styles**: Rejected - violates existing CSS pattern
- **Icon library (Font Awesome)**: Rejected - adds dependency
- **SVG icon component**: Rejected - unnecessary complexity for single icon
- **CSS background image**: Rejected - less accessible than text emoji

**Implementation Pattern**:
```javascript
<div className={`todo-card ${isOverdue ? 'overdue' : ''}`}>
  {isOverdue && <span className="overdue-icon">⚠️</span>}
  <span className="todo-title">{title}</span>
</div>
```

```css
.todo-card.overdue {
  color: var(--danger-color);
}

.todo-card.overdue .todo-title {
  font-weight: 700;
}

.overdue-icon {
  margin-right: 8px;
}
```

---

## Technology Stack Verification

**Frontend**: React 18 ✅ (existing)
- Hooks for state and effects
- Component updates on state changes
- Props for dependency injection

**Testing**: Jest + React Testing Library ✅ (existing)
- `render()` for component tests
- `screen` queries for assertions
- `jest.fn()` for mocks
- Date mocking with `jest.useFakeTimers()`

**Styling**: CSS with theme variables ✅ (existing)
- theme.css has danger colors defined
- No preprocessor needed
- CSS modules or className pattern

**No New Dependencies Required** ✅

---

## Performance Considerations

**Date Calculations**:
- O(1) per todo item
- No external API calls
- Pure functions (easily testable)
- Target: <50ms for 100 todos ✅

**List Sorting**:
- O(n log n) complexity
- Acceptable for typical 10-50 todos
- Acceptable for max 1000 todos edge case
- Target: <50ms for 100 todos ✅

**Re-render Optimization**:
- Avoid premature memoization
- React default reconciliation sufficient
- Profile if performance issues arise

---

## Accessibility Considerations

**Color Contrast**: 
- Red #c62828 on white background: 5.5:1 ratio ✅ (WCAG AA)
- Red #ef5350 on dark background: 4.7:1 ratio ✅ (WCAG AA)

**Multiple Indicators**:
- Color (for color vision)
- Icon (for symbolic recognition)
- Bold (for shape/weight distinction)
- Duration text (for semantic info)

**Screen Readers**:
- Warning icon ⚠️ announced as "warning sign"
- Duration text provides context
- Bold weight indicated by screen readers

---

## Testing Strategy

**Unit Tests** (utils/dateUtils.test.js):
- isOverdue() with various date scenarios
- getOverdueDays() with edge cases
- getDurationText() with singular/plural
- Edge cases: no due date, completed todos, partial days

**Component Tests** (TodoCard.test.js):
- Visual indicators render when overdue
- No indicators when not overdue
- Indicators update when due date changes
- Indicators disappear when todo completed

**Integration Tests** (TodoList.test.js):
- Overdue todos appear at top
- Creation date order preserved within groups
- List updates on focus event
- Multiple overdue todos ordered correctly

**Coverage Target**: 80%+ ✅

---

## Summary

All technical decisions documented with rationale. No additional dependencies needed. Implementation follows existing patterns and conventions. Performance targets achievable with chosen approach. Accessibility requirements met through multiple indicators.
