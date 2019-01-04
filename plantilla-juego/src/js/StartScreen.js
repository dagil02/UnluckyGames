'use strict'

var startScreen =  {
    create:function (game) {

        var MainMenu;
        var Music;
        this.cursor = this.game.input.keyboard;

      
        MainMenu = game.add.sprite(400, 500, 'Menu');
        MainMenu.anchor.setTo(0.5,1);
        Music = game.add.audio('AudioMenu',0.4,true);
       
        Music.play();
      
        
    },

    update:function (game) {
        if (this.cursor.isDown(13)) {
            this.state.start('play');
          }

    },

};
module.exports = startScreen;