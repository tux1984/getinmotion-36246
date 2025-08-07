// English-only translations
export const translations = {
  // UI Common
  ui: {
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    close: "Close",
    submit: "Submit",
    back: "Back",
    next: "Next",
    continue: "Continue",
    finish: "Finish",
    yes: "Yes",
    no: "No",
    ok: "OK",
    search: "Search",
    filter: "Filter",
    select: "Select",
    selectAll: "Select All",
    clear: "Clear",
    refresh: "Refresh",
    settings: "Settings",
    help: "Help",
    home: "Home",
    generatingRecommendations: "Generating recommendations..."
  },

  // Dashboard
  dashboard: {
    welcome: "Welcome",
    welcomeText: "Ready to take your creative business to the next level?",
    yourNextStep: "Your Next Step",
    taskManagement: "Task Management",
    activeTasks: "Active Tasks",
    completedTasks: "Completed Tasks",
    pendingTasks: "Pending Tasks",
    newTask: "New Task",
    viewAll: "View All",
    simpleView: "Simple View",
    taskLimit: "Task Limit",
    noTasks: "No tasks yet",
    noTasksDesc: "Let's create your first task to get started!",
    createFirstTask: "Create First Task",
    letsStart: "Let's Start!",
    letsKeepWorking: "Let's Keep Working!",
    keepWorking: "Keep Working",
    chatWithMe: "Chat with me",
    chatWithAgent: "Chat with Agent",
    almostThere: "Almost there!",
    keepGoing: "Keep going!",
    youGotThis: "You got this!",
    greatProgress: "Great progress!",
    nextUp: "Next up",
    whyImportant: "Why is this important?",
    whatYoullAchieve: "What you'll achieve",
    estimatedTime: "Estimated time",
    timeSpent: "Time spent",
    minutes: "minutes",
    howIsGoing: "How is it going?",
    going: "going",
    readyToCreate: "Ready to create",
    createFirst: "Create first",
    getStarted: "Get Started",
    yourCreativeJourney: "Your Creative Journey",
    continueTask: "Continue Task",
    welcomeTitle: "Welcome to Your Dashboard",
    welcomeSubtitle: "Your personal command center for business growth",
    priorityTasks: "Priority Tasks",
    activeAgents: "Active Agents",
    quickActions: "Quick Actions",
    projectProgress: "Project Progress",
    viewAgent: "View Agent",
    retakeAssessment: "Retake Assessment",
    startWithAgent: "Start with Agent",
    recommendedAssistant: "Recommended Assistant",
    noActiveAgents: "No active agents",
    scheduleSession: "Schedule Session",
    viewProgress: "View Progress"
  },

  // Master Coordinator
  masterCoordinator: {
    title: "Master Coordinator",
    subtitle: "Your AI-powered business growth coordinator",
    welcome: "Welcome back!",
    currentStatus: "Current Status",
    activeSlots: "Active Slots",
    completed: "Completed",
    maturityLevel: "Maturity Level",
    nextRecommendations: "Next Recommendations",
    viewAllTasks: "View All Tasks",
    startWithAgent: "Start with Agent",
    choosePath: "Choose Your Path",
    getPersonalizedGuidance: "Get personalized guidance",
    exploreSubAgents: "Explore specialized agents",
    progressToNext: "Progress to next level",
    personalCoordinator: "Your Personal Coordinator",
    alwaysHereToGuide: "Always here to guide you",
    preparingCoordinator: "Preparing your coordinator...",
    configuringExperience: "Configuring your experience",
    freeSlots: "free slots",
    excellentProgress: "Excellent progress!",
    successRate: "Success Rate",
    efficiency: "Efficiency",
    incredible: "Incredible!",
    completedTasks: "completed tasks"
  },

  // Tasks
  tasks: {
    completed: "Completed",
    pending: "Pending",
    inProgress: "In Progress",
    cancelled: "Cancelled",
    developWithAgent: "Develop with Agent",
    continueTask: "Continue Task",
    activateTask: "Activate Task",
    completeTask: "Complete Task",
    markCompleted: "Mark Completed",
    quickComplete: "Quick Complete",
    stepByStep: "Step by Step",
    continueSteps: "Continue Steps",
    startTask: "Start Task",
    delete: "Delete",
    subtasks: "Subtasks",
    progress: "Progress",
    dueDate: "Due Date",
    taskCreated: "Task created successfully",
    taskUpdated: "Task updated successfully",
    taskDeleted: "Task deleted successfully",
    taskCompleted: "Task completed successfully",
    limitReached: "Task limit reached",
    completeOthers: "Complete other tasks first",
    completeThisFirst: "Complete this task first",
    needToComplete: "You need to complete",
    due: "due",
    tasksLabel: "tasks",
    taskStatus: {
      completed: "Completed",
      pending: "Pending",
      inProgress: "In Progress",
      cancelled: "Cancelled"
    }
  },

  // Messages
  messages: {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
    loading: "Loading...",
    saving: "Saving...",
    deleting: "Deleting...",
    processing: "Processing...",
    connecting: "Connecting...",
    connected: "Connected",
    disconnected: "Disconnected",
    validationError: "Please check your input",
    networkError: "Network error occurred",
    unexpectedError: "An unexpected error occurred"
  },

  // Auth
  auth: {
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    forgotPassword: "Forgot Password",
    resetPassword: "Reset Password",
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    signInSuccess: "Successfully signed in",
    signUpSuccess: "Successfully signed up",
    signOutSuccess: "Successfully signed out",
    invalidCredentials: "Invalid credentials",
    accountCreated: "Account created successfully"
  },

  // Agents
  agents: {
    costCalculator: "Cost Calculator",
    contractGenerator: "Contract Generator",
    maturityEvaluator: "Maturity Evaluator",
    exportAdvisor: "Export Advisor",
    portfolioCatalog: "Portfolio Catalog",
    admin: "Administrative Assistant",
    selectAgent: "Select Agent",
    workingWith: "Working with",
    startWorking: "Start Working",
    comingSoon: "Coming Soon"
  }
};

export type Translations = typeof translations;

export function getTranslations(): Translations {
  return translations;
}

export function getTranslation(path: string, fallback = ""): string {
  const keys = path.split('.');
  let current: any = translations;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return fallback || path;
    }
  }
  
  return typeof current === 'string' ? current : fallback || path;
}