// Sistema de Tabs
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tabName}Tab`).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.querySelector('.cyber-container').classList.add('active');
    setTimeout(() => {
        document.querySelector('.cyber-container').classList.remove('active');
    }, 500);
}

// Sistema de Progressão
let currentLevel = 1;
let totalXP = 0;
const xpPerLevel = new Array(121).fill(0).map((_, i) => i * 100);
const shadows = [
    { name: "Igris", image: "https://www.nautiljon.com/images/manga_persos/00/73/mini/igris_7437.webp?11584024861", unlockLevel: 10, stats: "LV.78 | Marshal Grade" },
    { name: "Iron", image: "https://www.nautiljon.com/images/manga_persos/00/24/mini/acier_7442.webp?11584135234", unlockLevel: 20, stats: "LV.65 | Iron Knight" },
    { name: "Tank", image: "https://www.nautiljon.com/images/manga_persos/00/14/mini/tank_7441.webp?11584135243", unlockLevel: 30, stats: "LV.72 | Heavy Defender" },
    { name: "Tusk", image: "https://www.nautiljon.com/images/manga_persos/00/66/mini/kargalgan_7466.webp?10", unlockLevel: 40, stats: "LV.85 | Beast Lord" },
    { name: "Jima", image: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2024/02/img_0962.jpeg", unlockLevel: 50, stats: "LV.88 | Shadow Assassin" },
    { name: "Kaisel", image: "https://i.redd.it/v8jcf5rpbru31.png", unlockLevel: 60, stats: "LV.92 | Sky Sovereign" },
    { name: "Min", image: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/12/solo-leveling-min-byung-gyu.jpg", unlockLevel: 70, stats: "LV.95 | Undead General" },
    { name: "Beru", image: "https://www.nautiljon.com/images/manga_persos/00/04/mini/beru_7440.webp?11584013954", unlockLevel: 80, stats: "LV.99 | Insect Monarch" },
    { name: "Shadow Giants", image: "https://preview.redd.it/7rvc8lyvoxia1.jpg?auto=webp&s=15faa8d4944b7fe00343c0d528cd0caac2e06cf4", unlockLevel: 90, stats: "LV.102 | Colossal Army" },
    { name: "Kamish", image: "https://pbs.twimg.com/media/EgnJzHqWAAEso60.jpg:large", unlockLevel: 100, stats: "LV.110 | Dragon Monarch" },
    { name: "Greed", image: "https://static.wikia.nocookie.net/solo-leveling/images/2/27/Greed3.jpg", unlockLevel: 110, stats: "LV.115 | Sin Incarnate" },
    { name: "Bellion", image: "https://i.ytimg.com/vi/y8eJcRgr5nE/maxresdefault.jpg", unlockLevel: 120, stats: "LV.120 | Monarch's Right Hand" }
];
function updateProgress() {
    const oldLevel = currentLevel;
    currentLevel = Math.floor(totalXP / 100) + 1;
    document.getElementById('currentLevel').textContent = currentLevel;

    if (oldLevel !== currentLevel) {
        updateHunterRank();
        checkForNewShadows();
        updateNextShadow();
    }

    const progress = (totalXP % 100);
    document.getElementById('levelProgress').style.width = `${progress}%`;
    saveProgress();
}

function updateHunterRank() {
    const ranks = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'Monarch', 'Ruler'];
    const rankIndex = Math.floor(currentLevel / 10);
    document.getElementById('hunterRank').textContent =
        `CURRENT HUNTER RANK: ${ranks[rankIndex] || 'Ruler'}`;
}

// Sistema de Sombras
function checkForNewShadows() {
    shadows.forEach(shadow => {
        if (currentLevel >= shadow.unlockLevel &&
            !document.getElementById(shadow.name)) {
            addShadowToArmy(shadow);
        }
    });
}

function updateNextShadow() {
    const nextShadow = shadows.find(shadow => currentLevel < shadow.unlockLevel);
    document.getElementById('nextShadow').textContent =
        nextShadow ? `${nextShadow.name} (LV.${nextShadow.unlockLevel})` : "MAX LEVEL REACHED";
}

function addShadowToArmy(shadow) {
    const shadowDiv = document.createElement('div');
    shadowDiv.className = 'shadow-card';
    shadowDiv.id = shadow.name;
    shadowDiv.innerHTML = `
        <img src="${shadow.image}" class="shadow-avatar">
        <div>${shadow.name}</div>
        <div class="stat-value">${shadow.stats}</div>
    `;

    document.getElementById('shadowArmy').appendChild(shadowDiv);
    updateShadowCount();
}

function updateShadowCount() {
    const count = document.querySelectorAll('.shadow-card').length;
    document.getElementById('shadowCount').textContent =
        `SUMMONED CREATURES: ${count}/12`;
}

// Sistema de Timer
let timerInterval;
function updateTimer() {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const diff = end - now;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    document.getElementById('timeLeft').textContent =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Sistema de Verificação de Quest
function validateQuest() {
    const inputs = ['pushups', 'situps', 'squats', 'run'].map(id =>
        parseInt(document.getElementById(id).value)
    );

    if (inputs.every((val, i) => val >= [100, 100, 100, 10][i])) {
        totalXP += 400; // 4 levels por dia
        updateProgress();
        showModal('QUEST COMPLETE!', '🎉 +4 Levels Gained! ⚡<br>Return tomorrow for new quest!');
        localStorage.setItem('lastComplete', new Date().toISOString());
        lockInputs();
    } else {
        showModal('QUEST FAILED!', '⚠️ STATS DECREASED!');
        ['str', 'agi', 'sta'].forEach(id => {
            const el = document.getElementById(id);
            el.textContent = Math.max(0, parseInt(el.textContent) - 1);
        });
    }
}

// Sistema de Modal
function showModal(header, content) {
    const overlay = document.getElementById('modalOverlay');
    document.getElementById('modalHeader').textContent = header;
    document.getElementById('modalContent').innerHTML = content;
    overlay.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}

// Bloqueio de Inputs
function lockInputs() {
    const btn = document.getElementById('verifyBtn');
    btn.disabled = true;
    btn.textContent = 'QUEST COMPLETED';
    document.querySelectorAll('.goal-item input').forEach(input => {
        input.disabled = true;
        input.style.borderColor = 'var(--warning-red)';
    });
}

function checkDailyReset() {
    const lastComplete = localStorage.getItem('lastComplete');
    if (lastComplete) {
        const lastDate = new Date(lastComplete);
        const now = new Date();
        if (now.toDateString() === lastDate.toDateString()) {
            lockInputs();
        } else {
            document.getElementById('verifyBtn').disabled = false;
            document.getElementById('verifyBtn').textContent = 'VERIFY QUEST';
            document.querySelectorAll('.goal-item input').forEach(input => {
                input.disabled = false;
                input.value = 0;
                input.style.borderColor = 'var(--neon-purple)';
            });
        }
    }
}

// Sistema de Salvamento no Cache Local
function saveProgress() {
    const progressData = {
        currentLevel,
        totalXP,
        shadows: Array.from(document.querySelectorAll('.shadow-card')).map(card => card.id)
    };
    localStorage.setItem('progressData', JSON.stringify(progressData));
}

function loadProgress() {
    const progressData = JSON.parse(localStorage.getItem('progressData'));
    if (progressData) {
        currentLevel = progressData.currentLevel;
        totalXP = progressData.totalXP;
        progressData.shadows.forEach(shadowId => {
            const shadow = shadows.find(s => s.name === shadowId);
            if (shadow) {
                addShadowToArmy(shadow);
            }
        });
        updateProgress();
        updateHunterRank();
        updateNextShadow();
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
    checkDailyReset();
    setInterval(checkDailyReset, 60000);
    loadProgress();
});
