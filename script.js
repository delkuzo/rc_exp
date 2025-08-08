// Функция для сворачивания/разворачивания блоков
const toggleBlock = (blockId) => {
    const block = document.querySelector(`[data-block="${blockId}"]`);
    const chevron = block.querySelector('.chevron-icon');
    
    if (block.classList.contains('collapsed')) {
        // Разворачиваем блок
        block.classList.remove('collapsed');
        block.classList.add('expanded');
        chevron.style.transform = 'rotate(180deg)';
        
        // Если это блок иконок, загружаем иконки
        if (blockId === 'icons' && window.iconSystemV3) {
            setTimeout(async () => {
                await loadIconsDemo();
            }, 100);
        }
    } else {
        // Сворачиваем блок
        block.classList.remove('expanded');
        block.classList.add('collapsed');
        chevron.style.transform = 'rotate(0deg)';
    }
    
    updateAriaExpanded(block);
};

// Функция для переключения темы
const toggleTheme = () => {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    console.log('Переключение темы с', currentTheme, 'на', newTheme);
    
    // Устанавливаем новую тему
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Обновляем иконку
    updateThemeIcon(newTheme);
    
    console.log('Тема установлена:', newTheme);
    console.log('data-theme атрибут:', document.body.getAttribute('data-theme'));
};

// Функция для обновления иконки
const updateThemeIcon = (theme) => {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('.theme-icon');
    
    if (theme === 'light') {
        // Иконка солнца для светлой темы
        icon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    } else {
        // Иконка луны для темной темы
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }
};

// Функция для обновления aria-expanded при сворачивании/разворачивании
const updateAriaExpanded = (block) => {
    const header = block.querySelector('.block-header');
    const isExpanded = block.classList.contains('expanded');
    header.setAttribute('aria-expanded', isExpanded.toString());
};

// Экспортируем функцию toggleBlock в глобальную область
window.toggleBlock = toggleBlock;

// Инициализируем aria-expanded для всех блоков
document.querySelectorAll('.content-block').forEach(block => {
    updateAriaExpanded(block);
});

// Функция переключения контента
const switchContent = (section) => {
    console.log('Переключаем контент на секцию:', section);
    
    // Скрываем все секции
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(s => s.classList.add('hidden'));
    
    // Показываем нужную секцию
    const targetSection = document.getElementById(`${section}-content`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        console.log('Секция показана:', targetSection.id);
    } else {
        console.error('Секция не найдена:', `${section}-content`);
    }
};

// Обработка хэша в URL при загрузке страницы
const handleHashChange = () => {
    const hash = window.location.hash.substring(1); // Убираем #
    if (hash) {
        // Находим вкладку с соответствующим data-section
        const targetTab = document.querySelector(`.tab-item[data-section="${hash}"]`);
        if (targetTab) {
            // Убираем активный класс у всех вкладок
            const navTabs = document.querySelectorAll('.tab-item');
            navTabs.forEach(t => t.classList.remove('active'));
            // Добавляем активный класс к целевой вкладке
            targetTab.classList.add('active');
            // Переключаем контент
            switchContent(hash);
        }
    }
};

// Функция для инициализации демо Input
const initSearchInputDemo = async () => {
    // Получаем иконку xmark асинхронно
    const xmarkIcon = await window.connectIconV3('xmark', 12);
    
    // Инициализация базового input
    const inputContainer = document.getElementById('inputDemo');
    const inputField = document.getElementById('inputField');
    const inputClear = document.getElementById('inputClear');
    
    if (inputContainer && inputField && inputClear) {
        // Вставляем иконку в кнопку
        inputClear.innerHTML = xmarkIcon;
        initInputBehavior(inputContainer, inputField, inputClear);
    }
    
    // Инициализация error input
    const inputErrorContainer = document.getElementById('inputErrorDemo');
    const inputErrorField = document.getElementById('inputErrorField');
    const inputErrorClear = document.getElementById('inputErrorClear');
    
    if (inputErrorContainer && inputErrorField && inputErrorClear) {
        // Вставляем иконку в кнопку
        inputErrorClear.innerHTML = xmarkIcon;
        initInputBehavior(inputErrorContainer, inputErrorField, inputErrorClear);
    }
};

