"use strict";

var objeto = require("./Objeto");

function Muro(game, x, y, sprite) {
    objeto.call(this, game, x, y, sprite); //hereda de objeto

    //ATTRIBUTES
    this.orientation; //recibe el valor de jugador
    this.name = "wall";

}
Muro.prototype = Object.create(objeto.prototype);
Muro.prototype.constructor = Muro;

/******** PROTOTYPE METHODS *********/
// determina la dirección
//comunica con class: Player. devuelve el valor de la nueva pos
Muro.prototype.direction = function(player) {
  this.orientation = player.orientation;
  var dir = { x: 0, y: 0 }; //coordenadas de retorno
  //0:arriba; 1:derecha; 2:abajo; 3:izquierda
  if (this.orientation === 0) {
    dir.x = 0;
    dir.y = -1 * this.height;
  } else if (this.orientation === 1) {
    dir.x = 1 * this.width;
    dir.y = 0;
  } else if (this.orientation === 2) {
    dir.x = 0;
    dir.y = 1 * this.height;
  } else if (this.orientation === 3) {
    dir.x = -1 * this.width;
    dir.y = 0;
  }
  return dir;
};

//genera la lógica del objeto,
Muro.prototype.generate = function (player) {

    //physics
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.immovable = true;	
    this.body.checkCollision = true;
    //si se crea con la escala aumentada debe redimensionarse
    if (this.auxScale !== player.auxScale) {
        this.resizeObject(player.auxScale);
        //como el método ya diplica una posición presupuesta de 16*16 hay que dividir
        this.x /= player.auxScale; this.y /= player.auxScale;
    }
    //se recoge la nueva pos que será un tile por delante del jugador
    var pos = this.direction(player);
    this.x += pos.x; this.y += pos.y;
    this.body.x = this.x; this.body.y = this.y;
};

module.exports = Muro;