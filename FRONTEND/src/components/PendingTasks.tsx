import React, { useState, useMemo, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Filter, SortDesc, SortAsc, Award, Plus, ListChecks, Clock } from 'lucide-react';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/AddTask';
import { layoutClasses } from '../assets/dummy';

interface FrontendTask {
  id?: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  completed: boolean; // always boolean in frontend
  subtasks?: { title: string; completed: boolean }[];
  createdAt?: string;
}

interface OutletContext {
  tasks: FrontendTask[];
  refreshTasks: () => void;
}

const API_BASE = 'http://localhost:5000/api/Task';
const sortOptions = [
  { id: 'newest', label: 'Newest', icon: <SortDesc className="w-3 h-3" /> },
  { id: 'oldest', label: 'Oldest', icon: <SortAsc className="w-3 h-3" /> },
  { id: 'priority', label: 'Priority', icon: <Award className="w-3 h-3" /> },
];

export const PendingTasks: React.FC = () => {
  const { tasks = [], refreshTasks } = useOutletContext<OutletContext>();
  const [sortBy, setSortBy] = useState<string>('newest');
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [selectedTask, setSelectedTask] = useState<FrontendTask | null>(null);

  const handleDelete = useCallback(async (id: string | undefined) => {
    if (!id) return;
    await fetch(`${API_BASE}/${id}/Task`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    refreshTasks();
  }, [refreshTasks]);

  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter((t) => !t.completed);
    return filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
      const order: Record<string, number> = { high: 3, medium: 2, low: 1 };
      return (order[b.priority?.toLowerCase() || 'low'] || 0) - (order[a.priority?.toLowerCase() || 'low'] || 0);
    });
  }, [tasks, sortBy]);

  return (
    <div className={layoutClasses.container}>
      {/* Header & Sort UI */}
      <div className={layoutClasses.headerWrapper}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ListChecks className="text-purple-500" /> Pending Tasks
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-7">
            {sortedPendingTasks.length} task{sortedPendingTasks.length !== 1 && 's'} needing your attention
          </p>
        </div>
        <div className={layoutClasses.sortBox}>
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Filter className="w-4 h-4 text-purple-500" />
            <span className="text-sm">Sort by:</span>
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={layoutClasses.select}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">By Priority</option>
          </select>
          <div className={layoutClasses.tabWrapper}>
            {sortOptions.map(opt => (
              <button key={opt.id} onClick={() => setSortBy(opt.id)} className={layoutClasses.tabButton(sortBy === opt.id)}>
                {opt.icon}{opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Task Button */}
      <div className={layoutClasses.addBox} onClick={() => setModalMode("add")}>
        <div className="flex items-center justify-center gap-3 text-gray-500 group-hover:text-purple-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
            <Plus size={18} className="text-purple-500" />
          </div>
          <span className="font-medium">Add New Task</span>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {sortedPendingTasks.length === 0 ? (
          <div className={layoutClasses.emptyState}>
            <div className="max-w-xs mx-auto py-6">
              <div className={layoutClasses.emptyIconBg}><Clock className="w-8 h-8 text-purple-500" /></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">All caught up!</h3>
              <p className="text-sm text-gray-500 mb-4">No pending tasks - great work!</p>
              <button onClick={() => setModalMode("add")} className={layoutClasses.emptyBtn}>Create New Task</button>
            </div>
          </div>
        ) : (
          sortedPendingTasks.map(t => (
            <TaskItem
              key={t.id}
              task={t}
              showCompleteCheckbox
              onDelete={() => handleDelete(t.id)}
              onEdit={() => { setSelectedTask(t); setModalMode("edit"); }}
              onRefresh={refreshTasks}
            />
          ))
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalMode !== null}
        onClose={() => { setModalMode(null); setSelectedTask(null); refreshTasks(); }}
        taskToEdit={modalMode === "edit" ? selectedTask : null}
      />
    </div>
  );
};
export default PendingTasks