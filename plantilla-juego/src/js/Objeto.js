'use strict';


//Consturctora funciones Auxiliares
function RandomItem (){
	var r = Math.floor(Math.random() * 10 );
	return r;
}

//CLASE PADRE: Objeto
function Objeto (game, x, y, sprite){ 
	Phaser.Sprite.call(this, game, x, y, sprite);//hereda de sprite
	this.game.world.addChild(this);

	//atributos 
	this.bloquea = false; 
	this.cantidad; 
}
//enlaza ambas propiedades prototype
Objeto.prototype = Object.create(Phaser.Sprite.prototype);
//corrige la propiedad constructor
Objeto.prototype.constructor = Objeto;


//CLASES HIJAS: 
//recursos
function Recurso (game, x, y, sprite){
	Objeto.call(this, game, x, y, sprite); //hereda de objeto 
  
	//funciones 
	this.asignaValores = function (booleano, funcionRandom) {
		this.bloquea = booleano;
		this.cantidad = funcionRandom;
	}

}
Recurso.prototype = Object.create (Objeto.prototype);
Recurso.prototype.constructor = Recurso;

Recurso.prototype.generate = function (){

	var randItem = new RandomItem ();
	this.asignaValores(true, randItem);
}

module.exports = Recurso;
