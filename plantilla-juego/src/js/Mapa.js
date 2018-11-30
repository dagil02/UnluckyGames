'use strict';

//node_modules/.bin/gulp run


function Mapa (game){


    //ATRIBUTOS
    this.game = game;

    this.tile_Map; //recoge el mapa de tiles

    this.layer_background; this.layer_obstaculo_0; this.layer_obstaculo_1; this.layer_obstaculo_2;
    
    
    


    //FUNCIONES 
    //genera aleatorio para recursos y añade al grupo
    this.añadeObjetos = function (enlace, idSprite, nObj){

        var n_Recursos = nObj; var n = 0;
        var objeto = enlace; //recoge el valor por parámetro
 

        while (n < n_Recursos){
            
           var x = Math.floor(Math.random() * 50 );
           var y = Math.floor(Math.random() * 37 );

           //variable auxiliar. 
           var aux = this.game.add.sprite((x * 16), (y * 16), 'Casco1');
           //activa físicas del objeto
           this.game.physics.arcade.enable(aux);
           aux.enableBody = true;
           
           
           var col = false; var i = 1;
           while (!col && i < this.tile_Map.layerGroup.length){
               col = this.game.physics.arcade.collide(this.tile_Map.layerGroup.children[i],aux);
               i++;
           } 
          

           console.log ("BOOL COL: " + col); //MENSAJE EN CONSOLA

           if (!col){
            //this.recurso.enableBody = true;
            //this.recurso.physicsBodyType = Phaser.Physics.ARCADE;

            this.recurso.add(new objeto(this.game, (x * 16), (y * 16), idSprite));

            n++;  
           }
           aux.destroy(); //destruye la variable para que no se quede renderizada
                  
        }//fin while   
       
      
        
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
    this.añadeLayer = function (){

       
        
        //º las variables recojen las capas
        this.layer_background = this.tile_Map.createLayer('background');
        this.layer_obstaculo_0 = this.tile_Map.createLayer('obstaculo desierto'); 
        this.layer_obstaculo_1 = this.tile_Map.createLayer('obstaculo pradera'); 
        this.layer_obstaculo_2 = this.tile_Map.createLayer('obstaculo nieve'); 
        
 
        this.game.physics.arcade.enable(this.layer_obstaculo_0);
        this.game.physics.arcade.enable(this.layer_obstaculo_1);
        this.game.physics.arcade.enable(this.layer_obstaculo_2);

        this.tile_Map.setCollision([this.tile_Map.getLayerIndex('obstaculo desierto')], true, this.layer_obstaculo_0);
        this.tile_Map.setCollision([this.tile_Map.getLayerIndex('obstaculo pradera')], true, this.layer_obstaculo_1);
        this.tile_Map.setCollision([this.tile_Map.getLayerIndex('obstaculo nieve')], true, this.layer_obstaculo_2);

        /*this.tile_Map.setCollision([this.tile_Map.getLayerIndex('obstaculo desierto')], true, 'obstaculo desierto');
        this.tile_Map.setCollision([this.tile_Map.getLayerIndex('obstaculo pradera')], true, 'obstaculo pradera');
        this.tile_Map.setCollision([this.tile_Map.getLayerIndex('obstaculo nieve')], true, 'obstaculo nieve');*/

        //this.tile_Map.setCollisionByExclusion([10, 11, 12], true); 
        /*this.tile_Map.setCollisionByExclusion([11], true,  this.layer_obstaculo_1); 
        this.tile_Map.setCollisionByExclusion([12], true,  this.layer_obstaculo_2); */


        //º se añaden al grupo
        this.tile_Map.layerGroup.add(this.layer_background);
        this.tile_Map.layerGroup.add(this.layer_obstaculo_0);
        this.tile_Map.layerGroup.add(this.layer_obstaculo_1);
        this.tile_Map.layerGroup.add(this.layer_obstaculo_2);

    }

}


Mapa.prototype.generate = function() {
    
   this.añadeTileMap('mapa');
   this.añadeTileImg('tilesMap', 'tiles');

   this.tile_Map.layerGroup = this.game.add.group(); //capas con los patrones del mapa
   this.recurso = this.game.add.group(); //arbol = identificador en Preload clase Game

   //se crean las capas, se definen como colisiones y se añaden al grupo
   this.añadeLayer();


   //se require de la clase objeto para genrar sus hijos. 
   var recursosClass = require('./recurso'); //recursos 
   var armasClass = require('./Armas'); //armas
   var recursoIdSprite = 'arbol'; var armasIdSprite = 'subFusil';
   this.añadeObjetos(recursosClass, recursoIdSprite, 50);
   this.añadeObjetos(armasClass, armasIdSprite, 12);
}


module.exports = Mapa;
