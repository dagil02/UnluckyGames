"use strict";

var Tutorial = {

    create: function (game) {

        this.game = game;
        this.MainMenu = this.game.add.sprite(0, 0, "tutorialtextura");
    
        this.cursor = this.game.input.keyboard;
        this.key1 = Phaser.KeyCode.ENTER;
  
        
      },
    
      update: function () {
    
        if (this.cursor.isDown(this.key1)) {
            this.state.start('Menu');
          }
        }
        

};

module.exports = Tutorial;

 