// Общая функция для инициализации поведения input
const initInputBehavior = (container, field, clearButton) => {
    // Функция для обновления состояния кнопки очистки
    const updateClearButton = () => {
        if (field.value.length > 0) {
            container.classList.add('with-text');
        } else {
            container.classList.remove('with-text');
        }
    };
    
    // Проверяем начальное состояние при инициализации
    updateClearButton();
    
    // Обработчик ввода текста
    field.addEventListener('input', (e) => {
        updateClearButton();
    });
    
    // Обработчик кнопки очистки
    clearButton.addEventListener('click', (e) => {
        e.preventDefault();
        field.value = '';
        updateClearButton();
        field.focus();
    });
    
    // Hover эффекты (только для не-error состояния)
    if (!container.classList.contains('error')) {
        container.addEventListener('mouseenter', () => {
            container.style.borderColor = 'var(--color-text-primary)';
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.borderColor = 'var(--color-border-primary)';
        });
        
        // Focus эффекты
        field.addEventListener('focus', () => {
            container.style.borderColor = 'var(--color-text-primary)';
        });
        
        field.addEventListener('blur', () => {
            container.style.borderColor = 'var(--color-border-primary)';
        });
    }
    
    // Инициализация состояния
    updateClearButton();
};

// Функция для инициализации Switcher Button компонента
const initSwitcherButton = () => {
    const switcherContainers = document.querySelectorAll('.switcher-container');
    
    switcherContainers.forEach(container => {
        const options = container.querySelectorAll('.switcher-option');
        
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Убираем активный класс у всех опций в этом контейнере
                options.forEach(opt => opt.classList.remove('active'));
                
                // Добавляем активный класс к нажатой опции
                option.classList.add('active');
                
                // Можно добавить callback для обработки выбора
                const selectedValue = option.textContent.trim();
                console.log('Выбрана опция:', selectedValue);
                
                // Dispatch события для внешней обработки
                const changeEvent = new CustomEvent('switcherChange', {
                    detail: {
                        selectedValue: selectedValue,
                        selectedIndex: Array.from(options).indexOf(option),
                        container: container
                    }
                });
                container.dispatchEvent(changeEvent);
            });
        });
    });
};

// Функция для работы с иконками в кнопках
const initializeButtonIcons = async () => {
    // Проверяем доступность icon system
    if (!window.iconSystemV3) {
        setTimeout(initializeButtonIcons, 100);
        return;
    }
    
    // Находим все кнопки с data-icon атрибутом
    const buttonsWithIcons = document.querySelectorAll('button[data-icon]');
    
    for (const button of buttonsWithIcons) {
        const iconName = button.getAttribute('data-icon');
        const iconElement = button.querySelector('.btn__icon');
        
        if (iconElement && iconName) {
            try {
                // Определяем размер иконки по размеру кнопки
                const iconSize = button.classList.contains('btn--size-32') ? 12 : 16;
                const iconSvg = await window.iconSystemV3.renderIcon(iconName, iconSize);
                iconElement.innerHTML = iconSvg;
            } catch (error) {
                console.warn(`Не удалось загрузить иконку "${iconName}":`, error);
                // Fallback иконка
                iconElement.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/></svg>';
            }
        }
    }
};

