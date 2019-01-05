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
	this.name = "weapon";


	//ATTRIBUTE
	this.balas_Cont; //contador decrementa con cada disparo
	this.balas_image; //la imagen comunica con jugador para crear obj balas
	this.tipoArma = sprite; //sprite es un tipo string. sirve para inicializar el arma según su tipo
	this.alcance;//comunica con jugador y determina si se puede disparar o no
	this.weaponDamage;//damage comunican con jugador y éste con bala para determinar el daño ¡¡existe un atributo de sprite que se llama damage, no llamar así!!
	this.walk_WeaponScale; //será el escalar que resta pasos al jugador con cada disparo

	//METHODS
	this.asignaValores = function (funcionRandom) {
		this.balas_Cont = funcionRandom; //la cantidad de balas sí es aleatoria
		this.cantidad = 1; //en este caso cantidad no depende del random
		this.Tipo_De_Arma();
	}

	//función para determinar el tipo de arma e inicializar sus atributos
	this.Tipo_De_Arma = function () {
		if (this.tipoArma === "pistola") { this.alcance = 5; this.weaponDamage = 10; this.balas_image = 'b_Gun'; this.walk_WeaponScale = 1;}
		else if (this.tipoArma === "Subfusil") { this.alcance = 10; this.weaponDamage = 25; this.balas_image = 'b_Sf'; this.walk_WeaponScale = 3;}
		else if (this.tipoArma = "francoTirador") { this.alcance = 20; this.weaponDamage = 50; this.balas_image = 'b_Sn'; this.walk_WeaponScale = 6;}
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
	this.body.x = this.x; this.body.y = this.y;

};

//comunica con class: Player. como la tiene asociada al atributo currentWeapon, éste hace la llamada
Armas.prototype.Shot = function () {
	if (this.balas_Cont >=1){
		this.balas_Cont--;
		return true;
	}
	else return false;	
}

module.exports = Armas;

