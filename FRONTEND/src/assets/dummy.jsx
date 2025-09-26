import {
    User, Mail, Home,
    ListChecks,
    CheckCircle2, Lock, Home as HomeIcon, Flame,
    SortDesc, SortAsc, Award,
    Edit2,
    Trash2,
    MoreVertical,
    Clock,
    Calendar,
} from "lucide-react"

// BACKEND TEST 
// DUMMY DATA
const backendDummy = [
    {
        title: "Buy groceries",
        description: "Milk, bread, eggs, and spinach",
        priority: "Low",
        dueDate: "2025-05-02T18:00:00.000Z",
        completed: "No"
    },
    {
        "title": "Book dentist appointment",
        "description": "Routine check-up and cleaning",
        "priority": "Medium",
        "dueDate": "2025-05-10T10:00:00.000Z",
        "completed": true
    },
    {
        "title": "Book dentist appointment",
        "description": "Routine check-up and cleaning",
        "priority": "Medium",
        "dueDate": "2025-05-10T10:00:00.000Z",
        "completed": true
    },
    {
        "title": "Pay utility bills",
        "description": "Electricity and water bills for April",
        "priority": "High",
        "dueDate": "2025-04-28T12:00:00.000Z",
        "completed": "Yes"
    }
];

// FRONTEND DUMMY DATA

// assets/formConstants.js
export const baseControlClasses =
    "w-full px-4 py-2.5 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm";

export const priorityStyles = {
    Low: "bg-green-100 text-green-700 border-green-200",
    Medium: "bg-purple-100 text-purple-700 border-purple-200",
    High: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
};

// data/defaultTask.js
export const DEFAULT_TASK = {
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    completed: "No",
    id: null,
};

// LOGIN CSS


// GENERAL INPUT & BUTTON CLASSES
export const INPUT_WRAPPER =
  "flex items-center bg-[#2C2C3C] border border-[#6A0DAD] rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#FF6EC7] focus-within:border-[#FF6EC7] transition-all duration-200 text-[#F0F0F5]";
export const BUTTON_CLASSES =
  "w-full bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2";

// PROFILE SECTION CLASSES
export const FULL_BUTTON =
  "w-full  bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2";
export const SECTION_WRAPPER =
  "bg-[#1A1A2E] rounded-xl shadow-md border border-[#6A0DAD] p-6";
export const BACK_BUTTON =
  "flex items-center text-[#F0F0F5] hover:text-[#FF6EC7] mb-8 transition-colors duration-200";
export const DANGER_BTN =
  "w-full bg-gradient-to-r from-[#FF3B3B] to-[#FF6B6B] text-white py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2";

// PERSONAL INFORMATION FIELDS
export const personalFields = [
  { name: "username", type: "text", placeholder: "Full Name", icon: User },
  { name: "email", type: "email", placeholder: "Email", icon: Mail },
];

// SECURITY FIELDS
export const securityFields = [
  { name: "current", placeholder: "Current Password" },
  { name: "new", placeholder: "New Password" },
  { name: "confirm", placeholder: "Confirm Password" },
];

// SIDEBAR 

export const menuItems = [
    { text: "Dashboard", path: "/", icon: <Home className="w-5 h-5 text-[#FF6EC7]" /> },
    { text: "Pending Tasks", path: "/pending", icon: <ListChecks className="w-5 h-5 text-[#FF6EC7]" /> },
    { text: "Completed Tasks", path: "/complete", icon: <CheckCircle2 className="w-5 h-5 text-[#FF6EC7]" /> },
]

export const SIDEBAR_CLASSES = {
    desktop: "hidden md:flex flex-col fixed h-full w-20 lg:w-64 bg-[#1A1A2E]/90 backdrop-blur-sm border-r border-[#6A0DAD]/50 shadow-sm z-20 transition-all duration-300",
    mobileButton: "absolute md:hidden top-25 left-5 z-50 bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white p-2 rounded-full shadow-lg hover:scale-105 transition-all duration-300",
    mobileDrawerBackdrop: "fixed inset-0 bg-black/40 backdrop-blur-sm",
    mobileDrawer: "absolute top-0 left-0 w-64 h-full bg-[#1A1A2E]/90 backdrop-blur-md border-r border-[#6A0DAD]/50 shadow-lg z-50 p-4 flex flex-col space-y-6",
}

