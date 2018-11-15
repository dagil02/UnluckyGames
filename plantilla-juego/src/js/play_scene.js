'use strict';

var mapa = require('./Mapa');



  var PlayScene = {

  create: function () {

   this.mapa = new mapa (this.game);
   this.mapa.generate();

  }, 

  update: function(){
  }

};



module.exports = PlayScene;
