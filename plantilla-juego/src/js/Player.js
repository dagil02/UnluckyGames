"use strict";

function Player(game, x, y, sprite) {
  Phaser.Sprite.call(this, game, x, y, sprite); //hereda de sprite
  this.game.world.addChild(this);

  //Atributos
  this.cursor = this.game.input.keyboard;
  this.orientation = 0;
  this.vel = 4;
  //this.nextFire = 0;
  this.bulletTime = 0; //controla que no se dispare constantemente
  this.wallTime = 0;

  //Inicializacion fisicas jugador
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.name = "jugador";
  this.body.collideWorldBounds = true;
  this.body.bounce.setTo(1, 1);
  //Inicializacion pool de balas
  this.balas = this.game.add.physicsGroup(); //un grupo de físicas activa el body de los obj añadidos
  //this.balas.enableBody = true;
  this.balas.physicsBodyType = Phaser.Physics.ARCADE;
  this.balas.createMultiple(50, "bala");
  this.balas.setAll("anchor.x", 0.5);
  this.balas.setAll("anchor.y", 1);
  this.balas.setAll("checkWorldBounds", true);
  this.balas.setAll("outOfBoundsKill", true);
  this.muros = game.add.group();
  this.muros.enableBody = true;
  //this.muros.body.inamovible = true;
  this.muros.physicsBodyType = Phaser.Physics.ARCADE;
  this.muros.createMultiple(100, "muro");
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.muevePlayer = function(x, y) {
  this.body.x += x;
  this.body.y += y;
};
Player.prototype.compruebaInput = function() {
  var x = 0;
  var y = 0;
  //izquierda
  if (this.cursor.isDown(65)) {
    x--;
    this.orientation = 3;
  }
  //derecha
  else if (this.cursor.isDown(68)) {
    x++;
    this.orientation = 1;
  }
  //arriba
  else if (this.cursor.isDown(87)) {
    y--;
    this.orientation = 0;
  }
  //abajo
  else if (this.cursor.isDown(83)) {
    y++;
    this.orientation = 2;
  }

  this.muevePlayer(x * this.vel, y * this.vel);
};

Player.prototype.Accion = function() {
  //tecla spacebar
  if (this.cursor.isDown(32)) {
    var bullet = this.balas.getFirstExists(false);
    if (this.game.time.now > this.bulletTime) {
      if (bullet) {
        bullet.angle = 90 * this.orientation;
        if (this.orientation === 0) {
          bullet.reset(this.x + 8, this.y + 8);
          bullet.body.velocity.y = -320;
        } else if (this.orientation === 1) {
          bullet.reset(this.x + 24, this.y + 8);
          bullet.body.velocity.x = 320;
        } else if (this.orientation === 2) {
          bullet.reset(this.x + 8, this.y + 8);
          bullet.body.velocity.y = 320;
        } else if (this.orientation === 3) {
          bullet.reset(this.x - 8, this.y + 8);
          bullet.body.velocity.x = -320;
        }
        this.bulletTime = this.game.time.now + 200;
      }
    }
  }
  //tecla b
  if (this.cursor.isDown(66)) {
    var wall = this.muros.getFirstExists(false);
    if (this.game.time.now > this.wallTime) {
      if (wall) {
        wall.angle = 90 * this.orientation;
        if (this.orientation === 0) {
          wall.reset(this.x, this.y - 16);
        } else if (this.orientation === 1) {
          wall.reset(this.x + 30, this.y);
        } else if (this.orientation === 2) {
          wall.reset(this.x + 16, this.y + 32);
        } else if (this.orientation === 3) {
          wall.reset(this.x - 15, this.y + 16);
        }

        this.wallTime = this.game.time.now + 500;
      }
    }
  }
};

module.exports = Player;
