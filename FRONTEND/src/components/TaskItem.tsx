import { useState, useEffect } from "react";
import axios from "axios";
import { format, isToday } from "date-fns";
import { getPriorityColor, getPriorityBadgeColor, TI_CLASSES, MENU_OPTIONS } from "../assets/dummy";
import { CheckCircle2, MoreVertical, Clock, Calendar } from "lucide-react";
import type { FrontendTask } from "../types/types";

interface Subtask {
  id?: string;
  title: string;
  completed: boolean;
}

interface TaskItemProps {
  task: FrontendTask;
  onRefresh?: () => void;
  onLogout?: () => void;
  showCompleteCheckbox?: boolean;
  onEdit?: () => void;
  onDelete?: () => void | Promise<void>;
}

const API_BASE = "http://localhost:5000/api/Task";

const computeCompleted = (c: boolean | string | number | undefined): boolean => {
  if (typeof c === "boolean") return c;
  if (typeof c === "number") return c === 1;
  if (typeof c === "string") return c.toLowerCase() === "yes";
  return false;
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onRefresh,
  onLogout,
  showCompleteCheckbox = true,
  onEdit,
  onDelete,
}) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(computeCompleted(task.completed));
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false); // prevent double clicks

  useEffect(() => {
    setIsCompleted(computeCompleted(task.completed));
    setSubtasks(task.subtasks || []);
  }, [task]);

  const borderColor = isCompleted ? "border-green-500" : getPriorityColor(task.priority).split(" ")[0];

  const handleComplete = async () => {
    if (!task.id || loading) return;
    setLoading(true);
    const newStatus = isCompleted ? "No" : "Yes";
    try {
      await axios.put(`${API_BASE}/${task.id}/Task`, { completed: newStatus }, { withCredentials: true });
      setIsCompleted(!isCompleted);
      onRefresh?.();
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 401) onLogout?.();
    } finally {
      setLoading(false);
    }
  };

  const handleSubtaskToggle = async (index: number) => {
    if (!task.id || loading) return;
    setLoading(true);
    const updatedSubtasks = subtasks.map((st, i) => i === index ? { ...st, completed: !st.completed } : st);
    try {
      await axios.put(`${API_BASE}/${task.id}/Task`, { subtasks: updatedSubtasks }, { withCredentials: true });
      setSubtasks(updatedSubtasks);
      onRefresh?.();
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 401) onLogout?.();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task.id || loading) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/${task.id}/Task`, { withCredentials: true });
      onDelete?.();
      onRefresh?.();
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 401) onLogout?.();
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: string) => {
    setShowMenu(false);
    if (action === "edit") onEdit?.();
    if (action === "delete") handleDelete();
  };

  const progress = subtasks.length ? (subtasks.filter(st => st.completed).length / subtasks.length) * 100 : 0;

  return (
    <div className={`${TI_CLASSES.wrapper} ${borderColor}`}>
      <div className={TI_CLASSES.leftContainer}>
        {showCompleteCheckbox && (
          <button
            aria-label={isCompleted ? "Mark task as incomplete" : "Mark task as complete"}
            onClick={handleComplete}
            disabled={loading}
            className={`${TI_CLASSES.completeBtn} ${isCompleted ? "text-green-500" : "text-gray-300"}`}
          >
            <CheckCircle2 size={18} className={`${TI_CLASSES.checkboxIconBase} ${isCompleted ? "fill-green-500" : ""}`} />
          </button>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            <h3 className={`${TI_CLASSES.titleBase} ${isCompleted ? "text-gray-400 line-through" : "text-gray-800"}`}>
              {task.title}
            </h3>
            <span className={`${TI_CLASSES.priorityBadge} ${getPriorityBadgeColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>

          {task.description && <p className={TI_CLASSES.description}>{task.description}</p>}

          {subtasks.length > 0 && (
            <div className={TI_CLASSES.subtasksContainer}>
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Subtasks Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className={TI_CLASSES.progressBarBg}>
                <div className={TI_CLASSES.progressBarFg} style={{ width: `${progress}%` }} />
              </div>
              <div className="space-y-1 sm:space-y-2 pt-1">
                {subtasks.map((st, i) => (
                  <div key={st.id || i} className="flex items-center gap-2 group/subtask">
                    <input
                      type="checkbox"
                      aria-label={`Mark subtask "${st.title}" as ${st.completed ? "incomplete" : "complete"}`}
                      checked={st.completed}
                      onChange={() => handleSubtaskToggle(i)}
                      disabled={loading}
                      className="w-4 h-4 text-purple-500 rounded border-gray-300 focus:ring-purple-500"
                    />
                    <span className={`text-sm truncate ${st.completed ? "text-gray-400 line-through" : "text-gray-600 group-hover/subtask:text-purple-700"} transition-colors duration-200`}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={TI_CLASSES.rightContainer}>
        <div className="relative">
          <button aria-label="Task actions menu" onClick={() => setShowMenu(!showMenu)} className={TI_CLASSES.menuButton}>
            <MoreVertical size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          {showMenu && (
            <div className={TI_CLASSES.menuDropdown}>
              {MENU_OPTIONS.map(opt => (
                <button
                  key={opt.action}
                  onClick={() => handleAction(opt.action)}
                  className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors duration-200"
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className={`${TI_CLASSES.dateRow} ${task.dueDate && isToday(new Date(task.dueDate)) ? "text-fuchsia-600" : "text-gray-500"}`}>
            <Calendar className="w-3.5 h-3.5" />
            {task.dueDate ? (isToday(new Date(task.dueDate)) ? "Today" : format(new Date(task.dueDate), "MMM dd")) : "—"}
          </div>
          <div className={TI_CLASSES.createdRow}>
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {task.createdAt ? `Created ${format(new Date(task.createdAt), "MMM dd")}` : "No date"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
