'use strict';


//falta crear variable para controlar las phisicas
//var collisionWithTilemap = this.game.physics.arcade.collide(this._rush, this.layerName);
function Mapa (game){


    //ATRIBUTOS
    this.game = game;
    this.game.physics.startSystem(Phaser.Physics.ARCADE); //inicia el motor de físicas

    this.tile_Map; //recoge el mapa de tiles

    this.layerGroup = this.game.add.group(); //capas con los patrones del mapa
    this.recurso = this.game.add.group(); //arbol = identificador en Preload clase Game
    

    //FUNCIONES 
    //genera aleatorio para recursos y añade al grupo
    this.añadeRecursos = function (){
        var n_Recursos = 50; var n = 0;
        var objeto = require('./Objeto');

        var aux; 

        while (n < n_Recursos){
            
           var x = Math.floor(Math.random() * 50 );
           var y = Math.floor(Math.random() * 37 );

           //variable auxiliar. 
           aux = new objeto(this.game, (x * 16), (y * 16), 'arbol');
           this.game.physics.arcade.enable(aux); //activa fisicas para comprobar la colision en la posX,Y
           
           var col = false; var i = 0;
           while (!col && i < this.layerGroup.length){
            if (this.game.physics.arcade.collide(aux, this.layerGroup[i])){
                col = true;
            }
            i++;
           }

           if (!col){
            this.recurso.add(new objeto(this.game, (x * 16), (y * 16), 'arbol'));
            n++;  
           }
                  
        }//fin while   
        aux.destroy();
    }

    //añade el mapa de tiles precargado en el main
    this.añadeTileMap = function (str){
        this.tile_Map = this.game.add.tilemap(str);
    }
    //añade la img de patrones
    this.añadeTileImg = function (str_1, str_2){
        this.tile_Map.addTilesetImage(str_1, str_2); 
    }
    //añade entidades al grupo
    this.añadeLayer = function (str_3){
        this.layerGroup.add(this.tile_Map.createLayer(str_3));
    }

    //convierte los elementos de la capa en colisionadores
    this.CollidesCreate = function (layerName){
        //(start, stop, boolCollides, layerName) el rango se identifica con el num tiles de la capa
        //pero probamos con colision toda la capa tileMap (boolCollides, layerName)
        this.tile_Map.setCollision(true, layerName);
    }
}

Mapa.prototype.generate = function() {
   this.añadeTileMap('mapa');
   this.añadeTileImg('tilesMap', 'tiles');

   //añadimos las entidades al grupo
   //capas del mapa
   this.añadeLayer('background');  
   this.añadeLayer('obstaculo pradera');  
   this.añadeLayer('obstaculo nieve');  
   this.añadeLayer('obstaculo desierto'); 
   
   //determina las colisiones
   this.CollidesCreate('obstaculo pradera');
   this.CollidesCreate('obstaculo nieve');
   this.CollidesCreate('obstaculo desierto');

   //recursos
   this.añadeRecursos();
}


module.exports = Mapa;
