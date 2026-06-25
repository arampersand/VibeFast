-- ============================================================
-- 005 · tool_calls (auditoría de tool use)
-- ------------------------------------------------------------
-- Registra cada vez que un agente invoca una tool: qué tool, con
-- qué argumentos, qué devolvió y por qué la eligió (reasoning).
-- Sirve para evals y debugging del comportamiento del agente
-- (Sem 4-5). Cada usuario solo ve sus propios registros (RLS).
--
-- conversation_id es nullable: no toda tool corre dentro de un chat.
--
-- El alumno NO modela tablas: este schema ya viene completo.
-- ============================================================

create table if not exists public.tool_calls (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  conversation_id uuid references public.ai_conversations (id) on delete set null,
  tool_name       text not null,
  arguments       jsonb not null default '{}'::jsonb,
  result          jsonb,
  reasoning       text,
  created_at      timestamptz not null default now()
);

comment on table public.tool_calls is 'Auditoría de tool use: qué tool invocó el agente, args, result y por qué.';

create index if not exists tool_calls_user_id_idx
  on public.tool_calls (user_id, created_at desc);

create index if not exists tool_calls_conversation_id_idx
  on public.tool_calls (conversation_id);

-- ------------------------------------------------------------
-- RLS · tool_calls (dueño total sobre lo suyo)
-- ------------------------------------------------------------
alter table public.tool_calls enable row level security;

drop policy if exists "tool_calls_select_own" on public.tool_calls;
create policy "tool_calls_select_own"
  on public.tool_calls for select
  using (auth.uid() = user_id);

drop policy if exists "tool_calls_insert_own" on public.tool_calls;
create policy "tool_calls_insert_own"
  on public.tool_calls for insert
  with check (auth.uid() = user_id);

drop policy if exists "tool_calls_update_own" on public.tool_calls;
create policy "tool_calls_update_own"
  on public.tool_calls for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "tool_calls_delete_own" on public.tool_calls;
create policy "tool_calls_delete_own"
  on public.tool_calls for delete
  using (auth.uid() = user_id);
