// === MÓDULO: CONFIGURAÇÕES GLOBAIS ===
const CONFIG = {
    // Configurações do jogo
    FPS_LIMIT: 60,
    MAX_STEP: 0.033, // 30 FPS como mínimo
    DEBUG: false,
    
    // Configurações do jogador
    PLAYER: {
        SPEED: 240,
        ROTATION_SPEED: 0.15,
        HP: 100,
        SHIELD: 50,
        SHIELD_REGEN_DELAY: 3000, // ms
        SHIELD_REGEN_RATE: 10, // por segundo
        HIT_INVULNERABILITY: 500, // ms
        COLLISION_RADIUS: 15,
        DASH_DISTANCE: 100,
        DASH_COOLDOWN: 2000, // ms
        STASIS_COOLDOWN: 10000, // ms
        STASIS_DURATION: 3000, // ms
        STASIS_RADIUS: 150
    },
    
    // Configurações de armas
    WEAPONS: {
        PISTOL: {
            NAME: "Pistola",
            DAMAGE: 15,
            FIRE_RATE: 5, // tiros por segundo
            RECOIL: 1.5,
            SPREAD: 3, // graus
            SPREAD_INCREASE: 1.5, // por tiro
            SPREAD_DECREASE: 4, // por segundo
            DAMAGE_FALLOFF: 0.2, // % por 100px
            PROJECTILE_SPEED: 800,
            MAG_SIZE: 12,
            MAX_AMMO: 60,
            RELOAD_TIME: 1500, // ms
            PENETRATION: 1,
            NOISE: 20,
            KNOCKBACK: 5,
            CRIT_CHANCE: 0.1,
            CRIT_MULTIPLIER: 2,
            PROJECTILE_SIZE: 3,
            PROJECTILE_COLOR: "#ffaa00",
            MUZZLE_FLASH_SIZE: 10,
            MUZZLE_FLASH_DURATION: 50 // ms
        },
        SMG: {
            NAME: "SMG",
            DAMAGE: 8,
            FIRE_RATE: 10,
            RECOIL: 2,
            SPREAD: 5,
            SPREAD_INCREASE: 2,
            SPREAD_DECREASE: 3,
            DAMAGE_FALLOFF: 0.3,
            PROJECTILE_SPEED: 900,
            MAG_SIZE: 30,
            MAX_AMMO: 120,
            RELOAD_TIME: 2000,
            PENETRATION: 0,
            NOISE: 25,
            KNOCKBACK: 3,
            CRIT_CHANCE: 0.05,
            CRIT_MULTIPLIER: 1.5,
            PROJECTILE_SIZE: 2,
            PROJECTILE_COLOR: "#ff5555",
            MUZZLE_FLASH_SIZE: 8,
            MUZZLE_FLASH_DURATION: 40
        }
    },
    
    // Configurações de inimigos
    ENEMY: {
        TYPES: {
            ASSAULT: {
                SPEED: 120,
                HP: 50,
                DAMAGE: 10,
                FIRE_RATE: 3,
                VISION_ANGLE: Math.PI * 0.6,
                VISION_RANGE: 400,
                HEARING_RANGE: 300,
                MEMORY_TIME: 5000, // ms
                ATTACK_RANGE: 350,
                AVOID_RADIUS: 50,
                COLOR: "#ff5555",
                SIZE: 20,
                WEAPON: "SMG"
            },
            SNIPER: {
                SPEED: 80,
                HP: 40,
                DAMAGE: 25,
                FIRE_RATE: 1,
                VISION_ANGLE: Math.PI * 0.4,
                VISION_RANGE: 600,
                HEARING_RANGE: 200,
                MEMORY_TIME: 7000,
                ATTACK_RANGE: 500,
                AVOID_RADIUS: 70,
                COLOR: "#aa55ff",
                SIZE: 18,
                WEAPON: "PISTOL"
            }
        },
        SPAWN_RATE: 1000, // ms entre inimigos
        MAX_PER_WAVE: 10,
        WAVES_PER_LEVEL: 3
    },
    
    // Configurações de física
    PHYSICS: {
        PROJECTILE_LIFETIME: 2000, // ms
        PICKUP_RADIUS: 30,
        KNOCKBACK_DECAY: 0.9,
        FRICTION: 0.85
    },
    
    // Configurações de mundo
    WORLD: {
        WIDTH: 2000,
        HEIGHT: 2000,
        BOUNDARY_PADDING: 100,
        TILE_SIZE: 50,
        WALL_COLOR: "#555555",
        FLOOR_COLOR: "#222222"
    },
    
    // Configurações de UI
    UI: {
        MESSAGE_DURATION: 2000, // ms
        DAMAGE_TEXT_DURATION: 800, // ms
        DAMAGE_TEXT_SPEED: 50, // px/s
        CROSSHAIR_SIZE: 20,
        CROSSHAIR_COLOR: "#ffcc00",
        MINIMAP_SCALE: 0.05,
        MINIMAP_PLAYER_COLOR: "#55ff55",
        MINIMAP_ENEMY_COLOR: "#ff5555",
        MINIMAP_PICKUP_COLOR: "#55ff55"
    },
    
    // Configurações de áudio
    AUDIO: {
        VOLUME: 0.5,
        GUNSHOT_FREQ: 220,
        GUNSHOT_DURATION: 0.05,
        RELOAD_FREQ: [300, 400, 500],
        RELOAD_DURATION: 0.1,
        HIT_FREQ: 110,
        HIT_DURATION: 0.2,
        PICKUP_FREQ: 880,
        PICKUP_DURATION: 0.1,
        DASH_FREQ: 220,
        DASH_DURATION: 0.2
    }
};

// === MÓDULO: UTILITÁRIOS MATEMÁTICOS ===
class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    
    copy() {
        return new Vec2(this.x, this.y);
    }
    
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    
    scale(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    normalize() {
        const len = this.length();
        if (len > 0) {
            this.scale(1 / len);
        }
        return this;
    }
    
    distanceTo(v) {
        return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
    }
    
    angleTo(v) {
        return Math.atan2(v.y - this.y, v.x - this.x);
    }
    
    lerp(v, t) {
        this.x += (v.x - this.x) * t;
        this.y += (v.y - this.y) * t;
        return this;
    }
    
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x * cos - this.y * sin;
        this.y = this.x * sin + this.y * cos;
        this.x = x;
        return this;
    }
}

const Mathx = {
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    lerp(a, b, t) {
        return a + (b - a) * t;
    },
    
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    angleDiff(a, b) {
        let diff = b - a;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        return diff;
    },
    
    pointInCircle(px, py, cx, cy, r) {
        return (px - cx) ** 2 + (py - cy) ** 2 <= r ** 2;
    },
    
    pointInCone(px, py, cx, cy, dir, angle, range) {
        const distSq = (px - cx) ** 2 + (py - cy) ** 2;
        if (distSq > range * range) return false;
        
        const toPoint = Math.atan2(py - cy, px - cx);
        const angleDiff = this.angleDiff(dir, toPoint);
        return Math.abs(angleDiff) <= angle / 2;
    },
    
    circleCircleCollision(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < r1 + r2;
    },
    
    randomGaussian(mean = 0, stdev = 1) {
        const u = 1 - Math.random();
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdev + mean;
    }
};

// === MÓDULO: ENTIDADE BASE ===
class Entity {
    constructor(x, y) {
        this.pos = new Vec2(x, y);
        this.vel = new Vec2();
        this.acc = new Vec2();
        this.size = new Vec2(20, 20);
        this.rotation = 0;
        this.active = true;
        this.collidable = true;
    }
    
    update(dt) {
        this.vel.add(this.acc);
        this.pos.add(new Vec2(this.vel.x * dt, this.vel.y * dt));
        this.acc.scale(0);
        this.vel.scale(CONFIG.PHYSICS.FRICTION);
    }
    
    getCollisionBounds() {
        return {
            x: this.pos.x - this.size.x / 2,
            y: this.pos.y - this.size.y / 2,
            width: this.size.x,
            height: this.size.y
        };
    }
    
    onCollision(other) {
        // Implementação específica para cada entidade
    }
    
    render(ctx) {
        // Implementação específica para cada entidade
    }
}

// === MÓDULO: JOGADOR ===
class Player extends Entity {
    constructor(x, y) {
        super(x, y);
        this.hp = CONFIG.PLAYER.HP;
        this.maxHp = CONFIG.PLAYER.HP;
        this.shield = CONFIG.PLAYER.SHIELD;
        this.maxShield = CONFIG.PLAYER.SHIELD;
        this.speed = CONFIG.PLAYER.SPEED;
        this.size.set(20, 20);
        this.lastDamageTime = 0;
        this.invulnerable = false;
        this.weapons = [];
        this.currentWeaponIndex = 0;
        this.dashCooldown = 0;
        this.stasisCooldown = 0;
        this.stasisActive = false;
        this.stasisEndTime = 0;
        this.coins = 0;
        this.score = 0;
        this.kills = 0;
        
        this.initWeapons();
    }
    
