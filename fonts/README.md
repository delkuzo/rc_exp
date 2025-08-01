# Шрифты YS Text

## 📁 Структура файлов

```
fonts/
├── fonts.css          # CSS для подключения шрифтов
├── README.md          # Эта инструкция
├── YS-Text-Regular.woff2
├── YS-Text-Regular.woff
├── YS-Text-Medium.woff2
├── YS-Text-Medium.woff
├── YS-Text-Bold.woff2
├── YS-Text-Bold.woff
├── YS-Text-Light.woff2
└── YS-Text-Light.woff
```

## 🎯 Назначение

Шрифт **YS Text** - это корпоративный шрифт Яндекса, используемый в проекте для обеспечения единообразного и профессионального внешнего вида интерфейсов.

## 📦 Установка шрифтов

### Вариант 1: Скачивание с официального источника

1. Перейдите на официальный сайт Yandex Design System
2. Скачайте шрифты YS Text в форматах WOFF2 и WOFF
3. Разместите файлы в папке `fonts/`

### Вариант 2: Использование Google Fonts (альтернатива)

Если у вас нет доступа к YS Text, можно временно использовать похожий шрифт:

```css
/* В fonts/fonts.css заменить на: */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap');

:root {
    --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

## 🔧 Настройка

1. **Разместите файлы шрифтов** в папке `fonts/`
2. **Проверьте подключение** - откройте `index.html` в браузере
3. **Убедитесь**, что шрифты загружаются корректно

## 📋 Доступные начертания

- **Light (300)** - для мелкого текста и подписей
- **Regular (400)** - основной текст
- **Medium (500)** - заголовки и акценты
- **Bold (700)** - крупные заголовки

## 🎨 CSS переменные

Проект использует CSS переменные для удобного управления шрифтами:

```css
:root {
    --font-primary: 'YS Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-weight-light: 300;
    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-bold: 700;
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 32px;
    --font-size-4xl: 48px;
}
```

## 🚀 Использование

После установки шрифтов все элементы интерфейса автоматически будут использовать YS Text через CSS переменные.

## ⚠️ Важно

- Убедитесь, что файлы шрифтов имеют правильные имена
- Проверьте поддержку браузеров (WOFF2 для современных, WOFF для старых)
- Используйте `font-display: swap` для оптимизации загрузки 