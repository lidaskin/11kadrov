#!/usr/bin/env bash
# ==============================================================================
# Скрипт автоматического развёртывания фестиваля «11 кадров»
# Запуск: chmod +x deploy.sh && ./deploy.sh
# ==============================================================================

set -e

echo "🎬 ======================================================="
echo "🎬 РАЗВЁРТЫВАНИЕ: Фестиваль анимации «11 кадров»"
echo "🎬 ======================================================="

# 1. Проверка наличия файла .env
if [ ! -f .env ]; then
  echo "⚠️ Файл .env не найден! Создаём из .env.production.example..."
  cp .env.production.example .env
  echo "✅ Создан файл .env. Пожалуйста, проверьте и укажите реальные пароли в .env!"
fi

# 2. Проверка Docker и Docker Compose
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
  echo "🐳 Обнаружен Docker и Docker Compose. Запуск через контейнеры..."
  echo "📦 Сборка и запуск PostgreSQL + Node.js приложения..."
  docker compose down --remove-orphans || true
  docker compose up -d --build
  
  echo "⏳ Ожидание инициализации базы данных и сервисов..."
  sleep 6

  echo "🔍 Проверка состояния контейнеров:"
  docker compose ps

  echo "🩺 Проверка отклика приложения:"
  curl -s http://localhost:3000/api/health || echo "Приложение стартует..."

  echo ""
  echo "🎉 ======================================================="
  echo "🎉 УСПЕШНО РАЗВЁРНУТО В DOCKER!"
  echo "🌐 Сайт доступен по адресу: http://localhost:3000"
  echo "🔑 Вход в админку: http://localhost:3000 -> Кнопка «Вход для оргкомитета» в подвале"
  echo "👤 Логин: admin | Пароль: 11kadrov"
  echo "📧 Почта приёма заявок: chita11kadrov@mail.ru"
  echo "🎉 ======================================================="
  exit 0
fi

# 3. Вариант без Docker (стандартный Node.js + PM2)
echo "💻 Docker не обнаружен. Проверяем локальное окружение Node.js..."

if ! command -v node &> /dev/null; then
  echo "❌ Ошибка: Node.js не установлен! Установите Node.js 18+ или 20+."
  exit 1
fi

echo "📦 Установка npm зависимостей..."
npm install

echo "🔨 Сборка проекта (Frontend + Backend bundle)..."
npm run build

echo "🗄️ Напоминание по базе данных PostgreSQL:"
echo "   Убедитесь, что PostgreSQL запущен и выполнена команда:"
echo "   psql -U festival_admin -d festival_11_kadrov -f schema.sql"

if command -v pm2 &> /dev/null; then
  echo "🚀 Перезапуск через PM2..."
  pm2 restart ecosystem.config.cjs --env production || pm2 start ecosystem.config.cjs --env production
  pm2 save
  echo "✅ Запущено через PM2!"
else
  echo "💡 PM2 не найден. Запуск напрямую: npm start"
  echo "   (Рекомендуется установить PM2: npm install -g pm2)"
  npm start
fi
