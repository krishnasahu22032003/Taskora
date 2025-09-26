import { useState, useEffect, useCallback, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Circle, TrendingUp, Zap, Clock } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";

const Layout = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get("http://localhost:5000/api/Task/Task", {
        withCredentials: true, // ✅ cookies
      });

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setTasks(arr);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load tasks.");
      if (err.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "yes")
    ).length;

    const totalCount = tasks.length;
    const pendingCount = totalCount - completedTasks;
    const completionPercentage = totalCount
      ? Math.round((completedTasks / totalCount) * 100)
      : 0;

    return { totalCount, completedTasks, pendingCount, completionPercentage };
  }, [tasks]);

  const StatCard = ({ title, value, icon }) => (
    <div className="p-2 sm:p-3 rounded-xl bg-[#2C2C3C] shadow-sm border border-[#6A0DAD] hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#6A0DAD]/10 to-[#FF6EC7]/10 group-hover:from-[#6A0DAD]/20 group-hover:to-[#FF6EC7]/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-xs text-[#F0F0F5] font-medium">{title}</p>
        </div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-[#1C1C2C] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#1C1C2C] p-6 flex items-center justify-center">
        <div className="bg-[#FF4C61]/20 text-[#FF4C61] p-4 rounded-xl border border-[#FF4C61] max-w-md">
          <p className="font-medium mb-2">Error loading tasks</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-4 px-4 py-2 bg-[#FF4C61]/10 text-[#FF4C61] rounded-lg text-sm font-medium hover:bg-[#FF4C61]/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#1C1C2C] text-[#F0F0F5]">
      <Navbar user={user} onLogout={onLogout} unreadNotifications={stats.pendingCount} />
      <Sidebar user={user} tasks={tasks} />

      <div className="ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-16 p-3 sm:p-4 md:p-4 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-3 sm:space-y-4">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            {/* Task Statistics */}
            <div className="bg-[#2C2C3C] rounded-xl p-4 sm:p-5 shadow-sm border border-[#6A0DAD]">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-[#F0F0F5]">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6EC7]" />
                Task Statistics
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <StatCard
                  title="Total Tasks"
                  value={stats.totalCount}
                  icon={<Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6EC7]" />}
                />
                <StatCard
                  title="Completed"
                  value={stats.completedTasks}
                  icon={<Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4EF066]" />}
                />
                <StatCard
                  title="Pending"
                  value={stats.pendingCount}
                  icon={<Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6EC7]" />}
                />
                <StatCard
                  title="Completion Rate"
                  value={`${stats.completionPercentage}%`}
                  icon={<Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6EC7]" />}
                />
              </div>

              <hr className="my-3 sm:my-4 border-[#6A0DAD]" />

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-[#F0F0F5]">
                  <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                    <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF6EC7] fill-[#FF6EC7]" />
                    Task Progress
                  </span>
                  <span className="text-xs bg-[#6A0DAD]/20 text-[#6A0DAD] px-1.5 py-0.5 sm:px-2 rounded-full">
                    {stats.completedTasks}/{stats.totalCount}
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="flex gap-1.5 items-center">
                    <div className="flex-1 h-2 sm:h-3 bg-[#6A0DAD]/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] transition-all duration-500"
                        style={{ width: `${stats.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#2C2C3C] rounded-xl p-4 sm:p-5 shadow-sm border border-[#6A0DAD]">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-[#F0F0F5]">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6EC7]" />
                Recent Activity
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id || task.id}
                    className="flex items-center justify-between p-2 sm:p-3 hover:bg-[#6A0DAD]/10 rounded-lg transition-colors duration-200 border border-transparent hover:border-[#6A0DAD]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F0F0F5] break-words whitespace-normal">
                        {task.title}
                      </p>
                      <p className="text-xs text-[#A0A0B0] mt-0.5">
                        {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "No date"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2 ${
                        task.completed
                          ? "bg-[#4EF066]/20 text-[#4EF066]"
                          : "bg-[#FF6EC7]/20 text-[#FF6EC7]"
                      }`}
                    >
                      {task.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-4 sm:py-6 px-2">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-[#6A0DAD]/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-[#FF6EC7]" />
                    </div>
                    <p className="text-sm text-[#A0A0B0]">No recent activity</p>
                    <p className="text-xs text-[#707070] mt-1">Tasks will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
