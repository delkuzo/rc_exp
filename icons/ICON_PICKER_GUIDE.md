# 🎨 Руководство по использованию IconPicker

## 📋 Обзор

Компонент `IconPicker` позволяет выбирать иконки из полного каталога Gravity UI (741 иконка) с поиском и категоризацией.

## 🚀 Быстрый старт

### Подключение компонента

```html
<script src="icons/icon-system-v3.js"></script>
<script src="icons/icon-picker.js"></script>
```

### Простое использование

```javascript
// Базовый выбор иконки
const icon = await window.selectIcon('Выберите иконку...');
console.log('Выбрана иконка:', icon);
// Результат: { name: 'star', displayName: 'Star' }
```

### Кастомный выбор

```javascript
// С дополнительными настройками
const icon = await window.showIconPicker({
    placeholder: 'Выберите иконку для кнопки...',
    maxResults: 100,
    showCategories: true,
    showSearch: true
});
```

## 📚 API

### IconPicker.show(options)

Открывает модальное окно выбора иконок.

**Параметры:**
- `placeholder` (string) - текст в поле поиска
- `maxResults` (number) - максимальное количество результатов (по умолчанию: 50)
- `showSearch` (boolean) - показывать поле поиска (по умолчанию: true)
- `showCategories` (boolean) - показывать селект категорий (по умолчанию: true)

**Возвращает:** Promise с объектом иконки `{ name, displayName }`

### window.selectIcon(placeholder)

Упрощенная функция для выбора иконки.

**Параметры:**
- `placeholder` (string) - текст в поле поиска

**Возвращает:** Promise с объектом иконки

### new IconPicker(containerId, options)

Создание экземпляра компонента в указанном контейнере.

**Параметры:**
- `containerId` (string) - ID контейнера
- `options` (object) - настройки компонента

## 🎯 Примеры использования

### В эксперименте

```javascript
// Создание кнопки с выбором иконки
async function createButtonWithIcon() {
    const icon = await window.selectIcon('Выберите иконку для кнопки...');
    
    if (icon) {
        const iconHtml = await window.iconSystemV3.renderIcon(icon.name, 16);
        
        const button = document.createElement('button');
        button.innerHTML = `${iconHtml} ${icon.displayName}`;
        button.className = 'btn-with-icon';
        
        document.getElementById('button-container').appendChild(button);
    }
}
```

### В компоненте интерфейса

```javascript
// Компонент с выбором иконки
class IconButton {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.icon = null;
        this.init();
    }
    
    async init() {
        this.container.innerHTML = `
            <button class="icon-select-btn" onclick="this.selectIcon()">
                ${this.icon ? this.icon.displayName : 'Выбрать иконку'}
            </button>
        `;
    }
    
    async selectIcon() {
        const icon = await window.selectIcon('Выберите иконку...');
        if (icon) {
            this.icon = icon;
            this.updateButton();
        }
    }
    
    updateButton() {
        const btn = this.container.querySelector('.icon-select-btn');
        btn.textContent = this.icon.displayName;
    }
}
```

### В форме настроек

```javascript
// Настройки с выбором иконки
async function setupIconSettings() {
    const iconPicker = new IconPicker('settings-container', {
        onSelect: (icon) => {
            // Сохраняем выбор в настройках
            localStorage.setItem('selectedIcon', icon.name);
            
            // Обновляем интерфейс
            updateInterfaceIcon(icon.name);
        }
    });
}
```

## 🔍 Поиск и фильтрация

### Поиск по названию

Введите название иконки или ключевые слова:
- `star` - найдет иконки звезд
- `arrow` - найдет все стрелки
- `user` - найдет иконки пользователя

### Фильтр по категориям

Выберите категорию из выпадающего списка:
- **Navigation** - навигационные иконки
- **UI Controls** - элементы управления
- **Files & Folders** - файлы и папки
- **Security** - безопасность
- **Actions** - действия
- **Data** - данные

## 🎨 Стилизация

Компонент использует CSS переменные из вашей темы:

```css
.icon-picker {
    /* Использует переменные темы */
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border-secondary);
}
```

### Кастомные стили

```css
/* Переопределение стилей */
.icon-picker {
    border-radius: 16px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.icon-result-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

## ⚡ Производительность

- **Ленивая загрузка** - иконки загружаются только при необходимости
- **Кэширование** - загруженные иконки сохраняются в памяти
- **Асинхронная загрузка** - не блокирует интерфейс
- **Ограничение результатов** - предотвращает перегрузку

## 🛠️ Отладка

### Проверка загрузки

```javascript
// Проверка доступности системы иконок
if (window.iconSystemV3) {
    console.log('Система иконок загружена');
} else {
    console.error('Система иконок не найдена');
}
```

### Логирование выбора

```javascript
const icon = await window.selectIcon();
console.log('Выбрана иконка:', icon);
console.log('Название:', icon.displayName);
console.log('Код:', icon.name);
```

## 📱 Адаптивность

Компонент автоматически адаптируется под размер экрана:

- **Desktop** - полная функциональность
- **Tablet** - уменьшенные размеры
- **Mobile** - компактный вид

## 🔗 Интеграция

### С экспериментами

```javascript
// В эксперименте
class IconExperiment {
    async run() {
        const icon = await window.selectIcon('Выберите иконку для эксперимента...');
        
        if (icon) {
            // Используем выбранную иконку
            this.createIconDemo(icon.name);
        }
    }
    
    async createIconDemo(iconName) {
        const iconHtml = await window.iconSystemV3.renderIcon(iconName, 48);
        // Создание демо с иконкой
    }
}
```

### С интерфейсами

```javascript
// В готовом интерфейсе
class IconInterface {
    constructor() {
        this.setupIconSelection();
    }
    
    setupIconSelection() {
        const iconButtons = document.querySelectorAll('.icon-select');
        
        iconButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const icon = await window.selectIcon('Выберите иконку...');
                if (icon) {
                    btn.dataset.icon = icon.name;
                    this.updateButtonIcon(btn, icon.name);
                }
            });
        });
    }
    
    async updateButtonIcon(button, iconName) {
        const iconHtml = await window.iconSystemV3.renderIcon(iconName, 16);
        button.innerHTML = iconHtml;
    }
}
```

## 📄 Лицензия

Компонент распространяется под той же лицензией, что и проект - MIT. 