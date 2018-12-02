'use strict';



function Player (game,x,y,sprite){
    Phaser.Sprite.call(this,game,x,y,sprite);
    this.game.world.addChild(this);
    this.cursor= this.game.input.keyboard;
    this.vel = 2;
  }

Player.prototype=Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor=Player;

Player.prototype.muevePlayer = function(x,y){
this.x += x;
this.y += y;
}
Player.prototype.compruebaInput = function(){
    var x= 0;
    var y = 0;
    //izquierda
    if (this.cursor.isDown(37))
    {
        x--;
    }
    //derecha
    if (this.cursor.isDown(39))
    {
      x++;
    }
    //arriba
    if (this.cursor.isDown(38))
    {
      y--;
    }
    //abajo
    if (this.cursor.isDown(40))
    {
      y++;
    }

    var h = Math.pow(x,2) + Math.pow(y,2);

    if (h > 1){
      x /=h;
      y /=h;
    }

    this.muevePlayer(x*this.vel,y*this.vel);
}

module.exports = Player;