// Функция для создания кнопки с иконкой по запросу
const createButtonWithIcon = async (iconName, buttonText = 'Кнопка', size = 40, style = 'action') => {
    const button = document.createElement('button');
    const sizeClass = `btn--size-${size}`;
    const styleClass = `btn--style-${style}`;
    
    // Определяем тип кнопки
    if (buttonText && iconName) {
        // Кнопка с текстом и иконкой
        button.className = `btn ${sizeClass} ${styleClass} btn--icon-start`;
        button.innerHTML = `
            <span class="btn__icon"></span>
            ${buttonText}
        `;
    } else if (iconName && !buttonText) {
        // Только иконка
        button.className = `btn ${sizeClass} ${styleClass} btn--icon-only`;
        button.innerHTML = '<span class="btn__icon"></span>';
    } else {
        // Только текст
        button.className = `btn ${sizeClass} ${styleClass}`;
        button.textContent = buttonText || 'Кнопка';
        return button;
    }
    
    // Загружаем иконку
    const iconElement = button.querySelector('.btn__icon');
    if (iconElement && iconName) {
        try {
            const iconSize = size === 32 ? 12 : 16;
            const iconSvg = await window.iconSystemV3.renderIcon(iconName, iconSize);
            iconElement.innerHTML = iconSvg;
        } catch (error) {
            console.warn(`Не удалось загрузить иконку "${iconName}":`, error);
            iconElement.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/></svg>';
        }
    }
    
    return button;
};

// Функция для парсинга текстового запроса на создание кнопки
const parseButtonRequest = (request) => {
    const req = request.toLowerCase();
    
    // Определяем стиль кнопки по номеру/названию
    let style = 'action';
    if (req.includes('первого') || req.includes('главная') || req.includes('action')) {
        style = 'action';
    } else if (req.includes('второго') || req.includes('вторичная') || req.includes('fill')) {
        style = 'fill';
    } else if (req.includes('третьего') || req.includes('третичная') || req.includes('обводка') || req.includes('outline')) {
        style = 'outline';
    } else if (req.includes('четвертого') || req.includes('четверичная') || req.includes('blank')) {
        style = 'blank';
    }
    
    // Определяем размер
    let size = 40;
    if (req.includes('32') || req.includes('маленьк') || req.includes('мелк')) {
        size = 32;
    } else if (req.includes('40') || req.includes('большая') || req.includes('больш')) {
        size = 40;
    }
    
    // Определяем текст кнопки
    let buttonText = 'Кнопка';
    const textMatch = req.match(/текст[ом]*\s*["']([^"']+)["']/);
    if (textMatch) {
        buttonText = textMatch[1];
    }
    
    // Определяем иконку
    let iconName = null;
    
    // Словарь соответствий для популярных иконок
    const iconMap = {
        'гаечный ключ': 'wrench',
        'ключ': 'key',
        'звезда': 'star',
        'сердце': 'heart',
        'плюс': 'plus',
        'минус': 'minus',
        'удалить': 'delete',
        'корзина': 'delete',
        'глаз': 'eye',
        'закрыть': 'close',
        'проверить': 'check',
        'галочка': 'check',
        'календарь': 'calendar',
        'замок': 'lock',
        'разблокировать': 'unlock',
        'папка': 'folder',
        'файл': 'file',
        'камера': 'camera',
        'видео': 'video',
        'микрофон': 'microphone',
        'наушники': 'headphones',
        'громкость': 'volume',
        'играть': 'play',
        'пауза': 'pause',
        'стоп': 'stop',
        'следующий': 'next',
        'предыдущий': 'previous',
        'домой': 'home',
        'настройки': 'settings',
        'поиск': 'search',
        'фильтр': 'filter',
        'сортировка': 'sort',
        'список': 'list',
        'сетка': 'grid',
        'загрузка': 'upload',
        'скачать': 'download',
        'поделиться': 'share',
        'копировать': 'copy',
        'вставить': 'paste',
        'вырезать': 'cut',
        'отменить': 'undo',
        'повторить': 'redo',
        'печать': 'print',
        'почта': 'mail',
        'телефон': 'phone',
        'сообщение': 'message',
        'уведомление': 'notification',
        'предупреждение': 'warning',
        'ошибка': 'error',
        'информация': 'info',
        'вопрос': 'question'
    };
    
    // Ищем иконку в тексте запроса
    for (const [keyword, icon] of Object.entries(iconMap)) {
        if (req.includes(keyword)) {
            iconName = icon;
            break;
        }
    }
    
    // Проверяем, указано ли только иконка
    const onlyIcon = req.includes('только иконк') || req.includes('без текста');
    if (onlyIcon) {
        buttonText = null;
    }
    
    return {
        iconName,
        buttonText,
        size,
        style
    };
};

