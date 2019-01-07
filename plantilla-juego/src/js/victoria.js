'use strict'

var Victoria =  {
    create:function (game) {

        this.game = game;

        this.victory;
        this.cursor = this.game.input.keyboard;
        this.key1 = Phaser.KeyCode.ENTER;

      
        this.victory = game.add.sprite(0, 0, 'FondoVictoria');
        
    },

    update:function (game) {
        if (this.cursor.isDown(this.key1)) {
            this.state.start('Menu');
          }

    },

};
module.exports = Victoria;