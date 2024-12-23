init:
	supabase login
	supabase link --project-ref $(PROJECT_ID)
	supabase db push
	pnpm update-types
	pnpm install

dev:
	pnpm dev:all

run:
	make init
	make dev

supabase:
	supabase start