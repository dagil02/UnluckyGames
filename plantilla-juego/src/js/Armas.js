'use strict';

//coossdd

var objeto = require('./Objeto');

//armas
function Armas (game, x, y, sprite){

	objeto.call(this, game, x, y, sprite); //hereda de objeto 
	
	//atributos 
	this.cantidad;
	this.balas;
	this.alcance;
	this.damage;

	//funciones 
	this.asignaValores = function (booleano, funcionRandom) {

		this.bloquea = booleano;
		this.balas = funcionRandom;
        this.cantidad = 1;
	}

}
Armas.prototype = Object.create (objeto.prototype);
Armas.prototype.constructor = Armas;

Armas.prototype.generate = function (){

	var randItem = new objeto.RandomItem ();
	this.asignaValores(true, randItem);
}

module.exports = Armas;