    initWeapons() {
        this.weapons.push(this.createWeapon(CONFIG.WEAPONS.PISTOL));
        this.weapons.push(this.createWeapon(CONFIG.WEAPONS.SMG));
    }
    
    createWeapon(config) {
        return {
            name: config.NAME,
            damage: config.DAMAGE,
            fireRate: config.FIRE_RATE,
            recoil: config.RECOIL,
            baseSpread: config.SPREAD,
            spread: config.SPREAD,
            spreadIncrease: config.SPREAD_INCREASE,
            spreadDecrease: config.SPREAD_DECREASE,
            damageFalloff: config.DAMAGE_FALLOFF,
            projectileSpeed: config.PROJECTILE_SPEED,
            magSize: config.MAG_SIZE,
            magAmmo: config.MAG_SIZE,
            maxAmmo: config.MAX_AMMO,
            totalAmmo: config.MAX_AMMO - config.MAG_SIZE,
            reloadTime: config.RELOAD_TIME,
            penetration: config.PENETRATION,
            noise: config.NOISE,
            knockback: config.KNOCKBACK,
            critChance: config.CRIT_CHANCE,
            critMultiplier: config.CRIT_MULTIPLIER,
            projectileSize: config.PROJECTILE_SIZE,
            projectileColor: config.PROJECTILE_COLOR,
            muzzleFlashSize: config.MUZZLE_FLASH_SIZE,
            muzzleFlashDuration: config.MUZZLE_FLASH_DURATION,
            lastShotTime: 0,
            isReloading: false,
            reloadStartTime: 0,
            currentSpread: 0,
            
            canShoot() {
                const now = Date.now();
                const timeBetweenShots = 1000 / this.fireRate;
                
                return !this.isReloading && 
                       now - this.lastShotTime >= timeBetweenShots && 
                       this.magAmmo > 0;
            },
            
            update(dt) {
                this.currentSpread = Math.max(
                    this.baseSpread,
                    this.currentSpread - this.spreadDecrease * dt
                );
            },
            
            startReload() {
                if (!this.isReloading && this.magAmmo < this.magSize && this.totalAmmo > 0) {
                    this.isReloading = true;
                    this.reloadStartTime = Date.now();
                    
                    const tacticalBonus = this.magAmmo > 0 ? 0.9 : 1;
                    setTimeout(() => {
                        this.finishReload();
                    }, this.reloadTime * tacticalBonus);
                    
                    Audio.playReload();
                }
            },
            
            finishReload() {
                if (!this.isReloading) return;
                
                const ammoNeeded = this.magSize - this.magAmmo;
                const ammoToAdd = Math.min(ammoNeeded, this.totalAmmo);
                
                this.magAmmo += ammoToAdd;
                this.totalAmmo -= ammoToAdd;
                this.isReloading = false;
            },
            
            addAmmo(amount) {
                this.totalAmmo = Math.min(this.maxAmmo - this.magAmmo, this.totalAmmo + amount);
            }
        };
    }
    
    update(dt) {
        super.update(dt);
        
        // Regeneração de escudo
        if (Date.now() - this.lastDamageTime > CONFIG.PLAYER.SHIELD_REGEN_DELAY) {
            this.shield = Math.min(
                this.maxShield,
                this.shield + CONFIG.PLAYER.SHIELD_REGEN_RATE * dt
            );
        }
        
        // Atualizar cooldowns
        if (this.dashCooldown > 0) {
            this.dashCooldown -= dt * 1000;
        }
        
        if (this.stasisCooldown > 0 && !this.stasisActive) {
            this.stasisCooldown -= dt * 1000;
        }
        
        // Verificar campo de estase
        if (this.stasisActive && Date.now() >= this.stasisEndTime) {
            this.stasisActive = false;
            UI.showMessage("Campo de Estase Desativado");
        }
        
        // Atualizar arma atual
        if (this.currentWeapon) {
            this.currentWeapon.update(dt);
        }
    }
    
    get currentWeapon() {
        return this.weapons[this.currentWeaponIndex];
    }
    
    switchWeapon(index) {
        if (index >= 0 && index < this.weapons.length) {
            this.currentWeaponIndex = index;
            UI.updateWeaponDisplay();
        }
    }
    
    takeDamage(amount) {
        if (this.invulnerable) return;
        
        const shieldDamage = Math.min(this.shield, amount);
        this.shield -= shieldDamage;
        
        const remainingDamage = amount - shieldDamage;
        if (remainingDamage > 0) {
            this.hp -= remainingDamage;
            this.lastDamageTime = Date.now();
            
            this.invulnerable = true;
            setTimeout(() => {
                this.invulnerable = false;
            }, CONFIG.PLAYER.HIT_INVULNERABILITY);
            
            Game.camera.shake(remainingDamage / 10);
            Audio.playHit();
            
            if (this.hp <= 0) {
                this.die();
            }
        }
    }
    
    die() {
        this.active = false;
        Game.setState('GAME_OVER');
    }
    
    dash() {
        if (this.dashCooldown <= 0) {
            const mouseWorldPos = Input.getMouseWorldPos();
            const direction = new Vec2(
                mouseWorldPos.x - this.pos.x,
                mouseWorldPos.y - this.pos.y
            ).normalize();
            
            this.vel.add(direction.scale(CONFIG.PLAYER.DASH_DISTANCE));
            this.dashCooldown = CONFIG.PLAYER.DASH_COOLDOWN;
            Audio.playDash();
            
            // Efeito visual
            for (let i = 0; i < 10; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 50 + 50;
                const particle = new Particle(
                    this.pos.x,
                    this.pos.y,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed,
                    '#55aaff',
                    1,
                    0.5
                );
                Game.addEntity(particle);
            }
        }
    }
    
    activateStasis() {
        if (this.stasisCooldown <= 0 && !this.stasisActive) {
            this.stasisActive = true;
            this.stasisEndTime = Date.now() + CONFIG.PLAYER.STASIS_DURATION;
            this.stasisCooldown = CONFIG.PLAYER.STASIS_COOLDOWN;
            UI.showMessage("Campo de Estase Ativado!");
            
            const stasisField = new StasisField(
                this.pos.x,
                this.pos.y,
                CONFIG.PLAYER.STASIS_RADIUS,
                CONFIG.PLAYER.STASIS_DURATION
            );
            Game.addEntity(stasisField);
        }
    }
    
    addCoins(amount) {
        this.coins += amount;
        UI.showMessage(`+${amount} Moedas`, '#ffcc00');
    }
    
    addKill() {
        this.kills++;
        this.score += 100;
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation);
        
