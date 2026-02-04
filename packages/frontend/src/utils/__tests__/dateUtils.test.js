/**
 * Unit Tests for Date Utilities
 * 
 * Tests overdue calculation, duration text formatting, and todo sorting logic
 */

import {
  isOverdue,
  getOverdueDays,
  getDurationText,
  sortTodosByOverdue
} from '../dateUtils';

describe('dateUtils', () => {
  // Store original Date to restore after tests
  const RealDate = Date;

  // Mock current date to 2026-02-04
  beforeEach(() => {
    global.Date = class extends RealDate {
      constructor(...args) {
        if (args.length === 0) {
          return new RealDate('2026-02-04T12:00:00Z');
        }
        return new RealDate(...args);
      }
      static now() {
        return new RealDate('2026-02-04T12:00:00Z').getTime();
      }
    };
  });

  afterEach(() => {
    global.Date = RealDate;
  });

  describe('isOverdue', () => {
    test('should return true for past due date with incomplete todo', () => {
      expect(isOverdue('2026-02-01', false)).toBe(true);
      expect(isOverdue('2026-02-03', false)).toBe(true);
    });

    test('should return false for today\'s due date', () => {
      expect(isOverdue('2026-02-04', false)).toBe(false);
    });

    test('should return false for future due date', () => {
      expect(isOverdue('2026-02-05', false)).toBe(false);
      expect(isOverdue('2026-02-10', false)).toBe(false);
      expect(isOverdue('2027-01-01', false)).toBe(false);
    });

    test('should return false for completed todo regardless of due date', () => {
      expect(isOverdue('2026-02-01', true)).toBe(false);
      expect(isOverdue('2026-02-03', true)).toBe(false);
      expect(isOverdue('2025-01-01', true)).toBe(false);
    });

    test('should return false when dueDate is null', () => {
      expect(isOverdue(null, false)).toBe(false);
    });

    test('should return false when dueDate is undefined', () => {
      expect(isOverdue(undefined, false)).toBe(false);
    });

    test('should return false when dueDate is empty string', () => {
      expect(isOverdue('', false)).toBe(false);
    });

    test('should handle dates far in the past', () => {
      expect(isOverdue('2020-01-01', false)).toBe(true);
      expect(isOverdue('2000-01-01', false)).toBe(true);
    });

    test('should handle dates far in the future', () => {
      expect(isOverdue('2030-01-01', false)).toBe(false);
      expect(isOverdue('2100-01-01', false)).toBe(false);
    });
  });

  describe('getOverdueDays', () => {
    test('should return 1 for yesterday', () => {
      expect(getOverdueDays('2026-02-03')).toBe(1);
    });

    test('should return 0 for today', () => {
      expect(getOverdueDays('2026-02-04')).toBe(0);
    });

    test('should return 7 for one week ago', () => {
      expect(getOverdueDays('2026-01-28')).toBe(7);
    });

    test('should return 30 for one month ago', () => {
      expect(getOverdueDays('2026-01-05')).toBe(30);
    });

    test('should return correct count for partial day', () => {
      // Same day should return 0
      expect(getOverdueDays('2026-02-04')).toBe(0);
    });

    test('should handle dates far in the past', () => {
      expect(getOverdueDays('2025-02-04')).toBe(365);
      expect(getOverdueDays('2020-02-04')).toBeGreaterThan(2000);
    });

    test('should return 0 for future dates', () => {
      expect(getOverdueDays('2026-02-05')).toBe(0);
      expect(getOverdueDays('2026-02-10')).toBe(0);
    });
  });

  describe('getDurationText', () => {
    test('should return "< 1 day overdue" for today', () => {
      expect(getDurationText('2026-02-04')).toBe('< 1 day overdue');
    });

    test('should return "1 day overdue" with singular form', () => {
      expect(getDurationText('2026-02-03')).toBe('1 day overdue');
    });

    test('should return "N days overdue" with plural form', () => {
      expect(getDurationText('2026-02-02')).toBe('2 days overdue');
      expect(getDurationText('2026-01-28')).toBe('7 days overdue');
      expect(getDurationText('2026-01-05')).toBe('30 days overdue');
    });

    test('should handle dates far in the past', () => {
      const text = getDurationText('2025-02-04');
      expect(text).toContain('days overdue');
      expect(text).toContain('365');
    });

    test('should return "< 1 day overdue" for future dates (edge case)', () => {
      expect(getDurationText('2026-02-05')).toBe('< 1 day overdue');
    });
  });

  describe('sortTodosByOverdue', () => {
    const mockTodos = [
      {
        id: '1',
        title: 'Not Due',
        dueDate: '2026-02-10',
        completed: false,
        createdAt: '2026-02-01T10:00:00Z'
      },
      {
        id: '2',
        title: 'Overdue Old',
        dueDate: '2026-02-01',
        completed: false,
        createdAt: '2026-02-01T09:00:00Z'
      },
      {
        id: '3',
        title: 'Overdue New',
        dueDate: '2026-02-02',
        completed: false,
        createdAt: '2026-02-03T10:00:00Z'
      },
      {
        id: '4',
        title: 'Completed Overdue',
        dueDate: '2026-02-01',
        completed: true,
        createdAt: '2026-02-02T10:00:00Z'
      },
      {
        id: '5',
        title: 'No Due Date',
        dueDate: null,
        completed: false,
        createdAt: '2026-02-04T10:00:00Z'
      }
    ];

    test('should sort overdue todos before non-overdue', () => {
      const sorted = sortTodosByOverdue(mockTodos);
      
      // First two should be overdue (ids 2 and 3)
      expect(isOverdue(sorted[0].dueDate, sorted[0].completed)).toBe(true);
      expect(isOverdue(sorted[1].dueDate, sorted[1].completed)).toBe(true);
      
      // Remaining should not be overdue
      expect(isOverdue(sorted[2].dueDate, sorted[2].completed)).toBe(false);
      expect(isOverdue(sorted[3].dueDate, sorted[3].completed)).toBe(false);
      expect(isOverdue(sorted[4].dueDate, sorted[4].completed)).toBe(false);
    });

    test('should sort by creation date (newest first) within overdue group', () => {
      const sorted = sortTodosByOverdue(mockTodos);
      
      // id:3 created at 2026-02-03 should come before id:2 created at 2026-02-01
      const overdueIds = sorted
        .filter(todo => isOverdue(todo.dueDate, todo.completed))
        .map(todo => todo.id);
      
      expect(overdueIds[0]).toBe('3'); // Newer
      expect(overdueIds[1]).toBe('2'); // Older
    });

    test('should sort by creation date (newest first) within non-overdue group', () => {
      const sorted = sortTodosByOverdue(mockTodos);
      
      // Among non-overdue: id:5 (2026-02-04) > id:4 (2026-02-02) > id:1 (2026-02-01)
      const nonOverdueIds = sorted
        .filter(todo => !isOverdue(todo.dueDate, todo.completed))
        .map(todo => todo.id);
      
      expect(nonOverdueIds[0]).toBe('5'); // Newest
      expect(nonOverdueIds[1]).toBe('4');
      expect(nonOverdueIds[2]).toBe('1'); // Oldest
    });

    test('should not mutate original array', () => {
      const original = [...mockTodos];
      sortTodosByOverdue(mockTodos);
      
      expect(mockTodos).toEqual(original);
    });

    test('should handle empty array', () => {
      const sorted = sortTodosByOverdue([]);
      expect(sorted).toEqual([]);
    });

    test('should handle single todo', () => {
      const singleTodo = [mockTodos[0]];
      const sorted = sortTodosByOverdue(singleTodo);
      
      expect(sorted).toHaveLength(1);
      expect(sorted[0].id).toBe('1');
    });

    test('should handle all todos overdue', () => {
      const allOverdue = [
        { id: '1', dueDate: '2026-02-01', completed: false, createdAt: '2026-02-01T10:00:00Z' },
        { id: '2', dueDate: '2026-02-02', completed: false, createdAt: '2026-02-02T10:00:00Z' },
        { id: '3', dueDate: '2026-02-03', completed: false, createdAt: '2026-02-03T10:00:00Z' }
      ];
      
      const sorted = sortTodosByOverdue(allOverdue);
      
      // Should be sorted by creation date (newest first)
      expect(sorted[0].id).toBe('3');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('1');
    });

    test('should handle all todos non-overdue', () => {
      const allNonOverdue = [
        { id: '1', dueDate: '2026-02-10', completed: false, createdAt: '2026-02-01T10:00:00Z' },
        { id: '2', dueDate: '2026-02-15', completed: false, createdAt: '2026-02-02T10:00:00Z' },
        { id: '3', dueDate: null, completed: false, createdAt: '2026-02-03T10:00:00Z' }
      ];
      
      const sorted = sortTodosByOverdue(allNonOverdue);
      
      // Should be sorted by creation date (newest first)
      expect(sorted[0].id).toBe('3');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('1');
    });
  });

  describe('Performance', () => {
    test('should calculate overdue status in < 1ms per todo', () => {
      const start = Date.now();
      
      for (let i = 0; i < 100; i++) {
        isOverdue('2026-02-01', false);
      }
      
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(50); // 100 operations in < 50ms = < 0.5ms each
    });

    test('should sort 100 todos in < 50ms', () => {
      const todos = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        dueDate: i % 2 === 0 ? '2026-02-01' : '2026-02-10',
        completed: false,
        createdAt: `2026-02-${String(i % 28 + 1).padStart(2, '0')}T10:00:00Z`
      }));
      
      const start = RealDate.now();
      sortTodosByOverdue(todos);
      const elapsed = RealDate.now() - start;
      
      expect(elapsed).toBeLessThan(50);
    });
  });
});
