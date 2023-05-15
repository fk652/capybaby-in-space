class Sound {
  constructor(game) {
    this.waveBGM = document.createElement("audio");
    this.waveBGM.src = "src/sounds/wave_bgm.mp3";
    this.waveBGM.preload = 'auto';
    this.waveBGM.loop = true;

    this.bossIncomingBGM = document.createElement("audio");
    this.bossIncomingBGM.src = "src/sounds/boss_incoming_bgm.mp3";
    this.bossIncomingBGM.preload = 'auto';

    this.bossBGM = document.createElement("audio");
    this.bossBGM.src = "src/sounds/boss_bgm.mp3"
    this.bossBGM.preload = 'auto';
    this.bossBGM.volume = 0.6;
    this.bossBGM.loop = true;

    this.playerDeathSound = document.createElement("audio");
    this.playerDeathSound.src = "src/sounds/player_death.wav"
    this.playerDeathSound.preload = 'auto';
    this.playerDeathSound.volume = 0.2;

    this.bossDeathSound = document.createElement("audio");
    this.bossDeathSound.src = "src/sounds/boss_death.mp3"
    this.bossDeathSound.preload = 'auto';

    this.gameOverSound = document.createElement("audio");
    this.gameOverSound.src = "src/sounds/game_over.mp3"
    this.gameOverSound.preload = 'auto';

    this.winSound = document.createElement("audio");
    this.winSound.src = "src/sounds/win.mp3"
    this.winSound.preload = 'auto';
    // this.winSound.volume = 0.8;

    this.playerHurtSound = document.createElement("audio");
    this.playerHurtSound.src = "src/sounds/player_hurt.wav"
    this.playerHurtSound.preload = 'auto';

    this.powerupSound = document.createElement("audio");
    this.powerupSound.src = "src/sounds/powerup.wav"
    this.powerupSound.preload = 'auto';

    this.over9000Sound = document.createElement("audio");
    this.over9000Sound.src = "src/sounds/over9000.mp3"
    this.over9000Sound.preload = 'auto';

    this.finalShotSound = document.createElement("audio");
    this.finalShotSound.src = "src/sounds/final_shot.wav"
    this.finalShotSound.preload = 'auto';

    this.finalExplosionSound = document.createElement("audio");
    this.finalExplosionSound.src = "src/sounds/final_explosion.mp3"
    this.finalExplosionSound.preload = 'auto';

    this.closeCombatSound = document.createElement("audio");
    this.closeCombatSound.src = "src/sounds/close_combat.wav"
    this.closeCombatSound.preload = 'auto';


    this.taunt1Sound = document.createElement("audio");
    this.taunt1Sound.src = "src/sounds/taunt1.mp3"
    this.taunt1Sound.preload = 'auto';

    this.taunt2Sound = document.createElement("audio");
    this.taunt2Sound.src = "src/sounds/taunt2.mp3"
    this.taunt2Sound.preload = 'auto';

    this.taunt3Sound = document.createElement("audio");
    this.taunt3Sound.src = "src/sounds/taunt3.mp3"
    this.taunt3Sound.preload = 'auto';

    this.taunt4Sound = document.createElement("audio");
    this.taunt4Sound.src = "src/sounds/taunt4.mp3"
    this.taunt4Sound.preload = 'auto';

    this.tauntOnCooldown = false;
    this.taunts = [this.taunt1Sound, this.taunt2Sound, this.taunt3Sound, this.taunt4Sound];
    this.currentTaunt = this.taunts[0];

    this.audioSources = {
      defaultProjectile: "src/sounds/default_laser.wav",
      playerProjectile: "src/sounds/player_laser.wav",
      enemyProjectile: "src/sounds/enemy_laser.wav",
      bossProjectile: "src/sounds/boss_projectile.wav",
      explosion: "src/sounds/explosion.wav"
    }

    this.currentBGM = this.waveBGM;
    this.currentSounds = [];
    this.toggle = true;
    this.game = game;

    this.soundOnElement = document.getElementById("sound-on");
    this.soundOffElement = document.getElementById("sound-off");
    this.bindToggleListener();
  }

  playTauntSound() {
    if (!this.tauntOnCooldown) {
      this.currentTaunt = this.taunts.shift();
      const timeDelay = ((this.currentTaunt.duration * 1000) + 1000) || 6000;
      this.currentTaunt.play();
      this.taunts.push(this.currentTaunt);
      this.tauntOnCooldown = true;
      setTimeout(() => this.tauntOnCooldown = false, timeDelay);
    }
  }

  switchBGM(key) {
    this.currentBGM.pause();
    this.currentBGM.currentTime = 0;

    this.currentBGM = this[key];
    if (this.toggle) this.currentBGM.play();
  }

  playPlayerDeathSound() {
    this.currentBGM.pause();
    if (this.toggle) this.playerDeathSound.play();
  }

  playBossDeathSound() {
    this.currentBGM.pause();
    if (this.toggle) this.bossDeathSound.play();
  }

  playGameOverSound() {
    this.currentBGM.pause();
    if (this.toggle) this.gameOverSound.play();
  }

  playFinalExplosionSound() {
    this.currentBGM.pause();
    if (this.toggle) this.finalExplosionSound.play();
  }

  playCloseCombatSound() {
    if (this.toggle) this.closeCombatSound.play();
  }


  playPowerupSound() {
    this.closeCombatSound.pause();
    this.currentTaunt.pause();
    this.currentBGM.pause();
    if (this.toggle) this.powerupSound.play();
  }

  playOver9000Sound() {
    if (this.toggle) this.over9000Sound.play();
  }


  playFinalShotSound() {
    if (this.toggle) this.finalShotSound.play();
  }


  playWinSound() {
    this.currentBGM.pause();
    if (this.toggle) this.winSound.play();
  }

  playPlayerHurtSound() {
    if (this.toggle) this.playerHurtSound.play();
  }

  toggleOff() {
    this.currentBGM.pause();
    this.reset();
    this.toggle = false;
  }

  toggleOn() {
    if (!this.game.startScreen && !this.game.gameOver && !this.game.win) {
      this.currentBGM.play();
    }
    this.toggle = true;
  }

  add(audioSourceKey) {
    if (this.toggle) {
      const newAudio = document.createElement("audio");
      newAudio.src = this.audioSources[audioSourceKey];
      if (audioSourceKey === "enemyProjectile") newAudio.volume = 0.02;
      else if (audioSourceKey === "explosion") newAudio.volume = 0.75;
      else if(audioSourceKey === "bossProjectile") newAudio.volume = 0.2;
      else if(audioSourceKey === "playerProjectile") newAudio.volume = 0.25;
      this.currentSounds.push(newAudio);
      newAudio.play();
    }
  }

  clear() {
    this.currentSounds = this.currentSounds.filter(sound => !sound.ended);
  }

  reset() {
    this.bossDeathSound.pause();
    this.bossDeathSound.currentTime = 0;

    this.playerDeathSound.pause();
    this.playerDeathSound.currentTime = 0;

    this.gameOverSound.pause();
    this.gameOverSound.currentTime = 0;

    this.winSound.pause();
    this.winSound.currentTime = 0;

    this.playerHurtSound.pause();
    this.playerHurtSound.currentTime = 0;

    this.waveBGM.pause();
    this.waveBGM.currentTime = 0;

    this.bossIncomingBGM.pause();
    this.bossIncomingBGM.currentTime = 0;

    this.bossBGM.pause();
    this.bossBGM.currentTime = 0;

    this.currentSounds.forEach(sound => sound.pause());
    this.currentSounds = [];
  }

  bindToggleListener() {
    const soundContainer = document.getElementById("sound-container");
    soundContainer.addEventListener("click", this.handleSoundToggle.bind(this));
  }

  handleSoundToggle(event) {
    event.preventDefault();
    if (this.toggle) {
      this.toggleOff()
      this.soundOnElement.style.display = 'none';
      this.soundOffElement.style.display = 'block'; 
    } else {
      this.toggleOn()
      this.soundOnElement.style.display = 'block';
      this.soundOffElement.style.display = 'none';
    }
  }
}

export default Sound;