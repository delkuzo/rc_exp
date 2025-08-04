/**
 * Компонент для выбора иконок
 * Позволяет искать и выбирать иконки из полного каталога Gravity UI
 */

class IconPicker {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            onSelect: options.onSelect || (() => {}),
            placeholder: options.placeholder || 'Выберите иконку...',
            showSearch: options.showSearch !== false,
            showCategories: options.showCategories !== false,
            maxResults: options.maxResults || 50,
            ...options
        };
        
        this.currentQuery = '';
        this.currentCategory = 'all';
        this.selectedIcon = null;
        
        this.init();
    }

    async init() {
        if (!this.container) {
            console.error('Контейнер для IconPicker не найден:', this.containerId);
            return;
        }

        // Ждем инициализации системы иконок
        await this.waitForIconSystem();
        
        this.render();
        this.setupEventListeners();
    }

    async waitForIconSystem() {
        let attempts = 0;
        while (!window.iconSystemV3 && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.iconSystemV3) {
            throw new Error('Система иконок v3 не загружена');
        }
    }

    render() {
        const iconSystem = window.iconSystemV3;
        const categories = iconSystem.getCategories();
        const popularIcons = iconSystem.getPopularIcons();

        this.container.innerHTML = `
            <div class="icon-picker">
                <div class="icon-picker-header">
                    <h3 class="icon-picker-title">Выбор иконки</h3>
                    <button class="icon-picker-close" onclick="this.closest('.icon-picker').remove()">×</button>
                </div>
                
                ${this.options.showSearch ? `
                    <div class="icon-picker-search">
                        <input 
                            type="text" 
                            class="icon-search-input" 
                            placeholder="${this.options.placeholder}"
                            value="${this.currentQuery}"
                        >
                        <div class="search-icon">🔍</div>
                    </div>
                ` : ''}
                
                ${this.options.showCategories ? `
                    <div class="icon-picker-categories">
                        <select class="icon-category-select">
                            <option value="all">Все категории</option>
                            ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                        </select>
                    </div>
                ` : ''}
                
                <div class="icon-picker-results">
                    <div class="icon-results-grid" id="icon-results">
                        <!-- Результаты поиска будут здесь -->
                    </div>
                </div>
                
                <div class="icon-picker-footer">
                    <div class="icon-picker-info">
                        <span id="results-count">0</span> иконок найдено
                    </div>
                    <div class="icon-picker-actions">
                        <button class="btn-secondary" onclick="this.closest('.icon-picker').remove()">Отмена</button>
                        <button class="btn-primary" id="select-icon-btn" disabled>Выбрать</button>
                    </div>
                </div>
            </div>
        `;

        this.renderResults(popularIcons);
    }

    async renderResults(icons) {
        const resultsContainer = this.container.querySelector('#icon-results');
        const resultsCount = this.container.querySelector('#results-count');
        
        if (!icons || icons.length === 0) {
            resultsContainer.innerHTML = `
                <div class="icon-no-results">
                    <div class="no-results-icon">🔍</div>
                    <p>Иконки не найдены</p>
                    <small>Попробуйте изменить поисковый запрос</small>
                </div>
            `;
            resultsCount.textContent = '0';
            return;
        }

        let html = '';
        let loadedCount = 0;

        for (const icon of icons.slice(0, this.options.maxResults)) {
            try {
                const iconHtml = await window.iconSystemV3.renderIcon(icon.name, 32, 'picker-icon');
                html += `
                    <div class="icon-result-item" data-icon-name="${icon.name}" data-icon-display="${icon.displayName}">
                        <div class="icon-result-display">
                            ${iconHtml}
                        </div>
                        <div class="icon-result-info">
                            <div class="icon-result-name">${icon.displayName}</div>
                            <div class="icon-result-code">${icon.name}</div>
                        </div>
                    </div>
                `;
                loadedCount++;
            } catch (error) {
                console.warn(`Не удалось загрузить иконку ${icon.name}:`, error);
            }
        }

        resultsContainer.innerHTML = html;
        resultsCount.textContent = loadedCount;

        // Добавляем обработчики для выбора иконок
        this.setupIconSelection();
    }

    setupIconSelection() {
        const iconItems = this.container.querySelectorAll('.icon-result-item');
        const selectBtn = this.container.querySelector('#select-icon-btn');

        iconItems.forEach(item => {
            item.addEventListener('click', () => {
                // Убираем выделение у всех иконок
                iconItems.forEach(i => i.classList.remove('selected'));
                
                // Выделяем выбранную иконку
                item.classList.add('selected');
                
                // Сохраняем выбранную иконку
                this.selectedIcon = {
                    name: item.dataset.iconName,
                    displayName: item.dataset.iconDisplay
                };
                
                // Активируем кнопку выбора
                selectBtn.disabled = false;
            });
        });

        // Обработчик кнопки выбора
        selectBtn.addEventListener('click', () => {
            if (this.selectedIcon) {
                this.options.onSelect(this.selectedIcon);
                this.container.querySelector('.icon-picker').remove();
            }
        });
    }

    setupEventListeners() {
        // Поиск
        const searchInput = this.container.querySelector('.icon-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentQuery = e.target.value;
                this.performSearch();
            });
        }

        // Категории
        const categorySelect = this.container.querySelector('.icon-category-select');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.performSearch();
            });
        }
    }

    async performSearch() {
        const iconSystem = window.iconSystemV3;
        let results = [];

        if (this.currentQuery.trim()) {
            // Поиск по запросу
            results = iconSystem.searchIcons(this.currentQuery);
        } else if (this.currentCategory && this.currentCategory !== 'all') {
            // Фильтр по категории
            results = iconSystem.getIconsByCategory(this.currentCategory);
        } else {
            // Показать популярные иконки
            results = iconSystem.getPopularIcons();
        }

        await this.renderResults(results);
    }

    // Статический метод для быстрого вызова
    static async show(options = {}) {
        return new Promise((resolve) => {
            // Создаем временный контейнер
            const tempContainer = document.createElement('div');
            tempContainer.id = 'temp-icon-picker';
            tempContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            `;
            
            document.body.appendChild(tempContainer);

            // Создаем picker
            const picker = new IconPicker('temp-icon-picker', {
                ...options,
                onSelect: (icon) => {
                    document.body.removeChild(tempContainer);
                    resolve(icon);
                }
            });
        });
    }
}

// Глобальные функции для удобного использования
window.showIconPicker = async (options = {}) => {
    return await IconPicker.show(options);
};

window.selectIcon = async (placeholder = 'Выберите иконку...') => {
    return await IconPicker.show({
        placeholder,
        onSelect: (icon) => {
            console.log('Выбрана иконка:', icon);
            return icon;
        }
    });
}; 