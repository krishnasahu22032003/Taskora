import React, { useState, useEffect, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { PlusCircle, X, Save, Calendar, AlignLeft, Flag, CheckCircle } from 'lucide-react';
import axios from 'axios';
import type { FrontendTask, Task } from '../types/types';
import { baseControlClasses, priorityStyles, DEFAULT_TASK } from '../assets/dummy';

const API_BASE = 'http://localhost:5000/api/Task'; // Correct backend route

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: FrontendTask | null;
  onSave?: (task: FrontendTask) => void;
  onLogout?: () => void;
}

// Normalize priority
const normalizePriority = (p?: string): 'Low' | 'Medium' | 'High' => {
  if (!p) return 'Medium';
  const lower = p.toLowerCase();
  if (lower === 'low') return 'Low';
  if (lower === 'medium') return 'Medium';
  return 'High';
};

// Normalize completed to boolean
const normalizeCompleted = (c: any): boolean => {
  if (typeof c === 'boolean') return c;
  if (typeof c === 'string') return c.toLowerCase() === 'yes';
  if (typeof c === 'number') return c === 1;
  return false;
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState<FrontendTask>({ ...DEFAULT_TASK });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Initialize task data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (taskToEdit) {
      setTaskData({
        ...taskToEdit,
        id: (taskToEdit as any)._id || taskToEdit.id, // map MongoDB _id
        completed: normalizeCompleted(taskToEdit.completed),
        dueDate: taskToEdit.dueDate || '',
      });
    } else {
      setTaskData({ ...DEFAULT_TASK });
    }
    setError(null);
  }, [isOpen, taskToEdit]);

  // Handle input changes
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setTaskData(prev => ({
        ...prev,
        [name]: name === 'priority' ? normalizePriority(value) : value,
      }));
    },
    []
  );

  // Handle form submit (create or update)
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!taskData.title.trim()) {
        setError('Task title is required.');
        return;
      }

      if (taskData.dueDate && taskData.dueDate < today) {
        setError('Due date cannot be in the past.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const payload: Task = {
          ...taskData,
          priority: normalizePriority(taskData.priority),
          completed: taskData.completed ? 'Yes' : 'No',
          dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : undefined,
        };

        if (taskData.id) {
          // Update task
   await axios.put(`${API_BASE}/${taskData.id}/Task/`, payload, { withCredentials: true });
        } else {
          // Create task
  await axios.post(`${API_BASE}/Task`, payload, { withCredentials: true });
        }
        onClose();
      } catch (err: any) {
        console.error(err);
        if (err?.response?.status === 401) {
          onLogout?.();
        } else {
          setError(err?.response?.data?.message || 'Failed to save task');
        }
      } finally {
        setLoading(false);
      }
    },
    [taskData, onSave, onClose, onLogout, today]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white border border-purple-100 rounded-xl max-w-md w-full shadow-lg p-6 relative animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {taskData.id ? <Save className="text-purple-500 w-5 h-5" /> : <PlusCircle className="text-purple-500 w-5 h-5" />}
            {taskData.id ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-gray-500 hover:text-purple-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <div className="flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200">
              <input
                type="text"
                name="title"
                required
                value={taskData.title}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm"
                placeholder="Enter task title"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <AlignLeft className="w-4 h-4 text-purple-500" /> Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={taskData.description}
              onChange={handleChange}
              className={baseControlClasses}
              placeholder="Add details about your task"
            />
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Flag className="w-4 h-4 text-purple-500" /> Priority
              </label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className={`${baseControlClasses} ${priorityStyles[taskData.priority]}`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-purple-500" /> Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                min={today}
                value={taskData.dueDate}
                onChange={handleChange}
                className={baseControlClasses}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-purple-500" /> Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="completed"
                  checked={taskData.completed}
                  onChange={() => setTaskData(prev => ({ ...prev, completed: true }))}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Completed</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="completed"
                  checked={!taskData.completed}
                  onChange={() => setTaskData(prev => ({ ...prev, completed: false }))}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">In Progress</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-md transition-all duration-200"
          >
            {loading ? 'Saving...' : taskData.id ? <><Save className="w-4 h-4" /> Update Task</> : <><PlusCircle className="w-4 h-4" /> Create Task</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
