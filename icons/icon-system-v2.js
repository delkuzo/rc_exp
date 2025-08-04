/**
 * Система иконок v2 для RC Experiment
 * Подключение к полному репозиторию Gravity UI (741 иконка)
 */

class IconSystemV2 {
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

    // Получить иконку по имени
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
                console.log(`✅ Загружена иконка: ${name}`);
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

    // Рендеринг иконки с высоким качеством
    async renderIconHighQuality(name, size = 24, className = '') {
        const svgContent = await this.getIcon(name);
        if (!svgContent) {
            return `<div class="icon-placeholder ${className}" style="width: ${size}px; height: ${size}px; background: var(--color-border-secondary); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: var(--color-text-secondary);">?</div>`;
        }

        // Извлекаем viewBox из оригинального SVG
        const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
        const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";
        
        // Извлекаем все содержимое SVG (path, rect, circle и т.д.)
        const contentMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
        if (contentMatch) {
            const svgContentInner = contentMatch[1];
            return `<svg class="icon icon-high-quality ${className}" width="${size}" height="${size}" viewBox="${viewBox}" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="shape-rendering: geometricPrecision;">${svgContentInner}</svg>`;
        }

        return svgContent;
    }

    // Рендеринг иконки
    async renderIcon(name, size = 24, className = '') {
        const svgContent = await this.getIcon(name);
        if (!svgContent) {
            return `<div class="icon-placeholder ${className}" style="width: ${size}px; height: ${size}px; background: var(--color-border-secondary); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: var(--color-text-secondary);">?</div>`;
        }

        // Извлекаем viewBox из оригинального SVG
        const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
        const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";
        
        // Извлекаем все содержимое SVG (path, rect, circle и т.д.)
        const contentMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
        if (contentMatch) {
            const svgContentInner = contentMatch[1];
            return `<svg class="icon ${className}" width="${size}" height="${size}" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgContentInner}</svg>`;
        }

        return svgContent;
    }

    // Демо с поиском и категориями
    async renderIconDemo() {
        const demoContainer = document.getElementById('icons-demo');
        if (!demoContainer) {
            console.error('Контейнер icons-demo не найден');
            return;
        }

        const categories = this.getCategories();
        const popularIcons = this.allIcons.slice(0, 50); // Первые 50 иконок для демо

        const html = `
            <div class="icons-demo-container">
                <div class="icons-search">
                    <input type="text" id="icon-search" placeholder="Поиск иконок..." class="icon-search-input">
                    <select id="icon-category" class="icon-category-select">
                        <option value="">Все категории</option>
                        ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </div>
                
                <div class="icons-stats">
                    <p><strong>Всего иконок:</strong> ${this.allIcons.length}</p>
                    <p><strong>Категорий:</strong> ${categories.length}</p>
                    <p><strong>Источник:</strong> <a href="https://github.com/gravity-ui/icons" target="_blank">Gravity UI Icons</a></p>
                </div>

                <div class="icons-grid" id="icons-grid">
                    ${popularIcons.map(icon => `
                        <div class="icon-item" data-name="${icon.name}" data-category="${icon.category}" title="${icon.displayName}">
                            <div class="icon-display">
                                <div class="icon-loading">⏳</div>
                            </div>
                            <div class="icon-info">
                                <span class="icon-name">${icon.displayName}</span>
                                <span class="icon-code">${icon.name}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="icons-info">
                    <p><strong>Использование:</strong> <code>window.iconSystemV2.getIcon('icon-name')</code></p>
                    <p><strong>Пример:</strong> ${await this.renderIcon('star', 16)} Иконка звезды</p>
                </div>
            </div>
        `;

        demoContainer.innerHTML = html;

        // Загружаем иконки асинхронно
        this.loadIconsAsync(popularIcons);
        
        // Добавляем поиск
        this.setupSearch();
    }

    // Асинхронная загрузка иконок
    async loadIconsAsync(icons) {
        for (const icon of icons) {
            try {
                const svgContent = await this.getIcon(icon.name);
                if (svgContent) {
                    const iconElement = document.querySelector(`[data-name="${icon.name}"] .icon-display`);
                    if (iconElement) {
                        iconElement.innerHTML = await this.renderIconHighQuality(icon.name, 24, 'demo-icon');
                    }
                }
            } catch (error) {
                console.warn(`Не удалось загрузить иконку ${icon.name}:`, error);
            }
        }
    }

    // Настройка поиска
    setupSearch() {
        const searchInput = document.getElementById('icon-search');
        const categorySelect = document.getElementById('icon-category');
        const iconsGrid = document.getElementById('icons-grid');

        if (!searchInput || !categorySelect || !iconsGrid) return;

        const filterIcons = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedCategory = categorySelect.value;

            let filteredIcons = this.allIcons;

            // Фильтр по категории
            if (selectedCategory) {
                filteredIcons = filteredIcons.filter(icon => icon.category === selectedCategory);
            }

            // Фильтр по поиску
            if (searchTerm) {
                filteredIcons = filteredIcons.filter(icon => 
                    icon.name.toLowerCase().includes(searchTerm) ||
                    icon.displayName.toLowerCase().includes(searchTerm)
                );
            }

            // Показываем первые 50 результатов
            const displayIcons = filteredIcons.slice(0, 50);

            iconsGrid.innerHTML = displayIcons.map(icon => `
                <div class="icon-item" data-name="${icon.name}" data-category="${icon.category}" title="${icon.displayName}">
                    <div class="icon-display">
                        <div class="icon-loading">⏳</div>
                    </div>
                    <div class="icon-info">
                        <span class="icon-name">${icon.displayName}</span>
                        <span class="icon-code">${icon.name}</span>
                    </div>
                </div>
            `).join('');

            // Загружаем иконки для отфильтрованных результатов
            this.loadIconsAsync(displayIcons);
        };

        searchInput.addEventListener('input', filterIcons);
        categorySelect.addEventListener('change', filterIcons);
    }
}

// Глобальный экземпляр системы иконок v2
window.iconSystemV2 = new IconSystemV2();

// Функция для подключения иконки по запросу
window.connectIconV2 = async function(iconName) {
    const iconSystem = window.iconSystemV2;
    if (iconSystem) {
        return await iconSystem.renderIcon(iconName);
    } else {
        console.warn('Система иконок v2 не загружена');
        return '<div class="icon-placeholder">?</div>';
    }
};

// Инициализация демо при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.iconSystemV2) {
            window.iconSystemV2.renderIconDemo();
        }
    }, 100);
}); 