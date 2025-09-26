import { useState, useMemo, useCallback } from "react"
import { useOutletContext } from "react-router-dom"
import { Plus, Filter, Home as HomeIcon, Calendar as CalendarIcon } from "lucide-react"
import TaskModal from "../components/AddTask"
import TaskItem from "../components/TaskItem"
import axios from "axios"
import {
  WRAPPER, HEADER, ADD_BUTTON, STATS_GRID, STAT_CARD, ICON_WRAPPER, VALUE_CLASS, LABEL_CLASS,
  STATS, FILTER_OPTIONS, FILTER_LABELS, EMPTY_STATE, FILTER_WRAPPER, SELECT_CLASSES,
  TABS_WRAPPER, TAB_BASE, TAB_ACTIVE, TAB_INACTIVE
} from '../assets/dummy'

// API Base
const API_BASE = "http://localhost:5000/api/Task"

const Dashboard = () => {
  const { tasks, refreshTasks } = useOutletContext()
  const [filter, setFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  // Stats calculation
  const stats = useMemo(() => ({
    total: tasks.length,
    lowPriority: tasks.filter(t => t.priority?.toLowerCase() === "low").length,
    mediumPriority: tasks.filter(t => t.priority?.toLowerCase() === "medium").length,
    highPriority: tasks.filter(t => t.priority?.toLowerCase() === "high").length,
    completed: tasks.filter(t =>
      t.completed === true || t.completed === 1 ||
      (typeof t.completed === "string" && t.completed.toLowerCase() === "yes")
    ).length,
  }), [tasks])

  // Filter tasks
  const filteredTasks = useMemo(() => tasks.filter(task => {
    const dueDate = task.dueDate ? new Date(task.dueDate) : null
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    switch (filter) {
      case "today": return dueDate?.toDateString() === today.toDateString()
      case "week": return dueDate && dueDate >= today && dueDate <= nextWeek
      case "high":
      case "medium":
      case "low": return task.priority?.toLowerCase() === filter
      default: return true
    }
  }), [tasks, filter])

  // Save tasks (cookie-based auth)
  const handleTaskSave = useCallback(async (taskData) => {
    try {
      if (taskData.id) {
        await axios.put(`${API_BASE}/${taskData.id}/Task`, taskData, { withCredentials: true })
      }
      refreshTasks()
      setShowModal(false)
      setSelectedTask(null)
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }, [refreshTasks])

  return (
    <div className={WRAPPER}>
      {/* Header */}
      <div className={HEADER}>
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-[#F0F0F5] flex items-center gap-2">
            <HomeIcon className="text-[#FF6EC7] w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <span className="truncate">Task Overview</span>
          </h1>
          <p className="text-sm text-[#A0A0B0] mt-1 ml-7 truncate">Manage your tasks efficiently</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className={`${ADD_BUTTON} cursor-pointer bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white hover:shadow-lg`}
        >
          <Plus size={18} />
          Add New Task
        </button>
      </div>

      {/* Stats */}
      <div className={STATS_GRID}>
        {STATS.map(({ key, label, icon: Icon, iconColor, borderColor = "border-purple-100", valueKey, textColor, gradient }) => (
          <div key={key} className={`${STAT_CARD} ${borderColor}`}>
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`${ICON_WRAPPER} ${iconColor}`}><Icon className="w-4 h-4 md:w-5 md:h-5" /></div>
              <div className="min-w-0">
                <p className={`${VALUE_CLASS} ${gradient ? "bg-gradient-to-r from-[#FF6EC7] to-[#6A0DAD] bg-clip-text text-transparent" : textColor}`}>{stats[valueKey]}</p>
                <p className={LABEL_CLASS}>{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Filter */}
        <div className={FILTER_WRAPPER}>
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="w-5 h-5 text-[#FF6EC7] shrink-0" />
            <h2 className="text-base md:text-lg font-semibold text-[#F0F0F5] truncate">{FILTER_LABELS[filter]}</h2>
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className={SELECT_CLASSES}>
            {FILTER_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </select>
          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`${TAB_BASE} ${filter === opt ? TAB_ACTIVE : TAB_INACTIVE}`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className={EMPTY_STATE.wrapper}>
              <div className={EMPTY_STATE.iconWrapper}>
                <CalendarIcon className="w-8 h-8 text-[#FF6EC7]" />
              </div>
              <h3 className="text-lg font-semibold text-[#F0F0F5] mb-2">No tasks found</h3>
              <p className="text-sm text-[#A0A0B0] mb-4">
                {filter === "all" ? "Create your first task to get started" : "No tasks match this filter"}
              </p>
              <button onClick={() => setShowModal(true)} className={`${EMPTY_STATE.btn} cursor-pointer`}>Add New Task</button>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                onRefresh={refreshTasks}
                showCompleteCheckbox
                onEdit={() => { setSelectedTask(task); setShowModal(true); }}
              />
            ))
          )}
        </div>

        {/* Add Task (Desktop) */}
        <div
          onClick={() => setShowModal(true)}
          className="hidden md:flex items-center justify-center p-4 border-2 border-dashed border-[#6A0DAD]/40 rounded-xl hover:border-[#FF6EC7] bg-[#1B0D2C]/30 cursor-pointer transition-colors"
        >
          <Plus className="w-5 h-5 text-[#FF6EC7] mr-2" />
          <span className="text-[#A0A0B0] font-medium">Add New Task</span>
        </div>
      </div>

      {/* Modal */}
      <TaskModal
        isOpen={showModal || !!selectedTask}
        onClose={() => { setShowModal(false); setSelectedTask(null); }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  )
}

export default Dashboard
