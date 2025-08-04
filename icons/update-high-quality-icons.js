/**
 * Скрипт для обновления иконок высококачественными версиями из Gravity UI
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

class IconUpdater {
    constructor() {
        this.repoUrl = 'https://raw.githubusercontent.com/gravity-ui/icons/main/svgs/';
        this.iconsDir = path.join(__dirname);
        this.updatedCount = 0;
        this.failedCount = 0;
    }

    // Загрузка файла по HTTPS
    async fetchFile(url) {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                    return;
                }

                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            }).on('error', (err) => {
                reject(err);
            });
        });
    }

    // Получение списка существующих SVG файлов
    getExistingIcons() {
        const files = fs.readdirSync(this.iconsDir);
        return files
            .filter(file => file.endsWith('.svg'))
            .map(file => file.replace('.svg', ''));
    }

    // Обновление одной иконки
    async updateIcon(iconName) {
        try {
            const url = `${this.repoUrl}${iconName}.svg`;
            const svgContent = await this.fetchFile(url);
            
            // Проверяем, что это валидный SVG
            if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
                throw new Error('Невалидный SVG контент');
            }

            const filePath = path.join(this.iconsDir, `${iconName}.svg`);
            fs.writeFileSync(filePath, svgContent);
            
            console.log(`✅ Обновлена иконка: ${iconName}`);
            this.updatedCount++;
            
        } catch (error) {
            console.error(`❌ Ошибка обновления ${iconName}:`, error.message);
            this.failedCount++;
        }
    }

    // Обновление всех иконок
    async updateAllIcons() {
        console.log('🔄 Начинаем обновление иконок...');
        
        const existingIcons = this.getExistingIcons();
        console.log(`📋 Найдено ${existingIcons.length} иконок для обновления`);
        
        // Обновляем иконки по одной с задержкой
        for (const iconName of existingIcons) {
            await this.updateIcon(iconName);
            // Небольшая задержка между запросами
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log('\n📊 Результаты обновления:');
        console.log(`✅ Успешно обновлено: ${this.updatedCount}`);
        console.log(`❌ Ошибок: ${this.failedCount}`);
        console.log(`📈 Процент успеха: ${Math.round((this.updatedCount / (this.updatedCount + this.failedCount)) * 100)}%`);
    }

    // Создание резервной копии
    createBackup() {
        const backupDir = path.join(this.iconsDir, 'backup_' + new Date().toISOString().slice(0, 19).replace(/:/g, '-'));
        
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }
        
        const existingIcons = this.getExistingIcons();
        let backupCount = 0;
        
        for (const iconName of existingIcons) {
            const sourcePath = path.join(this.iconsDir, `${iconName}.svg`);
            const backupPath = path.join(backupDir, `${iconName}.svg`);
            
            if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, backupPath);
                backupCount++;
            }
        }
        
        console.log(`💾 Создана резервная копия ${backupCount} иконок в ${backupDir}`);
        return backupDir;
    }

    // Проверка качества иконок
    checkIconQuality(iconName) {
        const filePath = path.join(this.iconsDir, `${iconName}.svg`);
        
        if (!fs.existsSync(filePath)) {
            return false;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Проверяем наличие ключевых элементов высококачественного SVG
        const hasViewBox = content.includes('viewBox');
        const hasProperNamespace = content.includes('xmlns="http://www.w3.org/2000/svg"');
        const hasComplexPaths = content.includes('fill-rule') || content.includes('clip-rule');
        const hasProperDimensions = content.includes('width="16"') && content.includes('height="16"');
        
        return hasViewBox && hasProperNamespace && hasComplexPaths && hasProperDimensions;
    }

    // Проверка качества всех иконок
    checkAllIconsQuality() {
        console.log('🔍 Проверка качества иконок...');
        
        const existingIcons = this.getExistingIcons();
        let highQualityCount = 0;
        let lowQualityCount = 0;
        
        for (const iconName of existingIcons) {
            if (this.checkIconQuality(iconName)) {
                highQualityCount++;
                console.log(`✅ ${iconName} - высокое качество`);
            } else {
                lowQualityCount++;
                console.log(`⚠️ ${iconName} - низкое качество`);
            }
        }
        
        console.log('\n📊 Результаты проверки качества:');
        console.log(`✅ Высокое качество: ${highQualityCount}`);
        console.log(`⚠️ Низкое качество: ${lowQualityCount}`);
        console.log(`📈 Процент высокого качества: ${Math.round((highQualityCount / (highQualityCount + lowQualityCount)) * 100)}%`);
    }
}

// Основная функция
async function main() {
    const updater = new IconUpdater();
    
    console.log('🎨 Обновление иконок до высокого качества');
    console.log('=' .repeat(50));
    
    // Создаем резервную копию
    console.log('\n💾 Создание резервной копии...');
    updater.createBackup();
    
    // Проверяем текущее качество
    console.log('\n🔍 Проверка текущего качества...');
    updater.checkAllIconsQuality();
    
    // Обновляем иконки
    console.log('\n🔄 Обновление иконок...');
    await updater.updateAllIcons();
    
    // Проверяем качество после обновления
    console.log('\n🔍 Проверка качества после обновления...');
    updater.checkAllIconsQuality();
    
    console.log('\n🎉 Обновление завершено!');
}

// Запуск скрипта
if (require.main === module) {
    main().catch(console.error);
}

module.exports = IconUpdater; 