.PHONY: build up down logs restart clean env

# Cria .env a partir do exemplo se ainda não existir
env:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ .env criado a partir de .env.example — preencha suas chaves!"; \
	else \
		echo "ℹ️  .env já existe."; \
	fi

# Build de tudo
build: env
	docker compose build

# Build e sobe tudo
up: env
	docker compose up --build -d
	@echo ""
	@echo "🚀 Aplicação rodando!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:8000"
	@echo "   Health:   http://localhost:8000/api/health"
	@echo ""
	@echo "📋 Para ver os logs: make logs"

# Sobe sem rebuild
start:
	docker compose up -d

# Derruba tudo
down:
	docker compose down

# Logs em tempo real
logs:
	docker compose logs -f

# Logs só do backend
logs-back:
	docker compose logs -f backend

# Logs só do frontend
logs-front:
	docker compose logs -f frontend

# Restart
restart: down up

# Limpa tudo (containers, imagens, volumes)
clean:
	docker compose down --rmi all --volumes --remove-orphans
	@echo "🧹 Tudo limpo."

# Dev mode - roda backend direto e frontend com vite dev
dev-back:
	cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-front:
	cd frontend && npm run dev