export const LINK_CLASSES = {
    base: "group flex items-center px-4 py-3 rounded-xl transition-all duration-300",
    active: "bg-gradient-to-r from-[#6A0DAD]/20 to-[#FF6EC7]/20 border-l-4 border-[#FF6EC7] text-[#FF6EC7] font-medium shadow-sm",
    inactive: "hover:bg-[#6A0DAD]/10 text-[#F0F0F5] hover:text-[#FF6EC7]",
    icon: "transition-transform duration-300 group-hover:scale-110 text-[#FF6EC7]",
    text: "text-sm font-medium ml-2 text-[#F0F0F5]",
}

export const PRODUCTIVITY_CARD = {
    container: "bg-[#2C2C3C] rounded-xl p-3 border border-[#6A0DAD]/30",
    header: "flex items-center justify-between mb-2",
    label: "text-xs font-semibold text-[#FF6EC7]",
    badge: "text-xs bg-[#6A0DAD]/30 text-[#FF6EC7] px-2 py-0.5 rounded-full",
    barBg: "w-full h-2 bg-[#6A0DAD]/20 rounded-full overflow-hidden",
    barFg: "h-full bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] animate-pulse",
}

export const TIP_CARD = {
    container: "bg-[#2C2C3C] rounded-xl p-4 border border-[#6A0DAD]/30",
    iconWrapper: "p-2 bg-[#6A0DAD]/20 rounded-lg",
    title: "text-sm font-semibold text-[#FF6EC7]",
    text: "text-xs text-[#A0A0B0] mt-1",
}


// SIGNUP 
export const FIELDS = [
    { name: "username", type: "text", placeholder: "Username", icon: User },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    { name: "password", type: "password", placeholder: "Password", icon: Lock },
]

export const Inputwrapper =
    "flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200"
export const BUTTONCLASSES =
    "w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
export const MESSAGE_SUCCESS = "bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-100"
export const MESSAGE_ERROR = "bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100"

// TASK ITEM
export const getPriorityColor = (priority) => {
  const colors = {
    low: "border-0 bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white",
    medium: "border-0 bg-gradient-to-r from-[#FF9F50] to-[#FFC75F] text-white",
    high: "border-0 bg-gradient-to-r from-[#FF4C61] to-[#FF6EC7] text-white",
  };
  return colors[priority?.toLowerCase()] || "border-gray-500 bg-gray-50/50 text-gray-700";
};

export const getPriorityBadgeColor = (priority) => {
  const colors = {
    low: "bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white",
    medium: "bg-gradient-to-r from-[#FF9F50] to-[#FFC75F] text-white",
    high: "bg-gradient-to-r from-[#FF4C61] to-[#FF6EC7] text-white",
  };
  return colors[priority?.toLowerCase()] || "bg-gray-100 text-gray-700";
};


// DASHBOARD
// UI Constants
// Wrapper & Header
export const WRAPPER = "p-4 md:p-6 min-h-screen overflow-hidden bg-[#0D0D1A] text-[#F0F0F5]"
export const HEADER =
  "flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3"

// Buttons
export const ADD_BUTTON =
  "flex items-center gap-2 bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] cursor-pointer text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full md:w-auto justify-center text-sm md:text-base"

// Stats grid & cards
export const STATS_GRID =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6"
export const STAT_CARD =
  "p-3 md:p-4 rounded-xl bg-[#1B0D2C]/60 border border-[#6A0DAD]/40 shadow-sm hover:shadow-lg transition-all duration-300 min-w-0 backdrop-blur-md"
export const ICON_WRAPPER =
  "p-1.5 md:p-2 rounded-lg bg-[#2A0E4D]/50"
export const VALUE_CLASS =
  "text-lg md:text-2xl font-bold truncate text-transparent bg-clip-text bg-gradient-to-r from-[#FF6EC7] to-[#6A0DAD]"
