import React, { useState, useMemo, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Filter, SortDesc, SortAsc, Award, Plus, ListChecks, Clock } from 'lucide-react';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/AddTask';
import { SORT_OPTIONS } from '../assets/dummy';

const API_BASE = 'http://localhost:5000/api/Task/Task';
const sortOptions = [
  { id: 'newest', label: 'Newest', icon: <SortDesc className="w-3 h-3" /> },
  { id: 'oldest', label: 'Oldest', icon: <SortAsc className="w-3 h-3" /> },
  { id: 'priority', label: 'Priority', icon: <Award className="w-3 h-3" /> },
];

// Unified Neon Classes
const NEON_CLASSES = {
  page: 'p-4 md:p-6 bg-[#1A1A2E] min-h-screen',
  header: 'mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4',
  titleWrapper: 'flex flex-col',
  title: 'flex items-center gap-2 text-xl md:text-2xl font-bold text-[#F0F0F5]',
  subtitle: 'text-sm md:text-base text-[#A0A0B0]',
  sortContainer: 'flex items-center gap-2',
  sortBox: 'flex flex-col md:flex-row items-center gap-2',
  filterLabel: 'flex items-center gap-1 text-[#F0F0F5] text-xs md:text-sm',
  select: 'bg-[#2C2C3C] border border-[#6A0DAD] rounded-lg text-[#F0F0F5] text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6EC7] focus:border-[#FF6EC7]',
  btnGroup: 'hidden md:flex gap-2',
  btnBase: 'px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200',
  btnActive: 'bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white shadow-md',
  btnInactive: 'bg-[#2C2C3C] text-[#F0F0F5] border border-[#6A0DAD] hover:bg-[#6A0DAD]/20',
  addBox: 'flex items-center justify-center gap-3 cursor-pointer p-4 rounded-xl bg-[#2C2C3C] hover:bg-[#6A0DAD]/10 shadow-sm transition-all duration-200 mt-4',
  list: 'flex flex-col gap-3 mt-4',
  emptyState: 'flex flex-col items-center justify-center py-10 text-center text-[#F0F0F5]',
  emptyIconWrapper: 'mb-3',
  emptyTitle: 'text-lg md:text-xl font-bold text-[#FF6EC7]',
  emptyText: 'text-sm md:text-base text-[#A0A0B0]',
  emptyBtn: 'px-4 py-2 rounded-lg font-medium text-white shadow-md transition-all duration-200',
};

const PendingTasks = () => {
  const { tasks = [], refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // DELETE task
  const handleDelete = useCallback(async (id) => {
    try {
      await fetch(`${API_BASE}/${id}/Task/`, {
        method: 'DELETE',
        credentials: 'include',
      });
      refreshTasks();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }, [refreshTasks]);

  // Toggle complete
  const handleToggleComplete = useCallback(async (task) => {
    try {
      await fetch(`${API_BASE}/${task._id || task.id}/Task/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ completed: task.completed ? 'No' : 'Yes' }),
      });
      refreshTasks();
    } catch (err) {
      console.error('Toggle complete failed:', err);
    }
  }, [refreshTasks]);

  // Filter & sort pending tasks
  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter(
      t => !t.completed || (typeof t.completed === 'string' && t.completed.toLowerCase() === 'no')
    );
    return filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      const order = { high: 3, medium: 2, low: 1 };
      return order[b.priority?.toLowerCase()] - order[a.priority?.toLowerCase()];
    });
  }, [tasks, sortBy]);

  return (
    <div className={NEON_CLASSES.page}>
      {/* Header */}
      <div className={NEON_CLASSES.header}>
        <div className={NEON_CLASSES.titleWrapper}>
          <h1 className={NEON_CLASSES.title}>
            <ListChecks className="text-[#FF6EC7] w-5 h-5 md:w-6 md:h-6" />
            Pending Tasks
          </h1>
          <p className={NEON_CLASSES.subtitle}>
            {sortedPendingTasks.length} task{sortedPendingTasks.length !== 1 && 's'} needing your attention
          </p>
        </div>

        {/* Sort Controls */}
        <div className={NEON_CLASSES.sortContainer}>
          <div className={NEON_CLASSES.sortBox}>
            <div className={NEON_CLASSES.filterLabel}>
              <Filter className="w-4 h-4 text-[#FF6EC7]" />
              <span>Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className={NEON_CLASSES.select}
            >
              {sortOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
            <div className={NEON_CLASSES.btnGroup}>
              {sortOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={[NEON_CLASSES.btnBase, sortBy === opt.id ? NEON_CLASSES.btnActive : NEON_CLASSES.btnInactive].join(' ')}
                >
                  {opt.icon}{opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task */}
      <div className={NEON_CLASSES.addBox} onClick={() => setShowModal(true)}>
        <div className="flex items-center justify-center gap-3 text-[#F0F0F5] group-hover:text-[#FF6EC7] transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#2C2C3C] flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
            <Plus size={18} className="text-[#FF6EC7]" />
          </div>
          <span className="font-medium">Add New Task</span>
        </div>
      </div>

      {/* Pending Tasks List */}
      <div className={NEON_CLASSES.list}>
        {sortedPendingTasks.length === 0 ? (
          <div className={NEON_CLASSES.emptyState}>
            <div className={NEON_CLASSES.emptyIconWrapper}>
              <Clock className="w-8 h-8 text-[#FF6EC7]" />
            </div>
            <h3 className={NEON_CLASSES.emptyTitle}>All caught up!</h3>
            <p className={NEON_CLASSES.emptyText}>No pending tasks - great work!</p>
            <button
              onClick={() => setShowModal(true)}
              className={`${NEON_CLASSES.emptyBtn} bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] mt-2`}
            >
              Create New Task
            </button>
          </div>
        ) : (
          sortedPendingTasks.map(task => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              showCompleteCheckbox
              onDelete={() => handleDelete(task._id || task.id)}
              onToggleComplete={() => handleToggleComplete(task)}
              onEdit={() => { setSelectedTask(task); setShowModal(true); }}
            />
          ))
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={!!selectedTask || showModal}
        onClose={() => { setShowModal(false); setSelectedTask(null); refreshTasks(); }}
        taskToEdit={selectedTask}
      />
    </div>
  );
};

export default PendingTasks;
