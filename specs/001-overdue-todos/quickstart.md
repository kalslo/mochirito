# Quick Start: Overdue Todo Items

**Feature**: 001-overdue-todos  
**Branch**: `001-overdue-todos`  
**Prerequisites**: Node.js 18+, npm 7+

## Overview

Add visual indicators for overdue todos: red text, ⚠️ icon, bold styling, and automatic prioritization at top of list.

---

## Setup

### 1. Checkout Branch

```bash
git checkout 001-overdue-todos
```

### 2. Install Dependencies

```bash
cd /workspaces/mochirito
npm install
```

(No new dependencies needed - using existing React, Jest, React Testing Library)

---

## Development

### Run Frontend (Development Mode)

```bash
npm run start --workspace=packages/frontend
```

- Opens browser to `http://localhost:3000`
- Hot reload enabled
- Check console for errors

### Run Tests (Watch Mode)

```bash
npm test --workspace=packages/frontend -- --watch
```

- Tests run automatically on file changes
- Coverage visible in terminal
- Press `a` to run all tests

### Run Tests (Coverage Report)

```bash
npm test --workspace=packages/frontend -- --coverage
```

- Target: 80%+ coverage
- HTML report in `packages/frontend/coverage/`

---

## Testing the Feature

### Manual Test Scenarios

#### Scenario 1: Create Overdue Todo

1. Create a new todo with title "Test Overdue"
2. Set due date to yesterday (use date picker or manual entry)
3. **Expected**: Todo displays with:
   - ⚠️ icon before title
   - Red text color
   - Bold title
   - "1 day overdue" text below

#### Scenario 2: Verify Ordering

1. Create 3 todos:
   - "Not Due" - due date tomorrow
   - "Overdue 1" - due date yesterday
   - "Overdue 2" - due date 3 days ago
2. **Expected**: List shows in order:
   - Overdue 2 (newest first if same creation time)
   - Overdue 1
   - Not Due

#### Scenario 3: Complete Overdue Todo

1. Find an overdue todo (red, ⚠️, bold)
2. Click checkbox to mark complete
3. **Expected**: 
   - Red color removed
   - ⚠️ icon removed
   - Bold weight removed
   - Strikethrough applied (existing behavior)

#### Scenario 4: Edit Due Date

1. Find an overdue todo
2. Click edit button
3. Change due date to tomorrow
4. **Expected**: Indicators disappear immediately (before save)

#### Scenario 5: Window Focus

1. Create todo with due date = today
2. Change system time to tomorrow (or wait)
3. Switch to another tab
4. Switch back to app tab
5. **Expected**: Todo now shows overdue indicators

---

## File Locations

### New Files

```
packages/frontend/src/
├── utils/
│   ├── dateUtils.js              # Date calculation functions
│   └── __tests__/
│       └── dateUtils.test.js     # Unit tests for date utils
```

### Modified Files

```
packages/frontend/src/
├── components/
│   ├── TodoCard.js               # Add visual indicators
│   ├── TodoList.js               # Add sorting logic
│   └── __tests__/
│       ├── TodoCard.test.js      # Add overdue tests
│       └── TodoList.test.js      # Add sorting tests
└── styles/
    └── theme.css                 # Verify danger colors present
```

---

## Key Functions

### `isOverdue(dueDate, completed)` → boolean

```javascript
import { isOverdue } from './utils/dateUtils';

const overdue = isOverdue('2026-02-03', false); // true
const notDue = isOverdue('2026-02-05', false); // false
const completedOverdue = isOverdue('2026-02-03', true); // false
```

### `getOverdueDuration(dueDate)` → string | null

```javascript
import { getOverdueDuration } from './utils/dateUtils';

const duration = getOverdueDuration('2026-02-03'); // "1 day overdue"
const partial = getOverdueDuration('2026-02-04T10:00:00'); // "< 1 day overdue"
```

### `sortTodosByOverdue(todos)` → Todo[]

```javascript
import { sortTodosByOverdue } from './utils/dateUtils';

const sorted = sortTodosByOverdue(todos);
// Returns: [overdue todos (newest first), then not-due todos (newest first)]
```

---

## Common Issues

### Issue: Visual indicators not showing

**Check**:
- Is `dueDate` in the past? (use browser devtools to inspect)
- Is `completed` false?
- Are theme CSS variables defined in theme.css?

**Debug**:
```javascript
console.log('Due Date:', todo.dueDate);
console.log('Completed:', todo.completed);
console.log('Is Overdue:', isOverdue(todo.dueDate, todo.completed));
```

### Issue: Tests failing with date mismatches

**Solution**: Mock dates in tests

```javascript
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-02-04T00:00:00'));
});

afterEach(() => {
  jest.useRealTimers();
});
```

### Issue: Ordering not working

**Check**:
- TodoList component calling `sortTodosByOverdue()`?
- Spread operator used to create new array for React?
- `createdAt` field populated on all todos?

### Issue: Icons not rendering

**Check**:
- Unicode emoji ⚠️ supported in browser?
- CSS classes applied correctly?
- Console errors for missing icons?

---

## Verification Checklist

Before submitting PR:

- [ ] All tests pass (`npm test`)
- [ ] Coverage ≥80% (`npm test -- --coverage`)
- [ ] No linting errors (`npm run lint` if configured)
- [ ] Visual indicators visible in browser
- [ ] Overdue todos appear at top of list
- [ ] Indicators disappear when todo completed
- [ ] Indicators update when due date changed
- [ ] Window focus triggers recalculation
- [ ] Singular/plural grammar correct ("1 day" vs "2 days")
- [ ] WCAG AA contrast verified (use browser devtools)
- [ ] No console errors or warnings

---

## Links

- **Specification**: [spec.md](spec.md)
- **Implementation Plan**: [plan.md](plan.md)
- **Research**: [research.md](research.md)
- **Data Model**: [data-model.md](data-model.md)
- **UI Guidelines**: [../../docs/ui-guidelines.md](../../docs/ui-guidelines.md)
- **Testing Guidelines**: [../../docs/testing-guidelines.md](../../docs/testing-guidelines.md)

---

## Next Steps

1. Run tests to verify environment
2. Create `dateUtils.js` with unit tests (TDD)
3. Modify `TodoCard.js` to display indicators
4. Modify `TodoList.js` to sort by overdue status
5. Verify all acceptance scenarios pass
6. Submit PR for review
