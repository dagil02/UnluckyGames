'use strict'

var Victoria =  {
    create:function (game) {

        this.game = game;

        this.victory;
        this.cursor = this.game.input.keyboard;
        this.key1 = Phaser.KeyCode.ENTER;

       
        this.victory = game.add.sprite(0, 0, 'FondoVictoria');

        this.rodando = this.game.add.sprite(0, 600, 'rodando');     
        this.game.physics.enable(this.rodando, Phaser.Physics.ARCADE);

        this.velMove = 200;
        this.timeMove = 0;
        this.text1 = this.game.add.bitmapText(100, 500, "fuente1", 'PRESS ENTER  TO BACK TO MENU', 36);
        
    },

    update:function (game) {
        if (this.cursor.isDown(this.key1)) {
            this.state.start('Menu');
          }

          if (this.game.time.now > this.timeMove){
            this.rodando.frame = (this.rodando.frame + 1) % 6;
            this.rodando.x += this.rodando.width;
            if (this.rodando.body.x >= 800){
                this.rodando.body.x = -this.rodando.width;
            }
            this.timeMove += this.velMove;
          }
          

    },

};
module.exports = Victoria;