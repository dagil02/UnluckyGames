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
  this.wallGroup = this.game.add.group();

  //physics
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.collideWorldBounds = true;
  this.body.bounce.setTo(1, 1);
  this.body.x = this.x;
  this.body.y = this.y;
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

  //redimensiona los objetos en la mochila
  this.wallGroup.forEach(element => {
    element.resizeObject(scale);
  });
};

Player.prototype.checkInput = function(mapa, obj) {
  //desplazamiento y orientacion
  if (
    this.inputAux.isDown(this.key1) ||
    this.inputAux.isDown(this.key2) ||
    this.inputAux.isDown(this.key3) ||
    this.inputAux.isDown(this.key4)
  ) {
    this.checkMove(mapa);
    //objetos: recoger y soltar
  } else if (
    this.inputAux.isDown(this.key5) ||
    this.inputAux.isDown(this.key6)
  ) {
    if (this.inputAux.isDown(this.key5)) {
      mapa.plasyerResources(this);
    } else {
      this.buildWall(mapa);
    }
  }
};

//gestiona el input por desplazamiento
//el movimiento se realiza por tile: incrementa/decrem. en base al w/h actual del sprite
Player.prototype.checkMove = function(mapa) {
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

    this.movePlayer(mapa, pos);
    boolcheck = false;
  }
};

Player.prototype.movePlayer = function(mapa, posT) {
  //recogen el valor actual antes del cambio
  var X = this.body.x;
  var Y = this.body.y;

  //simula el siguiente paso
  this.body.x += posT.x;
  this.body.y += posT.y;

  //si existe colision no modifica la pos actual
  if (this.compruebaColision(mapa)) {
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

Player.prototype.compruebaColision = function(mapa) {
  var bool = false;
  //primero verifica que no choque con un recurso o arma
  bool = mapa.objectCheckCollision(this);
  //si no existe colision con objs llama a la función de la class: Map
  if (!bool) {
    //this.POSPREVIA se usará en caso de que auxScale === 2
    bool = mapa.playerCheckCollision(this);
  }

  return bool;
};

//jugador manda la orden a class: mapa. en caso de devolver true, decrementa los recursos en mochila y reactiva el timer
Player.prototype.buildWall = function(mapa) {
  //siempre que existan existencias en la mochila
  if (this.resources > 0) {
    //controla el tiempo de creación
    if (this.game.time.now > this.timeMove) {
      if (mapa.añadeWall(this)) {
        this.resources--;
        this.timeMove = this.game.time.now + this.velMove;
      }
    }
  }
};

module.exports = Player;
