'use strict';

/*Se crea el objeto arma y se llama a su método generate()
cuando el jugador recoja el arma, cambiará de estado a: armado (cambio de img)
se desactiva la física del obj, se hace invisible y se aclopa al jugador para utilizar sus 
valores al disparar. Si se cambia el obj o se deja caer, éste recupera física y visibilidad, pero
mantiene los valores actuales (ejem: menos balas en el cargador) */

var objeto = require('./Objeto');

//WEAPONS
function Armas(game, x, y, sprite) {

	objeto.call(this, game, x, y, sprite); //hereda de objeto 


	//ATTRIBUTE
	this.balas_Cont; //contador decrementa con cada disparo
	this.balas_image; //la imagen comunica con jugador para crear obj balas
	this.tipoArma = sprite; //sprite es un tipo string. sirve para inicializar el arma según su tipo
	this.alcance;//comunica con jugador y determina si se puede disparar o no
	this.damage;//damage comunican con jugador y éste con bala para determinar el daño

	//METHODS
	this.asignaValores = function (funcionRandom) {
		this.balas_Cont = funcionRandom; //la cantidad de balas sí es aleatoria
		this.cantidad = 1; //en este caso cantidad no depende del random
		this.Tipo_De_Arma();
	}

	//función para determinar el tipo de arma e inicializar sus atributos
	this.Tipo_De_Arma = function () {
		if (this.tipoArma === "pistola") { this.alcance = 5; this.damage = 10; this.balas_image = 'b_Gun' }
		else if (this.tipoArma === "Subfusil") { this.alcance = 12; this.damage = 25; this.balas_image = 'b_Sf' }
		else if (this.tipoArma = "francoTirador") { this.alcance = 20; this.damage = 50; this.balas_image = 'b_Sn' }
	}

}
Armas.prototype = Object.create(objeto.prototype);
Armas.prototype.constructor = Armas;

Armas.prototype.generate = function () {
	//la función random la herda de la clase Objeto.
	this.asignaValores(this.RandomItem(10));
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;
	this.body.immovable = true;

};

Armas.prototype.Shot = function () {
	this.balas_Cont--;
}

module.exports = Armas;

