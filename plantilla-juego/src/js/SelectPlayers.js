'use strict'

var SelectPlayers =  {
    
    create:function (game) {
 
        this.playersSelection = game.add.sprite(400, 500, 'FondoSelectPlayers');
        
        this.B1 = game.add.button(50, 400, 'Button1', this.functButton1, this, 2, 1, 0);
        this.B2 = game.add.button(300, 400, 'Button2', this.functButton2, this, 2, 1, 0);
        this.B3 = game.add.button(550, 400, 'Button3', this.functButton3, this, 2, 1, 0);
        
    },

    update:function (game) {
        

    },
    functButton1: function(game){
        this.game.numPlayers = 2;
        this.state.start('play');
    },
    functButton2: function(game){
        this.game.numPlayers = 3;
        this.state.start('play');
    },
    functButton3: function(game){
        this.game.numPlayers = 4;
        this.state.start('play');
    }
};
module.exports = SelectPlayers;