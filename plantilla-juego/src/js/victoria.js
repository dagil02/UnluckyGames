'use strict'

var Victoria =  {
    create:function (game) {

        this.game = game;

        this.victory;
        this.cursor = this.game.input.keyboard;
        this.key1 = Phaser.KeyCode.ENTER;


       
        this.victory = game.add.sprite(0, 0, 'FondoVictoria');

     
        this.rodando = this.game.add.sprite(0, 600, 'rodando'); 
        this.rodando.smoothed = false;   
        this.anim = this.rodando.animations.add('walk', [0,2,3,4,5] , 12, true);

        this.anim.play (8, true);
       

        this.text1 = this.game.add.bitmapText(100, 500, "fuente1", 'PRESS ENTER  TO BACK TO MENU', 36);
        
    },

    update:function (game) {
        if (this.cursor.isDown(this.key1)) {
            this.state.start('Menu');
          }

          this.rodando.x += 3;
          //tope lateral + frame width
          if (this.rodando.x > this.game.world.width + this.rodando.width) {
            this.rodando.x = -this.rodando.width;
          }
    },

};
module.exports = Victoria;