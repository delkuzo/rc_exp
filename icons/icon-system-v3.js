/**
 * Система иконок v3 для RC Experiment
 * Загрузка высококачественных иконок из Gravity UI
 */

class IconSystemV3 {
    constructor() {
        this.icons = new Map();
        this.allIcons = [];
        this.categories = new Map();
        this.repoUrl = 'https://raw.githubusercontent.com/gravity-ui/icons/main/svgs/';
        this.init();
    }

    async init() {
        await this.loadAllIcons();
        this.categorizeIcons();
        console.log('🎨 Система иконок v3 инициализирована');
    }

    async loadAllIcons() {
        try {
            const response = await fetch('icons/all-icons.json');
            this.allIcons = await response.json();
            console.log(`✅ Загружено ${this.allIcons.length} иконок из каталога`);
        } catch (error) {
            console.error('Ошибка загрузки каталога иконок:', error);
            this.allIcons = [];
        }
    }

    categorizeIcons() {
        this.categories.clear();
        this.allIcons.forEach(icon => {
            if (!this.categories.has(icon.category)) {
                this.categories.set(icon.category, []);
            }
            this.categories.get(icon.category).push(icon);
        });
        console.log(`📂 Категории иконок: ${this.categories.size}`);
    }

    // Получить иконку по имени с высоким качеством
    async getIcon(name) {
        // Проверяем кэш
        if (this.icons.has(name)) {
            return this.icons.get(name);
        }

        try {
            const response = await fetch(`${this.repoUrl}${name}.svg`);
            if (response.ok) {
                const svgContent = await response.text();
                this.icons.set(name, svgContent);
                console.log(`✅ Загружена высококачественная иконка: ${name}`);
                return svgContent;
            } else {
                console.warn(`⚠️ Иконка не найдена: ${name}`);
                return null;
            }
        } catch (error) {
            console.error(`❌ Ошибка загрузки иконки ${name}:`, error);
            return null;
        }
    }

    // Рендеринг иконки с высоким качеством
    async renderIcon(name, size = 24, className = '') {
        const svgContent = await this.getIcon(name);
        if (!svgContent) {
            return `<div class="icon-placeholder ${className}" style="width: ${size}px; height: ${size}px; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #6c757d; font-weight: 500;">${name}</div>`;
        }

        // Извлекаем viewBox из оригинального SVG
        const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
        const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";
        
        // Извлекаем все содержимое SVG (path, rect, circle и т.д.)
        const contentMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
        if (contentMatch) {
            const svgContentInner = contentMatch[1];
            
            // Сохраняем оригинальные атрибуты fill и stroke
            return `<svg class="icon ${className}" width="${size}" height="${size}" viewBox="${viewBox}">${svgContentInner}</svg>`;
        }

        return svgContent;
    }

    // Рендеринг иконки с сохранением оригинальных атрибутов
    async renderIconOriginal(name, size = 24, className = '') {
        const svgContent = await this.getIcon(name);
        if (!svgContent) {
            return `<div class="icon-placeholder ${className}" style="width: ${size}px; height: ${size}px; background: var(--color-border-secondary); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: var(--color-text-secondary);">?</div>`;
        }

        // Заменяем размеры, но сохраняем все остальные атрибуты
        const modifiedSvg = svgContent
            .replace(/width="[^"]*"/, `width="${size}"`)
            .replace(/height="[^"]*"/, `height="${size}"`)
            .replace(/class="[^"]*"/, `class="icon ${className}"`)
            .replace(/<svg/, `<svg class="icon ${className}"`);

        return modifiedSvg;
    }

    // Поиск иконок
    searchIcons(query) {
        const searchTerm = query.toLowerCase();
        return this.allIcons.filter(icon => 
            icon.name.toLowerCase().includes(searchTerm) ||
            icon.displayName.toLowerCase().includes(searchTerm) ||
            icon.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
        );
    }

    // Получить иконки по категории
    getIconsByCategory(category) {
        return this.categories.get(category) || [];
    }

    // Получить все категории
    getCategories() {
        return Array.from(this.categories.keys()).sort();
    }

    // Получить популярные иконки
    getPopularIcons() {
        // Используем доступные иконки из нашего каталога
        const availableIcons = [
            { name: 'star', displayName: 'Star' },
            { name: 'heart', displayName: 'Heart' },
            { name: 'plus', displayName: 'Plus' },
            { name: 'minus', displayName: 'Minus' },
            { name: 'check', displayName: 'Check' },
            { name: 'camera', displayName: 'Camera' },
            { name: 'clock', displayName: 'Clock' },
            { name: 'eye', displayName: 'Eye' },
            { name: 'eye-slash', displayName: 'Eye Slash' },
            { name: 'lock', displayName: 'Lock' },
            { name: 'folder', displayName: 'Folder' },
            { name: 'credit-card', displayName: 'Credit Card' }
        ];
        
        return availableIcons.filter(icon => this.allIcons.some(allIcon => allIcon.name === icon.name));
    }

    // Рендеринг демо
    async renderIconDemo() {
        const demoContainer = document.getElementById('icons-demo');
        
        if (!demoContainer) {
            console.error('Контейнер icons-demo не найден');
            return;
        }

        const popularIcons = this.getPopularIcons();
        
        console.log('Загружено иконок:', this.icons.size);
        console.log('Популярных иконок:', popularIcons.length);
        console.log('Доступные иконки:', Array.from(this.icons.keys()));

        let html = '<div class="icons-grid">';
        
        for (const icon of popularIcons.slice(0, 12)) {
            const iconHtml = await this.renderIcon(icon.name, 24, 'demo-icon');
            html += `
                <div class="icon-item" title="${icon.displayName}">
                    <div class="icon-display">
                        ${iconHtml}
                    </div>
                    <div class="icon-info">
                        <span class="icon-name">${icon.displayName}</span>
                        <span class="icon-code">${icon.name}</span>
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        html += `
            <div class="icons-info">
                <p><strong>Всего иконок:</strong> ${this.allIcons.length}</p>
                <p><strong>Загружено SVG:</strong> ${this.icons.size}</p>
                <p><strong>Использование:</strong> ${await this.renderIcon('star', 16)} Иконка в коде</p>
            </div>
        `;

        demoContainer.innerHTML = html;
    }

    // Загрузка иконок асинхронно
    async loadIconsAsync(icons) {
        const promises = icons.map(iconName => this.getIcon(iconName));
        await Promise.all(promises);
        console.log(`✅ Загружено ${icons.length} иконок асинхронно`);
    }

    // Настройка поиска
    setupSearch() {
        const searchInput = document.getElementById('icon-search');
        if (!searchInput) return;

        const filterIcons = () => {
            const query = searchInput.value;
            const results = this.searchIcons(query);
            // Обновление UI с результатами поиска
            console.log(`Найдено ${results.length} иконок для запроса "${query}"`);
        };

        searchInput.addEventListener('input', filterIcons);
    }
}

// Глобальный экземпляр системы иконок v3
window.iconSystemV3 = new IconSystemV3();

// Функция для подключения иконки по запросу
window.connectIconV3 = async function(iconName, size = 24) {
    const iconSystem = window.iconSystemV3;
    if (await iconSystem.getIcon(iconName)) {
        return await iconSystem.renderIcon(iconName, size);
    } else {
        console.warn(`Иконка "${iconName}" не найдена`);
        return iconSystem.renderIcon('question', size); // Fallback иконка
    }
};

// Инициализация системы иконок при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Система иконок v3 инициализирована');
}); 