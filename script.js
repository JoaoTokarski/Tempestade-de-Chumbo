// Configurações do jogo
const config = {
    playerSpeed: 6,
    jumpForce: 15,
    gravity: 0.5,
    enemySpeed: 3.5,
    enemySpawnRate: 2000,
    weaponSpawnRate: 10000,
    birdSpawnRate: 3000
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
        }
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
            nextMission: 3
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
    missionProgress: document.querySelector('.mission-progress:after'),
    weaponPrompt: document.querySelector('.weapon-prompt'),
    startScreen: document.getElementById('start-screen'),
    missionComplete: document.getElementById('mission-complete'),
    shootSound: document.getElementById('shoot-sound'),
    explosionSound: document.getElementById('explosion-sound')
};

// Inicialização do jogo
function initGame() {
    // Configurar eventos
    setupEventListeners();
    
    // Posicionar jogador
    gameState.player.y = window.innerHeight - 150;
    updatePlayerPosition();
    
    // Gerar terreno
    generateTerrain();
    
    // Iniciar loop do jogo
    gameLoop();
}

// Configurar eventos
function setupEventListeners() {
    // Teclado
    document.addEventListener('keydown', (e) => {
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
}

// Iniciar jogo
function startGame() {
    elements.startScreen.classList.add('hidden');
    gameState.gameRunning = true;
    gameState.currentMission = 0;
    startMission(gameState.currentMission);
}

// Mostrar como jogar
function showHowToPlay() {
    alert("CONTROLES:\n\nWASD - Movimento\nMouse - Mirar/Atirar\n1-2-3 - Trocar arma\nR - Recarregar\nE - Pegar arma");
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
    
    // Continuar loop
    requestAnimationFrame(gameLoop);
}

// Atualizar jogador
function updatePlayer() {
    // Movimento horizontal
    if (gameState.keys.a) {
        gameState.player.x -= config.playerSpeed;
        if (gameState.player.x < 0) gameState.player.x = 0;
    }
    if (gameState.keys.d) {
        gameState.player.x += config.playerSpeed;
        if (gameState.player.x > window.innerWidth - 60) {
            gameState.player.x = window.innerWidth - 60;
        }
    }
    
    // Gravidade
    gameState.player.velocityY += config.gravity;
    gameState.player.y += gameState.player.velocityY;
    
    // Limite inferior
    if (gameState.player.y > window.innerHeight - 150) {
        gameState.player.y = window.innerHeight - 150;
        gameState.player.velocityY = 0;
        gameState.player.isJumping = false;
    }
    
    // Atualizar posição
    updatePlayerPosition();
    
    // Verificar se está perto de uma arma
    checkNearbyWeapons();
}

// Atualizar posição do jogador
function updatePlayerPosition() {
    elements.player.style.left = `${gameState.player.x}px`;
    elements.player.style.top = `${gameState.player.y}px`;
}

// Atualizar inimigos
function updateEnemies() {
    gameState.enemies.forEach((enemy, index) => {
        // IA melhorada: persegue o jogador
        const dx = gameState.player.x - enemy.x;
        const dy = gameState.player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Movimento mais agressivo
        enemy.x += (dx / distance) * config.enemySpeed * (distance > 200 ? 1 : 0.5);
        enemy.y += (dy / distance) * config.enemySpeed * 0.3;
        
        enemy.element.style.left = `${enemy.x}px`;
        enemy.element.style.top = `${enemy.y}px`;
        
        // Remover se sair da tela
        if (enemy.x < -100 || enemy.x > window.innerWidth + 100) {
            enemy.element.remove();
            gameState.enemies.splice(index, 1);
        }
    });
}

// Atualizar balas
function updateBullets() {
    gameState.bullets.forEach((bullet, index) => {
        bullet.x += bullet.velocityX;
        bullet.y += bullet.velocityY;
        bullet.element.style.left = `${bullet.x}px`;
        bullet.element.style.top = `${bullet.y}px`;
        
        // Remover se sair da tela
        if (bullet.x < 0 || bullet.x > window.innerWidth || 
            bullet.y < 0 || bullet.y > window.innerHeight) {
            bullet.element.remove();
            gameState.bullets.splice(index, 1);
        }
    });
}

// Atualizar explosões
function updateExplosions() {
    gameState.explosions.forEach((explosion, index) => {
        explosion.size += 5;
        explosion.element.style.width = `${explosion.size}px`;
        explosion.element.style.height = `${explosion.size}px`;
        explosion.element.style.left = `${explosion.x - explosion.size/2}px`;
        explosion.element.style.top = `${explosion.y - explosion.size/2}px`;
        explosion.element.style.opacity = 1 - (explosion.size / 100);
        
        // Remover após animação
        if (explosion.size >= 100) {
            explosion.element.remove();
            gameState.explosions.splice(index, 1);
        }
    });
}

// Atualizar armas no chão
function updateWeapons() {
    gameState.weapons.forEach((weapon, index) => {
        // Efeito de flutuação
        weapon.floatOffset = Math.sin(Date.now() / 500 + index) * 5;
        weapon.element.style.top = `${weapon.y + weapon.floatOffset}px`;
    });
}

// Atualizar pássaros
function updateBirds() {
    gameState.birds.forEach((bird, index) => {
        bird.x -= 2;
        bird.element.style.left = `${bird.x}px`;
        
        // Remover se sair da tela
        if (bird.x < -50) {
            bird.element.remove();
            gameState.birds.splice(index, 1);
        }
    });
}

// Verificar colisões
function checkCollisions() {
    // Colisão bala-inimigo
    gameState.bullets.forEach((bullet, bulletIndex) => {
        gameState.enemies.forEach((enemy, enemyIndex) => {
            const distance = Math.sqrt(
                Math.pow(bullet.x - enemy.x, 2) + 
                Math.pow(bullet.y - enemy.y, 2)
            );
            
            if (distance < 30) { // Raio de colisão
                // Dano no inimigo
                enemy.health -= bullet.damage;
                
                // Remover bala
                bullet.element.remove();
                gameState.bullets.splice(bulletIndex, 1);
                
                // Criar explosão pequena
                if (bullet.damage > 20) {
                    createExplosion(bullet.x, bullet.y);
                }
                
                // Verificar se inimigo morreu
                if (enemy.health <= 0) {
                    enemy.element.remove();
                    gameState.enemies.splice(enemyIndex, 1);
                    
                    // Atualizar missão
                    if (gameState.missions[gameState.currentMission].id === 1) {
                        gameState.missions[gameState.currentMission].progress++;
                        updateMissionUI();
                        
                        // Verificar se missão foi completada
                        if (gameState.missions[gameState.currentMission].progress >= 
                            gameState.missions[gameState.currentMission].target) {
                            completeMission();
                        }
                    }
                }
            }
        });
    });
    
    // Colisão jogador-inimigo
    gameState.enemies.forEach(enemy => {
        const distance = Math.sqrt(
            Math.pow(gameState.player.x - enemy.x, 2) + 
            Math.pow(gameState.player.y - enemy.y, 2)
        );
        
        if (distance < 40) {
            gameState.player.health -= 0.5;
            updateHealthUI();
            
            if (gameState.player.health <= 0) {
                gameOver();
            }
        }
    });
    
    // Colisão explosão-inimigo (dano em área)
    gameState.explosions.forEach(explosion => {
        if (explosion.size < 30) return; // Só causa dano quando estiver grande o suficiente
        
        gameState.enemies.forEach((enemy, index) => {
            const distance = Math.sqrt(
                Math.pow(explosion.x - enemy.x, 2) + 
                Math.pow(explosion.y - enemy.y, 2)
            );
            
            if (distance < explosion.size / 2) {
                enemy.health -= 10; // Dano contínuo enquanto estiver na área
                
                if (enemy.health <= 0) {
                    enemy.element.remove();
                    gameState.enemies.splice(index, 1);
                    
                    // Atualizar missão
                    if (gameState.missions[gameState.currentMission].id === 1) {
                        gameState.missions[gameState.currentMission].progress++;
                        updateMissionUI();
                        
                        if (gameState.missions[gameState.currentMission].progress >= 
                            gameState.missions[gameState.currentMission].target) {
                            completeMission();
                        }
                    }
                }
            }
        });
    });
}

// Spawn de inimigos
function spawnEnemies() {
    const now = Date.now();
    if (now - gameState.lastEnemySpawn > config.enemySpawnRate) {
        const enemy = document.createElement('div');
        enemy.className = 'character enemy';
        
        // Spawn em bordas aleatórias
        const side = Math.random() > 0.5 ? 'left' : 'right';
        const x = side === 'left' ? -60 : window.innerWidth + 60;
        const y = window.innerHeight - 150 - Math.random() * 100;
        
        enemy.style.left = `${x}px`;
        enemy.style.top = `${y}px`;
        document.getElementById('game-container').appendChild(enemy);
        
        gameState.enemies.push({
            element: enemy,
            x: x,
            y: y,
            health: 100,
            speed: config.enemySpeed * (0.8 + Math.random() * 0.4)
        });
        
        gameState.lastEnemySpawn = now;
    }
}

// Spawn de armas
function spawnWeapons() {
    const now = Date.now();
    if (now - gameState.lastWeaponSpawn > config.weaponSpawnRate && 
        gameState.weapons.length < 3) {
        
        const weaponTypes = ['bazooka', 'grenade'];
        const weaponType = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
        
        const weapon = document.createElement('div');
        weapon.className = `weapon ${weaponType}`;
        
        const x = 100 + Math.random() * (window.innerWidth - 200);
        const y = window.innerHeight - 170;
        
        weapon.style.left = `${x}px`;
        weapon.style.top = `${y}px`;
        document.getElementById('game-container').appendChild(weapon);
        
        gameState.weapons.push({
            element: weapon,
            x: x,
            y: y,
            type: weaponType,
            floatOffset: 0
        });
        
        gameState.lastWeaponSpawn = now;
    }
}

// Spawn de pássaros
function spawnBirds() {
    const now = Date.now();
    if (now - gameState.lastBirdSpawn > config.birdSpawnRate) {
        const bird = document.createElement('div');
        bird.className = 'bird';
        
        const y = 50 + Math.random() * (window.innerHeight * 0.3);
        bird.style.setProperty('--bird-y', `${y}px`);
        
        bird.style.left = `${window.innerWidth + 50}px`;
        bird.style.top = `${y}px`;
        document.getElementById('sky').appendChild(bird);
        
        gameState.birds.push({
            element: bird,
            x: window.innerWidth + 50,
            y: y
        });
        
        gameState.lastBirdSpawn = now;
    }
}

// Atirar
function shoot(targetX, targetY) {
    const now = Date.now();
    const weapon = gameState.player.weapons[gameState.player.currentWeapon];
    
    // Verificar cooldown e munição
    if (now - gameState.lastShot < weapon.fireRate || weapon.ammo <= 0) return;
    
    gameState.lastShot = now;
    if (weapon.ammo !== Infinity) {
        weapon.ammo--;
        updateAmmoUI();
    }
    
    // Criar bala
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    
    const angle = Math.atan2(
        targetY - (gameState.player.y + 50),
        targetX - (gameState.player.x + 30)
    );
    
    // Posição inicial na ponta da arma
    const bulletX = gameState.player.x + 30 + Math.cos(angle) * 40;
    const bulletY = gameState.player.y + 50 + Math.sin(angle) * 40;
    
    bullet.style.left = `${bulletX}px`;
    bullet.style.top = `${bulletY}px`;
    document.getElementById('game-container').appendChild(bullet);
    
    // Velocidade baseada no tipo de arma
    let velocityMultiplier = 5;
    if (gameState.player.currentWeapon === 'bazooka') {
        velocityMultiplier = 3;
        elements.explosionSound.currentTime = 0;
        elements.explosionSound.play();
    } else {
        elements.shootSound.currentTime = 0;
        elements.shootSound.play();
    }
    
    gameState.bullets.push({
        element: bullet,
        x: bulletX,
        y: bulletY,
        velocityX: Math.cos(angle) * velocityMultiplier,
        velocityY: Math.sin(angle) * velocityMultiplier,
        damage: weapon.damage
    });
    
    // Efeito de recuo
    elements.player.style.transform = 'translateX(-5px)';
    setTimeout(() => {
        elements.player.style.transform = 'translateX(0)';
    }, 100);
}

// Criar explosão
function createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    document.getElementById('game-container').appendChild(explosion);
    
    gameState.explosions.push({
        element: explosion,
        x: x,
        y: y,
        size: 0
    });
    
    elements.explosionSound.currentTime = 0;
    elements.explosionSound.play();
}

// Verificar armas próximas
function checkNearbyWeapons() {
    let nearestWeapon = null;
    let minDistance = Infinity;
    
    gameState.weapons.forEach(weapon => {
        const distance = Math.sqrt(
            Math.pow(gameState.player.x - weapon.x, 2) + 
            Math.pow(gameState.player.y - weapon.y, 2)
        );
        
        if (distance < 100 && distance < minDistance) {
            nearestWeapon = weapon;
            minDistance = distance;
        }
    });
    
    if (nearestWeapon && gameState.keys.e) {
        pickUpWeapon(nearestWeapon);
    }
    
    // Mostrar prompt de pegar arma
    if (nearestWeapon) {
        elements.weaponPrompt.classList.remove('hidden');
        elements.weaponPrompt.querySelector('.weapon-name').textContent = 
            nearestWeapon.type === 'bazooka' ? 'Bazuca' : 'Granada';
    } else {
        elements.weaponPrompt.classList.add('hidden');
    }
}

// Pegar arma
function pickUpWeapon(weapon) {
    // Adicionar munição
    gameState.player.weapons[weapon.type].ammo += 
        weapon.type === 'bazooka' ? 2 : 1;
    
    // Atualizar UI
    updateAmmoUI();
    
    // Remover arma do chão
    weapon.element.remove();
    gameState.weapons = gameState.weapons.filter(w => w !== weapon);
    
    // Atualizar missão de coleta
    if (gameState.missions[gameState.currentMission].id === 2) {
        gameState.missions[gameState.currentMission].progress++;
        updateMissionUI();
        
        if (gameState.missions[gameState.currentMission].progress >= 
            gameState.missions[gameState.currentMission].target) {
            completeMission();
        }
    }
}

// Trocar arma
function switchWeapon(weaponType) {
    if (gameState.player.currentWeapon !== weaponType && 
        gameState.player.weapons[weaponType]) {
        gameState.player.currentWeapon = weaponType;
        updateWeaponUI();
    }
}

// Recarregar arma
function reloadWeapon() {
    const weapon = gameState.player.weapons[gameState.player.currentWeapon];
    if (weapon.ammo === Infinity) return;
    
    // Lógica de recarga (simplificada)
    if (gameState.player.currentWeapon === 'bazooka') {
        weapon.ammo = 5;
    } else if (gameState.player.currentWeapon === 'grenade') {
        weapon.ammo = 3;
    }
    
    updateAmmoUI();
}

// Iniciar missão
function startMission(index) {
    if (index >= gameState.missions.length) return;
    
    gameState.currentMission = index;
    updateMissionUI();
}

// Atualizar UI da missão
function updateMissionUI() {
    const mission = gameState.missions[gameState.currentMission];
    elements.missionText.textContent = `${mission.description} (${mission.progress}/${mission.target})`;
    elements.missionProgress.style.width = `${(mission.progress / mission.target) * 100}%`;
}

// Completar missão
function completeMission() {
    const mission = gameState.missions[gameState.currentMission];
    
    // Mostrar tela de missão completa
    elements.missionComplete.querySelector('.reward').textContent = `+${mission.reward} XP`;
    elements.missionComplete.classList.remove('hidden');
    
    // Avançar para próxima missão após delay
    setTimeout(() => {
        elements.missionComplete.classList.add('hidden');
        
        if (mission.nextMission) {
            startMission(mission.nextMission - 1); // -1 porque o array é 0-based
        }
    }, 3000);
}

// Game over
function gameOver() {
    alert("GAME OVER! Sua jornada chegou ao fim.");
    location.reload();
}

// Atualizar UI da saúde
function updateHealthUI() {
    elements.healthBar.style.width = `${gameState.player.health}%`;
    elements.healthText.textContent = `${Math.round(gameState.player.health)}%`;
}

// Atualizar UI do escudo
function updateShieldUI() {
    elements.shieldBar.style.width = `${gameState.player.shield}%`;
    elements.shieldText.textContent = `${Math.round(gameState.player.shield)}%`;
}

// Atualizar UI da arma
function updateWeaponUI() {
    const weapon = gameState.player.weapons[gameState.player.currentWeapon];
    elements.weaponIcon.textContent = weapon.icon;
    updateAmmoUI();
}

// Atualizar UI da munição
function updateAmmoUI() {
    const weapon = gameState.player.weapons[gameState.player.currentWeapon];
    elements.ammoText.textContent = weapon.ammo === Infinity ? '∞' : weapon.ammo;
}

// Gerar terreno
function generateTerrain() {
    // Limpar terreno existente
    elements.terrain.innerHTML = '';
    
    // Adicionar arbustos
    for (let i = 0; i < 15; i++) {
        const bush = document.createElement('div');
        bush.className = 'bush';
        bush.style.left = `${Math.random() * window.innerWidth}px`;
        elements.terrain.appendChild(bush);
    }
    
    // Adicionar árvores
    for (let i = 0; i < 8; i++) {
        const tree = document.createElement('div');
        tree.className = 'tree';
        tree.style.left = `${Math.random() * window.innerWidth}px`;
        elements.terrain.appendChild(tree);
    }
}

// Iniciar o jogo quando a página carregar
window.addEventListener('load', initGame);