        // Escudo
        if (this.shield > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, this.size.x / 2 + 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(51, 153, 255, ${this.shield / this.maxShield * 0.5})`;
            ctx.fill();
        }
        
        // Corpo
        ctx.fillStyle = '#55ff55';
        ctx.beginPath();
        ctx.arc(0, 0, this.size.x / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Direção
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.arc(10, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Efeito de invulnerabilidade
        if (this.invulnerable) {
            const flash = Math.sin(Date.now() / 50) > 0;
            if (flash) {
                ctx.beginPath();
                ctx.arc(this.pos.x, this.pos.y, this.size.x / 2 + 5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fill();
            }
        }
    }
}

// === MÓDULO: PROJÉTEIS ===
class Projectile extends Entity {
    constructor(x, y, velX, velY, damage, damageFalloff, penetration, knockback, 
                critChance, critMultiplier, size, color, noise) {
        super(x, y);
        this.vel.set(velX, velY);
        this.damage = damage;
        this.damageFalloff = damageFalloff;
        this.penetration = penetration;
        this.knockback = knockback;
        this.critChance = critChance;
        this.critMultiplier = critMultiplier;
        this.size.set(size, size);
        this.color = color;
        this.noise = noise;
        this.lifetime = CONFIG.PHYSICS.PROJECTILE_LIFETIME;
        this.spawnTime = Date.now();
        this.trailParticles = [];
        this.hasHit = false;
    }
    
    update(dt) {
        super.update(dt);
        
        if (Date.now() - this.spawnTime > this.lifetime) {
            this.active = false;
        }
        
        if (Math.random() < 0.3) {
            const trail = new Particle(
                this.pos.x,
                this.pos.y,
                this.vel.x * -0.2,
                this.vel.y * -0.2,
                this.color,
                1,
                0.5
            );
            this.trailParticles.push(trail);
            Game.addEntity(trail);
        }
        
        if (this.trailParticles.length > 10) {
            const oldTrail = this.trailParticles.shift();
            oldTrail.active = false;
        }
    }
    
    onCollision(other) {
        if (this.hasHit) return;
        
        if (other instanceof Enemy) {
            const isCrit = Math.random() < this.critChance;
            const damage = isCrit ? this.damage * this.critMultiplier : this.damage;
            
            const distance = this.pos.distanceTo(Game.player.pos);
            const falloff = 1 - (distance * this.damageFalloff / 100);
            const finalDamage = Math.max(1, damage * falloff);
            
            other.takeDamage(finalDamage, isCrit);
            
            if (this.knockback > 0) {
                const knockbackForce = this.vel.copy().normalize().scale(this.knockback);
                other.vel.add(knockbackForce);
            }
            
            if (isCrit) {
                UI.showFloatingText("CRÍTICO!", other.pos.x, other.pos.y, '#ffcc00');
            }
            
            this.penetration--;
            if (this.penetration <= 0) {
                this.hasHit = true;
                this.active = false;
            }
        } else if (other instanceof Wall) {
            this.active = false;
            
            for (let i = 0; i < 5; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 30 + 20;
                const particle = new Particle(
                    this.pos.x,
                    this.pos.y,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed,
                    this.color,
                    0.7,
                    0.5
                );
                Game.addEntity(particle);
            }
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size.x / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// === MÓDULO: INIMIGOS ===
class Enemy extends Entity {
    constructor(x, y, type) {
        super(x, y);
        this.type = type;
        this.config = CONFIG.ENEMY.TYPES[type];
        this.hp = this.config.HP;
        this.maxHp = this.config.HP;
        this.speed = this.config.SPEED;
        this.size.set(this.config.SIZE, this.config.SIZE);
        this.color = this.config.COLOR;
        this.aiState = 'PATROL';
        this.lastPlayerSighting = null;
        this.lastNoiseHeard = null;
        this.lastDecisionTime = 0;
        this.decisionInterval = 1000;
        this.targetPos = new Vec2(x, y);
        this.path = [];
        this.currentPathIndex = 0;
        this.coverSpot = null;
        this.lastShotTime = 0;
        this.reloadCooldown = 0;
        this.stunTime = 0;
        
        this.weapon = {
            name: this.config.WEAPON,
            damage: this.config.DAMAGE,
            fireRate: this.config.FIRE_RATE,
            projectileSpeed: 600,
            magSize: 30,
            magAmmo: 30,
            maxAmmo: 90,
            totalAmmo: 60,
            reloadTime: 2000,
            lastShotTime: 0,
            isReloading: false
        };
    }
    
    update(dt) {
        super.update(dt);
        
        if (Date.now() - this.lastDecisionTime > this.decisionInterval) {
            this.makeDecision();
            this.lastDecisionTime = Date.now();
        }
        
        this.executeBehavior(dt);
        
        if (this.reloadCooldown > 0) {
            this.reloadCooldown -= dt * 1000;
        }
        
        if (this.stunTime > 0) {
            this.stunTime -= dt * 1000;
            return;
        }
    }
    
    makeDecision() {
        const player = Game.player;
        const playerPos = player.pos;
        const playerVisible = this.canSeePlayer();
        const playerInRange = this.pos.distanceTo(playerPos) <= this.config.ATTACK_RANGE;
        const lowAmmo = this.weapon.magAmmo <= this.weapon.magSize * 0.2;
        const lowHealth = this.hp <= this.maxHp * 0.3;
        
        if (playerVisible) {
            this.lastPlayerSighting = playerPos.copy();
            
            if (lowHealth) {
                this.aiState = 'RETREAT';
            } else if (lowAmmo && this.reloadCooldown <= 0) {
                this.aiState = 'RELOAD';
            } else if (playerInRange) {
                this.aiState = 'ATTACK';
            } else {
                this.aiState = 'CHASE';
            }
        } else if (this.lastPlayerSighting) {
            if (this.pos.distanceTo(this.lastPlayerSighting) < 20) {
                this.lastPlayerSighting = null;
                this.aiState = 'PATROL';
            } else {
                this.aiState = 'INVESTIGATE';
            }
        } else if (this.lastNoiseHeard) {
            if (this.pos.distanceTo(this.lastNoiseHeard) < 20) {
                this.lastNoiseHeard = null;
                this.aiState = 'PATROL';
            } else {
                this.aiState = 'INVESTIGATE_NOISE';
            }
        } else {
            this.aiState = 'PATROL';
        }
    }
    
    executeBehavior(dt) {
        const player = Game.player;
        
        switch (this.aiState) {
            case 'PATROL':
                if (this.path.length === 0 || this.currentPathIndex >= this.path.length) {
                    this.findRandomDestination();
                }
                this.followPath(dt);
                break;
                
            case 'CHASE': {
                const desiredDistance = this.config.ATTACK_RANGE * 0.8;
                const toPlayer = new Vec2(
                    player.pos.x - this.pos.x,
                    player.pos.y - this.pos.y
                );
                const distance = toPlayer.length();
                
                if (distance > desiredDistance) {
                    toPlayer.normalize();
                    this.acc.x = toPlayer.x * this.speed;
                    this.acc.y = toPlayer.y * this.speed;
                } else if (distance < desiredDistance * 0.7) {
                    toPlayer.normalize().scale(-1);
                    this.acc.x = toPlayer.x * this.speed;
                    this.acc.y = toPlayer.y * this.speed;
                }
                
                if (Math.random() < 0.1) {
                    const flankDirection = Math.random() < 0.5 ? 1 : -1;
                    const flankVector = new Vec2(-toPlayer.y, toPlayer.x).scale(flankDirection);
                    this.acc.add(flankVector.normalize().scale(this.speed * 0.5));
                }
                break;
            }
                
            case 'ATTACK':
                this.vel.scale(0.8);
                
                if (Date.now() - this.lastShotTime > 1000 / this.weapon.fireRate) {
                    this.shootAtPlayer();
                    this.lastShotTime = Date.now();
                }
                
                if (Math.random() < 0.05) {
                    const evadeAngle = Math.random() * Math.PI * 2;
                    this.acc.x = Math.cos(evadeAngle) * this.speed * 0.5;
                    this.acc.y = Math.sin(evadeAngle) * this.speed * 0.5;
                }
                break;
                
            case 'INVESTIGATE':
                if (!this.lastPlayerSighting) return;
                
                if (this.pos.distanceTo(this.lastPlayerSighting) < 20) {
                    this.findCover();
                } else {
                    const direction = new Vec2(
                        this.lastPlayerSighting.x - this.pos.x,
                        this.lastPlayerSighting.y - this.pos.y
                    ).normalize();
                    
                    this.acc.x = direction.x * this.speed;
                    this.acc.y = direction.y * this.speed;
                }
                break;
                
            case 'INVESTIGATE_NOISE':
                if (!this.lastNoiseHeard) return;
                
                if (this.pos.distanceTo(this.lastNoiseHeard) < 20) {
                    this.lastNoiseHeard = null;
                    this.aiState = 'PATROL';
                } else {
                    const direction = new Vec2(
                        this.lastNoiseHeard.x - this.pos.x,
                        this.lastNoiseHeard.y - this.pos.y
                    ).normalize();
                    
                    this.acc.x = direction.x * this.speed;
                    this.acc.y = direction.y * this.speed;
                }
                break;
                
            case 'RELOAD':
                this.vel.scale(0.5);
                
                if (this.weapon.magAmmo < this.weapon.magSize && this.weapon.totalAmmo > 0) {
                    if (!this.weapon.isReloading) {
                        this.weapon.isReloading = true;
                        setTimeout(() => {
                            const ammoNeeded = this.weapon.magSize - this.weapon.magAmmo;
                            const ammoToAdd = Math.min(ammoNeeded, this.weapon.totalAmmo);
                            this.weapon.magAmmo += ammoToAdd;
                            this.weapon.totalAmmo -= ammoToAdd;
                            this.weapon.isReloading = false;
                            this.reloadCooldown = 5000;
                            this.aiState = 'ATTACK';
                        }, this.weapon.reloadTime);
                    }
                } else {
                    this.reloadCooldown = 5000;
                    this.aiState = 'ATTACK';
                }
                break;
                
            case 'RETREAT':
                if (!this.coverSpot) {
                    this.findCover();
                }
                
                if (this.coverSpot) {
                    const toCover = new Vec2(
                        this.coverSpot.x - this.pos.x,
                        this.coverSpot.y - this.pos.y
                    );
                    
                    if (toCover.length() < 20) {
                        this.vel.scale(0);
                    } else {
                        toCover.normalize();
                        this.acc.x = toCover.x * this.speed;
                        this.acc.y = toCover.y * this.speed;
                    }
                }
                
                if (this.weapon.magAmmo < this.weapon.magSize * 0.3 && this.weapon.totalAmmo > 0) {
                    if (!this.weapon.isReloading) {
                        this.weapon.isReloading = true;
                        setTimeout(() => {
                            const ammoNeeded = this.weapon.magSize - this.weapon.magAmmo;
                            const ammoToAdd = Math.min(ammoNeeded, this.weapon.totalAmmo);
                            this.weapon.magAmmo += ammoToAdd;
                            this.weapon.totalAmmo -= ammoToAdd;
                            this.weapon.isReloading = false;
                        }, this.weapon.reloadTime);
                    }
                }
                break;
        }
    }
    
    findRandomDestination() {
        const world = Game.world;
        const padding = 100;
        
        this.targetPos.set(
            Mathx.randomRange(padding, world.width - padding),
            Mathx.randomRange(padding, world.height - padding)
        );
        
        this.findPathTo(this.targetPos);
    }
    
    findPathTo(targetPos) {
        // Implementação simplificada - em um jogo real usaria A*
        this.path = [targetPos.copy()];
        this.currentPathIndex = 0;
    }
    
    followPath(dt) {
        if (this.path.length === 0 || this.currentPathIndex >= this.path.length) return;
        
        const currentTarget = this.path[this.currentPathIndex];
        const toTarget = new Vec2(
            currentTarget.x - this.pos.x,
            currentTarget.y - this.pos.y
        );
        
        if (toTarget.length() < 20) {
            this.currentPathIndex++;
        } else {
            toTarget.normalize();
            this.acc.x = toTarget.x * this.speed;
            this.acc.y = toTarget.y * this.speed;
        }
    }
    
    findCover() {
        const coverSpots = Game.world.getCoverSpots();
        
        if (coverSpots.length > 0) {
            let bestSpot = null;
            let bestScore = -Infinity;
            
            const playerPos = Game.player.pos;
            
            for (const spot of coverSpots) {
                const toPlayer = new Vec2(
                    playerPos.x - spot.x,
                    playerPos.y - spot.y
                );
                const toEnemy = new Vec2(
                    this.pos.x - spot.x,
                    this.pos.y - spot.y
                );
                
                const angle = Math.abs(Mathx.angleDiff(
                    toPlayer.angleTo(spot),
                    toEnemy.angleTo(spot)
                ));
                
                const score = angle - toEnemy.length() * 0.01;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestSpot = spot;
                }
            }
            
            this.coverSpot = bestSpot;
            if (this.coverSpot) {
                this.findPathTo(this.coverSpot);
            }
        }
    }
    
    canSeePlayer() {
        const player = Game.player;
        const playerPos = player.pos;
        const toPlayer = new Vec2(
            playerPos.x - this.pos.x,
            playerPos.y - this.pos.y
        );
        const distance = toPlayer.length();
        
        if (distance > this.config.VISION_RANGE) return false;
        
        const angle = toPlayer.angleTo(this.pos);
        const facingAngle = this.rotation;
        const angleDiff = Math.abs(Mathx.angleDiff(facingAngle, angle));
        
        if (angleDiff > this.config.VISION_ANGLE / 2) return false;
        
        const steps = Math.floor(distance / 10);
        let visible = true;
        
        for (let i = 1; i <= steps; i++) {
            const checkX = this.pos.x + (toPlayer.x * i / steps);
            const checkY = this.pos.y + (toPlayer.y * i / steps);
            
            if (Game.world.isWall(checkX, checkY)) {
                visible = false;
                break;
            }
        }
        
        return visible;
    }
    
    hearNoise(noisePos, loudness) {
        const distance = this.pos.distanceTo(noisePos);
        if (distance <= this.config.HEARING_RANGE * loudness) {
            this.lastNoiseHeard = noisePos.copy();
            this.makeDecision();
        }
    }
    
    shootAtPlayer() {
        if (this.weapon.magAmmo <= 0) {
            if (this.weapon.totalAmmo > 0 && !this.weapon.isReloading) {
                this.weapon.isReloading = true;
                setTimeout(() => {
                    const ammoNeeded = this.weapon.magSize - this.weapon.magAmmo;
                    const ammoToAdd = Math.min(ammoNeeded, this.weapon.totalAmmo);
                    this.weapon.magAmmo += ammoToAdd;
                    this.weapon.totalAmmo -= ammoToAdd;
                    this.weapon.isReloading = false;
                }, this.weapon.reloadTime);
            }
            return;
        }
        
        const playerPos = Game.player.pos;
        const spreadAngle = Math.random() * this.weapon.spread * Math.PI / 180;
        const angle = Math.atan2(playerPos.y - this.pos.y, playerPos.x - this.pos.x) + spreadAngle;
        
        const projectile = new Projectile(
            this.pos.x,
            this.pos.y,
            Math.cos(angle) * this.weapon.projectileSpeed,
            Math.sin(angle) * this.weapon.projectileSpeed,
            this.weapon.damage,
            0.1, // damageFalloff
            0, // penetration
            2, // knockback
            0.05, // critChance
            1.5, // critMultiplier
            4, // size
            this.color, // color
            30 // noise
        );
        
        Game.addEntity(projectile);
        
        const flash = new MuzzleFlash(
            this.pos.x,
            this.pos.y,
            angle,
            8,
            30
        );
        Game.addEntity(flash);
        
        Audio.playGunshot();
        
        this.weapon.magAmmo--;
        this.lastShotTime = Date.now();
    }
    
    takeDamage(amount, isCrit = false) {
        this.hp -= amount;
        
        UI.showFloatingText(Math.floor(amount), this.pos.x, this.pos.y, isCrit ? '#ff0000' : '#ff6666');
        
        if (this.hp <= 0) {
            this.die();
        } else {
            this.stunTime = 200;
            this.vel.scale(0.5);
            this.alertNearbyEnemies();
        }
    }
    
    die() {
        this.active = false;
        Game.player.addKill();
        
        if (Math.random() < 0.3) {
            const pickupType = Math.random() < 0.7 ? 'AMMO' : 'HEALTH';
            const pickup = new Pickup(
                this.pos.x,
                this.pos.y,
                pickupType,
                pickupType === 'AMMO' ? this.weapon.name : null
            );
            Game.addEntity(pickup);
        }
        
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 50 + 50;
            const particle = new Particle(
                this.pos.x,
                this.pos.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                this.color,
                1,
                1
            );
            Game.addEntity(particle);
        }
    }
    
    alertNearbyEnemies() {
        const alertRadius = this.config.HEARING_RANGE * 1.5;
        
        for (const entity of Physics.entities) {
            if (entity instanceof Enemy && entity !== this) {
                const distance = this.pos.distanceTo(entity.pos);
                if (distance <= alertRadius) {
                    entity.lastPlayerSighting = Game.player.pos.copy();
                    entity.makeDecision();
                }
            }
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size.x / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.arc(this.size.x / 3, 0, this.size.x / 4, 0, Math.PI * 2);
        ctx.fill();
        
        if (this.hp < this.maxHp) {
            const healthPercent = this.hp / this.maxHp;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(-this.size.x / 2, -this.size.y / 2 - 8, this.size.x * healthPercent, 3);
        }
        
        ctx.restore();
    }
}

// === MÓDULO: PAREDES ===
class Wall extends Entity {
    constructor(x, y, width, height) {
        super(x, y);
        this.size.set(width, height);
        this.collidable = true;
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        
        ctx.fillStyle = CONFIG.WORLD.WALL_COLOR;
        ctx.fillRect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        
        ctx.restore();
    }
}

// === MÓDULO: ITENS COLETÁVEIS ===
class Pickup extends Entity {
    constructor(x, y, type, weaponType = null) {
        super(x, y);
        this.type = type;
        this.weaponType = weaponType;
        this.size.set(15, 15);
        this.lifetime = 30000;
        this.spawnTime = Date.now();
        
        switch (type) {
            case 'HEALTH':
                this.color = '#00ff00';
                this.amount = 25;
                break;
                
            case 'AMMO':
                this.color = '#ffff00';
                this.amount = weaponType === 'PISTOL' ? 12 : 30;
                break;
                
            case 'COIN':
                this.color = '#ffcc00';
                this.amount = Mathx.randomInt(1, 5);
                break;
        }
    }
    
    update(dt) {
        if (Date.now() - this.spawnTime > this.lifetime) {
            this.active = false;
        }
        
        const player = Game.player;
        if (player && Mathx.circleCircleCollision(
            this.pos.x, this.pos.y, this.size.x / 2,
            player.pos.x, player.pos.y, player.size.x / 2
        )) {
            this.pickup(player);
        }
    }
    
    pickup(player) {
        this.active = false;
        
        switch (this.type) {
            case 'HEALTH':
                player.hp = Math.min(player.maxHp, player.hp + this.amount);
                UI.showMessage(`+${this.amount} Vida`, '#00ff00');
                Audio.playPickup();
                break;
                
            case 'AMMO':
                const weapon = player.weapons.find(w => w.name === this.weaponType);
                if (weapon) {
                    weapon.addAmmo(this.amount);
                    UI.showMessage(`+${this.amount} Munição`, '#ffff00');
                    Audio.playPickup();
                }
                break;
                
            case 'COIN':
                player.addCoins(this.amount);
                break;
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        
        const pulse = Math.sin(Date.now() / 300) * 0.2 + 1;
        ctx.scale(pulse, pulse);
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        switch (this.type) {
            case 'HEALTH':
                ctx.fillRect(-5, -2, 10, 4);
                ctx.fillRect(-2, -5, 4, 10);
                break;
                
            case 'AMMO':
                ctx.fillRect(-6, -3, 12, 6);
                ctx.fillRect(-4, -5, 8, 2);
                break;
                
            case 'COIN':
                ctx.arc(0, 0, 7, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(0, 0, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(0, 0, 3, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
        
        ctx.restore();
    }
}

// === MÓDULO: PARTÍCULAS ===
class Particle extends Entity {
    constructor(x, y, velX, velY, color, lifetime, size) {
        super(x, y);
        this.vel.set(velX, velY);
        this.color = color;
        this.lifetime = lifetime * 1000;
        this.size.set(size, size);
        this.spawnTime = Date.now();
        this.fadeTime = this.lifetime * 0.3;
    }
    
    update(dt) {
        super.update(dt);
        
        if (Date.now() - this.spawnTime > this.lifetime) {
            this.active = false;
        }
    }
    
    render(ctx) {
        const elapsed = Date.now() - this.spawnTime;
        const alpha = elapsed < this.lifetime - this.fadeTime ? 1 : 
                    1 - (elapsed - (this.lifetime - this.fadeTime)) / this.fadeTime;
        
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        
        ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.beginPath();
        ctx.arc(0, 0, this.size.x / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class MuzzleFlash extends Particle {
    constructor(x, y, angle, size, duration) {
        super(x, y, 0, 0, '#ffffff', duration / 1000, size);
        this.angle = angle;
    }
    
    render(ctx) {
        const elapsed = Date.now() - this.spawnTime;
        const progress = elapsed / this.lifetime;
        const currentSize = this.size.x * (1 - progress);
        
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle);
        
        ctx.fillStyle = `rgba(255, 255, 255, ${1 - progress})`;
        ctx.fillRect(0, -currentSize / 4, currentSize, currentSize / 2);
        
        ctx.fillStyle = `rgba(255, 200, 100, ${(1 - progress) * 0.5})`;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class StasisField extends Entity {
    constructor(x, y, radius, duration) {
        super(x, y);
        this.radius = radius;
        this.duration = duration;
        this.spawnTime = Date.now();
        this.particles = [];
    }
    
    update(dt) {
        if (Math.random() < 0.3) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * this.radius;
            const particle = new Particle(
                this.pos.x + Math.cos(angle) * dist,
                this.pos.y + Math.sin(angle) * dist,
                0, 0,
                '#55aaff',
                1,
                2
            );
            this.particles.push(particle);
            Game.addEntity(particle);
        }
        
        if (Date.now() - this.spawnTime > this.duration) {
            this.active = false;
            for (const particle of this.particles) {
                particle.active = false;
            }
        }
    }
    
    render(ctx) {
        const elapsed = Date.now() - this.spawnTime;
        const progress = elapsed / this.duration;
        const alpha = 0.3 * (1 - progress * 0.5);
        
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(85, 170, 255, ${alpha})`;
        ctx.fill();
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
}

// === MÓDULO: MUNDO ===
class World {
    constructor() {
        this.width = CONFIG.WORLD.WIDTH;
        this.height = CONFIG.WORLD.HEIGHT;
        this.tileSize = CONFIG.WORLD.TILE_SIZE;
        this.walls = [];
        this.coverSpots = [];
        this.spawnPoints = [];
        this.objectivePos = null;
        
        this.generate();
    }
    
