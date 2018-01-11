
var GameLayer = cc.Layer.extend({
    spritePelota: null,
    velocidadX:null,
    velocidadY:null,
    spriteCoche: null,
    spriteBarra:null,
    spriteBarraIA: null,
    dificultad:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        // Hasta aqui lo comun

        // 1 = Fácil
        // 2 = Normal
        // 3 = Difícil
        // 4 = Imposible
        this.dificultad = 3;
        this.velocidadX = 6;
        this.velocidadY = 4;

        //Fondo
        var spriteFondo = cc.Sprite.create(res.fondo_png);
        spriteFondo.setPosition(cc.p(size.width/2, size.height/2));
        spriteFondo.setScale(size.width / spriteFondo.width);
        this.addChild(spriteFondo);

        // Pelota
        this.spritePelota = cc.Sprite.create(res.bola_png);
        this.spritePelota.setPosition( cc.p( size.width/2 , size.height/2 )  );
        this.addChild(this.spritePelota);

        // Barra aliada
        this.spriteBarra = cc.Sprite.create(res.barra_2_png);
        this.spriteBarra.setPosition(cc.p(size.width*0.1, size.height*0.5 ));
        this.spriteBarra.rotation = 90;
        this.addChild(this.spriteBarra);

        // Barra enemiga
        this.spriteBarraIA = cc.Sprite.create(res.barra_2_png);
        this.spriteBarraIA.setPosition(cc.p(size.width*0.9, size.height*0.5 ));
        this.spriteBarraIA.rotation = 90;
        this.addChild(this.spriteBarraIA);


        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown
        }, this)

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.teclaPulsada
        }, this);


        this.scheduleUpdate();

        return true;

        //Keycodes:
        //37 = left arrow
        //38 = up arrow
        //39 = right arrow
        //40 = down arrow
    }, teclaPulsada: function( keyCode, event ){
         var instancia = event.getCurrentTarget();
         console.log(keyCode);
         if ( keyCode == 38 && instancia.spriteBarra.y < 400){ 
            instancia.spriteBarra.y =  instancia.spriteBarra.y + 10;
         }
         if ( keyCode == 40 && instancia.spriteBarra.y > 50){
            instancia.spriteBarra.y =  instancia.spriteBarra.y - 10;
         }

    }, procesarMouseDown: function ( event ){
        // NUNCA THIS ->  "event.getCurrentTarget()"
        console.log("x: "+event.getLocationX());
        console.log("y: "+event.getLocationY());

        var actionMoverPelota = cc.MoveTo.create( 3,  cc.p( event.getLocationX() , event.getLocationY() )  );
        event.getCurrentTarget().spritePelota.runAction(actionMoverPelota);

    }, update: function(){

        //Mover pelota
        this.spritePelota.x = this.spritePelota.x + this.velocidadX;
        this.spritePelota.y = this.spritePelota.y + this.velocidadY;

        //Mover barra enemiga
        if (this.spriteBarraIA.y < 400 && this.spritePelota.y > this.spriteBarraIA.y){
            this.spriteBarraIA.y = this.spriteBarraIA.y + this.dificultad;
        } else if (this.spriteBarraIA.y > 50 && this.spritePelota.y < this.spriteBarraIA.y){
            this.spriteBarraIA.y = this.spriteBarraIA.y - this.dificultad;
        }

        if (this.spritePelota.x < 0){
            this.spritePelota.x = 0;
            this.velocidadX = this.velocidadX*-1;
        }
        if (this.spritePelota.x > cc.winSize.width){
            this.spritePelota.x = cc.winSize.width;
            this.velocidadX = this.velocidadX*-1;
        }
        if (this.spritePelota.y < 0){
            this.spritePelota.y = 0;
            this.velocidadY = this.velocidadY*-1;
        }
        if (this.spritePelota.y > cc.winSize.height){
            this.spritePelota.y = cc.winSize.height;
            this.velocidadY = this.velocidadY*-1;
        }

       //Colisiones
        var areaPelota = this.spritePelota.getBoundingBox();
        var areaBarra = this.spriteBarra.getBoundingBox();
        var areaBarraIA = this.spriteBarraIA.getBoundingBox();

        if(cc.rectIntersectsRect(areaPelota, areaBarra) || 
            cc.rectIntersectsRect(areaPelota, areaBarraIA)){
                console.log("Collision");
                this.velocidadX = this.velocidadX*-1;
        }
    }

});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        // Hasta aqui lo comun
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

