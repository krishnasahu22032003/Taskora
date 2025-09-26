// components/TaskModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, X, Save, Calendar, AlignLeft, Flag, CheckCircle } from 'lucide-react';
import { baseControlClasses, priorityStyles, DEFAULT_TASK } from '../assets/dummy';

const API_BASE = 'http://localhost:5000/api/Task';

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState(DEFAULT_TASK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!isOpen) return;
    if (taskToEdit) {
      const normalized =
        taskToEdit.completed === 'yes' || taskToEdit.completed === true ? 'yes' : 'no';

      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'Low',
        dueDate: taskToEdit.dueDate?.split('T')[0] || '',
        completed: normalized,
        id: taskToEdit._id,
      });
    } else {
      setTaskData(DEFAULT_TASK);
    }
    setError(null);
  }, [isOpen, taskToEdit]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (taskData.dueDate < today) {
      setError('Due date cannot be in the past.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const isEdit = Boolean(taskData.id);
      const url = isEdit ? `${API_BASE}/${taskData.id}/Task` : `${API_BASE}/Task`;

      const resp = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        credentials: 'include', // ✅ use cookies for auth
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!resp.ok) {
        if (resp.status === 401) return onLogout?.();
        const err = await resp.json();
        throw new Error(err.message || 'Failed to save task');
      }
      const saved = await resp.json();
      onSave?.(saved);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [taskData, today, onLogout, onSave, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-[#2C2C3C] border border-[#6A0DAD] rounded-xl max-w-md w-full shadow-lg p-6 relative animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#F0F0F5] flex items-center gap-2">
            {taskData.id
              ? <Save className="text-[#FF6EC7] w-5 h-5" />
              : <PlusCircle className="text-[#FF6EC7] w-5 h-5" />}
            {taskData.id ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#6A0DAD]/20 rounded-lg transition-colors text-[#A0A0B0] hover:text-[#FF6EC7]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-[#FF4C61] bg-[#FF4C61]/20 p-3 rounded-lg border border-[#FF4C61]">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#A0A0B0] mb-1">Task Title</label>
            <div className="flex items-center border border-[#6A0DAD] rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#FF6EC7] transition-all duration-200">
              <input
                type="text"
                name="title"
                required
                value={taskData.title}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm text-[#F0F0F5] bg-[#2C2C3C] placeholder-[#A0A0B0]"
                placeholder="Enter task title"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-[#A0A0B0] mb-1 flex items-center gap-1">
              <AlignLeft className="w-4 h-4 text-[#FF6EC7]" /> Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={taskData.description}
              onChange={handleChange}
              className="w-full border border-[#6A0DAD] rounded-lg px-3 py-2 text-sm text-[#F0F0F5] bg-[#2C2C3C] placeholder-[#A0A0B0] focus:outline-none focus:ring-2 focus:ring-[#FF6EC7] transition-all duration-200"
              placeholder="Add details about your task"
            />
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#A0A0B0] mb-1 flex items-center gap-1">
                <Flag className="w-4 h-4 text-[#FF6EC7]" /> Priority
              </label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className="w-full border border-[#6A0DAD] rounded-lg px-3 py-2 text-sm text-[#F0F0F5] bg-[#2C2C3C] focus:outline-none focus:ring-2 focus:ring-[#FF6EC7] transition-all duration-200"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#A0A0B0] mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-[#FF6EC7]" /> Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                min={today}
                value={taskData.dueDate}
                onChange={handleChange}
                className="w-full border border-[#6A0DAD] rounded-lg px-3 py-2 text-sm text-[#F0F0F5] bg-[#2C2C3C] focus:outline-none focus:ring-2 focus:ring-[#FF6EC7] transition-all duration-200"
              />
            </div>
          </div>

          {/* Completed Status */}
          <div>
            <label className="text-sm font-medium text-[#A0A0B0] mb-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-[#FF6EC7]" /> Status
            </label>
            <div className="flex gap-4">
              {[{ val: 'yes', label: 'Completed' }, { val: 'no', label: 'In Progress' }].map(
                ({ val, label }) => (
                  <label key={val} className="flex items-center">
                    <input
                      type="radio"
                      name="completed"
                      value={val}
                      checked={taskData.completed === val}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#FF6EC7] focus:ring-[#6A0DAD] border-[#6A0DAD] bg-[#2C2C3C]"
                    />
                    <span className="ml-2 text-sm text-[#F0F0F5]">{label}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-md transition-all duration-200"
          >
            {loading
              ? 'Saving...'
              : taskData.id
              ? (
                <>
                  <Save className="w-4 h-4" /> Update Task
                </>
                )
              : (
                <>
                  <PlusCircle className="w-4 h-4" /> Create Task
                </>
                )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