    generate() {
        this.walls = [];
        this.coverSpots = [];
        this.spawnPoints = [];
        
        const thickness = 50;
        this.walls.push(new Wall(thickness / 2, this.height / 2, thickness, this.height));
        this.walls.push(new Wall(this.width - thickness / 2, this.height / 2, thickness, this.height));
        this.walls.push(new Wall(this.width / 2, thickness / 2, this.width, thickness));
        this.walls.push(new Wall(this.width / 2, this.height - thickness / 2, this.width, thickness));
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        this.walls.push(new Wall(centerX, centerY - 200, 400, 30));
        this.walls.push(new Wall(centerX - 150, centerY, 30, 300));
        this.walls.push(new Wall(centerX + 150, centerY + 100, 30, 200));
        
        this.coverSpots.push(new Vec2(centerX - 250, centerY - 100));
        this.coverSpots.push(new Vec2(centerX + 250, centerY - 100));
        this.coverSpots.push(new Vec2(centerX - 100, centerY + 150));
        this.coverSpots.push(new Vec2(centerX + 100, centerY + 150));
        
        this.spawnPoints.push(new Vec2(100, 100));
        this.spawnPoints.push(new Vec2(this.width - 100, 100));
        this.spawnPoints.push(new Vec2(this.width - 100, this.height - 100));
        this.spawnPoints.push(new Vec2(100, this.height - 100));
        
        this.objectivePos = new Vec2(centerX, centerY + 50);
    }
    