export const LABEL_CLASS = "text-xs text-[#A0A0B0] truncate"

// Stats definitions (dark theme + neon colors)
export const STATS = [
  {
    key: "total",
    label: "Total Tasks",
    icon: HomeIcon,
    iconColor: "bg-[#2A0E4D]/50 text-[#FF6EC7]",
    valueKey: "total",
    gradient: true,
  },
  {
    key: "lowPriority",
    label: "Low Priority",
    icon: Flame,
    iconColor: "bg-green-900/40 text-green-400",
    borderColor: "border-green-700/40",
    valueKey: "lowPriority",
    textColor: "text-green-400",
  },
  {
    key: "mediumPriority",
    label: "Medium Priority",
    icon: Flame,
    iconColor: "bg-orange-900/40 text-orange-400",
    borderColor: "border-orange-700/40",
    valueKey: "mediumPriority",
    textColor: "text-orange-400",
  },
  {
    key: "highPriority",
    label: "High Priority",
    icon: Flame,
    iconColor: "bg-red-900/40 text-red-400",
    borderColor: "border-red-700/40",
    valueKey: "highPriority",
    textColor: "text-red-400",
  },
]

// Filter options
export const FILTER_OPTIONS = ["all", "today", "week", "high", "medium", "low"]
export const FILTER_LABELS = {
  all: "All Tasks",
  today: "Today's Tasks",
  week: "This Week",
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
}

// Empty state (dark neon)
export const EMPTY_STATE = {
  wrapper:
    "p-6 bg-[#1B0D2C]/60 rounded-xl shadow-md border border-[#6A0DAD]/40 text-center backdrop-blur-md",
  iconWrapper:
    "w-16 h-16 bg-[#2A0E4D]/50 rounded-full flex items-center justify-center mx-auto mb-4",
  btn: "px-4 py-2 bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white rounded-lg text-sm font-medium shadow hover:shadow-lg transition",
}

// Filter UI Constants
export const FILTER_WRAPPER =
  "flex items-center justify-between bg-[#1B0D2C]/60 p-4 rounded-xl shadow-md border border-[#6A0DAD]/40 backdrop-blur-md"
export const SELECT_CLASSES =
  "px-3 py-2 border border-[#6A0DAD]/40 bg-[#0D0D1A] text-[#F0F0F5] rounded-lg focus:ring-2 focus:ring-[#FF6EC7] md:hidden text-sm"
export const TABS_WRAPPER =
  "hidden md:flex space-x-1 bg-[#2A0E4D]/50 p-1 rounded-lg backdrop-blur-md"
export const TAB_BASE =
  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
export const TAB_ACTIVE =
  "bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] text-white shadow"
export const TAB_INACTIVE =
  "text-[#A0A0B0] hover:bg-[#6A0DAD]/30 hover:text-[#F0F0F5]"



// COMPLETE TASK
export const SORT_OPTIONS = [
    { id: "newest", label: "Newest", icon: <SortDesc className="w-3 h-3" /> },
    { id: "oldest", label: "Oldest", icon: <SortAsc className="w-3 h-3" /> },
    { id: "priority", label: "Priority", icon: <Award className="w-3 h-3" /> },
]

// CSS class groups
export const CT_CLASSES = {
    page: "p-4 md:p-6 min-h-screen overflow-hidden",
    header: "flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3 md:gap-4",
    titleWrapper: "flex-1 min-w-0",
    title: "text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2 truncate",
    subtitle: "text-xs md:text-sm text-gray-500 mt-1 ml-7 md:ml-8",
    sortContainer: "w-full md:w-auto mt-2 md:mt-0",
    sortBox: "flex items-center justify-between bg-white p-2 md:p-3 rounded-xl shadow-sm border border-purple-100 w-full md:w-auto",
    filterLabel: "flex items-center gap-2 text-gray-700 font-medium",
    select: "px-2 py-1 md:px-3 md:py-2 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 md:hidden text-xs md:text-sm",
    btnGroup: "hidden md:flex space-x-1 bg-purple-50 p-1 rounded-lg ml-2 md:ml-3",
    btnBase: "px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1",
    btnActive: "bg-white text-purple-700 shadow-sm border border-purple-100",
    btnInactive: "text-gray-600 hover:text-purple-700 hover:bg-purple-100/50",
    list: "space-y-3 md:space-y-4",
    emptyState: "p-4 md:p-8 bg-white rounded-xl shadow-sm border border-purple-100 text-center",
    emptyIconWrapper: "w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4",
    emptyTitle: "text-base md:text-lg font-semibold text-gray-800 mb-2",
    emptyText: "text-xs md:text-sm text-gray-500",
}

