// src/components/AddTask.tsx
import React, { useState, useEffect, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { PlusCircle, X, Save, Calendar, AlignLeft, Flag, CheckCircle } from 'lucide-react';
import { baseControlClasses, priorityStyles, DEFAULT_TASK } from '../assets/dummy';
import type { Task, FrontendTask } from '../types/types';

const API_BASE = 'http://localhost:5000/api/tasks';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: FrontendTask | null;
  onSave?: (task: FrontendTask) => void; // backend type
  onLogout?: () => void;
}

const normalizePriority = (p: string): "Low" | "Medium" | "High" => {
  const formatted = p.toLowerCase();
  if (formatted === "low") return "Low";
  if (formatted === "medium") return "Medium";
  return "High";
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState<FrontendTask>({ ...DEFAULT_TASK });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Populate modal when opening
useEffect(() => {
  if (!isOpen) return;

  if (taskToEdit) {
    setTaskData({
      ...taskToEdit,
      completed: taskToEdit.completed === true, // ensure boolean
      id: taskToEdit.id, // only use `id`, remove _id reference
    });
  } else {
    setTaskData({ ...DEFAULT_TASK });
  }

  setError(null);
}, [isOpen, taskToEdit]);


  // Generic input handler
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

  // Get auth headers
  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  // Handle form submit
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (taskData.dueDate < today) {
        setError('Due date cannot be in the past.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Convert FrontendTask → Task
        const payload: Task = {
          ...taskData,
          completed: taskData.completed ? 'Yes' : 'No',
          id: taskData.id,
        };

        const isEdit = Boolean(taskData.id);
        const url = isEdit ? `${API_BASE}/${taskData.id}/gp` : `${API_BASE}/gp`;

        const resp = await fetch(url, {
          method: isEdit ? 'PUT' : 'POST',
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          if (resp.status === 401) return onLogout?.();
          const err = await resp.json();
          throw new Error(err.message || 'Failed to save task');
        }

        const saved = await resp.json();
        onSave?.(saved); // backend Task
        onClose();
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    },
    [taskData, today, getHeaders, onLogout, onSave, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
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
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
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
                  value="Yes"
                  checked={taskData.completed === true}
                  onChange={() => setTaskData(prev => ({ ...prev, completed: true }))}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Completed</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="completed"
                  value="No"
                  checked={taskData.completed === false}
                  onChange={() => setTaskData(prev => ({ ...prev, completed: false }))}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">In Progress</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
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