    getCoverSpots() {
        return this.coverSpots;
    }
    
    getRandomSpawnPoint() {
        return this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)].copy();
    }
    
    isWall(x, y) {
        for (const wall of this.walls) {
            const bounds = wall.getCollisionBounds();
            if (x >= bounds.x && x <= bounds.x + bounds.width &&
                y >= bounds.y && y <= bounds.y + bounds.height) {
                return true;
            }
        }
        return false;
    }
    
    render(ctx) {
        ctx.fillStyle = CONFIG.WORLD.FLOOR_COLOR;
        ctx.fillRect(0, 0, this.width, this.height);
        
        for (const wall of this.walls) {
            wall.render(ctx);
        }
        
        if (this.objectivePos) {
            ctx.save();
            ctx.translate(this.objectivePos.x, this.objectivePos.y);
            
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(0, 0, 30, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 30, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.restore();
        }
        
        if (CONFIG.DEBUG) {
            for (const spot of this.coverSpots) {
                ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(spot.x, spot.y, 10, 0, Math.PI * 2);
                ctx.fill();
            }
            
            for (const spawn of this.spawnPoints) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.beginPath();
                ctx.arc(spawn.x, spawn.y, 10, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// === MÓDULO: FÍSICA ===
const Physics = {
    entities: [],
    quadTree: null,
    
    init() {
        this.quadTree = new Quadtree({
            x: 0,
            y: 0,
            width: CONFIG.WORLD.WIDTH,
            height: CONFIG.WORLD.HEIGHT
        });
    },
    
    update(dt) {
        for (const entity of this.entities) {
            if (entity.updatePhysics) {
                entity.updatePhysics(dt);
            }
        }
        
        this.checkCollisions();
    },
    
    addEntity(entity) {
        this.entities.push(entity);
    },
    
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
        }
    },
    
    checkCollisions() {
        this.quadTree.clear();
        
        for (const entity of this.entities) {
            if (entity.getCollisionBounds) {
                const bounds = entity.getCollisionBounds();
                this.quadTree.insert({
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width,
                    height: bounds.height,
                    entity: entity
                });
            }
        }
        
        for (const entity of this.entities) {
            if (entity.onCollision && entity.getCollisionBounds) {
                const bounds = entity.getCollisionBounds();
                const candidates = this.quadTree.retrieve({
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width,
                    height: bounds.height
                });
                
                for (const candidate of candidates) {
                    if (candidate.entity !== entity && 
                        this.checkAABBCollision(bounds, candidate)) {
                        entity.onCollision(candidate.entity);
                    }
                }
            }
        }
    },
    
    checkAABBCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    },
    
    checkCircleCollision(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < r1 + r2;
    }
};

class Quadtree {
    constructor(bounds, maxObjects = 10, maxLevels = 4, level = 0) {
        this.bounds = bounds;
        this.maxObjects = maxObjects;
        this.maxLevels = maxLevels;
        this.level = level;
        this.objects = [];
        this.nodes = [];
    }
    
    split() {
        const nextLevel = this.level + 1;
        const subWidth = this.bounds.width / 2;
        const subHeight = this.bounds.height / 2;
        const x = this.bounds.x;
        const y = this.bounds.y;
        
        this.nodes[0] = new Quadtree({
            x: x + subWidth,
            y: y,
            width: subWidth,
            height: subHeight
        }, this.maxObjects, this.maxLevels, nextLevel);
        
        this.nodes[1] = new Quadtree({
            x: x,
            y: y,
            width: subWidth,
            height: subHeight
        }, this.maxObjects, this.maxLevels, nextLevel);
        
        this.nodes[2] = new Quadtree({
            x: x,
            y: y + subHeight,
            width: subWidth,
            height: subHeight
        }, this.maxObjects, this.maxLevels, nextLevel);
        
        this.nodes[3] = new Quadtree({
            x: x + subWidth,
            y: y + subHeight,
            width: subWidth,
            height: subHeight
        }, this.maxObjects, this.maxLevels, nextLevel);
    }
    
    getIndex(rect) {
        let index = -1;
        const verticalMidpoint = this.bounds.x + (this.bounds.width / 2);
        const horizontalMidpoint = this.bounds.y + (this.bounds.height / 2);
        
        const topQuadrant = rect.y < horizontalMidpoint && rect.y + rect.height < horizontalMidpoint;
        const bottomQuadrant = rect.y > horizontalMidpoint;
        
        if (rect.x < verticalMidpoint && rect.x + rect.width < verticalMidpoint) {
            if (topQuadrant) {
                index = 1;
            } else if (bottomQuadrant) {
                index = 2;
            }
        } else if (rect.x > verticalMidpoint) {
            if (topQuadrant) {
                index = 0;
            } else if (bottomQuadrant) {
                index = 3;
            }
        }
        
        return index;
    }
    
    insert(rect) {
        if (this.nodes.length) {
            const index = this.getIndex(rect);
            
            if (index !== -1) {
                this.nodes[index].insert(rect);
                return;
            }
        }
        
        this.objects.push(rect);
        
        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            if (!this.nodes.length) {
                this.split();
            }
            
            let i = 0;
            while (i < this.objects.length) {
                const index = this.getIndex(this.objects[i]);
                if (index !== -1) {
                    this.nodes[index].insert(this.objects.splice(i, 1)[0]);
                } else {
                    i++;
                }
            }
        }
    }
    
    retrieve(rect) {
        let returnObjects = this.objects;
        
        if (this.nodes.length) {
            const index = this.getIndex(rect);
            
            if (index !== -1) {
                returnObjects = returnObjects.concat(this.nodes[index].retrieve(rect));
            } else {
                for (const node of this.nodes) {
                    returnObjects = returnObjects.concat(node.retrieve(rect));
                }
            }
        }
        
        return returnObjects;
    }
    
    clear() {
        this.objects = [];
        
        for (const node of this.nodes) {
            node.clear();
        }
    }
}

