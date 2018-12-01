'use strict';



function Player (game,x,y,sprite){
    Phaser.Sprite.call(this,game,x,y,sprite);
    this.game.world.addChild(this);
    this.cursor= this.game.input.keyboard;
}

Player.prototype=Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor=Player;

Player.prototype.muevePlayer = function(x,y){
this.x += x;
this.y += y;
}
Player.prototype.compruebaInput = function(){
    //this.cursor= this.game.input.keyboard;
    //izquierda
    if (this.cursor.isDown(37))
    {
        this.muevePlayer(-2,0);
    }
    //derecha
    else if (this.cursor.isDown(39))
    {
      this.muevePlayer(2,0);
    }
    //arriba
    else if (this.cursor.isDown(38))
    {
      this.muevePlayer(0,-2);
    }
    //abajo
    else if (this.cursor.isDown(40))
    {
      this.muevePlayer(0,2);
    }
}

module.exports = Player;