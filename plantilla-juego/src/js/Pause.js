'use strict'

var Pause =  {
    create:function (game) {

        var Pause;
        this.cursor = this.game.input.keyboard;

        
        
        Pause = game.add.sprite(game.world.centerX, game.world.centerY+100, 'Pausa');
        Pause.anchor.setTo(0.5,0.5);
        
    },

    update:function (game) {
        if (this.cursor.isDown(13)) {
            this.state.setTo('play');
        }
        else if (this.cursor.isDown(27)) {
            this.state.start('Menu');
            
        }


    },

  



};
module.exports = Pause;