'use strict'

var Creditos =  {
    create:function (game) {

        this.game = game;

        this.credti;
        this.cursor = this.game.input.keyboard;
        this.key1 = Phaser.KeyCode.ENTER;

      
        this.credti = game.add.sprite(0, 0, 'FondoCreditos');
        
    },

    update:function (game) {
        if (this.cursor.isDown(this.key1)) {
            this.state.start('Menu');
          }

    },

};
module.exports = Creditos;