// Главная функция для создания кнопки по запросу
const createButtonFromRequest = async (request) => {
    const config = parseButtonRequest(request);
    console.log('Parsed request:', config);
    
    const button = await createButtonWithIcon(
        config.iconName,
        config.buttonText,
        config.size,
        config.style
    );
    
    return button;
};

// Функция для загрузки демо иконок
const loadIconsDemo = async () => {
    const iconsDemo = document.getElementById('icons-demo');
    if (!iconsDemo || !window.iconSystemV3) return;
    
    try {
        // Показываем загрузку
        iconsDemo.innerHTML = '<div style="padding: 20px; text-align: center;">🔄 Загрузка иконок...</div>';
        
        // Получаем популярные иконки
        const popularIcons = await window.iconSystemV3.getPopularIcons();
        
        if (popularIcons.length === 0) {
            iconsDemo.innerHTML = '<div style="padding: 20px; text-align: center;">❌ Иконки не найдены</div>';
            return;
        }
        
        // Создаем сетку иконок
        const iconGrid = document.createElement('div');
        iconGrid.className = 'icons-grid';
        iconGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 16px;
            padding: 20px 0;
        `;
        
        // Ограничиваем до первых 20 иконок для демо
        const iconsToShow = popularIcons.slice(0, 20);
        
        for (const icon of iconsToShow) {
            const iconItem = document.createElement('div');
            iconItem.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 12px;
                border: 1px solid var(--color-border-secondary);
                border-radius: 8px;
                background: var(--color-bg-primary);
                transition: all 0.2s ease;
                cursor: pointer;
            `;
            
            // Добавляем hover эффект
            iconItem.addEventListener('mouseenter', () => {
                iconItem.style.borderColor = 'var(--color-border-primary)';
                iconItem.style.transform = 'translateY(-2px)';
            });
            iconItem.addEventListener('mouseleave', () => {
                iconItem.style.borderColor = 'var(--color-border-secondary)';
                iconItem.style.transform = 'translateY(0)';
            });
            
            // Создаем иконку
            const iconSvg = await window.iconSystemV3.renderIcon(icon.name, 24);
            const iconDisplay = document.createElement('div');
            iconDisplay.innerHTML = iconSvg;
            iconDisplay.style.cssText = `
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 8px;
                color: var(--color-text-primary);
            `;
            
            // Название иконки
            const iconName = document.createElement('div');
            iconName.textContent = icon.displayName;
            iconName.style.cssText = `
                font-size: 10px;
                color: var(--color-text-secondary);
                text-align: center;
                font-weight: 500;
            `;
            
            iconItem.appendChild(iconDisplay);
            iconItem.appendChild(iconName);
            
            // Клик для копирования имени иконки
            iconItem.addEventListener('click', () => {
                navigator.clipboard.writeText(icon.name).then(() => {
                    iconName.textContent = 'Скопировано!';
                    setTimeout(() => {
                        iconName.textContent = icon.displayName;
                    }, 1000);
                });
            });
            
            iconGrid.appendChild(iconItem);
        }
        
        // Добавляем заголовок и инструкцию
        const demoContent = `
            <div style="margin-bottom: 16px;">
                <h4 style="margin: 0 0 8px 0; color: var(--color-text-primary);">Популярные иконки (${iconsToShow.length} из ${popularIcons.length})</h4>
                <p style="margin: 0; font-size: 12px; color: var(--color-text-secondary);">Кликните на иконку, чтобы скопировать её название</p>
            </div>
        `;
        
        iconsDemo.innerHTML = demoContent;
        iconsDemo.appendChild(iconGrid);
        
        console.log(`✅ Загружено ${iconsToShow.length} иконок в демо`);
        
    } catch (error) {
        console.error('Ошибка загрузки иконок:', error);
        iconsDemo.innerHTML = '<div style="padding: 20px; text-align: center;">❌ Ошибка загрузки иконок</div>';
    }
};

