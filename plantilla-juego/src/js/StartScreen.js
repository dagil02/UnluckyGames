'use strict'

var startScreen =  {
    
    create:function (game) {

        var MainMenu;
        var Music;
        this.cursor = this.game.input.keyboard;

      
        MainMenu = game.add.sprite(400, 500, 'Menu');
        MainMenu.anchor.setTo(0.5,1);
        this.Music = game.add.audio('AudioMenu',0.4, true);
       
        this.Music.play();
      
        
    },

    update:function (game) {
        if (this.cursor.isDown(13)) {
            //this.Music.mute = true;
            this.Music.stop();

            this.state.start('SPScene');
          }

    },

};
module.exports = startScreen;