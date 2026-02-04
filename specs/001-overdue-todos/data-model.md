# Data Model: Overdue Todo Items

**Feature**: 001-overdue-todos  
**Date**: 2026-02-04  
**Purpose**: Define entities, attributes, and relationships

## Overview

This feature adds NO new entities and NO schema changes. It uses the existing Todo entity's `dueDate` field and calculates overdue status dynamically on the frontend.

---

## Entities

### Todo (Existing - No Changes)

**Description**: Represents a user's task with optional due date and completion status.

**Attributes**:

| Attribute   | Type      | Required | Description                          | Validation                    |
|-------------|-----------|----------|--------------------------------------|-------------------------------|
| id          | string    | Yes      | Unique identifier                    | Non-empty string              |
| title       | string    | Yes      | Todo description                     | Max 255 characters            |
| dueDate     | string    | No       | ISO 8601 date (YYYY-MM-DD)           | Valid date format or null     |
| completed   | boolean   | Yes      | Completion status                    | true or false                 |
| createdAt   | string    | Yes      | ISO 8601 timestamp                   | Valid ISO timestamp           |

**Schema Changes**: None

**Notes**:
- `dueDate` field already exists - no modifications needed
- Overdue status is NOT stored - calculated dynamically using current date
- Completed todos excluded from overdue calculation (per FR-003)
- Todos without dueDate never marked overdue (per FR-004)

---

## Calculated Fields (Frontend Only)

### Overdue Status

**Description**: Dynamically calculated boolean indicating if todo is past due date

**Calculation Logic**:
```
isOverdue = (dueDate exists) AND 
            (NOT completed) AND 
            (current date > dueDate)
```

**Recalculation Triggers**:
- Page load/refresh
- Window focus (tab switch, window activation)
- Todo property changes (dueDate, completed)

**Storage**: Not persisted - calculated on every render

---

### Overdue Duration

**Description**: Human-readable text showing how long todo has been overdue

**Format Examples**:
- "< 1 day overdue" (less than 24 hours past due)
- "1 day overdue" (24-47 hours past due)
- "7 days overdue" (7*24 to 8*24-1 hours past due)

**Calculation Logic**:
```
if not isOverdue: return null
days = floor((current_date - due_date) / 1_day_in_ms)
if days === 0: return "< 1 day overdue"
if days === 1: return "1 day overdue"
else: return `${days} days overdue`
```

**Storage**: Not persisted - calculated when rendering overdue todos

---

## Relationships

No relationships added or modified. Todo entity remains independent.

---

## State Transitions

### Todo Overdue Status

```
┌─────────────┐
│   Created   │
│ (not due)   │
└──────┬──────┘
       │
       │ (time passes, current date > due date)
       │
       ▼
┌─────────────┐      (user completes)      ┌─────────────┐
│  Overdue    │───────────────────────────▶│  Completed  │
│ (past due)  │                             │  (any date) │
└──────┬──────┘                             └─────────────┘
       │
       │ (user changes due date to future)
       │
       ▼
┌─────────────┐
│  Not Due    │
│  (future)   │
└─────────────┘
```

**State Definitions**:
- **Not Due**: `dueDate` is in the future OR no `dueDate` set, `completed = false`
- **Overdue**: `dueDate` is in the past, `completed = false`
- **Completed**: `completed = true` (overdue indicators never shown regardless of dueDate)

**Transition Rules**:
- Overdue status updates automatically when date changes (midnight, window focus)
- Overdue status updates immediately when user edits dueDate or toggles completed
- No server-side state tracking needed

---

## Validation Rules

No new validation rules. Existing Todo validation applies:

**Existing Rules** (unchanged):
- `title`: Required, max 255 characters
- `dueDate`: Optional, must be valid ISO 8601 date format if provided
- `completed`: Required boolean
- `createdAt`: Required, auto-generated ISO 8601 timestamp

**Overdue-Specific Validation**:
- None - overdue is a calculated display property, not stored data

---

## Data Integrity

**Consistency**:
- Overdue status always derived from current date + dueDate
- No stored overdue flags to become stale
- Source of truth is `dueDate` field (immutable during calculation)

**Edge Cases**:
- `dueDate = null`: Never overdue
- `completed = true`: Never show overdue indicators
- `dueDate = today`: Not overdue (becomes overdue tomorrow)
- Invalid `dueDate`: Treat as no due date (graceful degradation)

---

## Performance Implications

**Read Operations**:
- Overdue calculation: O(1) per todo
- List ordering: O(n log n) for sorting
- No database queries needed (calculation-only)

**Write Operations**:
- No changes to write operations
- No additional persistence needed

**Memory**:
- No additional memory for overdue status
- Calculation happens during render (no caching needed for MVP)

---

## Migration

**Schema Migration**: None required ✅

**Data Migration**: None required ✅

**Backwards Compatibility**: 100% compatible ✅
- Existing todos work without modification
- Feature degrades gracefully if dueDate missing
- No breaking changes to API or data format

---

## Summary

- **Entities Added**: 0
- **Entities Modified**: 0
- **Attributes Added**: 0 (uses existing `dueDate`)
- **Calculated Fields**: 2 (isOverdue, overdueDuration)
- **Schema Changes**: None
- **Data Migrations**: None
- **Backwards Compatible**: Yes

This feature is purely presentational - all overdue logic computed on the frontend using existing data.
