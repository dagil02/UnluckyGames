"use strict";

var introScene = {
  create: function(game) {
    this.game = game;
 
    this.video = this.game.add.video('introScene');
    this.video.addToWorld(450, 400, 0.5, 0.5, 0.5, 0.5);
    this.video.play();

 
    //this.introTime = 3400;
   
   
  },
  update: function(game) {
    /*if (this.game.time.now > this.introTime){
        this.state.start("Menu");
    }*/
  }
};
module.exports = introScene;

//onComplete
