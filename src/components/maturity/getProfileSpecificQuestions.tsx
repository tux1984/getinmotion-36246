
import React from 'react';
import { Lightbulb, User, Users, Target, TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle, Search, Palette, Music, Calendar, Heart, Globe, Handshake, BarChart, FileText, Settings } from 'lucide-react';
import { Question, Language, ProfileType } from './types';

export const getProfileSpecificQuestions = (language: Language, profileType: ProfileType): Question[] => {
  const questionSets = {
    idea: {
      en: [
        {
          id: 'idea-clarity',
          question: 'How clear and specific is your creative idea?',
          options: [
            { id: 'idea-clarity-1', text: 'Just a rough concept', value: 1, icon: <Lightbulb size={20} /> },
            { id: 'idea-clarity-2', text: 'General direction with some details', value: 2, icon: <Lightbulb size={20} /> },
            { id: 'idea-clarity-3', text: 'Well-defined concept with clear features', value: 3, icon: <Lightbulb size={20} /> }
          ]
        },
        {
          id: 'market-research',
          question: 'Have you researched your target audience and market?',
          options: [
            { id: 'market-research-1', text: 'No research done yet', value: 1, icon: <Search size={20} /> },
            { id: 'market-research-2', text: 'Some informal research', value: 2, icon: <Search size={20} /> },
            { id: 'market-research-3', text: 'Structured market analysis', value: 3, icon: <Search size={20} /> }
          ]
        },
        {
          id: 'creative-validation',
          question: 'Have you tested your creative concept with potential users?',
          options: [
            { id: 'creative-validation-1', text: 'No validation yet', value: 1, icon: <CheckCircle size={20} /> },
            { id: 'creative-validation-2', text: 'Feedback from friends/family', value: 2, icon: <CheckCircle size={20} /> },
            { id: 'creative-validation-3', text: 'Feedback from target audience', value: 3, icon: <CheckCircle size={20} /> }
          ]
        },
        {
          id: 'competitive-analysis',
          question: 'Do you know who your competitors are in the cultural sector?',
          options: [
            { id: 'competitive-analysis-1', text: 'No idea about competition', value: 1, icon: <BarChart size={20} /> },
            { id: 'competitive-analysis-2', text: 'Aware of some competitors', value: 2, icon: <BarChart size={20} /> },
            { id: 'competitive-analysis-3', text: 'Detailed competitive analysis', value: 3, icon: <BarChart size={20} /> }
          ]
        },
        {
          id: 'revenue-model',
          question: 'Do you have a clear idea of how you will generate income?',
          options: [
            { id: 'revenue-model-1', text: 'No clear revenue plan', value: 1, icon: <DollarSign size={20} /> },
            { id: 'revenue-model-2', text: 'Basic pricing ideas', value: 2, icon: <DollarSign size={20} /> },
            { id: 'revenue-model-3', text: 'Defined revenue streams', value: 3, icon: <DollarSign size={20} /> }
          ]
        },
        {
          id: 'cultural-uniqueness',
          question: 'What makes your cultural offering unique?',
          options: [
            { id: 'cultural-uniqueness-1', text: 'Similar to existing offerings', value: 1, icon: <Palette size={20} /> },
            { id: 'cultural-uniqueness-2', text: 'Some unique elements', value: 2, icon: <Palette size={20} /> },
            { id: 'cultural-uniqueness-3', text: 'Highly innovative approach', value: 3, icon: <Palette size={20} /> }
          ]
        },
        {
          id: 'startup-timeline',
          question: 'What is your timeline to launch your cultural project?',
          options: [
            { id: 'startup-timeline-1', text: 'No specific timeline', value: 1, icon: <Clock size={20} /> },
            { id: 'startup-timeline-2', text: 'Rough timeline in mind', value: 2, icon: <Clock size={20} /> },
            { id: 'startup-timeline-3', text: 'Detailed launch plan', value: 3, icon: <Clock size={20} /> }
          ]
        },
        {
          id: 'resource-needs',
          question: 'Do you know what resources you need to start?',
          options: [
            { id: 'resource-needs-1', text: 'Unclear about needs', value: 1, icon: <Settings size={20} /> },
            { id: 'resource-needs-2', text: 'General idea of needs', value: 2, icon: <Settings size={20} /> },
            { id: 'resource-needs-3', text: 'Detailed resource plan', value: 3, icon: <Settings size={20} /> }
          ]
        },
        {
          id: 'cultural-impact',
          question: 'Have you defined the cultural impact you want to create?',
          options: [
            { id: 'cultural-impact-1', text: 'No clear impact vision', value: 1, icon: <Heart size={20} /> },
            { id: 'cultural-impact-2', text: 'General impact goals', value: 2, icon: <Heart size={20} /> },
            { id: 'cultural-impact-3', text: 'Clear cultural mission', value: 3, icon: <Heart size={20} /> }
          ]
        }
      ],
      es: [
        {
          id: 'idea-clarity',
          question: '¿Qué tan clara y específica es tu idea creativa?',
          options: [
            { id: 'idea-clarity-1', text: 'Solo un concepto aproximado', value: 1, icon: <Lightbulb size={20} /> },
            { id: 'idea-clarity-2', text: 'Dirección general con algunos detalles', value: 2, icon: <Lightbulb size={20} /> },
            { id: 'idea-clarity-3', text: 'Concepto bien definido con características claras', value: 3, icon: <Lightbulb size={20} /> }
          ]
        },
        {
          id: 'market-research',
          question: '¿Has investigado tu audiencia objetivo y el mercado?',
          options: [
            { id: 'market-research-1', text: 'No he hecho investigación aún', value: 1, icon: <Search size={20} /> },
            { id: 'market-research-2', text: 'Algo de investigación informal', value: 2, icon: <Search size={20} /> },
            { id: 'market-research-3', text: 'Análisis estructurado del mercado', value: 3, icon: <Search size={20} /> }
          ]
        },
        {
          id: 'creative-validation',
          question: '¿Has probado tu concepto creativo con usuarios potenciales?',
          options: [
            { id: 'creative-validation-1', text: 'Sin validación aún', value: 1, icon: <CheckCircle size={20} /> },
            { id: 'creative-validation-2', text: 'Comentarios de amigos/familia', value: 2, icon: <CheckCircle size={20} /> },
            { id: 'creative-validation-3', text: 'Feedback de audiencia objetivo', value: 3, icon: <CheckCircle size={20} /> }
          ]
        },
        {
          id: 'competitive-analysis',
          question: '¿Conoces quiénes son tus competidores en el sector cultural?',
          options: [
            { id: 'competitive-analysis-1', text: 'No tengo idea de la competencia', value: 1, icon: <BarChart size={20} /> },
            { id: 'competitive-analysis-2', text: 'Conozco algunos competidores', value: 2, icon: <BarChart size={20} /> },
            { id: 'competitive-analysis-3', text: 'Análisis detallado de competencia', value: 3, icon: <BarChart size={20} /> }
          ]
        },
        {
          id: 'revenue-model',
          question: '¿Tienes una idea clara de cómo generarás ingresos?',
          options: [
            { id: 'revenue-model-1', text: 'No tengo plan de ingresos claro', value: 1, icon: <DollarSign size={20} /> },
            { id: 'revenue-model-2', text: 'Ideas básicas de precios', value: 2, icon: <DollarSign size={20} /> },
            { id: 'revenue-model-3', text: 'Flujos de ingresos definidos', value: 3, icon: <DollarSign size={20} /> }
          ]
        },
        {
          id: 'cultural-uniqueness',
          question: '¿Qué hace única tu oferta cultural?',
          options: [
            { id: 'cultural-uniqueness-1', text: 'Similar a ofertas existentes', value: 1, icon: <Palette size={20} /> },
            { id: 'cultural-uniqueness-2', text: 'Algunos elementos únicos', value: 2, icon: <Palette size={20} /> },
            { id: 'cultural-uniqueness-3', text: 'Enfoque altamente innovador', value: 3, icon: <Palette size={20} /> }
          ]
        },
        {
          id: 'startup-timeline',
          question: '¿Cuál es tu cronograma para lanzar tu proyecto cultural?',
          options: [
            { id: 'startup-timeline-1', text: 'No tengo cronograma específico', value: 1, icon: <Clock size={20} /> },
            { id: 'startup-timeline-2', text: 'Cronograma aproximado en mente', value: 2, icon: <Clock size={20} /> },
            { id: 'startup-timeline-3', text: 'Plan de lanzamiento detallado', value: 3, icon: <Clock size={20} /> }
          ]
        },
        {
          id: 'resource-needs',
          question: '¿Sabes qué recursos necesitas para empezar?',
          options: [
            { id: 'resource-needs-1', text: 'No estoy claro sobre las necesidades', value: 1, icon: <Settings size={20} /> },
            { id: 'resource-needs-2', text: 'Idea general de las necesidades', value: 2, icon: <Settings size={20} /> },
            { id: 'resource-needs-3', text: 'Plan detallado de recursos', value: 3, icon: <Settings size={20} /> }
          ]
        },
        {
          id: 'cultural-impact',
          question: '¿Has definido el impacto cultural que quieres crear?',
          options: [
            { id: 'cultural-impact-1', text: 'No tengo visión clara del impacto', value: 1, icon: <Heart size={20} /> },
            { id: 'cultural-impact-2', text: 'Objetivos generales de impacto', value: 2, icon: <Heart size={20} /> },
            { id: 'cultural-impact-3', text: 'Misión cultural clara', value: 3, icon: <Heart size={20} /> }
          ]
        }
      ]
    },

    solo: {
      en: [
        {
          id: 'workflow-organization',
          question: 'How organized are your creative workflows and processes?',
          options: [
            { id: 'workflow-organization-1', text: 'Ad-hoc, figure it out as I go', value: 1, icon: <Settings size={20} /> },
            { id: 'workflow-organization-2', text: 'Some basic processes in place', value: 2, icon: <Settings size={20} /> },
            { id: 'workflow-organization-3', text: 'Well-documented workflows', value: 3, icon: <Settings size={20} /> }
          ]
        },
        {
          id: 'time-management',
          question: 'How do you manage your time between creative work and business tasks?',
          options: [
            { id: 'time-management-1', text: 'Struggle to balance both', value: 1, icon: <Clock size={20} /> },
            { id: 'time-management-2', text: 'Decent balance but room for improvement', value: 2, icon: <Clock size={20} /> },
            { id: 'time-management-3', text: 'Excellent time management system', value: 3, icon: <Clock size={20} /> }
          ]
        },
        {
          id: 'client-management',
          question: 'How do you handle client relationships and communication?',
          options: [
            { id: 'client-management-1', text: 'Informal, mostly verbal agreements', value: 1, icon: <User size={20} /> },
            { id: 'client-management-2', text: 'Basic contracts and regular communication', value: 2, icon: <User size={20} /> },
            { id: 'client-management-3', text: 'Professional CRM and processes', value: 3, icon: <User size={20} /> }
          ]
        },
        {
          id: 'income-diversification',
          question: 'How diversified are your income streams?',
          options: [
            { id: 'income-diversification-1', text: 'Single main income source', value: 1, icon: <DollarSign size={20} /> },
            { id: 'income-diversification-2', text: '2-3 different income sources', value: 2, icon: <DollarSign size={20} /> },
            { id: 'income-diversification-3', text: 'Multiple diversified income streams', value: 3, icon: <DollarSign size={20} /> }
          ]
        },
        {
          id: 'marketing-strategy',
          question: 'How developed is your personal brand and marketing?',
          options: [
            { id: 'marketing-strategy-1', text: 'Minimal online presence', value: 1, icon: <TrendingUp size={20} /> },
            { id: 'marketing-strategy-2', text: 'Active on some platforms', value: 2, icon: <TrendingUp size={20} /> },
            { id: 'marketing-strategy-3', text: 'Comprehensive marketing strategy', value: 3, icon: <TrendingUp size={20} /> }
          ]
        },
        {
          id: 'skill-development',
          question: 'How do you approach learning new skills for your business?',
          options: [
            { id: 'skill-development-1', text: 'Learn as needed, no plan', value: 1, icon: <Target size={20} /> },
            { id: 'skill-development-2', text: 'Occasional courses or workshops', value: 2, icon: <Target size={20} /> },
            { id: 'skill-development-3', text: 'Structured learning and development plan', value: 3, icon: <Target size={20} /> }
          ]
        },
        {
          id: 'financial-tracking',
          question: 'How do you track your business finances?',
          options: [
            { id: 'financial-tracking-1', text: 'Basic bank account tracking', value: 1, icon: <BarChart size={20} /> },
            { id: 'financial-tracking-2', text: 'Spreadsheets for expenses/income', value: 2, icon: <BarChart size={20} /> },
            { id: 'financial-tracking-3', text: 'Professional accounting software', value: 3, icon: <BarChart size={20} /> }
          ]
        },
        {
          id: 'network-building',
          question: 'How actively do you build professional networks?',
          options: [
            { id: 'network-building-1', text: 'Limited networking', value: 1, icon: <Users size={20} /> },
            { id: 'network-building-2', text: 'Attend some events/connect online', value: 2, icon: <Users size={20} /> },
            { id: 'network-building-3', text: 'Active networking and collaborations', value: 3, icon: <Users size={20} /> }
          ]
        },
        {
          id: 'cultural-positioning',
          question: 'How well have you positioned yourself in the cultural sector?',
          options: [
            { id: 'cultural-positioning-1', text: 'Still figuring out my niche', value: 1, icon: <Palette size={20} /> },
            { id: 'cultural-positioning-2', text: 'Clear positioning but limited recognition', value: 2, icon: <Palette size={20} /> },
            { id: 'cultural-positioning-3', text: 'Strong reputation and clear positioning', value: 3, icon: <Palette size={20} /> }
          ]
        }
      ],
      es: [
        {
          id: 'workflow-organization',
          question: '¿Qué tan organizados están tus flujos de trabajo creativos?',
          options: [
            { id: 'workflow-organization-1', text: 'Improvisado, resuelvo sobre la marcha', value: 1, icon: <Settings size={20} /> },
            { id: 'workflow-organization-2', text: 'Algunos procesos básicos establecidos', value: 2, icon: <Settings size={20} /> },
            { id: 'workflow-organization-3', text: 'Flujos de trabajo bien documentados', value: 3, icon: <Settings size={20} /> }
          ]
        },
        {
          id: 'time-management',
          question: '¿Cómo gestionas tu tiempo entre trabajo creativo y tareas comerciales?',
          options: [
            { id: 'time-management-1', text: 'Lucho por equilibrar ambos', value: 1, icon: <Clock size={20} /> },
            { id: 'time-management-2', text: 'Balance decente pero mejorable', value: 2, icon: <Clock size={20} /> },
            { id: 'time-management-3', text: 'Excelente sistema de gestión del tiempo', value: 3, icon: <Clock size={20} /> }
          ]
        },
        {
          id: 'client-management',
          question: '¿Cómo manejas las relaciones y comunicación con clientes?',
          options: [
            { id: 'client-management-1', text: 'Informal, principalmente acuerdos verbales', value: 1, icon: <User size={20} /> },
            { id: 'client-management-2', text: 'Contratos básicos y comunicación regular', value: 2, icon: <User size={20} /> },
            { id: 'client-management-3', text: 'CRM profesional y procesos', value: 3, icon: <User size={20} /> }
          ]
        },
        {
          id: 'income-diversification',
          question: '¿Qué tan diversificadas están tus fuentes de ingresos?',
          options: [
            { id: 'income-diversification-1', text: 'Una fuente principal de ingresos', value: 1, icon: <DollarSign size={20} /> },
            { id: 'income-diversification-2', text: '2-3 fuentes diferentes de ingresos', value: 2, icon: <DollarSign size={20} /> },
            { id: 'income-diversification-3', text: 'Múltiples fuentes diversificadas', value: 3, icon: <DollarSign size={20} /> }
          ]
        },
        {
          id: 'marketing-strategy',
          question: '¿Qué tan desarrollada está tu marca personal y marketing?',
          options: [
            { id: 'marketing-strategy-1', text: 'Presencia online mínima', value: 1, icon: <TrendingUp size={20} /> },
            { id: 'marketing-strategy-2', text: 'Activo en algunas plataformas', value: 2, icon: <TrendingUp size={20} /> },
            { id: 'marketing-strategy-3', text: 'Estrategia de marketing integral', value: 3, icon: <TrendingUp size={20} /> }
          ]
        },
        {
          id: 'skill-development',
          question: '¿Cómo abordas el aprendizaje de nuevas habilidades para tu negocio?',
          options: [
            { id: 'skill-development-1', text: 'Aprendo según necesidad, sin plan', value: 1, icon: <Target size={20} /> },
            { id: 'skill-development-2', text: 'Cursos o talleres ocasionales', value: 2, icon: <Target size={20} /> },
            { id: 'skill-development-3', text: 'Plan estructurado de aprendizaje', value: 3, icon: <Target size={20} /> }
          ]
        },
        {
          id: 'financial-tracking',
          question: '¿Cómo haces seguimiento a las finanzas de tu negocio?',
          options: [
            { id: 'financial-tracking-1', text: 'Seguimiento básico de cuenta bancaria', value: 1, icon: <BarChart size={20} /> },
            { id: 'financial-tracking-2', text: 'Hojas de cálculo para gastos/ingresos', value: 2, icon: <BarChart size={20} /> },
            { id: 'financial-tracking-3', text: 'Software de contabilidad profesional', value: 3, icon: <BarChart size={20} /> }
          ]
        },
        {
          id: 'network-building',
          question: '¿Qué tan activamente construyes redes profesionales?',
          options: [
            { id: 'network-building-1', text: 'Networking limitado', value: 1, icon: <Users size={20} /> },
            { id: 'network-building-2', text: 'Asisto a eventos/conecto online', value: 2, icon: <Users size={20} /> },
            { id: 'network-building-3', text: 'Networking activo y colaboraciones', value: 3, icon: <Users size={20} /> }
          ]
        },
        {
          id: 'cultural-positioning',
          question: '¿Qué tan bien te has posicionado en el sector cultural?',
          options: [
            { id: 'cultural-positioning-1', text: 'Aún descubriendo mi nicho', value: 1, icon: <Palette size={20} /> },
            { id: 'cultural-positioning-2', text: 'Posicionamiento claro pero reconocimiento limitado', value: 2, icon: <Palette size={20} /> },
            { id: 'cultural-positioning-3', text: 'Fuerte reputación y posicionamiento claro', value: 3, icon: <Palette size={20} /> }
          ]
        }
      ]
    },

    team: {
      en: [
        {
          id: 'team-structure',
          question: 'How well-defined are the roles in your cultural team?',
          options: [
            { id: 'team-structure-1', text: 'Everyone does everything', value: 1, icon: <Users size={20} /> },
            { id: 'team-structure-2', text: 'Some role clarity but overlap', value: 2, icon: <Users size={20} /> },
            { id: 'team-structure-3', text: 'Clear roles and responsibilities', value: 3, icon: <Users size={20} /> }
          ]
        },
        {
          id: 'communication-systems',
          question: 'How does your team communicate and coordinate?',
          options: [
            { id: 'communication-systems-1', text: 'Informal conversations and messages', value: 1, icon: <FileText size={20} /> },
            { id: 'communication-systems-2', text: 'Regular meetings and basic tools', value: 2, icon: <FileText size={20} /> },
            { id: 'communication-systems-3', text: 'Structured communication systems', value: 3, icon: <FileText size={20} /> }
          ]
        },
        {
          id: 'project-management',
          question: 'How do you manage cultural projects and deadlines?',
          options: [
            { id: 'project-management-1', text: 'Wing it and hope for the best', value: 1, icon: <Calendar size={20} /> },
            { id: 'project-management-2', text: 'Basic planning and tracking', value: 2, icon: <Calendar size={20} /> },
            { id: 'project-management-3', text: 'Professional project management tools', value: 3, icon: <Calendar size={20} /> }
          ]
        },
        {
          id: 'decision-making',
          question: 'How are important decisions made in your organization?',
          options: [
            { id: 'decision-making-1', text: 'Unclear decision-making process', value: 1, icon: <Target size={20} /> },
            { id: 'decision-making-2', text: 'Some consultation but leader decides', value: 2, icon: <Target size={20} /> },
            { id: 'decision-making-3', text: 'Clear collaborative decision process', value: 3, icon: <Target size={20} /> }
          ]
        },
        {
          id: 'talent-development',
          question: 'How do you develop and retain talent in your team?',
          options: [
            { id: 'talent-development-1', text: 'No formal development program', value: 1, icon: <TrendingUp size={20} /> },
            { id: 'talent-development-2', text: 'Occasional training and feedback', value: 2, icon: <TrendingUp size={20} /> },
            { id: 'talent-development-3', text: 'Structured development and growth plans', value: 3, icon: <TrendingUp size={20} /> }
          ]
        },
        {
          id: 'financial-management',
          question: 'How sophisticated is your financial management?',
          options: [
            { id: 'financial-management-1', text: 'Basic budgeting and tracking', value: 1, icon: <DollarSign size={20} /> },
            { id: 'financial-management-2', text: 'Regular financial reporting', value: 2, icon: <DollarSign size={20} /> },
            { id: 'financial-management-3', text: 'Advanced financial planning and analysis', value: 3, icon: <DollarSign size={20} /> }
          ]
        },
        {
          id: 'stakeholder-relations',
          question: 'How do you manage relationships with stakeholders and partners?',
          options: [
            { id: 'stakeholder-relations-1', text: 'Ad-hoc communication', value: 1, icon: <Handshake size={20} /> },
            { id: 'stakeholder-relations-2', text: 'Regular updates and meetings', value: 2, icon: <Handshake size={20} /> },
            { id: 'stakeholder-relations-3', text: 'Strategic stakeholder management', value: 3, icon: <Handshake size={20} /> }
          ]
        },
        {
          id: 'cultural-impact-measurement',
          question: 'How do you measure the cultural impact of your work?',
          options: [
            { id: 'cultural-impact-measurement-1', text: 'No formal measurement', value: 1, icon: <BarChart size={20} /> },
            { id: 'cultural-impact-measurement-2', text: 'Basic metrics and feedback', value: 2, icon: <BarChart size={20} /> },
            { id: 'cultural-impact-measurement-3', text: 'Comprehensive impact assessment', value: 3, icon: <BarChart size={20} /> }
          ]
        },
        {
          id: 'scalability-planning',
          question: 'How prepared is your organization for growth and scaling?',
          options: [
            { id: 'scalability-planning-1', text: 'No growth planning', value: 1, icon: <TrendingUp size={20} /> },
            { id: 'scalability-planning-2', text: 'Some growth ideas and goals', value: 2, icon: <TrendingUp size={20} /> },
            { id: 'scalability-planning-3', text: 'Strategic growth plan with systems', value: 3, icon: <TrendingUp size={20} /> }
          ]
        }
      ],
      es: [
        {
          id: 'team-structure',
          question: '¿Qué tan bien definidos están los roles en tu equipo cultural?',
          options: [
            { id: 'team-structure-1', text: 'Todos hacen de todo', value: 1, icon: <Users size={20} /> },
            { id: 'team-structure-2', text: 'Cierta claridad de roles pero hay superposición', value: 2, icon: <Users size={20} /> },
            { id: 'team-structure-3', text: 'Roles y responsabilidades claras', value: 3, icon: <Users size={20} /> }
          ]
        },
        {
          id: 'communication-systems',
          question: '¿Cómo se comunica y coordina tu equipo?',
          options: [
            { id: 'communication-systems-1', text: 'Conversaciones informales y mensajes', value: 1, icon: <FileText size={20} /> },
            { id: 'communication-systems-2', text: 'Reuniones regulares y herramientas básicas', value: 2, icon: <FileText size={20} /> },
            { id: 'communication-systems-3', text: 'Sistemas estructurados de comunicación', value: 3, icon: <FileText size={20} /> }
          ]
        },
        {
          id: 'project-management',
          question: '¿Cómo gestionas proyectos culturales y plazos?',
          options: [
            { id: 'project-management-1', text: 'Improvisamos y esperamos lo mejor', value: 1, icon: <Calendar size={20} /> },
            { id: 'project-management-2', text: 'Planificación y seguimiento básicos', value: 2, icon: <Calendar size={20} /> },
            { id: 'project-management-3', text: 'Herramientas profesionales de gestión', value: 3, icon: <Calendar size={20} /> }
          ]
        },
        {
          id: 'decision-making',
          question: '¿Cómo se toman las decisiones importantes en tu organización?',
          options: [
            { id: 'decision-making-1', text: 'Proceso de decisión poco claro', value: 1, icon: <Target size={20} /> },
            { id: 'decision-making-2', text: 'Cierta consulta pero el líder decide', value: 2, icon: <Target size={20} /> },
            { id: 'decision-making-3', text: 'Proceso colaborativo claro de decisión', value: 3, icon: <Target size={20} /> }
          ]
        },
        {
          id: 'talent-development',
          question: '¿Cómo desarrollas y retienes talento en tu equipo?',
          options: [
            { id: 'talent-development-1', text: 'No hay programa formal de desarrollo', value: 1, icon: <TrendingUp size={20} /> },
            { id: 'talent-development-2', text: 'Capacitación y feedback ocasionales', value: 2, icon: <TrendingUp size={20} /> },
            { id: 'talent-development-3', text: 'Planes estructurados de desarrollo', value: 3, icon: <TrendingUp size={20} /> }
          ]
        },
        {
          id: 'financial-management',
          question: '¿Qué tan sofisticada es tu gestión financiera?',
          options: [
            { id: 'financial-management-1', text: 'Presupuesto y seguimiento básicos', value: 1, icon: <DollarSign size={20} /> },
            { id: 'financial-management-2', text: 'Reportes financieros regulares', value: 2, icon: <DollarSign size={20} /> },
            { id: 'financial-management-3', text: 'Planificación y análisis financiero avanzado', value: 3, icon: <DollarSign size={20} /> }
          ]
        },
        {
          id: 'stakeholder-relations',
          question: '¿Cómo gestionas las relaciones con stakeholders y socios?',
          options: [
            { id: 'stakeholder-relations-1', text: 'Comunicación improvisada', value: 1, icon: <Handshake size={20} /> },
            { id: 'stakeholder-relations-2', text: 'Actualizaciones y reuniones regulares', value: 2, icon: <Handshake size={20} /> },
            { id: 'stakeholder-relations-3', text: 'Gestión estratégica de stakeholders', value: 3, icon: <Handshake size={20} /> }
          ]
        },
        {
          id: 'cultural-impact-measurement',
          question: '¿Cómo mides el impacto cultural de tu trabajo?',
          options: [
            { id: 'cultural-impact-measurement-1', text: 'No hay medición formal', value: 1, icon: <BarChart size={20} /> },
            { id: 'cultural-impact-measurement-2', text: 'Métricas básicas y feedback', value: 2, icon: <BarChart size={20} /> },
            { id: 'cultural-impact-measurement-3', text: 'Evaluación integral de impacto', value: 3, icon: <BarChart size={20} /> }
          ]
        },
        {
          id: 'scalability-planning',
          question: '¿Qué tan preparada está tu organización para crecer y escalar?',
          options: [
            { id: 'scalability-planning-1', text: 'No hay planificación de crecimiento', value: 1, icon: <TrendingUp size={20} /> },
            { id: 'scalability-planning-2', text: 'Algunas ideas y objetivos de crecimiento', value: 2, icon: <TrendingUp size={20} /> },
            { id: 'scalability-planning-3', text: 'Plan estratégico de crecimiento con sistemas', value: 3, icon: <TrendingUp size={20} /> }
          ]
        }
      ]
    }
  };

  return questionSets[profileType][language];
};
