'use strict'

var startScreen =  {
    create:function (game) {

        var MainMenu;
        this.cursor = this.game.input.keyboard;

        
        /*this.createButton(game, game.world.centerX, game.world.centerY+150, 300, 100,
        function(){
            this.state.start('Play');
        });*/

        MainMenu = game.add.sprite(game.world.centerX, game.world.centerY+100, 'Menu');
        MainMenu.anchor.setTo(0.5,1);
        
    },

    update:function (game) {
        if (this.cursor.isDown(13)) {
            this.state.start('play');
          }

    },

    createButton : function(game, x, y, w, h, callback){
        var button1 = game.add.button(x,y,'button', callback, this, 2,1);

        button1.anchor.setTo(0.5,0.5);
        button1.width = w;
        button1.height = h;

    }



};
module.exports = startScreen;