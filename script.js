// Функция для сворачивания/разворачивания блоков
const toggleBlock = (blockId) => {
    const block = document.querySelector(`[data-block="${blockId}"]`);
    const chevron = block.querySelector('.chevron-icon');
    
    if (block.classList.contains('collapsed')) {
        // Разворачиваем блок
        block.classList.remove('collapsed');
        block.classList.add('expanded');
        chevron.style.transform = 'rotate(180deg)';
    } else {
        // Сворачиваем блок
        block.classList.remove('expanded');
        block.classList.add('collapsed');
        chevron.style.transform = 'rotate(0deg)';
    }
};

// Функция для переключения темы
const toggleTheme = (theme) => {
    const lightBtn = document.querySelector('[data-theme="light"]');
    const darkBtn = document.querySelector('[data-theme="dark"]');
    
    if (theme === 'light') {
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
        document.body.classList.remove('dark-theme');
    } else {
        darkBtn.classList.add('active');
        lightBtn.classList.remove('active');
        document.body.classList.add('dark-theme');
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Обработчики для переключения темы
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            toggleTheme(theme);
        });
    });
    
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