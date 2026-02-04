import React, { useEffect, useState, useMemo } from 'react';
import TodoCard from './TodoCard';
import { sortTodosByOverdue } from '../utils/dateUtils';

function TodoList({ todos, onToggle, onEdit, onDelete, isLoading }) {
  // State to trigger re-renders when overdue status might change
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Recalculate overdue status on mount (page load)
    setRefreshTrigger((prev) => prev + 1);

    // Handle window focus events (tab switching, window activation)
    const handleFocus = () => {
      setRefreshTrigger((prev) => prev + 1);
    };

    // Handle visibility change events (tab switching)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setRefreshTrigger((prev) => prev + 1);
      }
    };

    // Add event listeners
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Sort todos with overdue items first
  // Recalculate when todos change or when refresh is triggered
  // refreshTrigger is intentionally included to force recalculation on focus/visibility events
  const sortedTodos = useMemo(() => {
    return sortTodosByOverdue(todos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos, refreshTrigger]);

  if (todos.length === 0) {
    return (
      <div className="todo-list empty-state">
        <p className="empty-state-message">
          No todos yet. Add one to get started! 👻
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {sortedTodos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

export default TodoList;
