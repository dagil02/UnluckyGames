"use strict";

function Player(game, x, y, sprite) {
  Phaser.Sprite.call(this, game, x, y, sprite); //hereda de sprite

  //ATTRIBUTE
  this.game.world.addChild(this);

  this.name = "jugador";

  //input
  this.inputAux = this.game.input.keyboard;
  //deslpazamiento: izq, arrib, derch, abajo.
  this.key1 = Phaser.KeyCode.A;
  this.key2 = Phaser.KeyCode.W;
  this.key3 = Phaser.KeyCode.D;
  this.key4 = Phaser.KeyCode.S;
  //objetos: recoger, soltar
  this.key5 = Phaser.KeyCode.P;
  this.key6 = Phaser.KeyCode.O;

  this.orientation = 0;
  this.velMove = 300; //controla el tiempo de desplazamiento
  this.timeMove = 0;

  //recoge la prox pos de player y la divide por la escala actual.
  //siempre obtendremos un valor de +-16 (tile: 16x16)
  this.POSPREVIA;

  //scale
  this.auxScale = 1; //1 por defecto. función Prototype resizePlayer

  //shot and build
  this.resources = 0; //contador de recursos

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

Player.prototype.checkInput = function (mapa, obj) {
  //desplazamiento y orientacion
  if (
    this.inputAux.isDown(this.key1) ||
    this.inputAux.isDown(this.key2) ||
    this.inputAux.isDown(this.key3) ||
    this.inputAux.isDown(this.key4)
  ) {
    this.checkMove(mapa, obj);
    //objetos: recoger y soltar
  } else if (
    this.inputAux.isDown(this.key5) ||
    this.inputAux.isDown(this.key6)
  ) {
    if (this.inputAux.isDown(this.key5)) {
      mapa.plasyerResources(this);
    }

  }
};

//gestiona el input por desplazamiento
//el movimiento se realiza por tile: incrementa/decrem. en base al w/h actual del sprite
Player.prototype.checkMove = function(mapa, obj) {
  //recogen la posición según input
  var pos = { x: 0, y: 0 };
  var posPrevia = { x: 0, y: 0 };

  //define la llamada a movePlayer()
  var boolcheck = false;

  //worldBounds
  var x = this.game.world.bounds.width - this.width * 2; //lím. derch
  var y = this.game.world.bounds.height - this.height * 2; //lím inferior

  //arriba W
  if (this.inputAux.isDown(this.key2)) {
    this.orientation = 0;

    if (this.body.y >= this.height) {
      pos.y -= this.width;
      posPrevia.y -= this.height / this.auxScale;
      boolcheck = true;
    }
  }
  //derecha D
  else if (this.inputAux.isDown(this.key3)) {
    this.orientation = 1;
    if (this.body.x <= x) {
      pos.x += this.width;
      posPrevia.x += this.width / this.auxScale;
      boolcheck = true;
    }
  }

  //abajo S
  else if (this.inputAux.isDown(this.key4)) {
    this.orientation = 2;
    if (this.body.y <= y) {
      pos.y += this.width;
      posPrevia.y += this.height / this.auxScale;
      boolcheck = true;
    }
  }
  //izquierda A
  else if (this.inputAux.isDown(this.key1)) {
    this.orientation = 3;
    if (this.body.x >= this.width) {
      pos.x -= this.width;
      posPrevia.x -= this.width / this.auxScale;
      boolcheck = true;
    }
  }
  //si existe entrada de teclado
  if (boolcheck) {
    //la variable de ámbito local simula la siguiente pos en base al escalar y lo pasa al atributo de la clase
    posPrevia.x = this.body.x + posPrevia.x;
    posPrevia.y = this.body.y + posPrevia.y;
    this.POSPREVIA = posPrevia; //comunica con class: Map mediante parámetro en método this.compruebaColision(...)

    this.movePlayer(mapa, obj, pos);
    boolcheck = false;
  }
};

Player.prototype.movePlayer = function(mapa, obj, posT) {
  //recogen el valor actual antes del cambio
  var X = this.body.x;
  var Y = this.body.y;

  //simula el siguiente paso
  this.body.x += posT.x;
  this.body.y += posT.y;

  //si existe colision no modifica la pos actual
  if (this.compruebaColision(mapa, obj)) {
    this.body.x = X;
    this.body.y = Y;
  } else {
    //gestiona un timeCounter para regular la velocidad de desplazamiento
    if (this.game.time.now > this.timeMove) {
      this.timeMove = this.game.time.now + this.velMove;
    } else {
      this.body.x = X;
      this.body.y = Y;
    }
  }
};

Player.prototype.compruebaColision = function(mapa, obj) {
  var bool = false;
  //se recorre el grupo de Objetos y comprueba los subGrupos la colision con los obj
  var i = 0;
  while (!bool && i < obj.length) {
    bool = this.game.physics.arcade.collide(this, obj.children[i].children);
    i++;
  }
  //si no existe colision con objs llama a la función de la class: Map
  if (!bool) {
    //this.POSPREVIA se usará en caso de que auxScale === 2
    bool = mapa.compruebaColision(this);
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
