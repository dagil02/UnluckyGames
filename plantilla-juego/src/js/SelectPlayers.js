'use strict'

var SelectPlayers =  {
    
    create:function (game) {
 
        this.game = game;
        this.playersSelection = game.add.sprite(0, 0, 'FondoSelectPlayers');
        
        //2players
        this.B1 = this.game.add.button(50, 400, 'Button1', this.functButton1, this);
        this.B1.onInputOver.add(this.B1funcionUP, this);
        this.B1.onInputOut.add(this.B1funcionOut, this);
        //3 players
        this.B2 = this.game.add.button(300, 400, 'Button2', this.functButton2, this);
        this.B2.onInputOver.add(this.B2funcionUP, this);
        this.B2.onInputOut.add(this.B2funcionOut, this);
        //4 players
        this.B3 = this.game.add.button(550, 400, 'Button3', this.functButton3, this);
        this.B3.onInputOver.add(this.B3funcionUP, this);
        this.B3.onInputOut.add(this.B3funcionOut, this);

        
    },

    update:function (game) {
        

    },
    functButton1: function(game){
        this.game.numPlayers = 2;
        this.state.start('play');
    },
    B1funcionUP: function(){
        this.B1.loadTexture('Button1A');
    },
    B1funcionOut: function(){
        this.B1.loadTexture('Button1');
    },

    functButton2: function(game){
        this.game.numPlayers = 3;
        this.state.start('play');
    },
    B2funcionUP: function(){
        this.B2.loadTexture('Button2A');
    },
    B2funcionOut: function(){
        this.B2.loadTexture('Button2');
    },
    functButton3: function(game){
        this.game.numPlayers = 4;
        this.state.start('play');
    },
    B3funcionUP: function(){
        this.B3.loadTexture('Button3A');
    },
    B3funcionOut: function(){
        this.B3.loadTexture('Button3');
    }
};
module.exports = SelectPlayers;