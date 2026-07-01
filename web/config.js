// ============================================================
// VibeFast · config.js
// ------------------------------------------------------------
// ESTE ES EL ARCHIVO MÁS IMPORTANTE DEL BOILERPLATE.
// Todo el branding, copy, features y configuración del producto vive aquí.
// Cambiar este archivo cambia el producto entero — sin abrir JSX.
//
// Estructura:
//   - app:      identidad del producto (nombre, descripción, dominio, color)
//   - features: toggles para encender/apagar funcionalidades
//   - ai:       configuración de OpenAI
//   - email:    configuración de Resend
//   - auth:     providers habilitados
//   - landing:  copy de la página pública
//   - pricing:  planes (si features.payments está activo)
//
// Tip Sem 1: empieza editando `app` y `landing.hero` con los datos de tu producto.
// ============================================================

const config = {
  // -----------------------------------------------------------
  // Identidad del producto
  // -----------------------------------------------------------
  app: {
    name: "VibeFast",
    description:
      "Boilerplate AI-native para founders. Construido para el Curso de Vibecoding Remotto.",
    domain: "vibefast.dev", // sin https://, sin www
    locale: "es", // "es" | "en"
    // URL pública: usa NEXT_PUBLIC_APP_URL en .env. En este config solo definimos el default.
    defaultUrl: "http://localhost:3000",
  },

  // -----------------------------------------------------------
  // Identidad visual
  // -----------------------------------------------------------
  brand: {
    // Color primario en HEX. DaisyUI lo aplica como --color-primary via theme.
    primary: "#7c3aed", // violet-600
    // Logo: puede ser texto o ruta a /public/logo.svg
    logoText: "VibeFast",
    logoSrc: null,
    // Estilo del bordeado global (DaisyUI usa esto para botones, cards)
    radius: "1rem",
  },

  // -----------------------------------------------------------
  // Toggles de features — encienden/apagan rutas y componentes
  // -----------------------------------------------------------
  features: {
    waitlist: true, // Captura emails en landing — Sem 1
    googleAuth: true, // Login con Google — Sem 2
    emailLogin: false, // Magic link email — opcional
    aiChat: true, // Chat AI en /chat — Sem 3
    toolUse: true, // Tool use registry — Sem 4
    agents: true, // LangGraph agents — Sem 5
    mcp: true, // Servidor MCP en /api/mcp — Sem 5
    rag: false, // RAG con pgvector — opcional
    posthog: false, // Tracking — opcional
    resend: true, // Email — Sem 1+
    pricing: true, // Muestra la sección de precios en la landing (vitrina; el cobro real es `payments`)
    payments: false, // Stripe — opcional, fuera del temario
    hardware: false, // ESP-Claw bridge — Sem 8
  },

  // -----------------------------------------------------------
  // OpenAI
  // -----------------------------------------------------------
  ai: {
    chatModel: "gpt-4o-mini", // default barato y rápido
    structuredModel: "gpt-4o-mini",
    agentModel: "gpt-4o", // los agentes razonan mejor con full gpt-4o
    embeddingModel: "text-embedding-3-small",
    maxTokens: 1500,
    temperature: 0.4,
  },

  // -----------------------------------------------------------
  // Resend (email transaccional)
  // -----------------------------------------------------------
  email: {
    // Asegúrate de tener el dominio verificado en Resend antes de cambiar `from`.
    // En desarrollo Resend permite enviar a tu propio correo desde `onboarding@resend.dev`.
    from: "VibeFast <onboarding@resend.dev>",
    replyTo: "hola@vibefast.dev",
    supportEmail: "soporte@vibefast.dev",
  },

  // -----------------------------------------------------------
  // Auth providers
  // -----------------------------------------------------------
  auth: {
    loginUrl: "/login",
    afterLoginUrl: "/dashboard",
    afterLogoutUrl: "/",
    providers: ["google"], // se sincroniza con features.googleAuth / emailLogin
  },

  // -----------------------------------------------------------
  // Landing — todo el copy de la página pública
  // -----------------------------------------------------------
  landing: {
    nav: [
      { label: "Características", href: "#features" },
      { label: "Precios", href: "#pricing" },
      { label: "Preguntas", href: "#faq" },
      { label: "Docs", href: "/docs" },
    ],
    hero: {
      eyebrow: "Curso Vibecoding · Remotto × Startup Chihuahua",
      title: "De 0 a producto AI-native en 11 semanas.",
      subtitle:
        "VibeFast es la plantilla del curso: Next.js, Supabase, OpenAI y MCP cableados desde el día 1. Tú extiendes con prompts en Cursor.",
      cta: { label: "Únete al waitlist", href: "#waitlist" },
      ctaSecondary: { label: "Ver docs", href: "/docs" },
    },
    problem: {
      eyebrow: "El problema",
      title: "Construir el andamiaje mata tu momentum.",
      subtitle:
        "La mayoría de founders se atoran semanas configurando lo mismo antes de tocar su idea real.",
      items: [
        {
          icon: "Timer",
          title: "Semanas en boilerplate",
          body: "Auth, base de datos, deploy, emails… configuras lo mismo que todos antes de validar nada.",
        },
        {
          icon: "Puzzle",
          title: "Parálisis por herramientas",
          body: "Cada capa tiene 10 opciones. Comparas en vez de construir y pierdes el hilo.",
        },
        {
          icon: "PlugZap",
          title: "La IA no se integra sola",
          body: "Structured outputs, tool use, agentes y MCP suenan bien hasta que hay que cablearlos.",
        },
      ],
    },
    features: {
      eyebrow: "Lo que ya viene listo",
      title: "Stack completo, una sola decisión por capa.",
      subtitle: "No pierdes tiempo eligiendo herramientas. Te enfocas en tu producto.",
      items: [
        {
          icon: "Sparkles",
          title: "AI nativa",
          body: "OpenAI con structured outputs, tool use, agentes con LangGraph y MCP. Listo para activar.",
        },
        {
          icon: "Database",
          title: "Supabase + Auth",
          body: "Base de datos con RLS, Google Auth y tablas pre-modeladas. No diseñas schema desde cero.",
        },
        {
          icon: "Zap",
          title: "Deploy en minutos",
          body: "Vercel + Supabase Cloud. Una URL pública el primer día.",
        },
        {
          icon: "BookOpen",
          title: "Docs semana a semana",
          body: "Tutoriales mapeados al temario del curso, con prompts de Cursor listos para copiar.",
        },
        {
          icon: "Mail",
          title: "Email + analytics",
          body: "Resend para correos transaccionales y PostHog opcional para tracking.",
        },
        {
          icon: "Cpu",
          title: "Hardware-ready",
          body: "Conexión MCP al ESP-Claw para el caso de hardware con IA del Módulo 3.",
        },
      ],
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Lo que todo founder pregunta antes de arrancar.",
      items: [
        {
          q: "¿Necesito saber programar?",
          a: "No. El curso asume founders no técnicos. Construyes describiendo en Cursor; el boilerplate hace el resto.",
        },
        {
          q: "¿Cuánto cuesta correr esto?",
          a: "Vercel y Supabase tienen tiers gratuitos generosos. OpenAI cobra por uso: con gpt-4o-mini, el costo de un MVP del curso ronda US$5-20.",
        },
        {
          q: "¿Puedo cambiar el stack?",
          a: "Sí, pero el curso (y las docs) asumen este stack. Cambiar pieza por pieza es posible después del curso.",
        },
        {
          q: "¿Y si me atoro?",
          a: "Las docs incluyen una sección de troubleshooting con los 20 errores más comunes. Además hay sesión semanal con el docente.",
        },
      ],
    },
    socialProof: {
      text: "Founders del curso ya lanzaron con este stack",
      logos: ["Remotto", "Startup Chihuahua", "Next.js", "Supabase", "OpenAI", "Vercel"],
    },
    testimonials: {
      eyebrow: "Prueba social",
      title: "Founders que ya lanzaron con VibeFast.",
      subtitle: "Testimonios de cohortes anteriores del curso.",
      items: [
        {
          quote:
            "Pasé de una idea en Notion a un MVP con IA en producción en dos semanas. Nunca había tocado código.",
          author: "Ana Márquez",
          role: "Founder · Fisio en casa",
        },
        {
          quote:
            "El boilerplate ya traía auth, base de datos y el agente cableados. Solo describí lo que quería en Cursor.",
          author: "Diego Sáenz",
          role: "Founder · Tutor IA",
        },
        {
          quote:
            "Las docs semana a semana fueron mi mapa. Copiaba el prompt, ajustaba y avanzaba sin atorarme.",
          author: "Lucía Fernández",
          role: "Founder · Recetario inteligente",
        },
      ],
    },
    finalCta: {
      eyebrow: "Tu turno",
      title: "Deja de configurar. Empieza a construir.",
      subtitle:
        "Clona la plantilla, edita config.js y ten tu producto AI-native en producción esta semana.",
      cta: { label: "Únete al waitlist", href: "#waitlist" },
      ctaSecondary: { label: "Leer las docs", href: "/docs" },
    },
    waitlist: {
      eyebrow: "Únete primero",
      title: "Sé de los primeros en saber.",
      subtitle: "Te avisamos cuando abramos cupos para la siguiente cohorte.",
      successMessage: "¡Listo! Te avisamos en cuanto haya novedades.",
      buttonLabel: "Quiero entrar",
      placeholder: "tu@email.com",
    },
    footer: {
      tagline: "Construido para founders. Por Remotto × Startup Chihuahua.",
      columns: [
        {
          title: "Producto",
          links: [
            { label: "Características", href: "#features" },
            { label: "Precios", href: "#pricing" },
            { label: "Preguntas", href: "#faq" },
          ],
        },
        {
          title: "Recursos",
          links: [
            { label: "Docs", href: "/docs" },
            { label: "Quick start", href: "/docs/setup/quick-start" },
            { label: "Troubleshooting", href: "/docs/troubleshooting/errores-comunes" },
          ],
        },
        {
          title: "Comunidad",
          links: [
            { label: "GitHub", href: "https://github.com/remotto/vibefast", external: true },
            { label: "Remotto", href: "https://remotto.com", external: true },
          ],
        },
      ],
      // Compat: links planos usados en el bar inferior
      links: [
        { label: "Docs", href: "/docs" },
        { label: "GitHub", href: "https://github.com/remotto/vibefast", external: true },
      ],
    },
  },

  // -----------------------------------------------------------
  // Pricing — vitrina de planes.
  // Se muestra en la landing si features.pricing === true.
  // El cobro real (Stripe) depende de features.payments.
  // -----------------------------------------------------------
  pricing: {
    eyebrow: "Precios",
    title: "Simple y sin sorpresas.",
    subtitle: "Empieza gratis. Sube de plan cuando tu producto crezca.",
    plans: [
      {
        id: "starter",
        name: "Starter",
        price: 0,
        currency: "USD",
        interval: "mes",
        description: "Para probar el producto.",
        features: ["Hasta 100 usuarios", "Soporte por email", "Branding VibeFast"],
        cta: "Empezar gratis",
      },
      {
        id: "pro",
        name: "Pro",
        price: 29,
        currency: "USD",
        interval: "mes",
        description: "Para founders que ya facturan.",
        features: ["Usuarios ilimitados", "Soporte prioritario", "Sin branding"],
        cta: "Probar Pro",
        highlighted: true,
        stripePriceId: "", // llenar cuando se active payments
      },
    ],
  },
}

export default config
