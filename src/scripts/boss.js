import Ship from "./ship";
import Projectile from "./projectile";
import MovingObject from "./moving_object";
import Explosion from "./explosion";
import Explosion2 from "./explosion2";

class Boss extends Ship {
  constructor(game) {
    let image = document.createElement("img");
    image.src = "src/assets/boss2.png";
    let height = 200;
    let width = 500
    let health = 9000;

    const objArgs = {
      width: width,
      height: height,
      position: [(game.canvasWidth/2) - (width/2), 0 - (height * 1)],
      velocity: [0, .75],
      health: health,
      game: game,
      image: image
    }

    image = document.createElement("img");
    image.src = "src/assets/shot.png";

    const projectileArgs = {
      objArgs: {
        velocity: [0, 8],
        health: 1,
        game: game,
        width: 100,
        height: 100,
        image: image
      },
      origin: "enemy",
      cooldown: 2000,
      xAdjustment: .45,
      yAdjustment: 0
    }

    super(objArgs, projectileArgs);

    this.shootOnCooldown = true;
    this.disabled = false;

    this.pattern1 = [[width/2, 200]];
    this.pattern1Cooldown = 1000;
    this.pattern1OnCooldown = true;
    this.pattern2 = [[60, 210], [this.width-76, 210]];
    this.pattern2Cooldown = 1000;
    this.pattern2OnCooldown = false;
    this.pattern3 = [[75, 180], [this.width-88, 180]];
    this.pattern3Cooldown = 1000;
    this.pattern3OnCooldown = false;
    this.pattern4 = [[100, 160], [this.width - 110, 160]];
    this.pattern4Cooldown = 1000;
    this.pattern4OnCooldown = false;

    // array of dx, dy
    this.projectilePositions = [
      ...this.pattern1
    ]

    this.projectileSound = "bossProjectile";
  }

  updateVelocity() {
    if (this.position[1] > 0) {
      const speed = 1.5;
      if (this.velocity[0] === 0 || this.position[0] < 0) {
        if (this.velocity[0] === 0) {
          setTimeout(this.resetCooldown.bind(this), 1250)
          this.game.sounds.switchBGM("bossBGM");
          this.game.player.disabled = false;
          this.game.healPlayer();
        }
        this.velocity = [speed, 0];
      } else if (this.position[0] > this.game.canvasWidth - this.width) {
        this.velocity = [-speed, 0];
      }
    }
  }

  move(timeDelta) {
    if (!this.disabled) {
      this.updateVelocity();
      this.updateShootingPattern();

      const velocityScale = timeDelta / MovingObject.NORMAL_FRAME_TIME_DELTA;
      const offsetX = this.velocity[0] * velocityScale;
      const offsetY = this.velocity[1] * velocityScale;

      const newPos = this.position;
      newPos[0] += offsetX;
      newPos[1] += offsetY;
      this.position = newPos;
      if (!this.shootOnCooldown) {
        this.shootProjectile();
        this.game.sounds.add(this.projectileSound);
        this.shootOnCooldown = true;
        setTimeout(this.resetCooldown.bind(this), this.cooldown);
      }
      if (!this.pattern1OnCooldown) {

      }
      if (!this.pattern2OnCooldown && this.health < 20) {

      }
      if (!this.pattern3OnCooldown && this.health < 15) {

      }
      if (!this.pattern4OnCooldown && this.health < 10) {

      }
    }
  }

  shootProjectile() {
    if (!this.shootOnCooldown) {
      this.projectilePositions.forEach((pos) => {
        const copy = structuredClone(this.position);
        const projPos = [copy[0] + pos[0], copy[1] + pos[1]]
        this.projectileArgs.objArgs.position = projPos;
        const projectile = new Projectile(this.projectileArgs);
        this.game.allMovingObjects.projectiles.push(projectile);
      })
    }
  }

  updateShootingPattern() {
    if (this.health < 10) {
      this.projectilePositions = [
        ...this.pattern1,
        ...this.pattern2,
        ...this.pattern3,
        ...this.pattern4
      ];
    } else if (this.health < 15) {
      this.projectilePositions = [
        ...this.pattern1,
        ...this.pattern2,
        ...this.pattern3
      ];
    } else if (this.health < 20) {
      this.projectilePositions = [
        ...this.pattern1,
        ...this.pattern2
      ];
    }
  }

  damageTaken(damage) {
    if (damage < 9000) {
      this.game.sounds.playTauntSound();
      damage = 0;
    }
    if (!this.disabled) {
      super.damageTaken(damage);

      if (this.health <= 0) {
        this.game.score += 1000;
        this.disabled = true;

        for (let i = 0; i < 100; i++) {
          try {
            const newX = this.position[0] + this.velocity[0];
            const newY = this.position[1] + this.velocity[1];
            const randPosX = Math.floor(Math.random() * ((newX + this.width) - newX) + newX);
            const randPosY = Math.floor(Math.random() * ((newY + this.height) - newY) + newY);
            const randTime = Math.floor(Math.random() * (7000 - 100) + 100);
            const multiplier = (this.velocity[0] < 0 ? 1 : -1);
            const dx = (this.velocity[0] < 0 ? 70 : 20)
            const explosion = new Explosion(this.game, 80, [randPosX - (dx * multiplier), randPosY - 20]);
            explosion.dy = 0.1;
            explosion.dx = (this.velocity[0]/4) * multiplier;
            explosion.velocity[0] = this.velocity[0];
            // this.game.sounds.add("explosion");
            setTimeout(() => {
              this.game.allMovingObjects.explosions.push(explosion);
            }, randTime);
          } catch(error) {
            // console.error(error);
            // console.log(this.game);
          }
        }

        setTimeout(() => {
          this.game.sounds.playBossDeathSound()
        }, 2000)
        
        setTimeout(() => {
          this.remove()
          try {
            // this.game.sounds.playBossDeathSound();
            const multiplier = (this.velocity[0] < 0 ? 1 : -1);
            const posX = this.position[0];
            const posY = this.position[1]-(this.height/1.5);
            const finalExplosion = new Explosion2(this.game, 500, [posX, posY]);
            this.game.allMovingObjects.explosions.push(finalExplosion);
            this.game.sounds.playFinalExplosionSound();
          } catch(error) {
            // console.error();
            // console.log(this.game);
          }
          setTimeout(this.game.setWin.bind(this.game), 2000);
        }, 7000)
      }
    }
  }

  remove() {
    const enemies = this.game.allMovingObjects.enemies;
    enemies[enemies.indexOf(this)] = null;
  }
}

export default Boss;