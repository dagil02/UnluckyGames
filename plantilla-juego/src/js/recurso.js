'use strict';



var objeto = require('./Objeto');

function Recurso (game, x, y, sprite){
    
	objeto.call(this, game, x, y, sprite); //hereda de objeto 
  
	//funciones 
	this.asignaValores = function (booleano, funcionRandom) {
		this.bloquea = booleano;
		this.cantidad = funcionRandom;
	}

}
Recurso.prototype = Object.create (objeto.prototype);
Recurso.prototype.constructor = Recurso;

Recurso.prototype.generate = function (){

	var randItem = new objeto.RandomItem ();
	this.asignaValores(true, randItem);
}


module.exports = Recurso;
