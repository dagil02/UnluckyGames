'use strict'

var Creditos =  {
    create:function (game) {

        var Credit;
        this.cursor = this.game.input.keyboard;

      
        Credit = game.add.sprite(400, 700, 'FondoCreditos');
        Credit.anchor.setTo(0.5,1);
        
    },

    update:function (game) {
        if (this.cursor.isDown(13)) {
            this.state.start('Menu');
          }

    },

};
module.exports = Creditos;