// Функция для создания простого конструктора кнопок  
const createButtonBuilder = () => {
    const builder = document.createElement('div');
    builder.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 300px;
        background: var(--color-bg-primary);
        border: 1px solid var(--color-border-primary);
        border-radius: 12px;
        padding: 20px;
        box-shadow: var(--shadow-regular);
        z-index: 1000;
        font-family: inherit;
    `;
    
    builder.innerHTML = `
        <div style="margin-bottom: 16px;">
            <h4 style="margin: 0 0 8px 0; color: var(--color-text-primary);">🔧 Конструктор кнопок</h4>
            <button onclick="this.parentElement.parentElement.remove()" style="float: right; background: none; border: none; font-size: 18px; cursor: pointer; color: var(--color-text-secondary);">×</button>
        </div>
        
        <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--color-text-secondary);">Текст кнопки:</label>
            <input type="text" id="button-text" value="Моя кнопка" style="width: 100%; padding: 8px; border: 1px solid var(--color-border-primary); border-radius: 6px; background: var(--color-bg-primary); color: var(--color-text-primary);">
        </div>
        
        <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--color-text-secondary);">Иконка (название):</label>
            <input type="text" id="button-icon" placeholder="star, heart, plus..." style="width: 100%; padding: 8px; border: 1px solid var(--color-border-primary); border-radius: 6px; background: var(--color-bg-primary); color: var(--color-text-primary);">
        </div>
        
        <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--color-text-secondary);">Размер:</label>
            <select id="button-size" style="width: 100%; padding: 8px; border: 1px solid var(--color-border-primary); border-radius: 6px; background: var(--color-bg-primary); color: var(--color-text-primary);">
                <option value="32">32px</option>
                <option value="40" selected>40px</option>
            </select>
        </div>
        
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--color-text-secondary);">Стиль:</label>
            <select id="button-style" style="width: 100%; padding: 8px; border: 1px solid var(--color-border-primary); border-radius: 6px; background: var(--color-bg-primary); color: var(--color-text-primary);">
                <option value="action" selected>Action (главная)</option>
                <option value="fill">Fill (вторичная)</option>
                <option value="outline">Outline (обводка)</option>
                <option value="blank">Blank (прозрачная)</option>
            </select>
        </div>
        
        <button onclick="createPreviewButton()" style="width: 100%; padding: 10px; background: var(--color-blue); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
            Создать кнопку
        </button>
        
        <div id="button-preview" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--color-border-secondary);"></div>
    `;
    
    document.body.appendChild(builder);
};

// Функция предпросмотра кнопки
const createPreviewButton = async () => {
    const previewContainer = document.getElementById('buttonPreview');
    if (!previewContainer) return;
    
    // Очищаем контейнер
    previewContainer.innerHTML = '';
    
    // Создаем кнопку с текущими настройками
    const button = await createButtonFromRequest(currentButtonConfig);
    previewContainer.appendChild(button);
};

// Инициализация компонента Select
const initSelectComponent = () => {
    console.log('Инициализация компонента Select...');
    const selectContainer = document.getElementById('selectDemo');
    const selectContainer40 = document.getElementById('selectDemo40');
    if (!selectContainer && !selectContainer40) {
        console.error('Select контейнер не найден!');
        return;
    }
    console.log('Select контейнер(ы) найден(ы)');

    const initOne = (rootId) => {
        const root = document.getElementById(rootId);
        if (!root) return;

        const button = root.querySelector('.select-button');
        const dropdown = root.querySelector('.select-dropdown');
        const icon = root.querySelector('.select-icon');
        const options = dropdown.querySelectorAll('.select-option');
        let isOpen = false;

        const toggleDropdown = () => {
            isOpen = !isOpen;
            if (isOpen) {
                dropdown.classList.add('select-dropdown-open');
                button.setAttribute('aria-expanded', 'true');
                icon.classList.add('select-icon-up');
                dropdown.setAttribute('aria-hidden', 'false');
            } else {
                dropdown.classList.remove('select-dropdown-open');
                button.setAttribute('aria-expanded', 'false');
                icon.classList.remove('select-icon-up');
                dropdown.setAttribute('aria-hidden', 'true');
            }
        };

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown();
        });

        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const value = option.getAttribute('data-value');
                const text = option.querySelector('.select-option-text')?.textContent || option.textContent.trim();
                button.querySelector('.select-text').textContent = text;
                options.forEach(opt => opt.classList.remove('select-option-selected'));
                option.classList.add('select-option-selected');
                toggleDropdown();
            });
        });

        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                if (!isOpen) toggleDropdown();
                const first = dropdown.querySelector('.select-option');
                first && first.focus();
            } else if (e.key === 'Escape' && isOpen) {
                e.preventDefault();
                toggleDropdown();
            }
        });

        document.addEventListener('click', (e) => {
            if (!root.contains(e.target) && isOpen) toggleDropdown();
        });
    };

    initOne('selectDemo');
    initOne('selectDemo40');
    
    // Предотвращение закрытия при наведении на dropdown
    selectDropdown.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
    });
    
    selectDropdown.addEventListener('mouseleave', (e) => {
        e.stopPropagation();
    });
    
    // Дополнительная защита от закрытия при наведении на опции
    selectOptions.forEach(option => {
        option.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
        });
        
        option.addEventListener('mouseleave', (e) => {
            e.stopPropagation();
        });
    });
    
    // Обработчик фокуса для навигации по опциям
    selectDropdown.addEventListener('keydown', (e) => {
        const currentOption = document.activeElement;
        const currentIndex = Array.from(selectOptions).indexOf(currentOption);
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % selectOptions.length;
                selectOptions[nextIndex].focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex === 0 ? selectOptions.length - 1 : currentIndex - 1;
                selectOptions[prevIndex].focus();
                break;
            case 'Escape':
                e.preventDefault();
                toggleDropdown();
                selectButton.focus();
                break;
        }
    });
};

// Экспортируем функции в глобальную область
window.createButtonWithIcon = createButtonWithIcon;
window.createButtonFromRequest = createButtonFromRequest;
window.parseButtonRequest = parseButtonRequest;
window.loadIconsDemo = loadIconsDemo;
window.createButtonBuilder = createButtonBuilder;
window.createPreviewButton = createPreviewButton;
window.initSelectComponent = initSelectComponent; // Добавляем инициализацию Select в глобальную область

// Инициализация иконок в кнопках
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализируем компоненты...');
    
    // Инициализация переключения вкладок
    const navTabs = document.querySelectorAll('.tab-item');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Обработчики для вкладок
    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Клик по вкладке:', tab.getAttribute('data-section'));
            
            // Убираем активный класс у всех вкладок
            navTabs.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс к кликнутой вкладке
            tab.classList.add('active');
            
            // Переключаем контент
            const section = tab.getAttribute('data-section');
            switchContent(section);
            
            // Обновляем URL
            window.location.hash = section;
        });
    });
    
    // Обработчик для переключения темы
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Клик по переключателю темы');
            toggleTheme();
        });
    }
    
    // Загружаем сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Обрабатываем хэш в URL при загрузке
    handleHashChange();
    
    // Обработчик изменения хэша в URL
    window.addEventListener('hashchange', handleHashChange);
    
    // Запускаем инициализацию иконок с небольшой задержкой
    setTimeout(initializeButtonIcons, 200);
    
    // Инициализация компонента Select
    initSelectComponent();

    // Рендерим info-иконки для tooltip триггеров
    (async () => {
        if (!window.iconSystemV3) return;
        const infoTargets = [
            ['tooltip-info-top-short', 16],
            ['tooltip-info-right', 16],
            ['tooltip-info-left', 16],
            ['tooltip-info-top', 16]
        ];
        for (const [id, size] of infoTargets) {
            const el = document.getElementById(id);
            if (!el) continue;
            try {
                const svg = await window.iconSystemV3.renderIcon('circle-info', size);
                el.innerHTML = svg;
            } catch (e) {
                el.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/></svg>';
            }
        }
    })();
    
    console.log('Все компоненты инициализированы');
}); 