// Sistema de traducciones centralizado
export interface Translations {
  // UI Common
  ui: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    close: string;
    submit: string;
    back: string;
    next: string;
    continue: string;
    finish: string;
    yes: string;
    no: string;
    ok: string;
    search: string;
    filter: string;
    select: string;
    selectAll: string;
    clear: string;
    refresh: string;
    settings: string;
    help: string;
    home: string;
    generatingRecommendations: string;
  };

  // Dashboard
  dashboard: {
    welcome: string;
    welcomeText: string;
    yourNextStep: string;
    taskManagement: string;
    activeTasks: string;
    completedTasks: string;
    pendingTasks: string;
    newTask: string;
    viewAll: string;
    simpleView: string;
    taskLimit: string;
    noTasks: string;
    noTasksDesc: string;
    createFirstTask: string;
    letsStart: string;
    letsKeepWorking: string;
    keepWorking: string;
    chatWithMe: string;
    chatWithAgent: string;
    almostThere: string;
    keepGoing: string;
    youGotThis: string;
    greatProgress: string;
    nextUp: string;
    whyImportant: string;
    whatYoullAchieve: string;
    estimatedTime: string;
    timeSpent: string;
    minutes: string;
    howIsGoing: string;
    going: string;
    readyToCreate: string;
    createFirst: string;
    getStarted: string;
    yourCreativeJourney: string;
    continueTask: string;
    
    // TaskBasedDashboard specific
    welcomeTitle: string;
    welcomeSubtitle: string;
    priorityTasks: string;
    activeAgents: string;
    quickActions: string;
    projectProgress: string;
    viewAgent: string;
    retakeAssessment: string;
    startWithAgent: string;
    recommendedAssistant: string;
    noActiveAgents: string;
    scheduleSession: string;
    viewProgress: string;
  };

  // Master Coordinator
  masterCoordinator: {
    title: string;
    subtitle: string;
    welcome: string;
    currentStatus: string;
    activeSlots: string;
    completed: string;
    maturityLevel: string;
    nextRecommendations: string;
    viewAllTasks: string;
    startWithAgent: string;
    choosePath: string;
    getPersonalizedGuidance: string;
    exploreSubAgents: string;
    progressToNext: string;
    personalCoordinator: string;
    alwaysHereToGuide: string;
    preparingCoordinator: string;
    configuringExperience: string;
    freeSlots: string;
    excellentProgress: string;
    successRate: string;
    efficiency: string;
    incredible: string;
    completedTasks: string;
  };

  // Greetings and coaching
  greetings: {
    goodMorning: string;
    goodAfternoon: string;
    goodEvening: string;
    firstTime: string;
    excellentProgress: string;
    manyActiveTasks: string;
    perfectMoment: string;
  };

  // Coaching tips
  coaching: {
    tip1: string;
    tip2: string;
    tip3: string;
    tip4: string;
    tip5: string;
  };

  // Maturity levels
  maturityLevels: {
    explorer: string;
    builder: string;
    strategist: string;
    visionary: string;
  };

  // Tasks
  tasks: {
    completed: string;
    pending: string;
    inProgress: string;
    cancelled: string;
    developWithAgent: string;
    continueTask: string;
    activateTask: string;
    completeTask: string;
    markCompleted: string;
    quickComplete: string;
    delete: string;
    subtasks: string;
    progress: string;
    dueDate: string;
    taskCreated: string;
    taskUpdated: string;
    taskDeleted: string;
    taskCompleted: string;
    limitReached: string;
    completeOthers: string;
    completeThisFirst: string;
    needToComplete: string;
    due: string;
    tasksLabel: string;
    taskStatus: {
      completed: string;
      pending: string;
      inProgress: string;
      cancelled: string;
    };
  };

  // Forms
  forms: {
    title: string;
    description: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    city: string;
    country: string;
    required: string;
    optional: string;
    placeholder: {
      enterText: string;
      selectOption: string;
      chooseFile: string;
      searchHere: string;
    };
    validation: {
      required: string;
      email: string;
      minLength: string;
      maxLength: string;
      passwordMatch: string;
    };
  };

  // Buttons
  buttons: {
    create: string;
    update: string;
    save: string;
    cancel: string;
    delete: string;
    submit: string;
    reset: string;
    clear: string;
    confirm: string;
    dismiss: string;
    tryAgain: string;
    getStarted: string;
    learnMore: string;
    showMore: string;
    showLess: string;
  };

  // Messages
  messages: {
    success: string;
    error: string;
    warning: string;
    info: string;
    loading: string;
    saving: string;
    deleting: string;
    processing: string;
    connecting: string;
    connected: string;
    disconnected: string;
    validationError: string;
    networkError: string;
    unexpectedError: string;
  };

  // Auth
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    forgotPassword: string;
    resetPassword: string;
    emailRequired: string;
    passwordRequired: string;
    signInSuccess: string;
    signUpSuccess: string;
    signOutSuccess: string;
    invalidCredentials: string;
    accountCreated: string;
  };

  // Agents
  agents: {
    costCalculator: string;
    contractGenerator: string;
    maturityEvaluator: string;
    exportAdvisor: string;
    portfolioCatalog: string;
    admin: string;
    selectAgent: string;
    workingWith: string;
    startWorking: string;
    comingSoon: string;
  };

  // Status
  status: {
    active: string;
    inactive: string;
    online: string;
    offline: string;
    available: string;
    busy: string;
    away: string;
    ready: string;
    processing: string;
    complete: string;
    failed: string;
  };

  // Time
  time: {
    now: string;
    today: string;
    yesterday: string;
    tomorrow: string;
    thisWeek: string;
    lastWeek: string;
    thisMonth: string;
    lastMonth: string;
    thisYear: string;
    ago: string;
    in: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };

  // Task Status and Progress
  taskStatus: {
    completed: string;
    completedPercentage: string; // "{percentage}% completed"
    completedTime: string; // "Completed {timeAgo}"
    progressPercentage: string; // "{percentage}% progress"
  };

  // Time Estimates
  timeEstimates: {
    hours_1_2: string; // "1-2 hours"
    hours_2_3: string; // "2-3 hours"
    hours_2_4: string; // "2-4 hours"
    hours_3_4: string; // "3-4 hours"
    hours_3_5: string; // "3-5 hours"
    hours_4_5: string; // "4-5 hours"
    hours_4_6: string; // "4-6 hours"
    hours_5_8: string; // "5-8 hours"
    hours_6_10: string; // "6-10 hours"
  };

  // Maturity Calculator
  maturityCalculator: {
    title: string;
    description: string;
    generatingTasks: string;
    generatingTasksDescription: string;
    ideaValidation: string;
    userExperience: string;
    marketFit: string;
    monetization: string;
  };

  // Missions Dashboard
  missionsDashboard: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allMissions: string;
    activeMissions: string;
    completedMissions: string;
    filterByStatus: string;
    filterByPriority: string;
    filterByAgent: string;
    all: string;
    pending: string;
    inProgress: string;
    completed: string;
    high: string;
    medium: string;
    low: string;
    continueTask: string;
    startTask: string;
    reviewTask: string;
    completeTask: string;
    taskStats: string;
    activeCount: string;
    completedCount: string;
    remainingSlots: string;
    progressTitle: string;
    noMissions: string;
    noMissionsDesc: string;
    createFirst: string;
    estimatedTime: string;
    minutes: string;
    priority: string;
    agent: string;
    status: string;
    lastUpdated: string;
    daysAgo: string;
    today: string;
    yesterday: string;
    recommendedTasks: string;
    recommendedSubtitle: string;
    convertToTask: string;
    recommendationsPriority: string;
    estimatedTimeLabel: string;
    hideRecommendations: string;
    showRecommendations: string;
  };

  // Recommended Tasks
  recommendedTasks: {
    categories: {
      validation: string;
      finances: string;
      legal: string;
      marketing: string;
      operations: string;
      strategy: string;
      expansion: string;
      networking: string;
      branding: string;
      growth: string;
      innovation: string;
    };
    agents: {
      culturalConsultant: string;
      costCalculator: string;
      legalAdvisor: string;
      marketingAdvisor: string;
      projectManager: string;
      pricingAssistant: string;
      exportAdvisor: string;
      stakeholderConnector: string;
      brandingStrategist: string;
      scalingSpecialist: string;
      innovationConsultant: string;
      ecosystemBuilder: string;
    };
    explorador: {
      validateBusiness: {
        title: string;
        description: string;
        prompt: string;
      };
      calculateCosts: {
        title: string;
        description: string;
        prompt: string;
      };
      legalStructure: {
        title: string;
        description: string;
        prompt: string;
      };
    };
    constructor: {
      digitalMarketing: {
        title: string;
        description: string;
        prompt: string;
      };
      projectManagement: {
        title: string;
        description: string;
        prompt: string;
      };
      pricingSystem: {
        title: string;
        description: string;
        prompt: string;
      };
    };
    estratega: {
      internationalMarkets: {
        title: string;
        description: string;
        prompt: string;
      };
      stakeholderNetwork: {
        title: string;
        description: string;
        prompt: string;
      };
      personalBrand: {
        title: string;
        description: string;
        prompt: string;
      };
    };
    visionario: {
      scalabilityStrategy: {
        title: string;
        description: string;
        prompt: string;
      };
      disruptiveInnovation: {
        title: string;
        description: string;
        prompt: string;
      };
      businessEcosystem: {
        title: string;
        description: string;
        prompt: string;
      };
    };
  };
  
  // Agent filtering and management
  agentFilters: {
    search: string;
    category: string;
    status: string;
    priority: string;
    sortBy: string;
    clearFilters: string;
    allCategories: string;
    filtersLabel: string;
  };
  
  // Task management
  taskManagement: {
    taskLimit: string;
    currentTasks: string;
    recommendation: string;
    pauseTask: string;
    resumeTask: string;
    deleteTask: string;
    reorderTasks: string;
    limitReached: string;
    limitWarning: string;
    smartSuggestion: string;
    manage: string;
    paused: string;
  };
  
  // Common sorting and filtering options
  sortOptions: {
    name: string;
    usage: string;
    impact: string;
  };
  
  // Impact levels
  impact: {
    high: string;
    medium: string;
    low: string;
  };
  
  // Agent Manager
  agentManager: {
    title: string;
    subtitle: string;
    categories: {
      Financiera: string;
      Legal: string;
      Diagnóstico: string;
      Comercial: string;
      Operativo: string;
      Comunidad: string;
    };
    priority: string;
    impact: string;
    enabled: string;
    disabled: string;
    activate: string;
    deactivate: string;
    allAgents: string;
    recommended: string;
    usageCount: string;
    lastUsed: string;
    never: string;
    activating: string;
    deactivating: string;
    loading: string;
    noAgentsFound: string;
    tryAdjusting: string;
    clearAllFilters: string;
    search: string;
    filters: string;
    filterCategories: string;
    totalAgents: string;
    activeAgents: string;
  };
  
  // Recommended Agents
  recommendedAgents: {
    recommendedAgents: string;
    primaryAgents: string;
    secondaryAgents: string;
    chatWith: string;
    configure: string;
    active: string;
    paused: string;
    inactive: string;
    activeTasks: string;
    lastUsed: string;
    never: string;
  };
  
  // Hero Section
  heroSection: {
    agentsSection: {
      title: string;
      subtitle: string;
      features: {
        instant: {
          title: string;
          description: string;
        };
        specialized: {
          title: string;
          description: string;
        };
        secure: {
          title: string;
          description: string;
        };
        collaborative: {
          title: string;
          description: string;
        };
      };
      categories: {
        financial: string;
        legal: string;
        operational: string;
        marketing: string;
      };
      cta: string;
      preview: string;
    };
    title: string;
    subtitle: string;
    ctaButton: string;
    scrollHint: string;
  };

  footer: {
    tagline: string;
    product: string;
    platform: string;
    calculator: string;
    dashboard: string;
    agents: string;
    agentsGallery: string;
    resources: string;
    login: string;
    admin: string;
    waitlist: string;
    legal: string;
    privacyPolicy: string;
    termsOfService: string;
    copyright: string;
    followUs: string;
  };

  productExplanation: {
    title: string;
    subtitle: string;
    step1: {
      title: string;
      description: string;
    };
    step2: {
      title: string;
      description: string;
    };
    step3: {
      title: string;
      description: string;
    };
    step4: {
      title: string;
      description: string;
    };
  };

  valueProposition: {
    title: string;
    subtitle: string;
    reasons: Array<{
      title: string;
      description: string;
    }>;
  };

  profileSelector: {
    title: string;
    subtitle: string;
    ideaTitle: string;
    ideaDescription: string;
    soloTitle: string;
    soloDescription: string;
    teamTitle: string;
    teamDescription: string;
    confirmButton: string;
    selectedMessage: string;
  };
}

