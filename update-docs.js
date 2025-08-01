#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функция для создания HTML страницы из markdown файла
function createHtmlFromMarkdown(mdContent, title, filename) {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - RC Experiment</title>
    <link rel="stylesheet" href="../styles.css">
    <style>
        .doc-page {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .doc-content {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .doc-content h1 {
            font-size: 32px;
            margin-bottom: 24px;
            color: rgba(0, 0, 0, 0.9);
        }
        .doc-content h2 {
            font-size: 24px;
            margin: 32px 0 16px 0;
            color: rgba(0, 0, 0, 0.9);
        }
        .doc-content h3 {
            font-size: 18px;
            margin: 24px 0 12px 0;
            color: rgba(0, 0, 0, 0.9);
        }
        .doc-content p, .doc-content li {
            font-size: 16px;
            line-height: 1.6;
            color: rgba(0, 0, 0, 0.8);
            margin-bottom: 12px;
        }
        .doc-content code {
            background: rgba(0, 0, 0, 0.05);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 14px;
        }
        .doc-content pre {
            background: rgba(0, 0, 0, 0.05);
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 16px 0;
        }
        .back-link {
            display: inline-block;
            margin-bottom: 24px;
            color: #F8604A;
            text-decoration: none;
            font-weight: 500;
        }
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="doc-page">
        <a href="../index.html" class="back-link">← Назад к демо-странице</a>
        
        <div class="doc-content">
            ${mdContent}
            
            <hr>
            
            <p><strong>Файл:</strong> ${filename}</p>
            <p><strong>Последнее обновление:</strong> ${new Date().toLocaleDateString('ru-RU')}</p>
        </div>
    </div>
</body>
</html>`;
}

// Функция для конвертации markdown в HTML
function markdownToHtml(mdContent) {
    return mdContent
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '</p>\n<p>')
        .replace(/^<p>/, '')
        .replace(/<\/p>$/, '')
        .replace(/<\/p>\n<p>/g, '</p>\n<p>');
}

// Функция для обновления README.html
function updateReadmeHtml() {
    try {
        const readmeContent = fs.readFileSync('README.md', 'utf8');
        const htmlContent = createHtmlFromMarkdown(
            markdownToHtml(readmeContent),
            'README',
            'README.md'
        );
        fs.writeFileSync('docs/README.html', htmlContent);
        console.log('✅ README.html обновлен');
    } catch (error) {
        console.error('❌ Ошибка обновления README.html:', error.message);
    }
}

// Функция для обновления MILESTONE.html
function updateMilestoneHtml() {
    try {
        const milestoneContent = fs.readFileSync('MILESTONE.md', 'utf8');
        const htmlContent = createHtmlFromMarkdown(
            markdownToHtml(milestoneContent),
            'MILESTONE',
            'MILESTONE.md'
        );
        fs.writeFileSync('docs/MILESTONE.html', htmlContent);
        console.log('✅ MILESTONE.html обновлен');
    } catch (error) {
        console.error('❌ Ошибка обновления MILESTONE.html:', error.message);
    }
}

// Функция для обновления правил проекта
function updateRulesHtml() {
    const rulesDir = '.cursor/rules';
    const rulesFiles = [
        { file: 'project-overview.mdc', title: 'Project Overview' },
        { file: 'development-workflow.mdc', title: 'Development Workflow' },
        { file: 'technical-standards.mdc', title: 'Technical Standards' },
        { file: 'git-workflow.mdc', title: 'Git Workflow' },
        { file: 'ui-kit-guidelines.mdc', title: 'UI Kit Guidelines' }
    ];

    rulesFiles.forEach(rule => {
        try {
            const rulePath = path.join(rulesDir, rule.file);
            if (fs.existsSync(rulePath)) {
                const ruleContent = fs.readFileSync(rulePath, 'utf8');
                // Убираем frontmatter
                const contentWithoutFrontmatter = ruleContent.replace(/^---[\s\S]*?---\n/, '');
                const htmlContent = createHtmlFromMarkdown(
                    markdownToHtml(contentWithoutFrontmatter),
                    rule.title,
                    rule.file
                );
                fs.writeFileSync(`docs/${rule.file.replace('.mdc', '.html')}`, htmlContent);
                console.log(`✅ ${rule.file.replace('.mdc', '.html')} обновлен`);
            }
        } catch (error) {
            console.error(`❌ Ошибка обновления ${rule.file}:`, error.message);
        }
    });
}

// Основная функция
function updateAllDocs() {
    console.log('🔄 Обновление документации...');
    
    // Создаем папку docs если её нет
    if (!fs.existsSync('docs')) {
        fs.mkdirSync('docs');
    }
    
    updateReadmeHtml();
    updateMilestoneHtml();
    updateRulesHtml();
    
    console.log('✅ Все файлы документации обновлены!');
}

// Запуск если скрипт вызван напрямую
if (require.main === module) {
    updateAllDocs();
}

module.exports = { updateAllDocs, updateReadmeHtml, updateMilestoneHtml, updateRulesHtml }; 