// === MÓDULO: CÂMERA ===
class Camera {
    constructor() {
        this.pos = new Vec2(0, 0);
        this.target = new Vec2(0, 0);
        this.zoom = 1;
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeStartTime = 0;
    }
    
    follow(target) {
        this.target = target;
    }
    
    update(dt) {
        this.pos.lerp(this.target.pos, 0.1);
        
        if (this.shakeDuration > 0) {
            const elapsed = Date.now() - this.shakeStartTime;
            const progress = elapsed / this.shakeDuration;
            
            if (progress >= 1) {
                this.shakeDuration = 0;
                this.shakeIntensity = 0;
            } else {
                const currentIntensity = this.shakeIntensity * (1 - progress);
                this.pos.x += (Math.random() - 0.5) * currentIntensity * 2;
                this.pos.y += (Math.random() - 0.5) * currentIntensity * 2;
            }
        }
    }
    
    shake(intensity, duration = 500) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeStartTime = Date.now();
    }
    
    applyTransform(ctx) {
        const canvas = Game.canvas;
        
        ctx.setTransform(
            this.zoom, 0, 0, this.zoom,
            canvas.width / 2 - this.pos.x * this.zoom,
            canvas.height / 2 - this.pos.y * this.zoom
        );
    }
    
    worldToScreen(worldX, worldY) {
        const canvas = Game.canvas;
        return {
            x: (worldX - this.pos.x) * this.zoom + canvas.width / 2,
            y: (worldY - this.pos.y) * this.zoom + canvas.height / 2
        };
    }
    
    screenToWorld(screenX, screenY) {
        const canvas = Game.canvas;
        return {
            x: (screenX - canvas.width / 2) / this.zoom + this.pos.x,
            y: (screenY - canvas.height / 2) / this.zoom + this.pos.y
        };
    }
}

// === MÓDULO: INPUT ===
const Input = {
    keys: {},
    mouse: { x: 0, y: 0, buttons: [false, false, false] },
    prevMouseButtons: [false, false, false],
    
    init() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toUpperCase()] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toUpperCase()] = false;
        });
        
        window.addEventListener('mousemove', (e) => {
            const rect = Game.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        window.addEventListener('mousedown', (e) => {
            if (e.button >= 0 && e.button < 3) {
                this.mouse.buttons[e.button] = true;
            }
        });
        
        window.addEventListener('mouseup', (e) => {
            if (e.button >= 0 && e.button < 3) {
                this.mouse.buttons[e.button] = false;
            }
        });
        
        window.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const rect = Game.canvas.getBoundingClientRect();
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
            this.mouse.buttons[0] = true;
            e.preventDefault();
        });
        
        window.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const rect = Game.canvas.getBoundingClientRect();
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
            e.preventDefault();
        });
        
        window.addEventListener('touchend', () => {
            this.mouse.buttons[0] = false;
        });
    },
    
    isKeyDown(key) {
        return this.keys[key.toUpperCase()] || false;
    },
    
    isMouseDown(button = 0) {
        return this.mouse.buttons[button] || false;
    },
    
    isMousePressed(button = 0) {
        return this.mouse.buttons[button] && !this.prevMouseButtons[button];
    },
    
    isMouseReleased(button = 0) {
        return !this.mouse.buttons[button] && this.prevMouseButtons[button];
    },
    
    update() {
        this.prevMouseButtons = [...this.mouse.buttons];
    },
    
    getMouseWorldPos() {
        return new Vec2(
            this.mouse.x / Game.camera.zoom + Game.camera.pos.x - Game.canvas.width / 2 / Game.camera.zoom,
            this.mouse.y / Game.camera.zoom + Game.camera.pos.y - Game.canvas.height / 2 / Game.camera.zoom
        );
    }
};

// === MÓDULO: ÁUDIO ===
const Audio = {
    ctx: null,
    masterGain: null,
    
    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = CONFIG.AUDIO.VOLUME;
            this.masterGain.connect(this.ctx.destination);
        } catch (e) {
            console.warn("Web Audio API não suportada:", e);
        }
    },
    
    playTone(freq, duration, type = 'sine', volume = 1) {
        if (!this.ctx) return;
        
        const now = this.ctx.currentTime;
        const oscillator = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        
        oscillator.type = type;
        oscillator.frequency.value = freq;
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
    },
    
    playGunshot() {
        this.playTone(
            CONFIG.AUDIO.GUNSHOT_FREQ,
            CONFIG.AUDIO.GUNSHOT_DURATION,
            'square'
        );
    },
    
    playReload() {
        const now = this.ctx.currentTime;
        CONFIG.AUDIO.RELOAD_FREQ.forEach((freq, i) => {
            this.playTone(
                freq,
                CONFIG.AUDIO.RELOAD_DURATION,
                'sine',
                0.5
            );
        });
    },
    
    playHit() {
        this.playTone(
            CONFIG.AUDIO.HIT_FREQ,
            CONFIG.AUDIO.HIT_DURATION,
            'sawtooth'
        );
    },
    
    playPickup() {
        this.playTone(
            CONFIG.AUDIO.PICKUP_FREQ,
            CONFIG.AUDIO.PICKUP_DURATION,
            'sine'
        );
    },
    
    playDash() {
        this.playTone(
            CONFIG.AUDIO.DASH_FREQ,
            CONFIG.AUDIO.DASH_DURATION,
            'sine'
        );
    },
    
    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Mathx.clamp(volume, 0, 1);
        }
    }
};

