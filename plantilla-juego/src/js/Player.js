"use strict";

function Player(game, x, y, sprite) {
  Phaser.Sprite.call(this, game, x, y, sprite); //hereda de sprite

  //ATTRIBUTE
  this.game.world.addChild(this);

  this.name = "jugador";

  //input
  this.inputAux = this.game.input.keyboard;
  this.key1 = Phaser.KeyCode.A;
  this.key2 = Phaser.KeyCode.W;
  this.key3 = Phaser.KeyCode.D;
  this.key4 = Phaser.KeyCode.S;

  this.orientation = 0;
  this.vel = 4;

  //scale
  this.auxScale = 1; //1 por defecto. función Prototype resizePlayer

  //shot and build

  //physics
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.collideWorldBounds = true;
  this.body.bounce.setTo(1, 1);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//redimensiona los objetos según parámetro.
Player.prototype.resizePlayer = function(scale) {
  var aux = this.auxScale; //aux recoge el último escalar
  this.auxScale = scale; //el atributo de la clase recoge el nuevo escalar
  this.scale.setTo(scale);
  this.x = this.x / aux;
  this.x = this.x * scale;
  this.y = this.y / aux;
  this.y = this.y * scale;
};

//el movimiento se realiza por tile: incrementa/decrem. en base al w/h actual del sprite
Player.prototype.checkInput = function(l, o) {
  var pos = { x: 0, y: 0 };
  var boolcheck = false;

  var x = this.game.world.bounds.width - this.width * 2; //lím. derch
  var y = this.game.world.bounds.height - this.height * 2; //lím inferior

  //arriba W
  if (this.inputAux.isDown(this.key2)) {
    this.orientation = 0;

    if (this.body.y >= this.height) {
      pos.y -= this.width;
      boolcheck = true;
    }
  }
  //derecha D
  else if (this.inputAux.isDown(this.key3)) {
    this.orientation = 1;
    if (this.body.x <= x) {
      pos.x += this.width;
      boolcheck = true;
    }
  }

  //abajo S
  else if (this.inputAux.isDown(this.key4)) {
    this.orientation = 2;
    if (this.body.y <= y) {
      pos.y += this.width;
      boolcheck = true;
    }
  }
  //izquierda A
  else if (this.inputAux.isDown(this.key1)) {
    this.orientation = 3;
    if (this.body.x >= this.width) {
      pos.x -= this.width;
      boolcheck = true;
    }
  }
  if (boolcheck) {
    this.movePlayer(pos, l, o);
    boolcheck = false;
  }
};

Player.prototype.movePlayer = function(position, l, o) {
  var X = this.body.x;
  var Y = this.body.y; //recogen el valor actual antes del cambio
  this.body.x += position.x;
  this.body.y += position.y;
  //si existe colision no modifica la pos actual
  if (this.compruebaColision(l, o)) {
    this.body.x = X;
    this.body.y = Y;
  }
};

Player.prototype.compruebaColision = function(l, o) {
  var bool = false;
  //se comprueba la colisión con las capas de obstáculos fijos del mapa
  if (this.game.physics.arcade.collide(this, l)) {
    bool = true;
  }
  //se recorre el grupo de Objetos y comprueba los subGrupos la colision con los obj.
  var i = 0;
  while (!bool & (i < o.length)) {
    bool = this.game.physics.arcade.collide(this, o.children[i].children);
    i++;
  }
  return bool;
};

module.exports = Player;

/**Player.prototype.Accion = function() {
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
}; */

/**Inicializacion pool de balas
  //this.balas = this.game.add.physicsGroup(); //un grupo de físicas activa el body de los obj añadidos
  //this.balas.enableBody = true; */

/** this.balas.physicsBodyType = Phaser.Physics.ARCADE;
  this.balas.createMultiple(50, "bala");
  this.balas.setAll("anchor.x", 0.5);
  this.balas.setAll("anchor.y", 1);
  this.balas.setAll("checkWorldBounds", true);
  this.balas.setAll("outOfBoundsKill", true);
  this.muros = game.add.group();
  this.muros.enableBody = true;
  //this.muros.body.inamovible = true;
  this.muros.physicsBodyType = Phaser.Physics.ARCADE;
  this.muros.createMultiple(100, "muro"); */

//this.bulletTime = 0; //controla que no se dispare constantemente
//this.wallTime = 0;
