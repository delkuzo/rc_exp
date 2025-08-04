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
    const navTabs = document.querySelectorAll('.nav-tab');
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
}); 