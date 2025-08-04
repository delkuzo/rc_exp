# 🎨 Система иконок RC Experiment

Система иконок на основе [@gravity-ui/icons](https://github.com/gravity-ui/icons.git) для проекта RC Experiment.

## 📁 Структура

```
icons/
├── icon-system.js      # Основная система иконок
├── popular-icons.json  # Список популярных иконок
├── README.md          # Документация
└── *.svg              # SVG файлы иконок
```

## 🚀 Использование

### Подключение иконки в коде

```javascript
// Получить HTML иконки
const iconHtml = window.connectIcon('star');

// Или через систему иконок
const iconSystem = window.iconSystem;
const iconHtml = iconSystem.renderIcon('heart', 24, 'my-icon-class');
```

### Доступные иконки

Всего доступно **34 иконки** из Gravity UI:

- **Действия:** plus, minus, delete, check, eye, eye-slash
- **Медиа:** play, pause, stop, video, volume, camera, headphones
- **Файлы:** file, file-exclamation, file-question, folder, folder-exclamation
- **Статусы:** circle-exclamation, circle-info, circle-question, exclamation-shape, diamond-exclamation
- **Безопасность:** lock, fingerprint
- **Время:** calendar, clock
- **Платежи:** credit-card
- **Социальные:** heart, star
- **Макеты:** layout-list, list-check, list-check-lock, list-ol

## 🎯 Демо

Откройте `index.html` и перейдите в блок "Иконки" для просмотра всех доступных иконок с названиями и кодами.

## 🔧 Технические детали

- **Источник:** Gravity UI Icons
- **Формат:** SVG
- **Размер:** 24x24px (по умолчанию)
- **Стиль:** Stroke-based
- **Цвет:** Наследует текущий цвет текста

## 📝 Добавление новых иконок

1. Скопируйте SVG файл из репозитория Gravity UI в папку `icons/`
2. Добавьте информацию об иконке в `popular-icons.json`
3. Обновите список в `icon-system.js`

## 🎨 Кастомизация

Иконки автоматически адаптируются к текущей теме (светлая/темная) и наследуют цвет текста через `currentColor`. 