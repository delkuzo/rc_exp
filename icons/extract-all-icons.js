const fs = require('fs');
const path = require('path');

// Читаем metadata.json из репозитория
const metadataPath = '../temp-icons-2/metadata.json';
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

// Создаем полный список иконок
const allIcons = metadata.icons.map(icon => ({
    name: icon.name,
    displayName: icon.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: `Иконка ${icon.name}`,
    category: getCategory(icon.name),
    keywords: icon.keywords || []
}));

// Функция для определения категории иконки
function getCategory(iconName) {
    if (iconName.includes('arrow') || iconName.includes('chevron')) return 'navigation';
    if (iconName.includes('play') || iconName.includes('pause') || iconName.includes('stop') || iconName.includes('volume')) return 'media';
    if (iconName.includes('file') || iconName.includes('folder') || iconName.includes('document')) return 'file';
    if (iconName.includes('user') || iconName.includes('person') || iconName.includes('profile')) return 'user';
    if (iconName.includes('settings') || iconName.includes('config') || iconName.includes('gear')) return 'system';
    if (iconName.includes('search') || iconName.includes('find')) return 'action';
    if (iconName.includes('edit') || iconName.includes('pencil')) return 'action';
    if (iconName.includes('delete') || iconName.includes('trash') || iconName.includes('remove')) return 'action';
    if (iconName.includes('add') || iconName.includes('plus')) return 'action';
    if (iconName.includes('check') || iconName.includes('tick')) return 'status';
    if (iconName.includes('warning') || iconName.includes('error') || iconName.includes('exclamation')) return 'status';
    if (iconName.includes('info') || iconName.includes('question')) return 'help';
    if (iconName.includes('lock') || iconName.includes('security')) return 'security';
    if (iconName.includes('calendar') || iconName.includes('clock') || iconName.includes('time')) return 'time';
    if (iconName.includes('mail') || iconName.includes('email')) return 'communication';
    if (iconName.includes('phone') || iconName.includes('call')) return 'communication';
    if (iconName.includes('camera') || iconName.includes('photo') || iconName.includes('image')) return 'media';
    if (iconName.includes('video') || iconName.includes('movie')) return 'media';
    if (iconName.includes('music') || iconName.includes('audio')) return 'media';
    if (iconName.includes('heart') || iconName.includes('like') || iconName.includes('favorite')) return 'social';
    if (iconName.includes('star') || iconName.includes('rating')) return 'rating';
    if (iconName.includes('share') || iconName.includes('social')) return 'social';
    if (iconName.includes('download') || iconName.includes('upload')) return 'action';
    if (iconName.includes('print') || iconName.includes('printer')) return 'action';
    if (iconName.includes('location') || iconName.includes('map') || iconName.includes('pin')) return 'navigation';
    if (iconName.includes('wifi') || iconName.includes('network') || iconName.includes('signal')) return 'network';
    if (iconName.includes('battery') || iconName.includes('power')) return 'system';
    if (iconName.includes('grid') || iconName.includes('list') || iconName.includes('layout')) return 'layout';
    if (iconName.includes('filter') || iconName.includes('sort')) return 'action';
    if (iconName.includes('zoom') || iconName.includes('magnify')) return 'action';
    if (iconName.includes('fullscreen') || iconName.includes('expand')) return 'action';
    if (iconName.includes('menu') || iconName.includes('hamburger')) return 'navigation';
    if (iconName.includes('close') || iconName.includes('x')) return 'action';
    if (iconName.includes('refresh') || iconName.includes('sync') || iconName.includes('reload')) return 'action';
    if (iconName.includes('eye') || iconName.includes('view')) return 'action';
    if (iconName.includes('money') || iconName.includes('dollar') || iconName.includes('payment')) return 'payment';
    if (iconName.includes('shopping') || iconName.includes('cart') || iconName.includes('buy')) return 'commerce';
    return 'other';
}

// Сохраняем полный список иконок
fs.writeFileSync('all-icons.json', JSON.stringify(allIcons, null, 2));

console.log(`✅ Извлечено ${allIcons.length} иконок из репозитория`);
console.log(`📁 Сохранено в all-icons.json`);

// Выводим статистику по категориям
const categories = {};
allIcons.forEach(icon => {
    categories[icon.category] = (categories[icon.category] || 0) + 1;
});

console.log('\n📊 Статистика по категориям:');
Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} иконок`);
}); 