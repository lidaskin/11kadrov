# 🎬 ПОЛНАЯ ИНСТРУКЦИЯ ПО РАЗВЁРТЫВАНИЮ НА СЕРВЕРЕ
## Дальневосточный фестиваль креативной анимации «11 кадров» (г. Чита)

Данный пакет содержит **полную готовую сборку приложения** со всеми компонентами:
1. **Frontend**: Интерактивный портал на React 19 + Vite + Tailwind CSS + Framer Motion.
2. **Backend**: Полноценный API-сервер на Express + TypeScript (`server.ts`), скомпилированный в автономный CommonJS бандл `dist/server.cjs`.
3. **Реляционная база данных (PostgreSQL)**:
   - Полная схема таблиц: `users`, `admin_credentials`, `admin_audit_logs`, `applications`, `email_logs`.
   - Автоматический скрипт инициализации `schema.sql`.
   - Готовая преднастроенная учётная запись администратора оргкомитета.
4. **Почтовая служба (Mailer / SMTP)**:
   - Автоматическая отправка уведомлений о каждой поданной заявке на `chita11kadrov@mail.ru`.
   - Поддержка SMTP Mail.ru, Yandex, Gmail или любого корпоративного почтового сервера.
   - Красивые адаптивные HTML-письма с полными реквизитами заявки и ссылкой на конкурсный фильм.
   - Журнал аудита отправленных писем в базе данных и панель повторной отправки при сбоях сети.
5. **Панель управления оргкомитета (Админка)**:
   - Полный менеджмент конкурсных заявок (одобрение, отклонение, фильтры, экспорт в Excel/CSV/JSON).
   - SQL-консоль и статистика базы данных.
   - Управление расписанием фестиваля, номинациями, составом жюри, вопросами FAQ и контактами.
   - Смена пароля администратора в базе данных.

---

## 🚀 ВАРИАНТ 1: Быстрый запуск в Docker Compose (Рекомендуемый, 2 минуты)

Этот способ не требует установки PostgreSQL и Node.js на хост-сервер — всё поднимается в изолированных контейнерах.

### Требования к серверу:
- Ubuntu 22.04 / 24.04 / Debian 12 / CentOS 9 (или любая Linux OS);
- Установленные `docker` и `docker compose` (версии 2+);
- Минимум 1 ГБ RAM (рекомендуется 2 ГБ) и 10 ГБ диска.

### Шаги установки:

1. **Распакуйте архив с проектом на сервере:**
   ```bash
   mkdir -p /var/www/11kadrov
   cd /var/www/11kadrov
   # Распакуйте сюда полученный ZIP-архив
   unzip festival-11-kadrov-server.zip
   ```

2. **Создайте и настройте файл конфигурации `.env`:**
   ```bash
   cp .env.production.example .env
   nano .env
   ```
   Укажите в `.env` свои значения (особенно пароль от почты `SMTP_PASS`):
   ```ini
   PORT=3000
   NODE_ENV=production
   SQL_HOST=postgres
   SQL_PORT=5432
   SQL_DB_NAME=festival_11_kadrov
   SQL_USER=festival_admin
   SQL_PASSWORD=Ваш_Надежный_Пароль_К_БД_2026!

   NOTIFICATION_EMAIL=chita11kadrov@mail.ru
   SMTP_HOST=smtp.mail.ru
   SMTP_PORT=465
   SMTP_USER=chita11kadrov@mail.ru
   SMTP_PASS=пароль_приложения_mail_ru
   ```

3. **Запустите автоматический деплой:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```
   *Или вручную командой:*
   ```bash
   docker compose up -d --build
   ```

4. **Проверьте статус сервисов:**
   ```bash
   docker compose ps
   curl -s http://localhost:3000/api/health
   ```

Готово! Сайт доступен на порту `3000`.

---

## 💻 ВАРИАНТ 2: Установка без Docker (Node.js + PostgreSQL + PM2)

Если вы предпочитаете нативное развёртывание на VPS:

### 1. Установка Node.js 20 и PostgreSQL:
```bash
# Ubuntu / Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql postgresql-contrib
sudo npm install -g pm2
```

### 2. Создание базы данных PostgreSQL:
```bash
sudo -u postgres psql
```
В консоли PostgreSQL выполните:
```sql
CREATE DATABASE festival_11_kadrov;
CREATE USER festival_admin WITH ENCRYPTED PASSWORD 'Ваш_Надежный_Пароль_К_БД_2026!';
GRANT ALL PRIVILEGES ON DATABASE festival_11_kadrov TO festival_admin;
ALTER DATABASE festival_11_kadrov OWNER TO festival_admin;
\q
```

### 3. Импорт схемы таблиц базы данных:
```bash
psql -U festival_admin -d festival_11_kadrov -h localhost -f schema.sql
```
*(Будут созданы все таблицы: `users`, `admin_credentials`, `admin_audit_logs`, `applications`, `email_logs` и предсоздан администратор `admin`)*.

### 4. Установка зависимостей и сборка приложения:
```bash
cd /var/www/11kadrov
cp .env.production.example .env
nano .env  # Укажите SQL_HOST=localhost и данные вашей БД
npm install
npm run build
```

### 5. Запуск через PM2 (с автозапуском при перезагрузке сервера):
```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

