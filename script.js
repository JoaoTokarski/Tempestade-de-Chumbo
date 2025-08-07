document.addEventListener('DOMContentLoaded', () => {
    // Elementos do jogo
    const player = document.getElementById('player');
    const enemy = document.getElementById('enemy');
    const bullet = document.getElementById('bullet');
    const terrain = document.getElementById('terrain');
    const healthDisplay = document.getElementById('health');
    const killsDisplay = document.getElementById('kills');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const finalScore = document.getElementById('final-score');
    
    // Variáveis do jogo
    let playerX = 100;
    let playerY = window.innerHeight - 130;
    let playerSpeed = 5;
    let playerHealth = 100;
    let kills = 0;
    let isJumping = false;
    let jumpHeight = 0;
    let maxJumpHeight = 150;
    let isFalling = false;
    let gravity = 5;
    let gameRunning = false;
    let enemies = [];
    let bullets = [];
    let enemySpeed = 2;
    let enemySpawnRate = 2000; // ms
    let lastEnemySpawn = 0;
    
    // Configuração inicial do terreno
    function setupTerrain() {
        // Adiciona alguns obstáculos
        for (let i = 0; i < 10; i++) {
            const bush = document.createElement('div');
            bush.className = 'bush';
            bush.style.left = `${Math.random() * (window.innerWidth - 80)}px`;
            terrain.appendChild(bush);
        }
        
        for (let i = 0; i < 5; i++) {
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
        playerHealth = 100;
        kills = 0;
        killsDisplay.textContent = `Eliminações: ${kills}`;
        healthDisplay.textContent = `Vida: ${playerHealth}`;
        playerX = 100;
        playerY = window.innerHeight - 130;
        updatePlayerPosition();
        enemies = [];
        bullets = [];
        gameRunning = true;
        lastEnemySpawn = Date.now();
        
        // Limpa inimigos existentes
        document.querySelectorAll('.enemy').forEach(enemy => {
            if (enemy.id !== 'enemy') enemy.remove();
        });
        
        // Inicia o loop do jogo
        gameLoop();
    }
    
    // Loop principal do jogo
    function gameLoop() {
        if (!gameRunning) return;
        
        // Movimento do jogador
        handlePlayerMovement();
        
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
        // Gravidade
        if (isJumping) {
            playerY -= gravity;
            jumpHeight += gravity;
            if (jumpHeight >= maxJumpHeight) {
                isJumping = false;
                isFalling = true;
            }
        } else if (playerY < window.innerHeight - 130) {
            playerY += gravity;
            isFalling = true;
        } else {
            playerY = window.innerHeight - 130;
            isFalling = false;
            jumpHeight = 0;
        }
        
        updatePlayerPosition();
    }
    
    // Atualiza a posição do jogador
    function updatePlayerPosition() {
        player.style.left = `${playerX}px`;
        player.style.top = `${playerY}px`;
    }
    
    // Spawn de um novo inimigo
    function spawnEnemy() {
        const newEnemy = document.createElement('div');
        newEnemy.className = 'character enemy';
        
        const enemyX = Math.random() > 0.5 ? 
            -50 : window.innerWidth + 50;
        const enemyY = window.innerHeight - 130;
        
        newEnemy.style.left = `${enemyX}px`;
        newEnemy.style.top = `${enemyY}px`;
        
        document.getElementById('game-container').appendChild(newEnemy);
        
        enemies.push({
            element: newEnemy,
            x: enemyX,
            y: enemyY,
            direction: enemyX < 0 ? 1 : -1,
            health: 100
        });
    }
    
    // Move os inimigos
    function moveEnemies() {
        enemies.forEach((enemy, index) => {
            enemy.x += enemySpeed * enemy.direction;
            enemy.element.style.left = `${enemy.x}px`;
            
            // Remove inimigos que saíram da tela
            if (enemy.x < -100 || enemy.x > window.innerWidth + 100) {
                enemy.element.remove();
                enemies.splice(index, 1);
            }
        });
    }
    
    // Cria uma nova bala
    function createBullet(x, y, angle) {
        const newBullet = document.createElement('div');
        newBullet.className = 'bullet';
        newBullet.style.left = `${x}px`;
        newBullet.style.top = `${y}px`;
        
        document.getElementById('game-container').appendChild(newBullet);
        
        bullets.push({
            element: newBullet,
            x: x,
            y: y,
            angle: angle,
            speed: 10
        });
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
        // Verifica colisão entre balas e inimigos
        bullets.forEach((bullet, bulletIndex) => {
            enemies.forEach((enemy, enemyIndex) => {
                const bulletRect = bullet.element.getBoundingClientRect();
                const enemyRect = enemy.element.getBoundingClientRect();
                
                if (bulletRect.left < enemyRect.right &&
                    bulletRect.right > enemyRect.left &&
                    bulletRect.top < enemyRect.bottom &&
                    bulletRect.bottom > enemyRect.top) {
                    
                    // Atingiu o inimigo
                    enemy.health -= 25;
                    
                    // Remove a bala
                    bullet.element.remove();
                    bullets.splice(bulletIndex, 1);
                    
                    // Verifica se o inimigo morreu
                    if (enemy.health <= 0) {
                        enemy.element.remove();
                        enemies.splice(enemyIndex, 1);
                        kills++;
                        killsDisplay.textContent = `Eliminações: ${kills}`;
                    }
                }
            });
        });
        
        // Verifica colisão entre jogador e inimigos
        const playerRect = player.getBoundingClientRect();
        enemies.forEach(enemy => {
            const enemyRect = enemy.element.getBoundingClientRect();
            
            if (playerRect.left < enemyRect.right &&
                playerRect.right > enemyRect.left &&
                playerRect.top < enemyRect.bottom &&
                playerRect.bottom > enemyRect.top) {
                
                // Jogador atingido
                playerHealth -= 1;
                healthDisplay.textContent = `Vida: ${playerHealth}`;
                
                // Verifica se o jogador morreu
                if (playerHealth <= 0) {
                    gameOver();
                }
            }
        });
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
    
    document.addEventListener('keydown', (e) => {
        if (!gameRunning) return;
        
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                if (!isJumping && !isFalling) {
                    isJumping = true;
                }
                break;
            case 'a':
            case 'arrowleft':
                playerX -= playerSpeed;
                if (playerX < 0) playerX = 0;
                updatePlayerPosition();
                break;
            case 'd':
            case 'arrowright':
                playerX += playerSpeed;
                if (playerX > window.innerWidth - 50) playerX = window.innerWidth - 50;
                updatePlayerPosition();
                break;
            case ' ':
                if (!isJumping && !isFalling) {
                    isJumping = true;
                }
                break;
        }
    });
    
    document.addEventListener('mousedown', (e) => {
        if (!gameRunning) return;
        
        // Calcula o ângulo entre o jogador e o mouse
        const playerCenterX = playerX + 25;
        const playerCenterY = playerY + 50;
        const angle = Math.atan2(
            e.clientY - playerCenterY,
            e.clientX - playerCenterX
        );
        
        // Cria uma bala
        createBullet(playerCenterX, playerCenterY, angle);
    });
    
    // Inicializa o jogo
    setupTerrain();
});
