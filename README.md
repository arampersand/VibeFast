# VibeFast

Boilerplate para el **Curso de Vibecoding Remotto × Startup Chihuahua** (11 semanas, 29 jun – 7 sep 2026).

Construido para founders mayormente no técnicos con 4 horas semanales: arrancas con una plantilla lista y la extiendes semana a semana hasta llegar a Demo Day con un producto AI-native funcional.

## Qué instalar (una vez que tienes el repo)

Antes de correr nada, ten esto listo. Checklist completa con los enlaces de cada cuenta: `/docs/setup/instalacion`.

**En tu computadora:**

- **Node 20 o 22 LTS** ([nodejs.org](https://nodejs.org)) — usa una versión par. El repo trae `.nvmrc`: con nvm corre `nvm use`.
- **yarn 1.x** — `npm install -g yarn`
- **Git** y **[Cursor](https://cursor.com)** (el editor con IA).

**Cuentas (todas con tier gratuito):**

- [GitHub](https://github.com), [Supabase](https://supabase.com) y [Vercel](https://vercel.com) — créalas hoy.
- [OpenAI](https://platform.openai.com) (Sem 3+) y [Resend](https://resend.com) (Sem 1+) — opcionales al inicio.

## Quick start (30 min, día de Sem 1)

```bash
# 1. Forkea con "Use this template" en GitHub y clona tu repo
git clone https://github.com/<tu-usuario>/<tu-producto>.git
cd <tu-producto>

# 2. Instala dependencias (yarn workspaces resuelve todo)
yarn install

# 3. Copia variables de entorno y rellena
cp web/.env.example web/.env.local

# 4. Arranca
yarn dev
```

Abre `http://localhost:3000` — verás tu landing.
Abre `http://localhost:3000/docs` — verás la documentación completa, mapeada semana a semana.

> Primera vez: sigue la checklist en `/docs/setup/instalacion` y luego el paso a paso en `/docs/setup/quick-start` (después de `yarn dev`).

## Estructura del repo

```
vibefast/
├── web/             ← Next.js app (donde construyes tu producto)
├── firmware/        ← ESP32 / asistente de voz (módulo hardware; ignóralo hasta Sem 8–9)
├── docs-content/    ← Fuente MDX de la documentación
└── supabase/        ← Migrations y schema
```

## Stack

- **Next.js 15** (App Router, JavaScript) + **Tailwind 4** + **DaisyUI**
- **Supabase** (Postgres + pgvector) + **Google Auth**
- **OpenAI** SDK + **LangGraph.js** + **MCP**
- **Resend** (email) + **PostHog** (analytics, opcional)
- **Vercel** + **yarn 1.x** workspaces

Detalles y razones de cada elección: `/docs/intro/stack`.

## Cómo usar las docs

Las docs están dentro del repo (`docs-content/`) y se sirven en `/docs` cuando corres `yarn dev`. Cuando deployas a Vercel, tus docs también se publican — son **tuyas**, edítalas.

- **Tutoriales** (`/docs/tutoriales/semana-N`): qué hacer cada semana del curso.
- **Features** (`/docs/features/*`): cómo funciona cada pieza del stack.
- **Recetas** (`/docs/recetas/*`): playbooks completos para casos comunes (agente Gmail, chatbot con RAG, SaaS, etc).
- **Troubleshooting** (`/docs/troubleshooting`): errores comunes y su solución.

## Licencia

MIT — usa esto para tu producto, modifícalo, distribúyelo. Si construyes algo cool, etiquétanos.
