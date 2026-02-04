# Feature Specification: Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Created**: 2026-02-04  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identification of Overdue Todos (Priority: P1)

Users viewing their todo list can immediately identify which incomplete todos have passed their due date through clear visual indicators.

**Why this priority**: This is the core value proposition - users need to quickly distinguish overdue items without manually comparing dates. Without this, the feature provides no value.

**Independent Test**: Can be fully tested by creating todos with past due dates and verifying they display with distinct visual styling (e.g., red text, warning icon, or highlighted background).

**Acceptance Scenarios**:

1. **Given** a todo with due date set to yesterday and status incomplete, **When** user views the todo list, **Then** the todo displays with a visual indicator showing it is overdue
2. **Given** a todo with due date set to today and status incomplete, **When** user views the todo list, **Then** the todo displays normally (not marked as overdue)
3. **Given** a todo with due date set to tomorrow and status incomplete, **When** user views the todo list, **Then** the todo displays normally (not marked as overdue)
4. **Given** a todo with due date set to yesterday but status completed, **When** user views the todo list, **Then** the todo displays as completed without overdue indicator

---

### User Story 2 - Overdue Duration Display (Priority: P2)

Users can see how long a todo has been overdue to better understand urgency and prioritize their work.

**Why this priority**: Enhances the basic overdue detection by providing context about severity (1 day overdue vs 30 days overdue), helping users prioritize better.

**Independent Test**: Create todos with various past due dates (1 day ago, 7 days ago, 30 days ago) and verify each shows the appropriate duration text.

**Acceptance Scenarios**:

1. **Given** a todo with due date set to 1 day ago, **When** user views the todo list, **Then** the todo displays "1 day overdue" or similar message
2. **Given** a todo with due date set to 7 days ago, **When** user views the todo list, **Then** the todo displays "7 days overdue" or similar message
3. **Given** a todo with due date set to today, **When** user views the todo list, **Then** no overdue duration is displayed

---

### User Story 3 - Automatic Date Comparison (Priority: P1)

The system automatically compares each todo's due date against the current date without requiring user action or page refresh.

**Why this priority**: This is the foundational logic that enables all other stories. Without automatic date comparison, users would need to manually check dates.

**Independent Test**: Create a todo with due date of today, wait until tomorrow (or manipulate system time in tests), and verify it automatically shows as overdue.

**Acceptance Scenarios**:

1. **Given** multiple todos with different due dates, **When** system loads the todo list, **Then** system automatically calculates overdue status for each incomplete todo
2. **Given** the user has the app open across midnight, **When** the date changes, **Then** todos that become overdue are automatically updated with overdue indicators
3. **Given** a todo with no due date, **When** user views the todo list, **Then** the todo is never marked as overdue

---

### Edge Cases

- What happens when a todo has no due date set? (Should never show as overdue)
- How does the system handle todos with due dates far in the past (e.g., years ago)? (Should still show overdue with appropriate duration)
- What happens when a user completes an overdue todo? (Overdue indicator should disappear immediately)
- How are overdue todos displayed when the user's system time is incorrect? (Use system time as source of truth)
- What happens at exactly midnight when due date equals current date? (Not overdue - becomes overdue the following day)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST automatically calculate whether each incomplete todo is overdue by comparing its due date to the current date
- **FR-002**: System MUST display a visual indicator (color, icon, or styling) for todos that are overdue
- **FR-003**: System MUST exclude completed todos from overdue detection (completed todos never show as overdue)
- **FR-004**: System MUST treat todos without a due date as never overdue
- **FR-005**: System MUST consider a todo overdue only when the current date is AFTER the due date (due date of today = not overdue)
- **FR-006**: System MUST display the number of days overdue for each overdue todo
- **FR-007**: System MUST recalculate overdue status when the page loads or refreshes
- **FR-008**: Overdue indicator MUST be clearly distinguishable from non-overdue todos using the existing Halloween theme color palette

### Key Entities

- **Todo**: Already exists with attributes: id, title, dueDate (optional), completed (boolean), createdAt
  - No schema changes needed - feature uses existing dueDate field
  - Overdue status is calculated, not stored

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify overdue todos within 1 second of viewing the todo list (visual indicator is immediately apparent)
- **SC-002**: 100% of incomplete todos with past due dates display with overdue indicator
- **SC-003**: 0% of completed todos display with overdue indicator regardless of due date
- **SC-004**: Overdue calculation completes in under 50ms for lists up to 100 todos (imperceptible to users)
- **SC-005**: Users can distinguish overdue from non-overdue todos without reading dates (visual difference is clear)

## Assumptions

- The application uses the client's system time as the source for "current date" comparison
- Timezone handling is not required - simple date comparison is sufficient for single-user desktop app
- The existing Halloween theme color palette includes appropriate colors for warning/error states (red, orange)
- The overdue status is calculated on the frontend when displaying todos (no backend changes required)
- Users understand that "overdue" means the due date has passed, not just approaching

## Out of Scope

- Notifications or alerts when todos become overdue
- Filtering or sorting by overdue status
- Bulk actions on overdue todos
- Customizable overdue thresholds or warnings before due date
- Historical tracking of how long todos were overdue before completion
- Server-side overdue calculation or storage
- Timezone conversion or multi-timezone support

## Dependencies

- Existing todo data model with dueDate field
- Existing todo display components (TodoCard, TodoList)
- JavaScript Date API for date comparison
- Halloween theme color palette for styling overdue indicators

## UI/UX Notes

- Overdue indicator should use danger color from theme (red: #c62828 in light mode, #ef5350 in dark mode)
- Consider adding a warning icon (⚠️ or 🚨) alongside the color change
- Overdue duration text should use caption typography (12px, regular)
- Ensure color contrast meets WCAG AA standards even with overdue styling
- Maintain consistency with existing todo card layout and spacing