// === MÓDULO: UI ===
const UI = {
    init() {
        this.crosshair = document.getElementById('crosshair');
        this.hpText = document.getElementById('hp-text');
        this.hpBar = document.getElementById('hp-bar');
        this.shieldBar = document.getElementById('shield-bar');
        this.weaponName = document.getElementById('weapon-name');
        this.ammoCount = document.getElementById('ammo-count');
        this.messageDisplay = document.getElementById('message-display');
        this.minimap = document.getElementById('minimap');
        
        this.minimapCtx = this.minimap.getContext('2d');
        this.minimap.width = this.minimap.clientWidth;
        this.minimap.height = this.minimap.clientHeight;
        
        document.querySelectorAll('.weapon-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                const index = parseInt(slot.dataset.slot) - 1;
                Game.player.switchWeapon(index);
            });
        });
        
        document.getElementById('power1').addEventListener('click', () => {
            Game.player.dash();
        });
        
        document.getElementById('power2').addEventListener('click', () => {
            Game.player.activateStasis();
        });
    },
    
    update(dt) {
        const mousePos = Input.mouse;
        this.crosshair.style.left = `${mousePos.x - 10}px`;
        this.crosshair.style.top = `${mousePos.y - 10}px`;
        
        const player = Game.player;
        if (player) {
            const hpPercent = player.hp / player.maxHp;
            const shieldPercent = player.shield / player.maxShield;
            
            this.hpBar.style.width = `${hpPercent * 100}%`;
            this.shieldBar.style.width = `${shieldPercent * 100}%`;
            this.hpText.textContent = Math.floor(player.hp);
            
            if (player.currentWeapon) {
                this.weaponName.textContent = player.currentWeapon.name;
                this.ammoCount.textContent = `${player.currentWeapon.magAmmo}/${player.currentWeapon.totalAmmo}`;
                
                if (player.currentWeapon.magAmmo <= player.currentWeapon.magSize * 0.2) {
                    this.ammoCount.style.color = '#ff5555';
                } else {
                    this.ammoCount.style.color = CONFIG.UI.AMMO_COLOR;
                }
            }
            
            const dashCooldown = document.getElementById('power1');
            const dashPercent = player.dashCooldown / CONFIG.PLAYER.DASH_COOLDOWN;
            dashCooldown.style.background = `conic-gradient(#55aaff ${dashPercent * 100}%, transparent ${dashPercent * 100}%)`;
            
            const stasisCooldown = document.getElementById('power2');
            let stasisPercent;
            if (player.stasisActive) {
                stasisPercent = 1 - (player.stasisEndTime - Date.now()) / CONFIG.PLAYER.STASIS_DURATION;
            } else {
                stasisPercent = player.stasisCooldown / CONFIG.PLAYER.STASIS_COOLDOWN;
            }
            stasisCooldown.style.background = `conic-gradient(#5555ff ${stasisPercent * 100}%, transparent ${stasisPercent * 100}%)`;
        }
        
        this.updateMinimap();
    },
    
    updateMinimap() {
        const ctx = this.minimapCtx;
        const player = Game.player;
        if (!player) return;
        
        ctx.clearRect(0, 0, this.minimap.width, this.minimap.height);
        
        const scale = CONFIG.UI.MINIMAP_SCALE;
        const offsetX = this.minimap.width / 2 - player.pos.x * scale;
        const offsetY = this.minimap.height / 2 - player.pos.y * scale;
        
        ctx.fillStyle = CONFIG.WORLD.WALL_COLOR;
        for (const wall of Game.world.walls) {
            const bounds = wall.getCollisionBounds();
            ctx.fillRect(
                bounds.x * scale + offsetX,
                bounds.y * scale + offsetY,
                bounds.width * scale,
                bounds.height * scale
            );
        }
        
        ctx.fillStyle = CONFIG.UI.MINIMAP_PLAYER_COLOR;
        ctx.beginPath();
        ctx.arc(
            player.pos.x * scale + offsetX,
            player.pos.y * scale + offsetY,
            4, 0, Math.PI * 2
        );
        ctx.fill();
        
        ctx.fillStyle = CONFIG.UI.MINIMAP_ENEMY_COLOR;
        for (const entity of Physics.entities) {
            if (entity instanceof Enemy && entity.active) {
                ctx.beginPath();
                ctx.arc(
                    entity.pos.x * scale + offsetX,
                    entity.pos.y * scale + offsetY,
                    3, 0, Math.PI * 2
                );
                ctx.fill();
            }
        }
        
        ctx.fillStyle = CONFIG.UI.MINIMAP_PICKUP_COLOR;
        for (const entity of Physics.entities) {
            if (entity instanceof Pickup && entity.active) {
                ctx.beginPath();
                ctx.arc(
                    entity.pos.x * scale + offsetX,
                    entity.pos.y * scale + offsetY,
                    2, 0, Math.PI * 2
                );
                ctx.fill();
            }
        }
    },
    
    updateWeaponDisplay() {
        const player = Game.player;
        if (!player) return;
        
        document.querySelectorAll('.weapon-slot').forEach((slot, index) => {
            if (index === player.currentWeaponIndex) {
                slot.classList.add('active');
            } else {
                slot.classList.remove('active');
            }
            
            if (index < player.weapons.length) {
                slot.textContent = index + 1;
            } else {
                slot.textContent = '';
            }
        });
    },
    
    showMessage(text, color = '#ffffff') {
        this.messageDisplay.textContent = text;
        this.messageDisplay.style.color = color;
        this.messageDisplay.style.opacity = 1;
        
        setTimeout(() => {
            this.messageDisplay.style.opacity = 0;
        }, CONFIG.UI.MESSAGE_DURATION);
    },
    
    showFloatingText(text, x, y, color = '#ffffff') {
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = text;
        floatingText.style.color = color;
        floatingText.style.position = 'absolute';
        
        const screenPos = Game.camera.worldToScreen(x, y);
        floatingText.style.left = `${screenPos.x}px`;
        floatingText.style.top = `${screenPos.y}px`;
        
        document.getElementById('game-container').appendChild(floatingText);
        
        const duration = CONFIG.UI.DAMAGE_TEXT_DURATION;
        const speed = CONFIG.UI.DAMAGE_TEXT_SPEED;
        
        let startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                floatingText.remove();
                return;
            }
            
            floatingText.style.opacity = 1 - progress;
            floatingText.style.transform = `translateY(${-speed * progress}px)`;
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    },
    
    showMenu(menuId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        document.getElementById(menuId).classList.remove('hidden');
    },
    
    updateUpgradeScreen() {
        const player = Game.player;
        const choicesContainer = document.getElementById('upgrade-choices');
        choicesContainer.innerHTML = '';
        
        const upgrades = [
            {
                title: "Dano da Pistola +20%",
                cost: 100,
                description: "Aumenta o dano da pistola em 20%",
                apply: () => {
                    const pistol = player.weapons.find(w => w.name === "Pistola");
                    if (pistol) {
                        pistol.damage *= 1.2;
                    }
                }
            },
            {
                title: "Capacidade de Escudo +25%",
                cost: 150,
                description: "Aumenta o escudo máximo em 25%",
                apply: () => {
                    player.maxShield *= 1.25;
                    player.shield = player.maxShield;
                }
            },
            {
                title: "Recarga Rápida",
                cost: 120,
                description: "Reduz o tempo de recarga em 30%",
                apply: () => {
                    player.weapons.forEach(weapon => {
                        weapon.reloadTime *= 0.7;
                    });
                }
            }
        ];
        
        upgrades.forEach(upgrade => {
            const upgradeElement = document.createElement('div');
            upgradeElement.className = 'upgrade-item';
            upgradeElement.innerHTML = `
                <h3>${upgrade.title}</h3>
                <div class="cost">${upgrade.cost} Moedas</div>
                <div class="description">${upgrade.description}</div>
            `;
            
            upgradeElement.addEventListener('click', () => {
                if (player.coins >= upgrade.cost) {
                    player.coins -= upgrade.cost;
                    upgrade.apply();
                    UI.showMenu('level-up-screen');
                    UI.updateUpgradeScreen();
                } else {
                    UI.showMessage("Moedas insuficientes!", "#ff5555");
                }
            });
            
            choicesContainer.appendChild(upgradeElement);
        });
    }
};

