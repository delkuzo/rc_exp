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
                await window.iconSystemV3.renderIconDemo();
            }, 100);
        }
    } else {
        // Сворачиваем блок
        block.classList.remove('expanded');
        block.classList.add('collapsed');
        chevron.style.transform = 'rotate(0deg)';
    }
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализация темы...');
    
    // Инициализация темы
    const savedTheme = localStorage.getItem('theme') || 'light';
    console.log('Сохраненная тема:', savedTheme);
    
    // Устанавливаем тему
    document.body.setAttribute('data-theme', savedTheme);
    
    // Обновляем иконку
    updateThemeIcon(savedTheme);
    
    // Обработчик для переключения темы
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Клик по кнопке темы');
            toggleTheme();
        });
    } else {
        console.error('Кнопка темы не найдена!');
    }
    
    // Обработчики для навигации
    const navTabs = document.querySelectorAll('.tab-item[data-section]');
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Убираем активный класс у всех вкладок
            navTabs.forEach(t => t.classList.remove('active'));
            // Добавляем активный класс к текущей вкладке
            tab.classList.add('active');
            
            // Переключаем контент
            const section = tab.getAttribute('data-section');
            switchContent(section);
        });
    });
    
    // Обработчики для вкладок в UI Kit (без data-section)
    const uiKitTabs = document.querySelectorAll('.tab-item:not([data-section])');
    uiKitTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Убираем активный класс у всех вкладок в этой группе
            const container = tab.closest('.tabs-container');
            if (container) {
                container.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
            }
            // Добавляем активный класс к текущей вкладке
            tab.classList.add('active');
        });
    });
    
    // Функция переключения контента
    const switchContent = (section) => {
        // Скрываем все секции
        const allSections = document.querySelectorAll('.content-section');
        allSections.forEach(s => s.classList.add('hidden'));
        
        // Показываем нужную секцию
        const targetSection = document.getElementById(`${section}-content`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
    };
    
    // Добавляем обработчики клавиатуры для доступности
    const blockHeaders = document.querySelectorAll('.block-header');
    blockHeaders.forEach(header => {
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const blockId = header.parentElement.getAttribute('data-block');
                toggleBlock(blockId);
            }
        });
        
        // Добавляем tabindex для доступности
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
    });
    
    // Обновляем aria-expanded при сворачивании/разворачивании
    const updateAriaExpanded = (block) => {
        const header = block.querySelector('.block-header');
        const isExpanded = block.classList.contains('expanded');
        header.setAttribute('aria-expanded', isExpanded.toString());
    };
    
    // Переопределяем функцию toggleBlock для обновления aria-expanded
    window.toggleBlock = (blockId) => {
        const block = document.querySelector(`[data-block="${blockId}"]`);
        const chevron = block.querySelector('.chevron-icon');
        
        if (block.classList.contains('collapsed')) {
            block.classList.remove('collapsed');
            block.classList.add('expanded');
            chevron.style.transform = 'rotate(180deg)';
        } else {
            block.classList.remove('expanded');
            block.classList.add('collapsed');
            chevron.style.transform = 'rotate(0deg)';
        }
        
        updateAriaExpanded(block);
    };
    
    // Инициализируем aria-expanded для всех блоков
    document.querySelectorAll('.content-block').forEach(block => {
        updateAriaExpanded(block);
    });
    
    // Инициализация Input компонента
    initSearchInputDemo();
    
    // Инициализация Switcher Button компонента
    initSwitcherButton();
});

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

// Экспортируем функции в глобальную область
window.createButtonWithIcon = createButtonWithIcon;
window.createButtonFromRequest = createButtonFromRequest;
window.parseButtonRequest = parseButtonRequest;

// Инициализация иконок в кнопках
document.addEventListener('DOMContentLoaded', () => {
    // Запускаем инициализацию иконок с небольшой задержкой
    setTimeout(initializeButtonIcons, 200);
}); 