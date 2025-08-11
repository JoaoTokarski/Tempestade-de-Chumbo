// Configurações do jogo
const config = {
    playerSpeed: 6,
    jumpForce: 15,
    gravity: 0.5,
    enemySpeed: 3.5,
    enemySpawnRate: 2000,
    weaponSpawnRate: 10000,
    birdSpawnRate: 3000,
    damageEffectDuration: 300
};

// Estado do jogo
const gameState = {
    player: {
        x: 100,
        y: 0,
        health: 100,
        shield: 100,
        isJumping: false,
        velocityY: 0,
        currentWeapon: 'pistol',
        weapons: {
            pistol: { ammo: Infinity, damage: 10, fireRate: 200, icon: '🔫' },
            bazooka: { ammo: 5, damage: 50, fireRate: 1000, icon: '🚀' },
            grenade: { ammo: 3, damage: 30, fireRate: 800, icon: '💣' }
        },
        score: 0
    },
    enemies: [],
    weapons: [],
    bullets: [],
    explosions: [],
    birds: [],
    missions: [
        { 
            id: 1, 
            title: "Eliminação", 
            description: "Elimine 5 inimigos", 
            target: 5, 
            progress: 0,
            reward: 500,
            nextMission: 2
        },
        { 
            id: 2, 
            title: "Coleta de Armas", 
            description: "Colete 3 armas especiais", 
            target: 3, 
            progress: 0,
            reward: 800,
            nextMission: null
        }
    ],
    currentMission: 0,
    keys: {
        a: false,
        d: false,
        w: false,
        e: false
    },
    lastShot: 0,
    lastEnemySpawn: 0,
    lastWeaponSpawn: 0,
    lastBirdSpawn: 0,
    lastDamageTime: 0,
    gameRunning: false
};

// Elementos DOM
const elements = {
    player: document.getElementById('player'),
    terrain: document.getElementById('terrain'),
    sky: document.getElementById('sky'),
    healthBar: document.querySelector('.health-bar .fill'),
    healthText: document.querySelector('.health-bar span'),
    shieldBar: document.querySelector('.shield-bar .fill'),
    shieldText: document.querySelector('.shield-bar span'),
    weaponIcon: document.querySelector('.weapon-icon'),
    ammoText: document.querySelector('.ammo'),
    missionText: document.querySelector('.mission-text'),
    missionProgress: document.querySelector('.mission-progress'),
    weaponPrompt: document.querySelector('.weapon-prompt'),
    startScreen: document.getElementById('start-screen'),
    missionComplete: document.getElementById('mission-complete'),
    gameOverScreen: document.getElementById('game-over'),
    scoreText: document.querySelector('.score'),
    restartBtn: document.getElementById('restart-btn'),
    shootSound: document.getElementById('shoot-sound'),
    explosionSound: document.getElementById('explosion-sound'),
    powerupSound: document.getElementById('powerup-sound'),
    damageEffect: document.createElement('div')
};

// Inicialização do jogo
function initGame() {
    // Criar efeito de dano
    elements.damageEffect.className = 'damage-effect';
    document.body.appendChild(elements.damageEffect);

    // Posicionar jogador
    gameState.player.y = window.innerHeight - 150;
    updatePlayerPosition();
    
    // Gerar terreno
    generateTerrain();
    
    // Configurar eventos
    setupEventListeners();
    
    // Mostrar tela inicial
    elements.startScreen.classList.remove('hidden');
}

