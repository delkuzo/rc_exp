/**
 * Система иконок для RC Experiment
 * Позволяет загружать и отображать иконки из Gravity UI
 */

class IconSystem {
    constructor() {
        this.icons = new Map();
        this.popularIcons = [];
        this.init();
    }

    async init() {
        await this.loadPopularIcons();
        await this.loadAvailableIcons();
    }

    async loadPopularIcons() {
        try {
            const response = await fetch('icons/popular-icons.json');
            this.popularIcons = await response.json();
        } catch (error) {
            console.error('Ошибка загрузки популярных иконок:', error);
            this.popularIcons = [];
        }
    }

    async loadAvailableIcons() {
        // Загружаем доступные SVG иконки
        const iconNames = [
            'calendar', 'camera', 'check', 'circle-exclamation', 'circle-info', 
            'circle-question', 'clock', 'credit-card', 'delete', 'diamond-exclamation', 
            'exclamation-shape', 'eye', 'eye-slash', 'file', 'file-exclamation', 
            'file-question', 'fingerprint', 'folder', 'folder-exclamation', 'headphones', 
            'heart', 'layout-list', 'list-check', 'list-check-lock', 'list-ol', 'lock', 
            'minus', 'pause', 'play', 'plus', 'star', 'stop', 'video', 'volume'
        ];

        for (const name of iconNames) {
            try {
                const response = await fetch(`icons/${name}.svg`);
                if (response.ok) {
                    const svgContent = await response.text();
                    this.icons.set(name, svgContent);
                    console.log(`✅ Загружена иконка: ${name}`);
                } else {
                    console.warn(`⚠️ Иконка не найдена: ${name}`);
                }
            } catch (error) {
                console.warn(`❌ Ошибка загрузки иконки ${name}:`, error);
            }
        }
    }

    getIcon(name) {
        return this.icons.get(name);
    }

    getPopularIcons() {
        return this.popularIcons.filter(icon => this.icons.has(icon.name));
    }

    renderIcon(name, size = 24, className = '') {
        const svgContent = this.getIcon(name);
        if (!svgContent) {
            return `<div class="icon-placeholder ${className}" style="width: ${size}px; height: ${size}px; background: var(--color-border-secondary); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: var(--color-text-secondary);">?</div>`;
        }

        // Извлекаем path из SVG
        const pathMatch = svgContent.match(/<path[^>]*>/);
        if (pathMatch) {
            return `<svg class="icon ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${pathMatch[0]}</svg>`;
        }

        return svgContent;
    }

    renderIconDemo() {
        const popularIcons = this.getPopularIcons();
        const demoContainer = document.getElementById('icons-demo');
        
        if (!demoContainer) {
            console.error('Контейнер icons-demo не найден');
            return;
        }

        console.log('Загружено иконок:', this.icons.size);
        console.log('Популярных иконок:', popularIcons.length);
        console.log('Доступные иконки:', Array.from(this.icons.keys()));

        const html = `
            <div class="icons-grid">
                ${popularIcons.map(icon => `
                    <div class="icon-item" title="${icon.displayName}">
                        <div class="icon-display">
                            ${this.renderIcon(icon.name, 24, 'demo-icon')}
                        </div>
                        <div class="icon-info">
                            <span class="icon-name">${icon.displayName}</span>
                            <span class="icon-code">${icon.name}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="icons-info">
                <p><strong>Всего иконок:</strong> ${popularIcons.length}</p>
                <p><strong>Загружено SVG:</strong> ${this.icons.size}</p>
                <p><strong>Использование:</strong> ${this.renderIcon('star', 16)} Иконка в коде</p>
            </div>
        `;

        demoContainer.innerHTML = html;
    }
}

// Глобальный экземпляр системы иконок
window.iconSystem = new IconSystem();

// Функция для подключения иконки по запросу
window.connectIcon = function(iconName) {
    const iconSystem = window.iconSystem;
    if (iconSystem.getIcon(iconName)) {
        return iconSystem.renderIcon(iconName);
    } else {
        console.warn(`Иконка "${iconName}" не найдена`);
        return iconSystem.renderIcon('question'); // Fallback иконка
    }
};

// Инициализация демо при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.iconSystem) {
            window.iconSystem.renderIconDemo();
        }
    }, 100);
}); 