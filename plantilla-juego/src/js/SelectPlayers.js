'use strict'

var SelectPlayers =  {
    
    create:function (game) {

        var playersSelection;
        
        var B1;
        var B2;
        var B3;
        

      
        playersSelection = game.add.sprite(400, 500, 'FondoSelectPlayers');
        playersSelection.anchor.setTo(0.5,0.5);
        
        B1 = game.add.button(50, 400, 'Button1', this.functButton1, this, 2, 1, 0);
        B2 = game.add.button(300, 400, 'Button2', this.functButton2, this, 2, 1, 0);
        B3 = game.add.button(550, 400, 'Button2', this.functButton3, this, 2, 1, 0);
        
    },

    update:function (game) {
        

    },
    functButton1: function(game){
        game.numPlayers = 2;
        this.state.start('play');
    },
    functButton2: function(game){
        game.numPlayers = 3;
        this.state.start('play');
    },
    functButton3: function(game){
        game.numPlayers = 4;
        this.state.start('play');
    }
};
module.exports = SelectPlayers;