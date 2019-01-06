"use strict";

var introScene = {
  create: function(game) {
    this.game = game;
 
    //this.video = this.game.video.create();
    this.video = this.game.add.video('introScene');
    this.video.addToWorld(450, 400, 0.5, 0.5, 0.5, 0.5);
    this.video.play();

    this.videoOFF = new Phaser.Signal();
    this.video.onComplete = this.videoOFF;
    this.videoOFF.addOnce(this.changeState,this);
    
   

   
  },
  update: function(game) {
  },

  changeState: function (){
    this.state.start("Menu");
  }

};
module.exports = introScene;

//onComplete
