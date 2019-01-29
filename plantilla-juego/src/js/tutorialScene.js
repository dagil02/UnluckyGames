"use strict";

var Tutorial = {

    create: function (game) {

        this.game = game;
        this.MainMenu = this.game.add.sprite(0, 0, "tutorialtextura");
    
        this.cursor = this.game.input.keyboard;
        this.key1 = Phaser.KeyCode.ENTER;

        /*this.tutorialMenu = this.game.add.sprite (0, 0, 'tutorial');
        this.tutorialMenu.smoothed = false;   
        this.anim =  this.tutorialMenu.animations.add('anima', [0,1,2] , 24, true);
        this.anim.play (1, true);  */      
      },
    
      update: function () {
    
        if (this.cursor.isDown(this.key1)) {
            this.state.start('Menu');
          }
        }
        

};

module.exports = Tutorial;

 