// constants/cssClasses.js
export const layoutClasses = {
    container: "p-6 min-h-screen overflow-hidden",
    headerWrapper: "flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4",
    sortBox: "flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-purple-100 w-full md:w-auto",
    select: "px-3 py-2 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 md:hidden text-sm",
    tabWrapper: "hidden md:flex space-x-1 bg-purple-50 p-1 rounded-lg ml-3",
    tabButton: (active) =>
        `px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${active
            ? "bg-white text-purple-700 shadow-sm border border-purple-100"
            : "text-gray-600 hover:text-purple-700 hover:bg-purple-100/50"
        }`,
    addBox: "hidden md:block p-5 border-2 border-dashed border-purple-200 rounded-xl hover:border-purple-400 transition-colors cursor-pointer mb-6 bg-purple-50/50 group",
    emptyState: "p-8 bg-white rounded-xl shadow-sm border border-purple-100 text-center",
    emptyIconBg: "w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4",
    emptyBtn: "px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors",
};


// TASK ITEM

// Menu options for task actions
export const MENU_OPTIONS = [
    { action: "edit", label: "Edit Task", icon: <Edit2 size={14} className="text-purple-600" /> },
    { action: "delete", label: "Delete Task", icon: <Trash2 size={14} className="text-red-600" /> },
]

// CSS class groups for TaskItem
export const TI_CLASSES = {
  wrapper: "group p-4 sm:p-5 rounded-xl shadow-sm bg-[#2C2C3C] border-l-4 border-[#6A0DAD] hover:shadow-md transition-all duration-300", 
  leftContainer: "flex items-start gap-2 sm:gap-3 flex-1 min-w-0",
  completeBtn: "mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-full hover:bg-[#6A0DAD]/20 transition-colors duration-300",
  checkboxIconBase: "w-4 h-4 sm:w-5 sm:h-5 text-[#FF6EC7]",
titleBase: "text-base sm:text-lg font-medium truncate text-white ",
priorityBadge: "text-xs px-2 py-0.5 rounded-full shrink-0 bg-gradient-to-r from-[#6A0DAD]/20 to-[#FF6EC7]/20 text-[#FF6EC7] font-semibold",
  description: "text-sm text-[#A0A0B0] mt-1 truncate",
  subtasksContainer: "mt-3 sm:mt-4 space-y-2 sm:space-y-3 bg-[#6A0DAD]/10 p-2 sm:p-3 rounded-lg border border-[#6A0DAD]/30",
  progressBarBg: "h-1.5 bg-[#6A0DAD]/20 rounded-full overflow-hidden",
  progressBarFg: "h-full bg-gradient-to-r from-[#6A0DAD] to-[#FF6EC7] transition-all duration-300",
  rightContainer: "flex flex-col items-end gap-2 sm:gap-3",
  menuButton: "p-1 sm:p-1.5 hover:bg-[#6A0DAD]/20 rounded-lg text-[#F0F0F5] hover:text-[#FF6EC7] transition-colors duration-200",
  menuDropdown: "absolute right-0 mt-1 w-40 sm:w-48 bg-[#2C2C3C] border border-[#6A0DAD] rounded-2xl shadow-xl z-10 overflow-hidden animate-fadeIn",
  dateRow: "flex items-center gap-1.5 text-xs font-medium text-[#F0F0F5] whitespace-nowrap",
  createdRow: "flex items-center gap-1.5 text-xs text-[#A0A0B0] whitespace-nowrap",
}
