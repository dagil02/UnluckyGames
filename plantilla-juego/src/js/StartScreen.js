'use strict'

var startScreen =  {
    
    create:function (game) {

        this.game = game;
        this.game.world.setBounds(0, 0, 800, 800);
        this.MainMenu = game.add.sprite(0, 0, 'Menu');
        this.Music =  game.add.audio('AudioMenu',0.4, true);
        this.cursor = this.game.input.keyboard;
        //input 
        this.key1 = Phaser.KeyCode.ENTER;

        this.MainMenu.width = 800;
        this.MainMenu.height = 800;

        this.Music.play();
      
        
    },

    update:function (game) {
        if (this.cursor.isDown(this.key1)) {

            this.Music.stop();

            this.state.start('SPScene');
          }

    },

};
module.exports = startScreen;