---

## 📧 НАСТРОЙКА ПОЧТОВОЙ СЛУЖБЫ MAIL.RU (Для ящика chita11kadrov@mail.ru)

По умолчанию фестиваль принимает заявки и направляет мгновенные уведомления на адрес:
**`chita11kadrov@mail.ru`**.

Для отправки писем через официальный SMTP-сервер Mail.ru требуется сгенерировать **«Пароль для внешних приложений»**:
1. Войдите в почту `chita11kadrov@mail.ru` на сайте Mail.ru.
2. В нижнем левом углу нажмите на значок шестерёнки (Настройки) -> **«Все настройки»**.
3. Перейдите в раздел **«Безопасность»** -> блок **«Пароли для внешних приложений»**.
4. Нажмите кнопку **«Добавить»**, укажите имя (например, `11kadrov_server`).
5. Скопируйте сгенерированный 16-значный пароль приложения (вида `xxxx-xxxx-xxxx-xxxx`).
6. Вставьте его в ваш файл `.env` на сервере в строку:
   ```ini
   SMTP_HOST=smtp.mail.ru
   SMTP_PORT=465
   SMTP_USER=chita11kadrov@mail.ru
   SMTP_PASS=ваш_скопированный_пароль_приложения
   NOTIFICATION_EMAIL=chita11kadrov@mail.ru
   ```
7. Перезапустите приложение (`docker compose restart app` или `pm2 restart festival-11-kadrov`).
8. В панели администратора в разделе «База данных и почта» нажмите **«Тест отправки на chita11kadrov@mail.ru»** для мгновенной проверки соединения.

---

## 🌐 НАСТРОЙКА ВЕБ-СЕРВЕРА NGINX И SSL (HTTPS)

Для работы сайта по доменному имени (например, `11kadrov.ru`) с бесплатным SSL-сертификатом Let's Encrypt:

1. **Скопируйте конфигурационный файл:**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/11kadrov.conf
   # Замените в файле 11kadrov.ru на ваш реальный домен
   sudo nano /etc/nginx/sites-available/11kadrov.conf
   sudo ln -s /etc/nginx/sites-available/11kadrov.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

2. **Получите бесплатный SSL-сертификат Let's Encrypt (Certbot):**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d 11kadrov.ru -d www.11kadrov.ru
   ```
   Certbot автоматически настроит защищённый протокол HTTPS и настроит автопродление сертификата.

---

## 🔐 ВХОД В ПАНЕЛЬ УПРАВЛЕНИЯ ОРГКОМИТЕТА (АДМИНКУ)

1. Откройте сайт фестиваля в браузере.
2. В самом низу страницы (в футере) нажмите ссылку **«Вход для оргкомитета»** (или используйте клавиатурную комбинацию `Alt + A`).
3. Введите данные для входа:
   - **Логин**: `admin`
   - **Пароль по умолчанию**: `11kadrov`
4. Внутри панели управления вы можете:
   - Просматривать и модерировать все поданные заявки участников;
   - Менять статус заявок: *«Одобрена»*, *«На рассмотрении»*, *«Отклонена»*;
   - Повторно отправлять письма на `chita11kadrov@mail.ru` одной кнопкой;
   - Экспортировать реестр заявок в Excel (CSV) или JSON;
   - Редактировать номинации, программу фестиваля, список жюри и FAQ;
   - Изменить пароль администратора на новый в базе данных.

---

## 💾 РЕЗЕРВНОЕ КОПИРОВАНИЕ (БЭКАПЫ)

### Бэкап базы данных PostgreSQL:
```bash
# В Docker:
docker exec -t festival_11kadrov_db pg_dump -U festival_admin festival_11_kadrov > backup_$(date +%Y%m%d).sql

# Без Docker:
pg_dump -U festival_admin -d festival_11_kadrov -h localhost > backup_$(date +%Y%m%d).sql
```

### Восстановление из бэкапа:
```bash
# В Docker:
cat backup_20261015.sql | docker exec -i festival_11kadrov_db psql -U festival_admin -d festival_11_kadrov

# Без Docker:
psql -U festival_admin -d festival_11_kadrov -h localhost < backup_20261015.sql
```

---

## 📞 ТЕХНИЧЕСКАЯ ПОДДЕРЖКА ФЕСТИВАЛЯ
- **Организатор**: Школа креативных индустрий (ШКИ) Забайкальского края, г. Чита.
- **Официальный email оргкомитета**: `chita11kadrov@mail.ru`
- **Телефон оргкомитета**: +7 (3022) 35-22-11
