'use strict'

var startScreen =  {
    create:function (game) {

        var MainMenu;
        this.cursor = this.game.input.keyboard;

      
        MainMenu = game.add.sprite(400, 500, 'Menu');
        MainMenu.anchor.setTo(0.5,1);
        
    },

    update:function (game) {
        if (this.cursor.isDown(13)) {
            this.state.start('play');
          }

    },

};
module.exports = startScreen;