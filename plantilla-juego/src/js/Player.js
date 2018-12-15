'use strict';



function Player (game,x,y,sprite){
    game.physics.startSystem(Phaser.Physics.ARCADE);  
    Phaser.Sprite.call(this,game,x,y,sprite);
    this.game.world.addChild(this);
    this.cursor= this.game.input.keyboard;
    this.orientation = 0;
    this.vel = 2;
    this.nextFire = 0;
    this.bulletTime = 0; //controla que no se dispare constantemente
    //Inicializacion fisicas jugador
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    //Inicializacion pool de balas
    this.balas = game.add.group();
    this.balas.enableBody = true;
    this.balas.physicsBodyType = Phaser.Physics.ARCADE;
    this.balas.createMultiple(50, 'bala');
    this.balas.setAll('anchor.x', 0.5);
    this.balas.setAll('anchor.y', 1);
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
        this.orientation = 3;
    }
    //derecha
    else if (this.cursor.isDown(39))
    {
      x++;
      this.orientation = 1;
    }
    //arriba
    else if (this.cursor.isDown(38))
    {
      y--;
      this.orientation = 0;
    }
    //abajo
    else if (this.cursor.isDown(40))
    {
      y++;
      this.orientation = 2;
    }

 

    this.muevePlayer(x*this.vel,y*this.vel);
}

Player.prototype.Disparo = function(x,y){
 
  
  if (this.cursor.isDown(65)){
    
       

       var bullet = this.balas.getFirstExists(false);
       if (this.game.time.now > this.bulletTime){
        if (bullet)
        {
            bullet.angle = 90 * this.orientation;
            if (this.orientation === 0){
              bullet.reset(this.x + 8, this.y + 8);
              bullet.body.velocity.y = -320;
            }else if (this.orientation === 1){
              bullet.reset(this.x + 24, this.y + 8);
              bullet.body.velocity.x = 320;
            }else if (this.orientation === 2){
              bullet.reset(this.x + 8, this.y + 8);
              bullet.body.velocity.y = 320;
            }else if (this.orientation === 3){
              bullet.reset(this.x - 8, this.y + 8);
              bullet.body.velocity.x = -320;
            }
         
            this.bulletTime = this.game.time.now + 200;
        }
    
  }
}


}

module.exports = Player;