export const translations: Record<'en' | 'es', Translations> = {
  en: {
    ui: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      close: 'Close',
      submit: 'Submit',
      back: 'Back',
      next: 'Next',
      continue: 'Continue',
      finish: 'Finish',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      search: 'Search',
      filter: 'Filter',
      select: 'Select',
      selectAll: 'Select All',
      clear: 'Clear',
      refresh: 'Refresh',
      settings: 'Settings',
      help: 'Help',
      home: 'Home',
      generatingRecommendations: 'Generating personalized recommendations...',
    },
    dashboard: {
      welcome: 'Welcome to GET IN MOTION MVP!',
      welcomeText: 'This is an early version of the dashboard. You can now interact with your back office agents.',
      yourNextStep: 'Your Next Step',
      taskManagement: 'Your Creative Journey 🎨',
      activeTasks: 'Active Tasks',
      completedTasks: 'Completed Tasks',
      pendingTasks: 'Pending Tasks',
      newTask: 'New Task',
      viewAll: 'View All Tasks',
      simpleView: 'Simple View',
      taskLimit: 'Task Limit',
      noTasks: 'Ready to Start Creating?',
      noTasksDesc: "Let's start with your first creative task!",
      createFirstTask: 'Create My First Task',
      letsStart: "Let's Start!",
      letsKeepWorking: "Let's Keep Working!",
      keepWorking: "Keep Working!",
      chatWithMe: 'Chat with me',
      chatWithAgent: 'Chat',
      almostThere: 'Almost there!',
      keepGoing: 'Keep going!',
      youGotThis: 'You got this!',
      greatProgress: 'Great progress!',
      nextUp: 'Coming up next:',
      whyImportant: 'Why this matters:',
      whatYoullAchieve: "What you'll achieve:",
      estimatedTime: 'Time needed:',
      timeSpent: 'Time spent',
      minutes: 'minutes',
      howIsGoing: 'How is',
      going: 'going?',
      readyToCreate: 'Ready to Create Something Amazing?',
      createFirst: 'Let me help you with your first creative task',
      getStarted: "Based on your answers, here's where I think you should start:",
      yourCreativeJourney: 'Your Creative Journey 🎨',
      continueTask: 'Continue',
      
      // TaskBasedDashboard specific
      welcomeTitle: 'Welcome to Your Creative Workspace',
      welcomeSubtitle: 'Ready to bring your creative project to life?',
      priorityTasks: 'Priority Tasks Based on Your Assessment',
      activeAgents: 'Active AI Assistants',
      quickActions: 'Quick Actions',
      projectProgress: 'Project Progress',
      viewAgent: 'View Agent',
      retakeAssessment: 'Retake Assessment',
      startWithAgent: 'Start with',
      recommendedAssistant: 'Recommended assistant',
      noActiveAgents: 'No active agents yet',
      scheduleSession: 'Schedule Session',
      viewProgress: 'View Progress',
    },
    tasks: {
      completed: 'Completed! 🎉',
      pending: 'Pending',
      inProgress: 'In Progress',
      cancelled: 'Cancelled',
      developWithAgent: 'Develop with Agent',
      continueTask: 'Continue',
      activateTask: 'Activate Task',
      completeTask: 'Complete Task',
      markCompleted: 'Mark as Done',
      quickComplete: 'Quick complete',
      delete: 'Delete',
      subtasks: 'subtasks',
      progress: 'Progress',
      dueDate: 'Due',
      taskCreated: 'Task created successfully',
      taskUpdated: 'Task updated successfully',
      taskDeleted: 'Task deleted successfully',
      taskCompleted: 'Task completed successfully',
      limitReached: 'Task limit reached',
      completeOthers: 'Complete some tasks first',
      completeThisFirst: 'Complete this task first',
      needToComplete: 'Complete some tasks to create new ones',
      due: 'Due',
      tasksLabel: 'tasks',
      taskStatus: {
        completed: 'Completed',
        pending: 'Pending',
        inProgress: 'In Development',
        cancelled: 'Cancelled',
      },
    },
    forms: {
      title: 'Title',
      description: 'Description',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      phone: 'Phone',
      city: 'City',
      country: 'Country',
      required: 'Required',
      optional: 'Optional',
      placeholder: {
        enterText: 'Enter text...',
        selectOption: 'Select an option...',
        chooseFile: 'Choose file...',
        searchHere: 'Search here...',
      },
      validation: {
        required: 'This field is required',
        email: 'Please enter a valid email',
        minLength: 'Minimum length required',
        maxLength: 'Maximum length exceeded',
        passwordMatch: 'Passwords do not match',
      },
    },
    buttons: {
      create: 'Create',
      update: 'Update',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      submit: 'Submit',
      reset: 'Reset',
      clear: 'Clear',
      confirm: 'Confirm',
      dismiss: 'Dismiss',
      tryAgain: 'Try Again',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      showMore: 'Show More',
      showLess: 'Show Less',
    },
    messages: {
      success: 'Success!',
      error: 'Error occurred',
      warning: 'Warning',
      info: 'Information',
      loading: 'Loading...',
      saving: 'Saving...',
      deleting: 'Deleting...',
      processing: 'Processing...',
      connecting: 'Connecting...',
      connected: 'Connected',
      disconnected: 'Disconnected',
      validationError: 'Please complete all required fields',
      networkError: 'Network connection error',
      unexpectedError: 'An unexpected error occurred',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      forgotPassword: 'Forgot Password',
      resetPassword: 'Reset Password',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      signInSuccess: 'Signed in successfully',
      signUpSuccess: 'Account created successfully',
      signOutSuccess: 'Signed out successfully',
      invalidCredentials: 'Invalid credentials',
      accountCreated: 'Account created successfully',
    },
    agents: {
      costCalculator: 'Cost & Profitability Calculator',
      contractGenerator: 'Contract Generator',
      maturityEvaluator: 'Creative Business Maturity Evaluator',
      exportAdvisor: 'Export & International Payments Advisor',
      portfolioCatalog: 'Portfolio & Catalog Creator',
      admin: 'Administrative Support',
      selectAgent: 'Select Agent',
      workingWith: 'Working with',
      startWorking: 'Start Working',
      comingSoon: 'Coming Soon',
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      online: 'Online',
      offline: 'Offline',
      available: 'Available',
      busy: 'Busy',
      away: 'Away',
      ready: 'Ready',
      processing: 'Processing',
      complete: 'Complete',
      failed: 'Failed',
    },
    time: {
      now: 'Now',
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
      thisWeek: 'This Week',
      lastWeek: 'Last Week',
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      thisYear: 'This Year',
      ago: 'ago',
      in: 'in',
      days: 'days',
      hours: 'hours',
      minutes: 'min',
      seconds: 'seconds',
    },
    taskStatus: {
      completed: 'Completed',
      completedPercentage: '{percentage}% completed',
      completedTime: 'Completed {timeAgo}',
      progressPercentage: '{percentage}% progress',
    },
    timeEstimates: {
      hours_1_2: '1-2 hours',
      hours_2_3: '2-3 hours',
      hours_2_4: '2-4 hours',
      hours_3_4: '3-4 hours',
      hours_3_5: '3-5 hours',
      hours_4_5: '4-5 hours',
      hours_4_6: '4-6 hours',
      hours_5_8: '5-8 hours',
      hours_6_10: '6-10 hours',
    },
    maturityCalculator: {
      title: 'Cultural Maturity Assessment',
      description: 'Discover your creative project\'s strengths and get personalized recommendations',
      generatingTasks: 'Creating Your Action Plan',
      generatingTasksDescription: 'AI is analyzing your responses to create personalized tasks...',
      ideaValidation: 'Idea Validation',
      userExperience: 'User Experience',
      marketFit: 'Market Fit',
      monetization: 'Monetization'
    },
    missionsDashboard: {
      title: 'My Missions 🎯',
      subtitle: 'Central hub for all your creative tasks and goals',
      searchPlaceholder: 'Search missions...',
      allMissions: 'All Missions',
      activeMissions: 'Active',
      completedMissions: 'Completed',
      filterByStatus: 'Filter by Status',
      filterByPriority: 'Filter by Priority',
      filterByAgent: 'Filter by Agent',
      all: 'All',
      pending: 'Not Started',
      inProgress: 'In Progress',
      completed: 'Completed',
      high: 'High Priority',
      medium: 'Medium Priority',
      low: 'Low Priority',
      continueTask: 'Continue',
      startTask: 'Start',
      reviewTask: 'Review',
      completeTask: 'Mark Complete',
      taskStats: 'Mission Statistics',
      activeCount: 'Active Missions',
      completedCount: 'Completed',
      remainingSlots: 'Free Slots',
      progressTitle: 'Your Progress',
      noMissions: 'No missions found',
      noMissionsDesc: 'Try adjusting your filters or create new tasks',
      createFirst: 'Create My First Mission',
      estimatedTime: 'Est. time',
      minutes: 'min',
      priority: 'Priority',
      agent: 'Agent',
      status: 'Status',
      lastUpdated: 'Updated',
      daysAgo: 'days ago',
      today: 'today',
      yesterday: 'yesterday',
      recommendedTasks: 'Recommended Tasks',
      recommendedSubtitle: 'Smart suggestions based on your business maturity',
      convertToTask: 'Add to Missions',
      recommendationsPriority: 'Recommended Priority',
      estimatedTimeLabel: 'Estimated Time',
      hideRecommendations: 'Hide Recommendations',
      showRecommendations: 'Show Recommendations'
    },
    recommendedTasks: {
      categories: {
        validation: 'Validation',
        finances: 'Finances',
        legal: 'Legal',
        marketing: 'Marketing',
        operations: 'Operations',
        strategy: 'Strategy',
        expansion: 'Expansion',
        networking: 'Networking',
        branding: 'Branding',
        growth: 'Growth',
        innovation: 'Innovation'
      },
      agents: {
        culturalConsultant: 'Cultural Consultant',
        costCalculator: 'Cost Calculator',
        legalAdvisor: 'Legal Advisor',
        marketingAdvisor: 'Marketing Advisor',
        projectManager: 'Project Manager',
        pricingAssistant: 'Pricing Assistant',
        exportAdvisor: 'Export Advisor',
        stakeholderConnector: 'Stakeholder Connector',
        brandingStrategist: 'Branding Strategist',
        scalingSpecialist: 'Scaling Specialist',
        innovationConsultant: 'Innovation Consultant',
        ecosystemBuilder: 'Ecosystem Builder'
      },
      explorador: {
        validateBusiness: {
          title: 'Validate your business idea with experts',
          description: 'Get professional feedback on your business concept and validate its market viability',
          prompt: 'I need to validate my business idea with experts. Help me structure my proposal and find the necessary feedback.'
        },
        calculateCosts: {
          title: 'Calculate real project costs',
          description: 'Define precise budgets and understand all costs involved in your project',
          prompt: 'Help me calculate all the real costs of my project to have an accurate budget.'
        },
        legalStructure: {
          title: 'Establish basic legal structure',
          description: 'Protect your business legally with the appropriate legal structure',
          prompt: 'I need to establish the basic legal structure for my business. Guide me through the process.'
        }
      },
      constructor: {
        digitalMarketing: {
          title: 'Develop digital marketing strategy',
          description: 'Attract your first customers with an effective marketing strategy',
          prompt: 'Help me develop a digital marketing strategy to attract my first customers.'
        },
        projectManagement: {
          title: 'Optimize project management',
          description: 'Organize your workflow to maximize productivity',
          prompt: 'I need to optimize my project management to be more efficient.'
        },
        pricingSystem: {
          title: 'Create competitive pricing system',
          description: 'Maximize your revenue with an intelligent pricing strategy',
          prompt: 'Help me create a competitive pricing system for my products/services.'
        }
      },
      estratega: {
        internationalMarkets: {
          title: 'Explore international markets',
          description: 'Expand globally and find new market opportunities',
          prompt: 'I want to explore opportunities in international markets. Help me with the strategy.'
        },
        stakeholderNetwork: {
          title: 'Develop stakeholder network',
          description: 'Connect with key partners to boost your business',
          prompt: 'I need to develop a solid stakeholder network for my business.'
        },
        personalBrand: {
          title: 'Optimize personal brand',
          description: 'Strengthen your positioning and market presence',
          prompt: 'Help me optimize my personal brand and market positioning.'
        }
      },
      visionario: {
        scalabilityStrategy: {
          title: 'Develop scalability strategy',
          description: 'Multiply your impact with scalable systems',
          prompt: 'I need to develop a strategy to scale my business sustainably.'
        },
        disruptiveInnovation: {
          title: 'Implement disruptive innovation',
          description: 'Lead change in your industry with innovation',
          prompt: 'I want to implement disruptive innovation in my industry. Guide me through the process.'
        },
        businessEcosystem: {
          title: 'Create business ecosystem',
          description: 'Build an integrated business empire',
          prompt: 'Help me create an integrated and profitable business ecosystem.'
        }
      }
    },
    agentFilters: {
      search: 'Search agents...',
      category: 'Category',
      status: 'Status',
      priority: 'Priority',
      sortBy: 'Sort by',
      clearFilters: 'Clear filters',
      allCategories: 'All categories',
      filtersLabel: 'Filters:'
    },
    taskManagement: {
      taskLimit: 'Task Management',
      currentTasks: 'Active Tasks',
      recommendation: 'Recommendation',
      pauseTask: 'Pause',
      resumeTask: 'Resume',
      deleteTask: 'Delete',
      reorderTasks: 'Reorder Tasks',
      limitReached: 'You\'ve reached the task limit',
      limitWarning: 'Close to task limit',
      smartSuggestion: 'Consider pausing low-priority tasks to focus on high-impact ones',
      manage: 'Manage',
      paused: 'Paused'
    },
    sortOptions: {
      name: 'Name',
      usage: 'Usage',
      impact: 'Impact'
    },
    impact: {
      high: 'High Impact',
      medium: 'Medium Impact',
      low: 'Low Impact'
    },
    
    // Master Coordinator
    masterCoordinator: {
      title: 'Master Business Coordinator',
      subtitle: 'Your AI Business Success Partner',
      welcome: 'Welcome to your Business Command Center',
      currentStatus: 'Current Progress Status',
      activeSlots: 'Active Task Slots',
      completed: 'Completed Tasks',
      maturityLevel: 'Business Maturity',
      nextRecommendations: 'Your Next Priority Missions',
      viewAllTasks: 'Mission Control Center',
      startWithAgent: 'Assign to',
      choosePath: 'Choose Your Growth Path',
      getPersonalizedGuidance: 'Strategic Consultation',
      exploreSubAgents: 'Available Specialists',
      progressToNext: 'Progress to Next Level',
      personalCoordinator: 'Your Personal Coordinator',
      alwaysHereToGuide: 'Always here to guide you',
      preparingCoordinator: 'Preparing your Master Coordinator...',
      configuringExperience: 'Setting up your personalized experience',
      freeSlots: 'free slots',
      excellentProgress: 'Excellent progress!',
      successRate: 'Success Rate',
      efficiency: 'Efficiency',
      incredible: 'Incredible!',
      completedTasks: 'You have completed {count} tasks'
    },

    // Greetings and coaching
    greetings: {
      goodMorning: '🌅 Good morning!',
      goodAfternoon: '☀️ Good afternoon!',
      goodEvening: '🌙 Good evening!',
      firstTime: 'I am your Master Coordinator and I am excited to accompany you on this business adventure!',
      excellentProgress: 'Incredible progress! You have proven to be a true {level}. Let\'s keep building your success!',
      manyActiveTasks: 'I see you have many active missions. As your coordinator, I help you prioritize to maximize results.',
      perfectMoment: 'Perfect time to advance toward your goals. I have some strategic missions for you.'
    },

    // Coaching tips
    coaching: {
      tip1: '💡 Every small step counts in your business journey',
      tip2: '🚀 Consistency beats perfection',
      tip3: '✨ Your next big idea is one task away',
      tip4: '🎯 Focus on completing, not perfecting',
      tip5: '🌟 Each completed task brings you closer to success'
    },

    // Maturity levels
    maturityLevels: {
      explorer: 'Explorer',
      builder: 'Builder',
      strategist: 'Strategist',
      visionary: 'Visionary'
    },
    
    agentManager: {
      title: "Agent Manager",
      subtitle: "Activate and manage your AI agents",
      categories: {
        Financiera: "Financial",
        Legal: "Legal",
        Diagnóstico: "Diagnostic",
        Comercial: "Commercial",
        Operativo: "Operations",
        Comunidad: "Community"
      },
      priority: "Priority",
      impact: "Impact",
      enabled: "Enabled",
      disabled: "Disabled",
      activate: "Activate",
      deactivate: "Deactivate",
      allAgents: "All Agents",
      recommended: "Recommended",
      usageCount: "Usage count",
      lastUsed: "Last used",
      never: "Never",
      activating: "Activating...",
      deactivating: "Deactivating...",
      loading: "AI Agent Manager",
      noAgentsFound: "No agents found",
      tryAdjusting: "Try adjusting your filters",
      clearAllFilters: "Clear all filters",
      search: "Search agents...",
      filters: "Filters", 
      filterCategories: "Categories",
      totalAgents: "Total",
      activeAgents: "Active"
    },
    
    recommendedAgents: {
      recommendedAgents: "Your AI Agents",
      primaryAgents: "Primary Recommendations",
      secondaryAgents: "Secondary Recommendations",
      chatWith: "Chat",
      configure: "Configure",
      active: "Active",
      paused: "Paused",
      inactive: "Inactive",
      activeTasks: "active tasks",
      lastUsed: "Last used",
      never: "Never"
    },
    
    heroSection: {
      title: "Empower your creative business with AI",
      subtitle: "Transform ideas into sustainable creative careers with intelligent agents that understand your industry",
      ctaButton: "Start Your Journey",
      scrollHint: "Scroll to explore",
      agentsSection: {
        title: "Meet Your AI Back Office Team",
        subtitle: "20+ specialized AI agents designed to handle your business operations while you focus on creating",
        features: {
          instant: {
            title: "Instant Activation",
            description: "Deploy agents in seconds with zero configuration"
          },
          specialized: {
            title: "Specialized Expertise",
            description: "Each agent is trained for specific creative business needs"
          },
          secure: {
            title: "Secure & Private",
            description: "Your data stays protected with enterprise-grade security"
          },
          collaborative: {
            title: "Works Together",
            description: "Agents coordinate seamlessly for complex workflows"
          }
        },
        categories: {
          financial: "Financial Agents",
          legal: "Legal Experts",
          operational: "Operations Team",
          marketing: "Marketing Suite"
        },
        cta: "Explore All Agents",
        preview: "See Agents in Action"
      }
    },

    footer: {
      tagline: "Empowering cultural creators with AI-powered tools for sustainable creative careers",
      product: "Product",
      platform: "Platform",
      calculator: "Maturity Calculator", 
      dashboard: "Dashboard",
      agents: "AI Agents",
      agentsGallery: "Agents Gallery",
      resources: "Resources",
      login: "Login",
      admin: "Admin Access",
      waitlist: "Join Waitlist",
      legal: "Legal",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      copyright: `© ${new Date().getFullYear()} Motion Project. All rights reserved.`,
      followUs: "Follow Us"
    },

    productExplanation: {
      title: "How Get in Motion Works",
      subtitle: "Simple steps to transform your creative business",
      step1: {
        title: "Start a Task, Your Way",
        description: "Email, Slack, or directly in the app - whatever works for you"
      },
      step2: {
        title: "Motion Gets to Work",
        description: "We generate invoices, verify compliance, and handle the paperwork"
      },
      step3: {
        title: "Collections Go Automatically",
        description: "Smart follow-ups and payment reminders without you lifting a finger"
      },
      step4: {
        title: "Review Reports and Optimize",
        description: "Monitor everything during construction and optimize your processes"
      }
    },

    valueProposition: {
      title: "Why Choose Get in Motion?",
      subtitle: "Designed to empower creators, organizations, and small businesses anywhere in the world",
      reasons: [
        {
          title: "Save time and resources",
          description: "Automate repetitive tasks and focus on what truly matters - your creative work and business growth."
        },
        {
          title: "Operate like a large team",
          description: "Access AI copilots 24/7 that work alongside you, providing expertise and support whenever you need it."
        },
        {
          title: "Grow without technical knowledge",
          description: "User-friendly tools that don't require coding or technical expertise to implement and use effectively."
        },
        {
          title: "Custom solution",
          description: "Tailored specifically for your industry, workflow, and unique business needs and challenges."
        }
      ]
    },

    profileSelector: {
      title: "Where are you today with your project?",
      subtitle: "We'll help you move forward from where you are. Choose the option that best represents you right now.",
      ideaTitle: "I just have the idea",
      ideaDescription: "I have an idea, but I don't know where to start and don't have anything set up yet.",
      soloTitle: "I'm working on this, but alone",
      soloDescription: "I've already started, but I do everything myself: sell, create, collect, publish.",
      teamTitle: "I have a team",
      teamDescription: "I work with more people and need to coordinate or delegate tasks.",
      confirmButton: "Confirm Selection",
      selectedMessage: "Ready! This helps us help you better!",
    },
  },
  es: {
    ui: {
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      view: 'Ver',
      close: 'Cerrar',
      submit: 'Enviar',
      back: 'Atrás',
      next: 'Siguiente',
      continue: 'Continuar',
      finish: 'Finalizar',
      yes: 'Sí',
      no: 'No',
      ok: 'OK',
      search: 'Buscar',
      filter: 'Filtrar',
      select: 'Seleccionar',
      selectAll: 'Seleccionar Todo',
      clear: 'Limpiar',
      refresh: 'Actualizar',
      settings: 'Configuración',
      help: 'Ayuda',
      home: 'Inicio',
      generatingRecommendations: 'Generando recomendaciones personalizadas...',
    },
    dashboard: {
      welcome: '¡Bienvenido al MVP de GET IN MOTION!',
      welcomeText: 'Esta es una versión temprana del dashboard. Ahora puedes interactuar con tus agentes de oficina.',
      yourNextStep: 'Tu Próximo Paso',
      taskManagement: 'Tu Viaje Creativo 🎨',
      activeTasks: 'Tareas Activas',
      completedTasks: 'Tareas Completadas',
      pendingTasks: 'Tareas Pendientes',
      newTask: 'Nueva Tarea',
      viewAll: 'Ver Todas las Tareas',
      simpleView: 'Vista Simple',
      taskLimit: 'Límite de Tareas',
      noTasks: '¿Listo para Empezar a Crear?',
      noTasksDesc: '¡Empecemos con tu primera tarea creativa!',
      createFirstTask: 'Crear Mi Primera Tarea',
      letsStart: '¡Empecemos!',
      letsKeepWorking: '¡Sigamos Trabajando!',
      keepWorking: '¡Sigamos Trabajando!',
      chatWithMe: 'Charlemos',
      chatWithAgent: 'Chat',
      almostThere: '¡Ya casi!',
      keepGoing: '¡Sigue así!',
      youGotThis: '¡Tú puedes!',
      greatProgress: '¡Excelente progreso!',
      nextUp: 'Lo que sigue:',
      whyImportant: 'Por qué es importante:',
      whatYoullAchieve: 'Lo que vas a lograr:',
      estimatedTime: 'Tiempo necesario:',
      timeSpent: 'Tiempo dedicado',
      minutes: 'minutos',
      howIsGoing: '¿Cómo va',
      going: '?',
      readyToCreate: '¿Listo para Crear Algo Increíble?',
      createFirst: 'Te ayudo con tu primera tarea creativa',
      getStarted: 'Basándome en tus respuestas, creo que deberías empezar por acá:',
      yourCreativeJourney: 'Tu Viaje Creativo 🎨',
      continueTask: 'Continuar',
      
      // TaskBasedDashboard specific
      welcomeTitle: 'Bienvenido a tu Espacio Creativo',
      welcomeSubtitle: '¿Listo para dar vida a tu proyecto creativo?',
      priorityTasks: 'Tareas Prioritarias Basadas en tu Evaluación',
      activeAgents: 'Asistentes IA Activos',
      quickActions: 'Acciones Rápidas',
      projectProgress: 'Progreso del Proyecto',
      viewAgent: 'Ver Agente',
      retakeAssessment: 'Repetir Evaluación',
      startWithAgent: 'Empezar con',
      recommendedAssistant: 'Asistente recomendado',
      noActiveAgents: 'Sin agentes activos aún',
      scheduleSession: 'Programar Sesión',
      viewProgress: 'Ver Progreso',
    },
    tasks: {
      completed: '¡Completada! 🎉',
      pending: 'Pendiente',
      inProgress: 'En Desarrollo',
      cancelled: 'Cancelada',
      developWithAgent: 'Desarrollar con Agente',
      continueTask: 'Continuar',
      activateTask: 'Activar Tarea',
      completeTask: 'Completar Tarea',
      markCompleted: 'Marcar Terminada',
      quickComplete: 'Completar rápido',
      delete: 'Eliminar',
      subtasks: 'subtareas',
      progress: 'Progreso',
      dueDate: 'Vence',
      taskCreated: 'Tarea creada exitosamente',
      taskUpdated: 'Tarea actualizada exitosamente',
      taskDeleted: 'Tarea eliminada exitosamente',
      taskCompleted: 'Tarea completada exitosamente',
      limitReached: 'Límite de tareas alcanzado',
      completeOthers: 'Completa algunas tareas primero',
      completeThisFirst: 'Completa esta tarea primero',
      needToComplete: 'Completa algunas tareas para crear nuevas',
      due: 'Vence',
      tasksLabel: 'tareas',
      taskStatus: {
        completed: 'Completada',
        pending: 'Pendiente',
        inProgress: 'En Desarrollo',
        cancelled: 'Cancelada',
      },
    },
    forms: {
      title: 'Título',
      description: 'Descripción',
      name: 'Nombre',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      phone: 'Teléfono',
      city: 'Ciudad',
      country: 'País',
      required: 'Requerido',
      optional: 'Opcional',
      placeholder: {
        enterText: 'Ingresa texto...',
        selectOption: 'Selecciona una opción...',
        chooseFile: 'Elegir archivo...',
        searchHere: 'Buscar aquí...',
      },
      validation: {
        required: 'Este campo es requerido',
        email: 'Por favor ingresa un email válido',
        minLength: 'Longitud mínima requerida',
        maxLength: 'Longitud máxima excedida',
        passwordMatch: 'Las contraseñas no coinciden',
      },
    },
    buttons: {
      create: 'Crear',
      update: 'Actualizar',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      submit: 'Enviar',
      reset: 'Restablecer',
      clear: 'Limpiar',
      confirm: 'Confirmar',
      dismiss: 'Descartar',
      tryAgain: 'Intentar de Nuevo',
      getStarted: 'Empezar',
      learnMore: 'Saber Más',
      showMore: 'Mostrar Más',
      showLess: 'Mostrar Menos',
    },
    messages: {
      success: '¡Éxito!',
      error: 'Ocurrió un error',
      warning: 'Advertencia',
      info: 'Información',
      loading: 'Cargando...',
      saving: 'Guardando...',
      deleting: 'Eliminando...',
      processing: 'Procesando...',
      connecting: 'Conectando...',
      connected: 'Conectado',
      disconnected: 'Desconectado',
      validationError: 'Por favor completa todos los campos requeridos',
      networkError: 'Error de conexión de red',
      unexpectedError: 'Ocurrió un error inesperado',
    },
    auth: {
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      signOut: 'Cerrar Sesión',
      forgotPassword: '¿Olvidaste tu Contraseña?',
      resetPassword: 'Restablecer Contraseña',
      emailRequired: 'El email es requerido',
      passwordRequired: 'La contraseña es requerida',
      signInSuccess: 'Sesión iniciada exitosamente',
      signUpSuccess: 'Cuenta creada exitosamente',
      signOutSuccess: 'Sesión cerrada exitosamente',
      invalidCredentials: 'Credenciales inválidas',
      accountCreated: 'Cuenta creada exitosamente',
    },
    agents: {
      costCalculator: 'Calculadora de Costos y Rentabilidad',
      contractGenerator: 'Generador de Contratos',
      maturityEvaluator: 'Evaluador de Madurez de Negocio Creativo',
      exportAdvisor: 'Asesor de Exportación y Pagos Internacionales',
      portfolioCatalog: 'Creador de Portafolio y Catálogo',
      admin: 'Soporte Administrativo',
      selectAgent: 'Seleccionar Agente',
      workingWith: 'Trabajando con',
      startWorking: 'Empezar a Trabajar',
      comingSoon: 'Próximamente',
    },
    status: {
      active: 'Activo',
      inactive: 'Inactivo',
      online: 'En Línea',
      offline: 'Desconectado',
      available: 'Disponible',
      busy: 'Ocupado',
      away: 'Ausente',
      ready: 'Listo',
      processing: 'Procesando',
      complete: 'Completo',
      failed: 'Falló',
    },
    time: {
      now: 'Ahora',
      today: 'Hoy',
      yesterday: 'Ayer',
      tomorrow: 'Mañana',
      thisWeek: 'Esta Semana',
      lastWeek: 'La Semana Pasada',
      thisMonth: 'Este Mes',
      lastMonth: 'El Mes Pasado',
      thisYear: 'Este Año',
      ago: 'hace',
      in: 'en',
      days: 'días',
      hours: 'horas',
      minutes: 'min',
      seconds: 'segundos',
    },
    taskStatus: {
      completed: 'Completada',
      completedPercentage: '{percentage}% completado',
      completedTime: 'Completada {timeAgo}',
      progressPercentage: '{percentage}% progreso',
    },
    timeEstimates: {
      hours_1_2: '1-2 horas',
      hours_2_3: '2-3 horas',
      hours_2_4: '2-4 horas',
      hours_3_4: '3-4 horas',
      hours_3_5: '3-5 horas',
      hours_4_5: '4-5 horas',
      hours_4_6: '4-6 horas',
      hours_5_8: '5-8 horas',
      hours_6_10: '6-10 horas',
    },
    maturityCalculator: {
      title: 'Evaluación de Madurez Cultural',
      description: 'Descubre las fortalezas de tu proyecto creativo y obtén recomendaciones personalizadas',
      generatingTasks: 'Creando tu Plan de Acción',
      generatingTasksDescription: 'La IA está analizando tus respuestas para crear tareas personalizadas...',
      ideaValidation: 'Validación de Idea',
      userExperience: 'Experiencia de Usuario',
      marketFit: 'Ajuste al Mercado',
      monetization: 'Monetización'
    },
    missionsDashboard: {
      title: 'Mis Misiones 🎯',
      subtitle: 'Centro de control para todas tus tareas y objetivos creativos',
      searchPlaceholder: 'Buscar misiones...',
      allMissions: 'Todas las Misiones',
      activeMissions: 'Activas',
      completedMissions: 'Completadas',
      filterByStatus: 'Filtrar por Estado',
      filterByPriority: 'Filtrar por Prioridad',
      filterByAgent: 'Filtrar por Agente',
      all: 'Todas',
      pending: 'Sin Iniciar',
      inProgress: 'En Progreso',
      completed: 'Completadas',
      high: 'Prioridad Alta',
      medium: 'Prioridad Media',
      low: 'Prioridad Baja',
      continueTask: 'Continuar',
      startTask: 'Iniciar',
      reviewTask: 'Revisar',
      completeTask: 'Marcar Completa',
      taskStats: 'Estadísticas de Misiones',
      activeCount: 'Misiones Activas',
      completedCount: 'Completadas',
      remainingSlots: 'Espacios Libres',
      progressTitle: 'Tu Progreso',
      noMissions: 'No se encontraron misiones',
      noMissionsDesc: 'Intenta ajustar los filtros o crea nuevas tareas',
      createFirst: 'Crear Mi Primera Misión',
      estimatedTime: 'Tiempo est.',
      minutes: 'min',
      priority: 'Prioridad',
      agent: 'Agente',
      status: 'Estado',
      lastUpdated: 'Actualizada',
      daysAgo: 'días atrás',
      today: 'hoy',
      yesterday: 'ayer',
      recommendedTasks: 'Tareas Recomendadas',
      recommendedSubtitle: 'Sugerencias inteligentes basadas en tu madurez empresarial',
      convertToTask: 'Agregar a Misiones',
      recommendationsPriority: 'Prioridad Recomendada',
      estimatedTimeLabel: 'Tiempo Estimado',
      hideRecommendations: 'Ocultar Recomendaciones',
      showRecommendations: 'Mostrar Recomendaciones'
    },
    recommendedTasks: {
      categories: {
        validation: 'Validación',
        finances: 'Finanzas',
        legal: 'Legal',
        marketing: 'Marketing',
        operations: 'Operaciones',
        strategy: 'Estrategia',
        expansion: 'Expansión',
        networking: 'Networking',
        branding: 'Branding',
        growth: 'Crecimiento',
        innovation: 'Innovación'
      },
      agents: {
        culturalConsultant: 'Consultor Cultural',
        costCalculator: 'Calculadora de Costos',
        legalAdvisor: 'Asesor Legal',
        marketingAdvisor: 'Asesor de Marketing',
        projectManager: 'Gestor de Proyectos',
        pricingAssistant: 'Asistente de Precios',
        exportAdvisor: 'Asesor de Exportación',
        stakeholderConnector: 'Conector de Stakeholders',
        brandingStrategist: 'Estratega de Marca',
        scalingSpecialist: 'Especialista en Escalabilidad',
        innovationConsultant: 'Consultor de Innovación',
        ecosystemBuilder: 'Constructor de Ecosistemas'
      },
      explorador: {
        validateBusiness: {
          title: 'Validar tu idea de negocio con expertos',
          description: 'Obtén feedback profesional sobre tu concepto de negocio y valida su viabilidad en el mercado',
          prompt: 'Necesito validar mi idea de negocio con expertos. Ayúdame a estructurar mi propuesta y encontrar el feedback necesario.'
        },
        calculateCosts: {
          title: 'Calcular costos reales de tu proyecto',
          description: 'Define presupuestos precisos y entiende todos los costos involucrados en tu proyecto',
          prompt: 'Ayúdame a calcular todos los costos reales de mi proyecto para tener un presupuesto preciso.'
        },
        legalStructure: {
          title: 'Establecer estructura legal básica',
          description: 'Protege tu negocio legalmente con la estructura jurídica adecuada',
          prompt: 'Necesito establecer la estructura legal básica para mi negocio. Guíame en el proceso.'
        }
      },
      constructor: {
        digitalMarketing: {
          title: 'Desarrollar estrategia de marketing digital',
          description: 'Atrae a tus primeros clientes con una estrategia de marketing efectiva',
          prompt: 'Ayúdame a desarrollar una estrategia de marketing digital para atraer mis primeros clientes.'
        },
        projectManagement: {
          title: 'Optimizar gestión de proyectos',
          description: 'Organiza tu flujo de trabajo para maximizar la productividad',
          prompt: 'Necesito optimizar la gestión de mis proyectos para ser más eficiente.'
        },
        pricingSystem: {
          title: 'Crear sistema de precios competitivo',
          description: 'Maximiza tus ingresos con una estrategia de precios inteligente',
          prompt: 'Ayúdame a crear un sistema de precios competitivo para mis productos/servicios.'
        }
      },
      estratega: {
        internationalMarkets: {
          title: 'Explorar mercados internacionales',
          description: 'Expande globalmente y encuentra nuevas oportunidades de mercado',
          prompt: 'Quiero explorar oportunidades en mercados internacionales. Ayúdame con la estrategia.'
        },
        stakeholderNetwork: {
          title: 'Desarrollar red de stakeholders',
          description: 'Conecta con socios clave para potenciar tu negocio',
          prompt: 'Necesito desarrollar una red sólida de stakeholders para mi negocio.'
        },
        personalBrand: {
          title: 'Optimizar marca personal',
          description: 'Fortalece tu posicionamiento y presencia en el mercado',
          prompt: 'Ayúdame a optimizar mi marca personal y posicionamiento en el mercado.'
        }
      },
      visionario: {
        scalabilityStrategy: {
          title: 'Desarrollar estrategia de escalabilidad',
          description: 'Multiplica tu impacto con sistemas escalables',
          prompt: 'Necesito desarrollar una estrategia para escalar mi negocio de manera sostenible.'
        },
        disruptiveInnovation: {
          title: 'Implementar innovación disruptiva',
          description: 'Lidera el cambio en tu industria con innovación',
          prompt: 'Quiero implementar innovación disruptiva en mi industria. Guíame en el proceso.'
        },
        businessEcosystem: {
          title: 'Crear ecosistema de negocios',
          description: 'Construye un imperio empresarial integrado',
          prompt: 'Ayúdame a crear un ecosistema de negocios integrado y rentable.'
        }
      }
    },
    agentFilters: {
      search: 'Buscar agentes...',
      category: 'Categoría',
      status: 'Estado',
      priority: 'Prioridad',
      sortBy: 'Ordenar por',
      clearFilters: 'Limpiar filtros',
      allCategories: 'Todas las categorías',
      filtersLabel: 'Filtros:'
    },
    taskManagement: {
      taskLimit: 'Gestión de Tareas',
      currentTasks: 'Tareas Activas',
      recommendation: 'Recomendación',
      pauseTask: 'Pausar',
      resumeTask: 'Reanudar',
      deleteTask: 'Eliminar',
      reorderTasks: 'Reordenar Tareas',
      limitReached: 'Has alcanzado el límite de tareas',
      limitWarning: 'Cerca del límite de tareas',
      smartSuggestion: 'Considera pausar tareas de baja prioridad para enfocarte en las de alto impacto',
      manage: 'Gestionar',
      paused: 'Pausada'
    },
    sortOptions: {
      name: 'Nombre',
      usage: 'Uso',
      impact: 'Impacto'
    },
    impact: {
      high: 'Alto Impacto',
      medium: 'Impacto Medio',
      low: 'Bajo Impacto'
    },
    
    // Master Coordinator
    masterCoordinator: {
      title: 'Coordinador Maestro de Negocios',
      subtitle: 'Tu Compañero IA para el Éxito Empresarial',
      welcome: 'Bienvenido a tu Centro de Comando Empresarial',
      currentStatus: 'Estado Actual de Progreso',
      activeSlots: 'Espacios de Tareas Activas',
      completed: 'Tareas Completadas',
      maturityLevel: 'Madurez del Negocio',
      nextRecommendations: 'Tus Próximas Misiones Prioritarias',
      viewAllTasks: 'Centro de Control de Misiones',
      startWithAgent: 'Asignar a',
      choosePath: 'Elige tu Ruta de Crecimiento',
      getPersonalizedGuidance: 'Consulta Estratégica',
      exploreSubAgents: 'Especialistas Disponibles',
      progressToNext: 'Progreso al Siguiente Nivel',
      personalCoordinator: 'Tu Coordinador Personal',
      alwaysHereToGuide: 'Siempre aquí para guiarte',
      preparingCoordinator: 'Preparando tu Coordinador Maestro...',
      configuringExperience: 'Configurando tu experiencia personalizada',
      freeSlots: 'espacios libres',
      excellentProgress: '¡Excelente progreso!',
      successRate: 'Tasa de Éxito',
      efficiency: 'Eficiencia',
      incredible: '¡Increíble!',
      completedTasks: 'Has completado {count} tareas'
    },

    // Greetings and coaching
    greetings: {
      goodMorning: '🌅 ¡Buenos días!',
      goodAfternoon: '☀️ ¡Buenas tardes!',
      goodEvening: '🌙 ¡Buenas noches!',
      firstTime: '¡Soy tu Coordinador Maestro y estoy emocionado de acompañarte en esta aventura empresarial!',
      excellentProgress: '¡Increíble progreso! Has demostrado ser un verdadero {level}. ¡Sigamos construyendo tu éxito!',
      manyActiveTasks: 'Veo que tienes muchas misiones activas. Como tu coordinador, te ayudo a priorizar para maximizar resultados.',
      perfectMoment: 'Perfecto momento para avanzar hacia tus objetivos. Tengo algunas misiones estratégicas para ti.'
    },

    // Coaching tips
    coaching: {
      tip1: '💡 Cada pequeño paso cuenta en tu viaje empresarial',
      tip2: '🚀 La consistencia supera a la perfección',
      tip3: '✨ Tu próxima gran idea está a una tarea de distancia',
      tip4: '🎯 Enfócate en completar, no en perfeccionar',
      tip5: '🌟 Cada tarea completada te acerca más al éxito'
    },

    // Maturity levels
    maturityLevels: {
      explorer: 'Explorador',
      builder: 'Constructor',
      strategist: 'Estratega',
      visionary: 'Visionario'
    },
    
    agentManager: {
      title: "Gestor de Agentes",
      subtitle: "Activa y gestiona tus agentes IA",
      categories: {
        Financiera: "Financiera",
        Legal: "Legal",
        Diagnóstico: "Diagnóstico",
        Comercial: "Comercial",
        Operativo: "Operativo",
        Comunidad: "Comunidad"
      },
      priority: "Prioridad",
      impact: "Impacto",
      enabled: "Activado",
      disabled: "Desactivado",
      activate: "Activar",
      deactivate: "Desactivar",
      allAgents: "Todos los Agentes",
      recommended: "Recomendado",
      usageCount: "Contador de uso",
      lastUsed: "Último uso",
      never: "Nunca",
      activating: "Activando...",
      deactivating: "Desactivando...",
      loading: "Gestor de Agentes IA",
      noAgentsFound: "No se encontraron agentes",
      tryAdjusting: "Intenta ajustar tus filtros",
      clearAllFilters: "Limpiar todos los filtros",
      search: "Buscar agentes...",
      filters: "Filtros",
      filterCategories: "Categorías", 
      totalAgents: "Total",
      activeAgents: "Activos"
    },
    
    recommendedAgents: {
      recommendedAgents: "Tus Agentes IA",
      primaryAgents: "Recomendaciones Principales",
      secondaryAgents: "Recomendaciones Secundarias",
      chatWith: "Chatear",
      configure: "Configurar",
      active: "Activo",
      paused: "Pausado",
      inactive: "Inactivo",
      activeTasks: "tareas activas",
      lastUsed: "Último uso",
      never: "Nunca"
    },
    
    heroSection: {
      title: "Empodera tu negocio creativo con IA",
      subtitle: "Transforma ideas en carreras creativas sostenibles con agentes inteligentes que entienden tu industria",
      ctaButton: "Comenzar Tu Viaje",
      scrollHint: "Desliza para explorar",
      agentsSection: {
        title: "Conoce Tu Equipo de IA para Back Office",
        subtitle: "Más de 20 agentes de IA especializados diseñados para manejar las operaciones de tu negocio mientras te enfocas en crear",
        features: {
          instant: {
            title: "Activación Instantánea",
            description: "Despliega agentes en segundos sin configuración"
          },
          specialized: {
            title: "Experiencia Especializada",
            description: "Cada agente está entrenado para necesidades específicas de negocios creativos"
          },
          secure: {
            title: "Seguro y Privado",
            description: "Tus datos se mantienen protegidos con seguridad empresarial"
          },
          collaborative: {
            title: "Trabaja en Conjunto",
            description: "Los agentes se coordinan perfectamente para flujos complejos"
          }
        },
        categories: {
          financial: "Agentes Financieros",
          legal: "Expertos Legales",
          operational: "Equipo Operativo",
          marketing: "Suite de Marketing"
        },
        cta: "Explorar Todos los Agentes",
        preview: "Ver Agentes en Acción"
      }
    },

    footer: {
      tagline: "Empoderando a creadores culturales con herramientas de IA para carreras creativas sostenibles",
      product: "Producto",
      platform: "Plataforma",
      calculator: "Calculadora de Madurez",
      dashboard: "Dashboard", 
      agents: "Agentes de IA",
      agentsGallery: "Galería de Agentes",
      resources: "Recursos",
      login: "Iniciar Sesión",
      admin: "Acceso Admin",
      waitlist: "Unirse a Lista",
      legal: "Legal",
      privacyPolicy: "Política de Privacidad",
      termsOfService: "Términos de Servicio",
      copyright: `© ${new Date().getFullYear()} Motion Project. Todos los derechos reservados.`,
      followUs: "Síguenos"
    },

    productExplanation: {
      title: "Cómo Funciona Get in Motion",
      subtitle: "Pasos simples para transformar tu negocio creativo",
      step1: {
        title: "Inicia una Tarea, a Tu Manera",
        description: "Email, Slack, o directo en la app - como prefieras"
      },
      step2: {
        title: "Motion Se Pone a Trabajar",
        description: "Generamos facturas, verificamos cumplimiento y manejamos el papeleo"
      },
      step3: {
        title: "Las Cobranzas Salen Automáticamente",
        description: "Seguimientos inteligentes y recordatorios de pago sin que muevas un dedo"
      },
      step4: {
        title: "Revisa Reportes y Optimiza",
        description: "Supervisión durante la construcción y optimización de tus procesos"
      }
    },

    valueProposition: {
      title: "¿Por Qué Elegir Get in Motion?",
      subtitle: "Diseñado para empoderar a creadores, organizaciones y pequeñas empresas en cualquier parte del mundo",
      reasons: [
        {
          title: "Ahorra tiempo y recursos",
          description: "Automatiza tareas repetitivas y enfócate en lo que realmente importa: tu trabajo creativo y crecimiento empresarial."
        },
        {
          title: "Opera como un gran equipo",
          description: "Accede a copilotos de IA 24/7 que trabajan junto a ti, brindando experiencia y apoyo cuando lo necesites."
        },
        {
          title: "Crece sin conocimiento técnico",
          description: "Herramientas fáciles de usar que no requieren programación o experiencia técnica para implementar y usar efectivamente."
        },
        {
          title: "Solución personalizada",
          description: "Adaptado específicamente para tu industria, flujo de trabajo y necesidades y desafíos únicos del negocio."
        }
      ]
    },

    profileSelector: {
      title: "¿Dónde estás hoy con tu proyecto?",
      subtitle: "Te ayudamos a avanzar desde donde estés. Elige la opción que mejor te representa ahora.",
      ideaTitle: "Apenas tengo la idea",
      ideaDescription: "Tengo una idea, pero no sé por dónde empezar ni tengo nada montado todavía.",
      soloTitle: "Estoy trabajando en esto, pero solo/a",
      soloDescription: "Ya empecé, pero todo lo hago yo: vender, crear, cobrar, publicar.",
      teamTitle: "Tengo un equipo",
      teamDescription: "Trabajo con más personas y necesito coordinar o delegar tareas.",
      confirmButton: "Confirmar Selección",
      selectedMessage: "¡Listo, esto nos ayuda a ayudarte mejor!",
    },
  },
};

// Hook para usar las traducciones
export function getTranslations(language: 'en' | 'es') {
  return translations[language];
}

// Función helper para obtener una traducción específica
export function getTranslation(language: 'en' | 'es', path: string, fallback?: string): string {
  const keys = path.split('.');
  let value: any = translations[language];
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return fallback || path;
    }
  }
  
  return typeof value === 'string' ? value : fallback || path;
}