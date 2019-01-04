"use strict";

//jugador crea el obj. bala, luego se llama a AsignaValores, y por último a
//su generate para aplicar la lógica

var objeto = require("./Objeto");

function Bala(game, x, y, sprite) {
  objeto.call(this, game, x, y, sprite); //hereda de objeto

  //ATTRIBUTES
  //recibe el valor del arma que porta jugador
  this.vel = 100;
  this.vel_Y = false;
  this.damage = 0;
  this.alcance = 0;
  this.name = 'bullet';
  //recibe el valor de jugador
  this.orientacion;

  this.dir;
}
Bala.prototype = Object.create(objeto.prototype);
Bala.prototype.constructor = Bala;

//METHODS
// determina la dirección de la bala
Bala.prototype.direction = function(player) {
  this.orientation = player.orientation; 
  var dir = { x: 0, y: 0 }; //coordenadas de retorno
  //0:arriba; //el sprite, en 0 grados, apunta hacia arriba
  if (this.orientation === 0) {
    dir.y = -1 * this.height;
    this.alcance = this.y + this.alcance * dir.y; //alcance obtiene la posición donde debe destruirse
    this.vel *= -1;
    this.vel_Y = true;
    //this.angle = 0;
    //1:derecha;
  } else if (this.orientation === 1) {
    dir.x = 1 * this.width;
    this.alcance = this.x + this.alcance * dir.x;
    //this.angle = 90; //rotación del sprite
    //this.anchor.setTo(0, 1);
  } //2:abajo;
  else if (this.orientation === 2) {
    dir.y = 1 * this.height;
    this.alcance = this.y + this.alcance * dir.y;
    this.vel_Y = true;
    //this.angle = 180;
    //this.anchor.setTo(1, 1);
  }
  //3:izquierda
  else if (this.orientation === 3) {
    dir.x = -1 * this.width;
    this.vel *= -1;
    this.alcance = this.x + this.alcance * dir.x;
    //this.angle = -90;
    //this.anchor.setTo(1, 0);
  }
  return dir;
};

Bala.prototype.generate = function(player) {
  //alcance y daño se recogen del atributo currentWeapon
  this.alcance = player.currentWeapon.alcance;
  this.damage = player.currentWeapon.damage;

  //physics
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.collideWorldBounds = true;
  this.body.checkCollision = true;

  //si se crea con la escala aumentada debe redimensionarse
  if (this.auxScale !== player.auxScale) {
    this.resizeObject(player.auxScale);
    //como el método ya diplica una posición presupuesta de 16*16 hay que dividir
    this.x /= player.auxScale;
    this.y /= player.auxScale;
    this.vel *= 2; //duplica la velocidad para regular según escalar
  }
  //se recoge la nueva pos que será un tile por delante del jugador
  this.dir = this.direction(player);
  this.x += this.dir.x;
  this.y += this.dir.y;
};

Bala.prototype.move = function() {
   this.body.x = this.x; this.body.y = this.y;
    if (this.vel_Y) {
    this.body.velocity.y = this.vel;
  } else {
    this.body.velocity.x = this.vel;
  }
};

//de actualizará en el update, si llega al límite sin colsionar con algo se destruirá.
//como se usa en el update también actualizamos su poisición
Bala.prototype.limiteAlcance = function() {
  var bool = false;
  //si colisiona con los límites del mapa
  if (this.body.checkWorldBounds()) {
    bool = true;
  } else {
    if (this.orientation === 0) {
      bool = this.y <= this.alcance;
    } else if (this.orientation === 3) {
      bool = this.x <= this.alcance;
    } else if (this.orientation === 1) {
      bool = this.x >= this.alcance;
    } else {
      bool = this.y >= this.alcance;
    }
  }

  return bool;
};

module.exports = Bala;