// src/pages/CompletedTasks.tsx
import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { CheckCircle2, Filter } from "lucide-react";
import TaskItem from "../components/TaskItem";
import { SORT_OPTIONS, CT_CLASSES } from "../assets/dummy";
import type { FrontendTask } from "../types/types";

interface OutletContext {
  tasks: FrontendTask[];
  refreshTasks: () => void;
}

// Helper to normalize completed values
const computeCompleted = (c: any): boolean => {
  if (typeof c === "boolean") return c;
  if (typeof c === "number") return c === 1;
  if (typeof c === "string") return c.toLowerCase() === "yes";
  return false;
};

const CompletedTasks: React.FC = () => {
  const { tasks, refreshTasks } = useOutletContext<OutletContext>();
  const [sortBy, setSortBy] = useState<string>("newest");

  const sortedCompletedTasks = useMemo(() => {
    return tasks
      .filter(task => computeCompleted(task.completed)) // normalize completed to boolean
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
          case "oldest":
            return new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime();
          case "priority": {
            const order: Record<string, number> = { high: 3, medium: 2, low: 1 };
            return (order[b.priority?.toLowerCase() || "low"] || 0) - (order[a.priority?.toLowerCase() || "low"] || 0);
          }
          default:
            return 0;
        }
      });
  }, [tasks, sortBy]);

  return (
    <div className={CT_CLASSES.page}>
      {/* Header */}
      <div className={CT_CLASSES.header}>
        <div className={CT_CLASSES.titleWrapper}>
          <h1 className={CT_CLASSES.title}>
            <CheckCircle2 className="text-purple-500 w-5 h-5 md:w-6 md:h-6" />
            <span className="truncate">Completed Tasks</span>
          </h1>
          <p className={CT_CLASSES.subtitle}>
            {sortedCompletedTasks.length} task{sortedCompletedTasks.length !== 1 && "s"} marked as complete
          </p>
        </div>

        {/* Sort Controls */}
        <div className={CT_CLASSES.sortContainer}>
          <div className={CT_CLASSES.sortBox}>
            <div className={CT_CLASSES.filterLabel}>
              <Filter className="w-4 h-4 text-purple-500" />
              <span className="text-xs md:text-sm">Sort by:</span>
            </div>

            {/* Mobile Dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className={CT_CLASSES.select}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Desktop Buttons */}
            <div className={CT_CLASSES.btnGroup}>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={[
                    CT_CLASSES.btnBase,
                    sortBy === opt.id ? CT_CLASSES.btnActive : CT_CLASSES.btnInactive
                  ].join(" ")}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className={CT_CLASSES.list}>
        {sortedCompletedTasks.length === 0 ? (
          <div className={CT_CLASSES.emptyState}>
            <div className={CT_CLASSES.emptyIconWrapper}>
              <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
            </div>
            <h3 className={CT_CLASSES.emptyTitle}>No completed tasks yet!</h3>
            <p className={CT_CLASSES.emptyText}>Complete some tasks and they’ll appear here</p>
          </div>
        ) : (
          sortedCompletedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox={false}
              className="opacity-90 hover:opacity-100 transition-opacity text-sm md:text-base"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CompletedTasks;
