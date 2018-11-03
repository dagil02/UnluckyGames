'use strict';

var controls = {};

var map;
var layer_0, layer_1, layer_2, layer_3, layer_4;

  var PlayScene = {

  create: function () {


    this.game.stage.backgroundColor = '#787878'; //fondo por defecto
    map = this.game.add.tilemap('mapa'); //parametro: definicion clase main
    map.addTilesetImage('tilesMap', 'tiles'); //parametros: tileset name (json), def. clase main
    layer_0 = map.createLayer('background'); //parametros: nombre capa (json), posicion en cannvas
    //layer.fixedToCamera = false;//desactiva la camara fija
    layer_1 = map.createLayer('obstaculo pradera');
    layer_2 = map.createLayer('obstaculo nieve');
    layer_3 = map.createLayer('obstaculo desierto')
    layer_4 = map.createLayer('collider'); //colisionadores 



    
    

    /*controls = {
      right: this.input.keyboard.addKey(Phaser.Keyboard.D),
      left: this.input.keyboard.addKey(Phaser.Keyboard.A),
      up: this.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.input.keyboard.addKey(Phaser.Keyboard.S),
    };*/

  }, 


  update: function(){}
};

module.exports = PlayScene;
