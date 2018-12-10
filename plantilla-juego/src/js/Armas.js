'use strict';

//coossdd

var objeto = require('./Objeto');

//armas
function Armas (game, x, y, sprite, indice){

	objeto.call(this, game, x, y, sprite); //hereda de objeto 
	
	//atributos 
	this.cantidad;
	this.balas;
	this.indice = indice;

	//funciones 
	this.asignaValores = function (booleano, funcionRandom) {

		this.bloquea = booleano;
		this.balas = funcionRandom;
		this.cantidad = 1;
		this.Tipo_De_Arma(this.indice);
	}

	this.Tipo_De_Arma = function (i){
		if (i === 0){ this.tipoArma = "pistola"; this.alcance = 5;  this.damage = 10;}
		else if (i === 1){ this.tipoArma = "Subfusil"; this.alcance = 12;  this.damage = 25;}
		else if (i === 2){ this.tipoArma = "LanzaCohetes"; this.alcance = 14;  this.damage = 50;}

	}

}
Armas.prototype = Object.create (objeto.prototype);
Armas.prototype.constructor = Armas;

Armas.prototype.generate = function (){

	var randItem = new objeto.RandomItem ();
	this.asignaValores(true, randItem);
}

module.exports = Armas;