// === MÓDULO: GAME ===
const Game = {
    canvas: null,
    ctx: null,
    camera: null,
    world: null,
    player: null,
    state: 'MENU',
    lastTime: 0,
    accumulatedTime: 0,
    frameCount: 0,
    fps: 0,
    currentLevel: 1,
    currentWave: 0,
    enemiesAlive: 0,
    spawnTimer: 0,
    lastFpsUpdate: 0,
    
    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.camera = new Camera();
        this.world = new World();
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        Input.init();
        Audio.init();
        UI.init();
        Physics.init();
        
        document.getElementById('start-game').addEventListener('click', () => {
            this.startNewGame();
        });
        
        document.getElementById('continue-game').addEventListener('click', () => {
            this.loadGame();
        });
        
        document.getElementById('resume-game').addEventListener('click', () => {
            this.setState('RUN');
        });
        
        document.getElementById('quit-to-menu').addEventListener('click', () => {
            this.setState('MENU');
        });
        
        document.getElementById('game-over-to-menu').addEventListener('click', () => {
            this.setState('MENU');
        });
        
        document.getElementById('next-level').addEventListener('click', () => {
            this.currentLevel++;
            this.startLevel();
        });
        
        document.getElementById('retry-level').addEventListener('click', () => {
            this.startLevel();
        });
        
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    },
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    
    setState(newState) {
        this.state = newState;
        
        switch (newState) {
            case 'MENU':
                UI.showMenu('menu-screen');
                break;
                
            case 'RUN':
                UI.showMenu('game-screen');
                break;
                
            case 'PAUSE':
                UI.showMenu('pause-screen');
                break;
                
            case 'GAME_OVER':
                UI.showMenu('game-over-screen');
                break;
                
            case 'LEVEL_UP':
                UI.updateUpgradeScreen();
                UI.showMenu('level-up-screen');
                break;
        }
    },
    
    startNewGame() {
        this.currentLevel = 1;
        this.player = new Player(this.world.width / 2, this.world.height / 2);
        this.camera.follow(this.player);
        this.startTutorial();
    },
    
    loadGame() {
        const saveData = localStorage.getItem('echo_strike_save');
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                this.currentLevel = data.level || 1;
                
                this.player = new Player(this.world.width / 2, this.world.height / 2);
                this.camera.follow(this.player);
                
                if (data.upgrades) {
                    // Aplicar upgrades...
                }
                
                this.player.coins = data.coins || 0;
                this.startLevel();
            } catch (e) {
                console.error("Erro ao carregar jogo:", e);
                this.startNewGame();
            }
        } else {
            this.startNewGame();
        }
    },
    
    saveGame() {
        const saveData = {
            level: this.currentLevel,
            coins: this.player.coins,
            upgrades: {
                // Salvar upgrades...
            }
        };
        localStorage.setItem('echo_strike_save', JSON.stringify(saveData));
    },
    
    startTutorial() {
        this.setState('TUTORIAL');
        
        document.getElementById('skip-tutorial').addEventListener('click', () => {
            this.startLevel();
        });
        
        document.getElementById('next-tutorial').addEventListener('click', () => {
            const tutorialContent = document.getElementById('tutorial-content');
            const currentStep = document.querySelector('.tutorial-step.active');
            const nextStep = currentStep.nextElementSibling;
            
            if (nextStep) {
                currentStep.classList.remove('active');
                nextStep.classList.add('active');
            } else {
                this.startLevel();
            }
        });
    },
    
    startLevel() {
        this.currentWave = 0;
        this.enemiesAlive = 0;
        this.spawnTimer = 0;
        
        Physics.entities = Physics.entities.filter(e => e === this.player);
        
        this.player.pos.set(this.world.width / 2, this.world.height / 2);
        this.player.hp = this.player.maxHp;
        this.player.shield = this.player.maxShield;
        
        this.setState('RUN');
        this.startNextWave();
    },
    
    startNextWave() {
        this.currentWave++;
        
        if (this.currentWave > CONFIG.ENEMY.WAVES_PER_LEVEL) {
            this.setState('LEVEL_UP');
            return;
        }
        
        UI.showMessage(`Onda ${this.currentWave}/${CONFIG.ENEMY.WAVES_PER_LEVEL}`, '#ffffff');
        
        this.enemiesAlive = Math.min(
            CONFIG.ENEMY.MAX_PER_WAVE,
            CONFIG.ENEMY.MAX_PER_WAVE * this.currentWave * 0.7
        );
        
        this.spawnTimer = CONFIG.ENEMY.SPAWN_RATE;
    },
    
    spawnEnemy() {
        if (this.enemiesAlive <= 0) return;
        
        const spawnPoint = this.world.getRandomSpawnPoint();
        const enemyTypes = Object.keys(CONFIG.ENEMY.TYPES);
        
        let typeIndex = Math.floor(Math.random() * enemyTypes.length);
        if (this.currentLevel > 2 && Math.random() < 0.3) {
            typeIndex = Math.min(enemyTypes.length - 1, typeIndex + 1);
        }
        
        const enemy = new Enemy(
            spawnPoint.x,
            spawnPoint.y,
            enemyTypes[typeIndex]
        );
        
        Game.addEntity(enemy);
        this.enemiesAlive--;
    },
    
    addEntity(entity) {
        Physics.addEntity(entity);
    },
    
    gameLoop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        const clampedDelta = Math.min(deltaTime, CONFIG.MAX_STEP);
        this.accumulatedTime += clampedDelta;
        
        this.frameCount++;
        if (currentTime - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
            
            if (CONFIG.DEBUG) {
                console.log(`FPS: ${this.fps}`);
            }
        }
        
        Input.update();
        
        switch (this.state) {
            case 'RUN':
                this.handleInput();
                
                while (this.accumulatedTime >= CONFIG.MAX_STEP) {
                    this.update(CONFIG.MAX_STEP);
                    this.accumulatedTime -= CONFIG.MAX_STEP;
                }
                
                if (this.spawnTimer > 0) {
                    this.spawnTimer -= clampedDelta * 1000;
                    if (this.spawnTimer <= 0) {
                        this.spawnEnemy();
                        this.spawnTimer = CONFIG.ENEMY.SPAWN_RATE;
                    }
                }
                break;
        }
        
        this.render();
        requestAnimationFrame((t) => this.gameLoop(t));
    },
    
    handleInput() {
        if (Input.isKeyDown('Escape')) {
            this.setState('PAUSE');
            return;
        }
        
        const player = this.player;
        if (!player) return;
        
        player.acc.set(0, 0);
        
        const moveSpeed = player.speed;
        if (Input.isKeyDown('W') || Input.isKeyDown('ArrowUp')) {
            player.acc.y -= moveSpeed;
        }
        if (Input.isKeyDown('S') || Input.isKeyDown('ArrowDown')) {
            player.acc.y += moveSpeed;
        }
        if (Input.isKeyDown('A') || Input.isKeyDown('ArrowLeft')) {
            player.acc.x -= moveSpeed;
        }
        if (Input.isKeyDown('D') || Input.isKeyDown('ArrowRight')) {
            player.acc.x += moveSpeed;
        }
        
        if (player.acc.x !== 0 && player.acc.y !== 0) {
            player.acc.scale(0.7071);
        }
        
        const mouseWorldPos = Input.getMouseWorldPos();
        player.rotation = Math.atan2(
            mouseWorldPos.y - player.pos.y,
            mouseWorldPos.x - player.pos.x
        );
        
        if (Input.isMouseDown(0)) {
            if (player.currentWeapon && player.currentWeapon.canShoot()) {
                const angle = Math.atan2(
                    mouseWorldPos.y - player.pos.y,
                    mouseWorldPos.x - player.pos.x
                );
                const spreadAngle = angle + (Math.random() - 0.5) * player.currentWeapon.spread * Math.PI / 180;
                
                const projectile = new Projectile(
                    player.pos.x,
                    player.pos.y,
                    Math.cos(spreadAngle) * player.currentWeapon.projectileSpeed,
                    Math.sin(spreadAngle) * player.currentWeapon.projectileSpeed,
                    player.currentWeapon.damage,
                    player.currentWeapon.damageFalloff,
                    player.currentWeapon.penetration,
                    player.currentWeapon.knockback,
                    player.currentWeapon.critChance,
                    player.currentWeapon.critMultiplier,
                    player.currentWeapon.projectileSize,
                    player.currentWeapon.projectileColor,
                    player.currentWeapon.noise
                );
                
                this.addEntity(projectile);
                
                const flash = new MuzzleFlash(
                    player.pos.x,
                    player.pos.y,
                    angle,
                    player.currentWeapon.muzzleFlashSize,
                    player.currentWeapon.muzzleFlashDuration
                );
                this.addEntity(flash);
                
                Audio.playGunshot();
                
                player.currentWeapon.magAmmo--;
                player.currentWeapon.lastShotTime = Date.now();
                player.currentWeapon.currentSpread = Math.min(
                    player.currentWeapon.baseSpread * 3,
                    player.currentWeapon.currentSpread + player.currentWeapon.spreadIncrease
                );
                
                player.vel.x -= Math.cos(angle) * player.currentWeapon.recoil;
                player.vel.y -= Math.sin(angle) * player.currentWeapon.recoil;
            }
        }
        
        if (Input.isKeyDown('R')) {
            if (player.currentWeapon && !player.currentWeapon.isReloading) {
                player.currentWeapon.startReload();
            }
        }
        
        if (Input.isKeyDown('1')) player.switchWeapon(0);
        if (Input.isKeyDown('2')) player.switchWeapon(1);
        if (Input.isKeyDown('3')) player.switchWeapon(2);
        if (Input.isKeyDown('4')) player.switchWeapon(3);
        
        if (Input.isKeyDown('Q')) {
            player.dash();
        }
        
        if (Input.isMouseDown(2) || Input.isKeyDown('E')) {
            player.activateStasis();
        }
    },
    
    update(dt) {
        this.camera.update(dt);
        Physics.update(dt);
        
        for (let i = Physics.entities.length - 1; i >= 0; i--) {
            const entity = Physics.entities[i];
            if (entity.active) {
                entity.update(dt);
            } else {
                Physics.removeEntity(entity);
            }
        }
        
        UI.update(dt);
        
        if (this.state === 'RUN' && this.currentWave <= CONFIG.ENEMY.WAVES_PER_LEVEL) {
            const enemiesRemaining = Physics.entities.filter(e => e instanceof Enemy).length;
            
            if (enemiesRemaining === 0 && this.enemiesAlive === 0 && this.spawnTimer <= 0) {
                this.startNextWave();
            }
        }
    },
    
    render() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (this.state === 'RUN') {
            this.camera.applyTransform(ctx);
            
            this.world.render(ctx);
            
            for (const entity of Physics.entities) {
                entity.render(ctx);
            }
            
            if (this.player.stasisActive) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(
                    this.player.pos.x,
                    this.player.pos.y,
                    CONFIG.PLAYER.STASIS_RADIUS,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = 'rgba(100, 150, 255, 0.1)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(200, 220, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
            }
            
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        
        UI.render(ctx);
        
        if (CONFIG.DEBUG) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Arial';
            ctx.fillText(`FPS: ${this.fps}`, 10, 20);
            ctx.fillText(`Entities: ${Physics.entities.length}`, 10, 40);
            ctx.fillText(`Wave: ${this.currentWave}`, 10, 60);
            ctx.fillText(`Enemies: ${Physics.entities.filter(e => e instanceof Enemy).length}`, 10, 80);
        }
    }
};

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});

// === DEBUG ===
document.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
        CONFIG.DEBUG = !CONFIG.DEBUG;
        console.log(`Debug mode ${CONFIG.DEBUG ? 'ON' : 'OFF'}`);
    }
    
    if (e.key === 'G' && CONFIG.DEBUG && Game.player) {
        Game.player.invulnerable = !Game.player.invulnerable;
        console.log(`God mode ${Game.player.invulnerable ? 'ON' : 'OFF'}`);
    }
    
    if (e.key === 'C' && CONFIG.DEBUG && Game.player) {
        Game.player.addCoins(100);
        console.log('Added 100 coins');
    }
    
    if (e.key === 'N' && CONFIG.DEBUG) {
        Game.currentLevel++;
        Game.startLevel();
        console.log(`Skipped to level ${Game.currentLevel}`);
    }
});