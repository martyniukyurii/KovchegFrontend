#!/bin/bash

echo "🚨 ТЕРМІНОВИЙ СКРИПТ ОЧИСТКИ GIT"
echo "================================"
echo ""
echo "⚠️  УВАГА: Цей скрипт перезапише Git історію!"
echo ""
echo "Що він робить:"
echo "1. Знаходить всі коміти з паролем"
echo "2. Замінює пароль на ***REMOVED***"
echo "3. Force push в GitHub"
echo ""
echo "❌ НЕ ЗАПУСКАЙТЕ якщо працюють інші розробники!"
echo ""
read -p "Натисніть Enter для продовження або Ctrl+C для скасування..."

echo ""
echo "📋 Створюю backup..."
git branch backup-before-cleanup

echo "✅ Backup створено: backup-before-cleanup"
echo ""

# Спосіб 1: git filter-repo (найкращий, але треба встановити)
if command -v git-filter-repo &> /dev/null; then
    echo "🔧 Використовую git-filter-repo..."
    
    # Створюємо файл для заміни
    cat > /tmp/replacements.txt << 'REPLACE'
ZgKbgBGVXm2Wi2Xf==>***REMOVED***
mongodb+srv://yuramartin1993:ZgKbgBGVXm2Wi2Xf@cluster0.gitezea.mongodb.net/==>mongodb+srv://username:***REMOVED***@cluster0.gitezea.mongodb.net/
REPLACE
    
    git filter-repo --replace-text /tmp/replacements.txt --force
    
    echo "✅ Пароль видалено з історії!"
    rm /tmp/replacements.txt
    
else
    echo "❌ git-filter-repo не встановлено"
    echo ""
    echo "📥 Встановіть його:"
    echo "   brew install git-filter-repo"
    echo ""
    echo "Або використайте BFG Repo Cleaner:"
    echo "   brew install bfg"
    echo ""
    exit 1
fi

echo ""
echo "🚀 Тепер потрібно force push:"
echo ""
echo "   git remote add origin https://github.com/martyniukyurii/KovchegFrontend.git"
echo "   git push --force --all origin"
echo ""
echo "⚠️  УВАГА: Force push перезапише історію в GitHub!"
echo "   Всі хто клонував репозиторій повинні зробити:"
echo "   git fetch origin"
echo "   git reset --hard origin/main"
echo ""
read -p "Натиснути Enter щоб зробити force push, або Ctrl+C щоб зупинити..."

git push --force --all origin

echo ""
echo "✅ ГОТОВО! Пароль видалено з Git історії!"
echo ""
echo "📝 Що робити далі:"
echo "1. Перевірте GitHub - алерти мають зникнути через 24 години"
echo "2. Змініть пароль MongoDB (якщо ще не зробили)"
echo "3. Зробіть репозиторій приватним"
echo ""
