'use strict';

//coossdd

var objeto = require('./Objeto');

//armas
function Armas (game, x, y, sprite){

	objeto.call(this, game, x, y, sprite); //hereda de objeto 
	
	//atributos 
	this.balas;
	this.tipoArma = sprite; //sprite es un tipo string. sirve pra inicializar el arma según su tipo
	this.alcance;  this.damage;

	//funciones 
	this.asignaValores = function (booleano, funcionRandom) {
		this.bloquea = booleano; //debe bloquear el paso
		this.balas = funcionRandom; //la cantidad de balas sí es aleatoria
		this.cantidad = 1; //en este caso cantidad no depende del random
		this.Tipo_De_Arma();
	}

	//función para determinar el tipo de arma e inicializar sus atributos
	this.Tipo_De_Arma = function (){
		if (this.tipoArma === "pistola"){ this.alcance = 5;  this.damage = 10;}
		else if (this.tipoArma === "Subfusil"){ this.alcance = 12;  this.damage = 25;}
		else if (this.tipoArma = "francoTirador"){this.alcance = 20;  this.damage = 50;}
	}

}
Armas.prototype = Object.create (objeto.prototype);
Armas.prototype.constructor = Armas;

Armas.prototype.generate = function (){
	//la función random la herda de la clase Objeto.
	this.asignaValores(true,  this.RandomItem(10));
}

module.exports = Armas;