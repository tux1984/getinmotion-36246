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

  // Maturity Calculator
  maturityCalculator: {
    title: string;
    description: string;
    generatingTasks: string;
    generatingTasksDescription: string;
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
    maturityCalculator: {
      title: 'Cultural Maturity Assessment',
      description: 'Discover your creative project\'s strengths and get personalized recommendations',
      generatingTasks: 'Creating Your Action Plan',
      generatingTasksDescription: 'AI is analyzing your responses to create personalized tasks...'
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
    maturityCalculator: {
      title: 'Evaluación de Madurez Cultural',
      description: 'Descubre las fortalezas de tu proyecto creativo y obtén recomendaciones personalizadas',
      generatingTasks: 'Creando tu Plan de Acción',
      generatingTasksDescription: 'La IA está analizando tus respuestas para crear tareas personalizadas...'
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