'use strict';



function Player (game,x,y,sprite){
    game.physics.startSystem(Phaser.Physics.ARCADE);  
    Phaser.Sprite.call(this,game,x,y,sprite);
    this.game.world.addChild(this);
    this.cursor= this.game.input.keyboard;
    this.vel = 2;
    this.nextFire = 0;
    this.fireRate = 100; //velocidad de disparo
    this.balas = game.add.group();
    this.balas.enableBody = true;
    this.balas.physicsBodyType = Phaser.Physics.ARCADE;
    this.balas.createMultiple(50, 'bullet');
    this.balas.setAll('checkWorldBounds', true);
    this.balas.setAll('outOfBoundsKill', true);
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

    var h = Math.sqrt( Math.pow(x,2) + Math.pow(y,2));

    if (h > 1){
      x /=h;
      y /=h;
    }

    this.muevePlayer(x*this.vel,y*this.vel);
}

Player.prototype.Disparo = function(x,y){
 
  
  if (this.cursor.isDown(65)){
    
        //nextFire = game.time.now + fireRate;

        var bala = this.balas.getFirstDead();

        bala.reset(sprite.x - 8, sprite.y - 8);

        game.physics.arcade.moveToPointer(bala, 300);
    
  }


}

module.exports = Player;

//Clase Bala
