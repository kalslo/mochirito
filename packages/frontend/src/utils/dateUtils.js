/**
 * Date Utilities for Overdue Todo Calculations
 * 
 * Provides functions for determining overdue status, calculating duration,
 * and sorting todos by overdue status and creation date.
 */

/**
 * Determines if a todo is overdue based on its due date and completion status
 * 
 * @param {string|null} dueDate - ISO 8601 date string (YYYY-MM-DD) or null
 * @param {boolean} completed - Whether the todo is marked as completed
 * @returns {boolean} True if the todo is overdue (past due date and not completed)
 * 
 * @example
 * isOverdue('2026-02-01', false) // true (if today is 2026-02-04)
 * isOverdue('2026-02-10', false) // false (future date)
 * isOverdue('2026-02-01', true) // false (completed todos not overdue)
 * isOverdue(null, false) // false (no due date)
 */
export function isOverdue(dueDate, completed) {
  // Todos without due dates or completed todos are never overdue
  if (!dueDate || completed) {
    return false;
  }

  // Get current date normalized to midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse due date directly to avoid timezone issues
  // Input format is YYYY-MM-DD
  const [year, month, day] = dueDate.split('-');
  const due = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  due.setHours(0, 0, 0, 0);

  // Check if due date is in the past
  return due.getTime() < today.getTime();
}

/**
 * Calculates the number of full days a todo has been overdue
 * 
 * @param {string} dueDate - ISO 8601 date string (YYYY-MM-DD)
 * @returns {number} Number of full days overdue (0 for partial day/same day)
 * 
 * @example
 * getOverdueDays('2026-02-03') // 1 (if today is 2026-02-04)
 * getOverdueDays('2026-01-28') // 7 (if today is 2026-02-04)
 * getOverdueDays('2026-02-04') // 0 (same day, not yet overdue)
 */
export function getOverdueDays(dueDate) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Get current date normalized to midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse due date directly to avoid timezone issues
  // Input format is YYYY-MM-DD
  const [year, month, day] = dueDate.split('-');
  const due = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  due.setHours(0, 0, 0, 0);

  // Calculate difference in milliseconds
  const diffMs = today.getTime() - due.getTime();

  // Convert to days and floor to get full days
  const diffDays = Math.floor(diffMs / MS_PER_DAY);

  return Math.max(0, diffDays);
}

/**
 * Generates human-readable duration text for overdue todos
 * 
 * @param {string} dueDate - ISO 8601 date string (YYYY-MM-DD)
 * @returns {string} Formatted duration text with proper singular/plural grammar
 * 
 * @example
 * getDurationText('2026-02-03') // "1 day overdue" (if today is 2026-02-04)
 * getDurationText('2026-02-04') // "< 1 day overdue" (same day)
 * getDurationText('2026-01-28') // "7 days overdue" (if today is 2026-02-04)
 */
export function getDurationText(dueDate) {
  const days = getOverdueDays(dueDate);

  if (days === 0) {
    return '< 1 day overdue';
  } else if (days === 1) {
    return '1 day overdue';
  } else {
    return `${days} days overdue`;
  }
}

/**
 * Sorts todos with overdue items first, then by creation date (newest first)
 * 
 * Sorting order:
 * 1. Overdue todos (by creation date, newest first)
 * 2. Non-overdue todos (by creation date, newest first)
 * 
 * @param {Array<Object>} todos - Array of todo objects
 * @param {string} todos[].id - Todo unique identifier
 * @param {string|null} todos[].dueDate - ISO 8601 date string or null
 * @param {boolean} todos[].completed - Completion status
 * @param {string} todos[].createdAt - ISO 8601 timestamp
 * @returns {Array<Object>} New array with todos sorted by overdue status and creation date
 * 
 * @example
 * const todos = [
 *   { id: '1', dueDate: '2026-02-10', completed: false, createdAt: '2026-02-01T10:00:00Z' },
 *   { id: '2', dueDate: '2026-02-01', completed: false, createdAt: '2026-02-02T10:00:00Z' },
 *   { id: '3', dueDate: '2026-02-02', completed: false, createdAt: '2026-02-03T10:00:00Z' }
 * ];
 * const sorted = sortTodosByOverdue(todos);
 * // Result: [id:3 (overdue, newest), id:2 (overdue, oldest), id:1 (not overdue)]
 */
export function sortTodosByOverdue(todos) {
  // Create a copy to avoid mutating the original array
  return [...todos].sort((a, b) => {
    const aOverdue = isOverdue(a.dueDate, a.completed);
    const bOverdue = isOverdue(b.dueDate, b.completed);

    // Primary sort: overdue todos first
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    // Secondary sort: creation date (newest first)
    const aCreated = new Date(a.createdAt).getTime();
    const bCreated = new Date(b.createdAt).getTime();
    return bCreated - aCreated;
  });
}
