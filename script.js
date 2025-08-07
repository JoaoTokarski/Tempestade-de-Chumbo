document.addEventListener('DOMContentLoaded', () => {
    // Elementos do jogo
    const player = document.getElementById('player');
    const weapon = player.querySelector('.weapon');
    const rightArm = player.querySelector('.arm.right');
    const terrain = document.getElementById('terrain');
    const healthDisplay = document.getElementById('health');
    const ammoDisplay = document.getElementById('ammo');
    const killsDisplay = document.getElementById('kills');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const finalScore = document.getElementById('final-score');
    const gameContainer = document.getElementById('game-container');
    
    // Adiciona mira
    const crosshair = document.createElement('div');
    crosshair.className = 'crosshair';
    gameContainer.appendChild(crosshair);
    
    // Adiciona efeito de sangue
    const bloodEffect = document.createElement('div');
    bloodEffect.className = 'blood-effect hidden';
    gameContainer.appendChild(bloodEffect);
    
    // Variáveis do jogo
    let playerX = 100;
    let playerY = window.innerHeight - 150;
    let playerSpeed = 5;
    let playerHealth = 100;
    let ammo = 30;
    let maxAmmo = 30;
    let kills = 0;
    let isJumping = false;
    let isFalling = false;
    let jumpForce = 0;
    const gravity = 0.5;
    const maxJumpForce = 15;
    let gameRunning = false;
    let enemies = [];
    let bullets = [];
    let enemySpeed = 1.5;
    let enemySpawnRate = 3000; // ms
    let lastEnemySpawn = 0;
    let lastShotTime = 0;
    let shootDelay = 200; // ms
    let isReloading = false;
    let reloadTime = 1000; // ms
    let mouseX = 0;
    let mouseY = 0;
    
    // Configuração inicial do terreno
    function setupTerrain() {
        // Limpa obstáculos existentes
        const obstacles = document.querySelectorAll('.bush, .tree');
        obstacles.forEach(obs => obs.remove());
        
        // Adiciona novos obstáculos
        for (let i = 0; i < 15; i++) {
            const bush = document.createElement('div');
            bush.className = 'bush';
            bush.style.left = `${Math.random() * (window.innerWidth - 80)}px`;
            terrain.appendChild(bush);
        }
        
        for (let i = 0; i < 8; i++) {
            const tree = document.createElement('div');
            tree.className = 'tree';
            tree.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
            terrain.appendChild(tree);
        }
    }
    
    // Inicia o jogo
    function startGame() {
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        bloodEffect.classList.add('hidden');
        
        playerHealth = 100;
        ammo = maxAmmo;
        kills = 0;
        updateHUD();
        
        playerX = 100;
        playerY = window.innerHeight - 150;
        updatePlayerPosition();
        
        enemies = [];
        bullets = [];
        gameRunning = true;
        lastEnemySpawn = Date.now();
        
        // Limpa inimigos existentes
        document.querySelectorAll('.enemy').forEach(enemy => {
            if (!enemy.classList.contains('character')) enemy.remove();
        });
        
        // Inicia o loop do jogo
        gameLoop();
    }
    
    // Atualiza o HUD
    function updateHUD() {
        healthDisplay.textContent = `Vida: ${playerHealth}`;
        ammoDisplay.textContent = `Munição: ${ammo}/${maxAmmo}`;
        killsDisplay.textContent = `Eliminações: ${kills}`;
    }
    
    // Loop principal do jogo
    function gameLoop() {
        if (!gameRunning) return;
        
        // Movimento do jogador
        handlePlayerMovement();
        
        // Atualiza a arma para seguir o mouse
        updateWeaponPosition();
        
        // Spawn de inimigos
        if (Date.now() - lastEnemySpawn > enemySpawnRate) {
            spawnEnemy();
            lastEnemySpawn = Date.now();
        }
        
        // Movimento dos inimigos
        moveEnemies();
        
        // Movimento das balas
        moveBullets();
        
        // Verifica colisões
        checkCollisions();
        
        // Continua o loop
        requestAnimationFrame(gameLoop);
    }
    
    // Manipula o movimento do jogador
    function handlePlayerMovement() {
        // Gravidade e pulo
        if (isJumping) {
            playerY -= jumpForce;
            jumpForce -= gravity;
            
            if (jumpForce <= 0) {
                isJumping = false;
                isFalling = true;
            }
        } else if (playerY < window.innerHeight - 150) {
            playerY += gravity * 5;
            isFalling = true;
        } else {
            playerY = window.innerHeight - 150;
            isFalling = false;
            jumpForce = 0;
        }
        
        updatePlayerPosition();
    }
    
    // Atualiza a posição do jogador
    function updatePlayerPosition() {
        player.style.left = `${playerX}px`;
        player.style.top = `${playerY}px`;
    }
    
    // Atualiza a posição da arma para mirar no mouse
    function updateWeaponPosition() {
        const playerCenterX = playerX + 30;
        const playerCenterY = playerY + 60;
        
        // Calcula o ângulo entre o jogador e o mouse
        const angle = Math.atan2(
            mouseY - playerCenterY,
            mouseX - playerCenterX
        );
        
        // Rotaciona a arma e o braço direito
        weapon.style.transform = `rotate(${angle}rad)`;
        rightArm.style.transform = `rotate(${angle}rad)`;
        
        // Ajusta a posição da arma para parecer que está sendo segurada
        const weaponX = Math.cos(angle) * 20;
        const weaponY = Math.sin(angle) * 20;
        weapon.style.left = `${35 + weaponX}px`;
        weapon.style.top = `${55 + weaponY}px`;
    }
    
    // Spawn de um novo inimigo
    function spawnEnemy() {
        const newEnemy = document.createElement('div');
        newEnemy.className = 'character enemy';
        
        // Adiciona partes do corpo do inimigo
        newEnemy.innerHTML = `
            <div class="head"></div>
            <div class="body"></div>
            <div class="arm left"></div>
            <div class="arm right"></div>
            <div class="leg left"></div>
            <div class="leg right"></div>
        `;
        
        const enemyX = Math.random() > 0.5 ? 
            -60 : window.innerWidth + 60;
        const enemyY = window.innerHeight - 150;
        
        newEnemy.style.left = `${enemyX}px`;
        newEnemy.style.top = `${enemyY}px`;
        
        gameContainer.appendChild(newEnemy);
        
        enemies.push({
            element: newEnemy,
            x: enemyX,
            y: enemyY,
            direction: enemyX < 0 ? 1 : -1,
            health: 100,
            speed: enemySpeed + Math.random() * 0.5
        });
    }
    
    // Move os inimigos
    function moveEnemies() {
        enemies.forEach((enemy, index) => {
            // Move em direção ao jogador
            const dx = (playerX + 30) - (enemy.x + 30);
            const dy = (playerY + 60) - (enemy.y + 60);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 200) {
                // Move na direção geral do jogador
                enemy.x += enemy.speed * enemy.direction;
            } else {
                // Fica mais perto mas mantém distância
                enemy.x += (dx / distance) * enemy.speed * 0.5;
                enemy.y += (dy / distance) * enemy.speed * 0.5;
            }
            
            enemy.element.style.left = `${enemy.x}px`;
            enemy.element.style.top = `${enemy.y}px`;
            
            // Remove inimigos que saíram da tela
            if (enemy.x < -100 || enemy.x > window.innerWidth + 100 ||
                enemy.y < -100 || enemy.y > window.innerHeight + 100) {
                enemy.element.remove();
                enemies.splice(index, 1);
            }
        });
    }
    
    // Cria uma nova bala
    function createBullet() {
        if (ammo <= 0) {
            if (!isReloading) {
                reload();
            }
            return;
        }
        
        const now = Date.now();
        if (now - lastShotTime < shootDelay) return;
        
        lastShotTime = now;
        ammo--;
        updateHUD();
        
        const playerCenterX = playerX + 30;
        const playerCenterY = playerY + 60;
        
        // Calcula o ângulo entre o jogador e o mouse
        const angle = Math.atan2(
            mouseY - playerCenterY,
            mouseX - playerCenterX
        );
        
        // Posição inicial da bala (na ponta da arma)
        const bulletX = playerCenterX + Math.cos(angle) * 40;
        const bulletY = playerCenterY + Math.sin(angle) * 40;
        
        const newBullet = document.createElement('div');
        newBullet.className = 'bullet';
        newBullet.style.left = `${bulletX}px`;
        newBullet.style.top = `${bulletY}px`;
        
        gameContainer.appendChild(newBullet);
        
        // Efeito de recuo
        player.style.transform = 'translateX(-5px)';
        setTimeout(() => {
            player.style.transform = 'translateX(0)';
        }, 100);
        
        // Som de tiro (simulado com oscilador Web Audio)
        playGunshotSound();
        
        bullets.push({
            element: newBullet,
            x: bulletX,
            y: bulletY,
            angle: angle,
            speed: 15,
            damage: 25
        });
    }
    
    // Recarrega a arma
    function reload() {
        if (isReloading || ammo === maxAmmo) return;
        
        isReloading = true;
        ammoDisplay.textContent = `Recarregando...`;
        
        setTimeout(() => {
            ammo = maxAmmo;
            updateHUD();
            isReloading = false;
        }, reloadTime);
    }
    
    // Move as balas
    function moveBullets() {
        bullets.forEach((bullet, index) => {
            bullet.x += Math.cos(bullet.angle) * bullet.speed;
            bullet.y += Math.sin(bullet.angle) * bullet.speed;
            
            bullet.element.style.left = `${bullet.x}px`;
            bullet.element.style.top = `${bullet.y}px`;
            
            // Remove balas que saíram da tela
            if (bullet.x < 0 || bullet.x > window.innerWidth || 
                bullet.y < 0 || bullet.y > window.innerHeight) {
                bullet.element.remove();
                bullets.splice(index, 1);
            }
        });
    }
    
    // Verifica colisões
    function checkCollisions() {
        const playerRect = {
            left: playerX,
            right: playerX + 60,
            top: playerY,
            bottom: playerY + 120
        };
        
        // Verifica colisão entre balas e inimigos
        bullets.forEach((bullet, bulletIndex) => {
            const bulletRect = bullet.element.getBoundingClientRect();
            
            enemies.forEach((enemy, enemyIndex) => {
                const enemyRect = {
                    left: enemy.x,
                    right: enemy.x + 60,
                    top: enemy.y,
                    bottom: enemy.y + 120
                };
                
                if (bulletRect.left < enemyRect.right &&
                    bulletRect.right > enemyRect.left &&
                    bulletRect.top < enemyRect.bottom &&
                    bulletRect.bottom > enemyRect.top) {
                    
                    // Atingiu o inimigo
                    enemy.health -= bullet.damage;
                    
                    // Efeito visual
                    enemy.element.style.filter = 'brightness(1.5)';
                    setTimeout(() => {
                        enemy.element.style.filter = 'brightness(1)';
                    }, 100);
                    
                    // Remove a bala
                    bullet.element.remove();
                    bullets.splice(bulletIndex, 1);
                    
                    // Verifica se o inimigo morreu
                    if (enemy.health <= 0) {
                        enemy.element.remove();
                        enemies.splice(enemyIndex, 1);
                        kills++;
                        updateHUD();
                    }
                }
            });
        });
        
        // Verifica colisão entre jogador e inimigos
        enemies.forEach(enemy => {
            const enemyRect = {
                left: enemy.x,
                right: enemy.x + 60,
                top: enemy.y,
                bottom: enemy.y + 120
            };
            
            if (playerRect.left < enemyRect.right &&
                playerRect.right > enemyRect.left &&
                playerRect.top < enemyRect.bottom &&
                playerRect.bottom > enemyRect.top) {
                
                // Jogador atingido
                playerHealth -= 0.5;
                updateHUD();
                
                // Efeito de sangue
                bloodEffect.classList.remove('hidden');
                setTimeout(() => {
                    bloodEffect.classList.add('hidden');
                }, 200);
                
                // Verifica se o jogador morreu
                if (playerHealth <= 0) {
                    gameOver();
                }
            }
        });
    }
    
    // Toca som de tiro
    function playGunshotSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(50, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
            console.log("Web Audio API não suportada");
        }
    }
    
    // Finaliza o jogo
    function gameOver() {
        gameRunning = false;
        finalScore.textContent = `Eliminações: ${kills}`;
        gameOverScreen.classList.remove('hidden');
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    
    // Controles de teclado
    const keys = {
        w: false,
        a: false,
        s: false,
        d: false
    };
    
    document.addEventListener('keydown', (e) => {
        if (!gameRunning) return;
        
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                keys.w = true;
                if (!isJumping && !isFalling) {
                    isJumping = true;
                    jumpForce = maxJumpForce;
                }
                break;
            case 'a':
            case 'arrowleft':
                keys.a = true;
                break;
            case 's':
            case 'arrowdown':
                keys.s = true;
                break;
            case 'd':
            case 'arrowright':
                keys.d = true;
                break;
            case ' ':
                if (!isJumping && !isFalling) {
                    isJumping = true;
                    jumpForce = maxJumpForce;
                }
                break;
            case 'r':
                if (!isReloading) {
                    reload();
                }
                break;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                keys.w = false;
                break;
            case 'a':
            case 'arrowleft':
                keys.a = false;
                break;
            case 's':
            case 'arrowdown':
                keys.s = false;
                break;
            case 'd':
            case 'arrowright':
                keys.d = false;
                break;
        }
    });
    
    // Movimento suave com teclado
    function handleKeyboardMovement() {
        if (keys.a) {
            playerX -= playerSpeed;
            if (playerX < 0) playerX = 0;
        }
        if (keys.d) {
            playerX += playerSpeed;
            if (playerX > window.innerWidth - 60) playerX = window.innerWidth - 60;
        }
    }
    
    // Atualiza o movimento a cada frame
    function updateMovement() {
        handleKeyboardMovement();
        updatePlayerPosition();
    }
    
    // Mouse movement tracking
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Mouse click to shoot
    document.addEventListener('mousedown', (e) => {
        if (!gameRunning) return;
        if (e.button === 0) { // Botão esquerdo
            createBullet();
        }
    });
    
    // Mouse continuous shooting
    let mouseDown = false;
    document.addEventListener('mousedown', () => mouseDown = true);
    document.addEventListener('mouseup', () => mouseDown = false);
    
    // Auto-fire when mouse is held down
    setInterval(() => {
        if (gameRunning && mouseDown && !isReloading) {
            createBullet();
        }
    }, shootDelay);
    
    // Inicializa o jogo
    setupTerrain();
    
    // Loop de movimento suave
    setInterval(updateMovement, 16);
});