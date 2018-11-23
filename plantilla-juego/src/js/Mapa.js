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
    this.añadeObjetos = function (enlace, idSprite, nObj){

        var n_Recursos = nObj; var n = 0;
        var objeto = enlace; //recoge el valor por parámetro
 

        while (n < n_Recursos){
            
           var x = Math.floor(Math.random() * 50 );
           var y = Math.floor(Math.random() * 37 );

           //variable auxiliar. 
           var aux = this.game.add.sprite((x * 16), (y * 16), 'Casco1');
           //this.game.physics.arcade.enable(aux); //activa fisicas para comprobar la colision en la posX,Y
           this.game.physics.enable(aux, Phaser.Physics.ARCADE);
           
           var col = false; var i = 0;
           while (!col && i < this.layerGroup.lenght){
               col = this.game.physics.arcade.collide(aux, this.layerGroup.children[i]);
               i++;
           } 

           console.log ("BOOL COL: " + col); //MENSAJE EN CONSOLA

           if (!col){
            this.recurso.enableBody = true;
            this.recurso.physicsBodyType = Phaser.Physics.ARCADE;

            this.recurso.create(new objeto(this.game, (x * 16), (y * 16), idSprite));

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
    this.añadeLayer = function (str_3){
        this.layerGroup.create(this.tile_Map.createLayer(str_3));
        
    }

    //convierte los elementos de la capa en colisionadores
    this.CollidesCreate = function (layerName){
        
        //probamos con colision toda la capa tileMap (boolCollides, layerName)
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



   var recursosClass = require('./recurso'); //recursos 
   var armasClass = require('./Armas'); //armas
   var recursoIdSprite = 'arbol'; var armasIdSprite = 'subFusil';
   this.añadeObjetos(recursosClass, recursoIdSprite, 50);
   this.añadeObjetos(armasClass, armasIdSprite, 12);
   
}


module.exports = Mapa;
