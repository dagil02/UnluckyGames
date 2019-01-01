"use strict";

//jugador crea el obj. bala, luego se llama a AsignaValores, y por último a
//su generate para aplicar la lógica

var objeto = require("./Objeto");

function Bala(game, x, y, sprite) {
  objeto.call(this, game, x, y, sprite); //hereda de objeto

  //ATTRIBUTES
  this.vel = 0; //recibe el valor del arma que porta jugador
  this.damage; //recibe el valor del arma que porta jugador
  this.orientacion; //recibe el valor de jugador

  //METHODS
  // determina la dirección de la bala
  this.direction = function() {
    var dir = { x: 0, y: 0 }; //coordenadas de retorno
    //0:arriba; 1:derecha; 2:abajo; 3:izquierda
    if (this.orientacion === 0) {
      dir.x = 0;
      dir.y = -1;
    } else if (this.orientacion === 1) {
      dir.x = 1;
      dir.y = 0;
    } else if (this.orientacion === 2) {
      dir.x = 0;
      dir.y = 1;
    } else if (this.orientacion === 3) {
      dir.x = -1;
      dir.y = 0;
    }
    return dir;
  };
}
Bala.prototype = Object.create(objeto.prototype);
Bala.prototype.constructor = Bala;

//se asigna valores a los atributos del obj.
Bala.prototype.AsignaValores = function(v, o, d) {
  this.vel = v;
  this.orientacion = o;
  this.damage = d;
};

//genera la lógica del objeto,
//¿¿¿que se gestiona en el método action del jugador, invocado en el Update de PlayScene???
Bala.prototype.generate = function() {
  this.position = (this.position + this.direction()) * this.vel;
};

module.exports = Bala;