// Configurar eventos
function setupEventListeners() {
    // Teclado
    document.addEventListener('keydown', (e) => {
        if (!gameState.gameRunning) return;
        
        switch(e.key.toLowerCase()) {
            case 'a': gameState.keys.a = true; break;
            case 'd': gameState.keys.d = true; break;
            case 'w': 
                if (!gameState.player.isJumping) {
                    gameState.player.velocityY = -config.jumpForce;
                    gameState.player.isJumping = true;
                }
                break;
            case 'e': gameState.keys.e = true; break;
            case 'r': reloadWeapon(); break;
            case '1': switchWeapon('pistol'); break;
            case '2': switchWeapon('bazooka'); break;
            case '3': switchWeapon('grenade'); break;
            case 'escape': togglePause(); break;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        switch(e.key.toLowerCase()) {
            case 'a': gameState.keys.a = false; break;
            case 'd': gameState.keys.d = false; break;
            case 'w': gameState.keys.w = false; break;
            case 'e': gameState.keys.e = false; break;
        }
    });
    
    // Mouse
    document.addEventListener('mousedown', (e) => {
        if (gameState.gameRunning) {
            shoot(e.clientX, e.clientY);
        }
    });
    
    // Botões do menu
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('howto-btn').addEventListener('click', showHowToPlay);
    elements.restartBtn.addEventListener('click', restartGame);
}

// Iniciar jogo
function startGame() {
    resetGameState();
    elements.startScreen.classList.add('hidden');
    elements.gameOverScreen.classList.add('hidden');
    gameState.gameRunning = true;
    startMission(0);
    gameLoop();
}

// Reiniciar jogo
function restartGame() {
    resetGameState();
    elements.gameOverScreen.classList.add('hidden');
    gameState.gameRunning = true;
    startMission(0);
    gameLoop();
}

// Resetar estado do jogo
function resetGameState() {
    // Limpar entidades do jogo
    gameState.enemies.forEach(enemy => enemy.element.remove());
    gameState.weapons.forEach(weapon => weapon.element.remove());
    gameState.bullets.forEach(bullet => bullet.element.remove());
    gameState.explosions.forEach(explosion => explosion.element.remove());
    gameState.birds.forEach(bird => bird.element.remove());

    // Resetar estado
    gameState.enemies = [];
    gameState.weapons = [];
    gameState.bullets = [];
    gameState.explosions = [];
    gameState.birds = [];
    
    // Resetar jogador
    gameState.player = {
        x: 100,
        y: window.innerHeight - 150,
        health: 100,
        shield: 100,
        isJumping: false,
        velocityY: 0,
        currentWeapon: 'pistol',
        weapons: {
            pistol: { ammo: Infinity, damage: 10, fireRate: 200, icon: '🔫' },
            bazooka: { ammo: 5, damage: 50, fireRate: 1000, icon: '🚀' },
            grenade: { ammo: 3, damage: 30, fireRate: 800, icon: '💣' }
        },
        score: 0
    };

    // Atualizar UI
    updateHealthUI();
    updateShieldUI();
    updateWeaponUI();
    updatePlayerPosition();
}

// Mostrar como jogar
function showHowToPlay() {
    alert("CONTROLES:\n\nWASD - Movimento\nMouse - Mirar/Atirar\n1-2-3 - Trocar arma\nR - Recarregar\nE - Pegar arma\nESC - Pausar");
}

// Alternar pausa
function togglePause() {
    gameState.gameRunning = !gameState.gameRunning;
    if (!gameState.gameRunning) {
        alert("Jogo pausado. Pressione OK para continuar.");
        gameState.gameRunning = true;
    }
}

// Loop principal do jogo
function gameLoop() {
    if (!gameState.gameRunning) return;
    
    // Atualizar jogador
    updatePlayer();
    
    // Atualizar inimigos
    updateEnemies();
    
    // Atualizar balas
    updateBullets();
    
    // Atualizar explosões
    updateExplosions();
    
    // Atualizar armas no chão
    updateWeapons();
    
    // Atualizar pássaros
    updateBirds();
    
    // Verificar colisões
    checkCollisions();
    
    // Spawn de inimigos
    spawnEnemies();
    
    // Spawn de armas
    spawnWeapons();
    
    // Spawn de pássaros
    spawnBirds();
    
    // Atualizar efeito de dano
    updateDamageEffect();
    
    // Continuar loop
    requestAnimationFrame(gameLoop);
}

// ... (mantenha todas as outras funções do jogo conforme fornecido anteriormente) ...

// Atualizar efeito de dano
function updateDamageEffect() {
    const now = Date.now();
    const timeSinceDamage = now - gameState.lastDamageTime;
    
    if (timeSinceDamage < config.damageEffectDuration) {
        const opacity = 0.5 * (1 - timeSinceDamage / config.damageEffectDuration);
        elements.damageEffect.style.opacity = opacity;
    } else {
        elements.damageEffect.style.opacity = 0;
    }
}

// Mostrar tela de game over
function showGameOver() {
    gameState.gameRunning = false;
    elements.scoreText.textContent = `Inimigos eliminados: ${gameState.player.score}`;
    elements.gameOverScreen.classList.remove('hidden');
}

// Iniciar o jogo quando a página carregar
window.addEventListener('load', initGame);