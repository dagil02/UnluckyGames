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
  //recibe el valor de jugador
  this.orientacion;
}
Bala.prototype = Object.create(objeto.prototype);
Bala.prototype.constructor = Bala;

//METHODS
// determina la dirección de la bala
Bala.prototype.direction = function(player) {
  this.orientation = player.orientation;
  var dir = { x: 0, y: 0 }; //coordenadas de retorno
  //0:arriba; 1:derecha; 2:abajo; 3:izquierda
  if (this.orientation === 0) {
    dir.y = -1 * this.height;
    this.alcance = this.y + (this.alcance * dir.y); //alcance obtiene la posición donde debe destruirse
    this.vel *= -1;
    this.vel_Y = true;
  } else if (this.orientation === 1) {
    dir.x = 1 * this.width;
    this.alcance = this.x + (this.alcance * dir.x);
  } else if (this.orientation === 2) {
    dir.y = 1 * this.height;
    this.alcance = this.y + (this.alcance * dir.y);
    this.vel_Y = true;
  } else if (this.orientation === 3) {
    dir.x = -1 * this.width;
    this.vel *= -1;
    this.alcance = this.x + (this.alcance * dir.x);
    
  }
  return dir;
};

Bala.prototype.generate = function(player) {
  //alcance y el daño lo recoge de Player (atributo: armaActual)
  //this.damage = player.armaActual.damage;
  //this.alcance = player.armaActual.alcance;
  this.alcance = 2;

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
  }
  //se recoge la nueva pos que será un tile por delante del jugador
  var dir = this.direction(player);
  this.x += dir.x;
  this.y += dir.y;
  this.body.x = this.x;
  this.body.y = this.y;
};

Bala.prototype.move = function () {
  if (this.vel_Y) {
    this.body.velocity.y = this.vel;
  } else {
    this.body.velocity.x = this.vel;
  }

};

//de actualizará en el update, si llega al límite sin colsionar con algo se destruirá.
Bala.prototype.limiteAlcance = function() {
  if (this.x === this.alcance || this.y === this.alcance) {
   return true;
  }
  else { 
    return false;
  } 
};


module.exports = Bala;
