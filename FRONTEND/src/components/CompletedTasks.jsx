// components/CompletedTasks.jsx
import { useState, useMemo } from "react"
import { useOutletContext } from "react-router-dom"
import { CheckCircle2, Filter } from "lucide-react"
import TaskItem from "../components/TaskItem"
import { SORT_OPTIONS } from "../assets/dummy"

const NEON_CLASSES = {
  page: "p-4 md:p-6 bg-[#1A1A2E] min-h-screen",
  header: "mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4",
  titleWrapper: "flex flex-col",
  title: "flex items-center gap-2 text-xl md:text-2xl font-bold text-[#F0F0F5]",
  subtitle: "text-sm md:text-base text-[#A0A0B0]",
  sortContainer: "flex items-center gap-2",
  sortBox: "flex flex-col md:flex-row items-center gap-2",
  filterLabel: "flex items-center gap-1 text-[#F0F0F5] text-xs md:text-sm",
  select: "bg-[#2C2C3C] border border-[#6A0DAD] rounded-lg text-[#F0F0F5] text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF6EC7] focus:border-[#FF6EC7]",
  btnGroup: "hidden md:flex gap-2",
  btnBase: "px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200",
  btnActive: "bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white shadow-md",
  btnInactive: "bg-[#2C2C3C] text-[#F0F0F5] border border-[#6A0DAD] hover:bg-[#6A0DAD]/20",
  list: "flex flex-col gap-3",
  emptyState: "flex flex-col items-center justify-center py-10 text-center text-[#F0F0F5]",
  emptyIconWrapper: "mb-3",
  emptyTitle: "text-lg md:text-xl font-bold text-[#FF6EC7]",
  emptyText: "text-sm md:text-base text-[#A0A0B0]",
}

const CompletedTasks = () => {
  const { tasks, refreshTasks } = useOutletContext()
  const [sortBy, setSortBy] = useState("newest")

  const sortedCompletedTasks = useMemo(() => {
    return tasks
      .filter(task =>
        [true, 1, "yes"].includes(
          typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
        )
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt)
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt)
          case "priority": {
            const order = { high: 3, medium: 2, low: 1 }
            return order[b.priority?.toLowerCase()] - order[a.priority?.toLowerCase()]
          }
          default:
            return 0
        }
      })
  }, [tasks, sortBy])

  return (
    <div className={NEON_CLASSES.page}>
      {/* Header */}
      <div className={NEON_CLASSES.header}>
        <div className={NEON_CLASSES.titleWrapper}>
          <h1 className={NEON_CLASSES.title}>
            <CheckCircle2 className="text-[#FF6EC7] w-5 h-5 md:w-6 md:h-6" />
            <span className="truncate">Completed Tasks</span>
          </h1>
          <p className={NEON_CLASSES.subtitle}>
            {sortedCompletedTasks.length} task{sortedCompletedTasks.length !== 1 && "s"} marked as complete
          </p>
        </div>

        {/* Sort Controls */}
        <div className={NEON_CLASSES.sortContainer}>
          <div className={NEON_CLASSES.sortBox}>
            <div className={NEON_CLASSES.filterLabel}>
              <Filter className="w-4 h-4 text-[#FF6EC7]" />
              <span>Sort by:</span>
            </div>

            {/* Mobile Dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className={NEON_CLASSES.select}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label} {opt.id === 'newest' ? 'First' : ''}</option>
              ))}
            </select>

            {/* Desktop Buttons */}
            <div className={NEON_CLASSES.btnGroup}>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={[NEON_CLASSES.btnBase, sortBy === opt.id ? NEON_CLASSES.btnActive : NEON_CLASSES.btnInactive].join(" ")}
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
      <div className={NEON_CLASSES.list}>
        {sortedCompletedTasks.length === 0 ? (
          <div className={NEON_CLASSES.emptyState}>
            <div className={NEON_CLASSES.emptyIconWrapper}>
              <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-[#FF6EC7]" />
            </div>
            <h3 className={NEON_CLASSES.emptyTitle}>No completed tasks yet!</h3>
            <p className={NEON_CLASSES.emptyText}>Complete some tasks and they’ll appear here</p>
          </div>
        ) : (
          sortedCompletedTasks.map(task => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox={false}
              className="opacity-90 hover:opacity-100 transition-opacity text-sm md:text-base"
            />
          ))
        )}
      </div>
    </div>
  )
}

export default CompletedTasks
