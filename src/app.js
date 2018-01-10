
var GameLayer = cc.Layer.extend({
    spritePelota: null,
    velocidadX:null,
    velocidadY:null,
    spriteCoche: null,
    spriteBarra:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        // Hasta aqui lo comun

        this.velocidadX = 6;
        this.velocidadY = 4;

        // Pelota
        this.spritePelota = cc.Sprite.create(res.bola_png);
        this.spritePelota.setPosition( cc.p( size.width/2 , size.height/2 )  );
        this.addChild(this.spritePelota);

        // Barra
        this.spriteBarra = cc.Sprite.create(res.barra_2_png);
        this.spriteBarra.setPosition(cc.p(cc.winSize.width*0.5 , size.height*0.1 ));
        this.addChild(this.spriteBarra);


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

    }, teclaPulsada: function( keyCode, event ){
         var instancia = event.getCurrentTarget();
         console.log(keyCode);
         if ( keyCode == 37 ){
            instancia.spriteBarra.x =  instancia.spriteBarra.x - 14;
         }
         if ( keyCode == 39 ){
            instancia.spriteBarra.x =  instancia.spriteBarra.x + 14;
         }

    }, procesarMouseDown: function ( event ){
        // NUNCA THIS ->  "event.getCurrentTarget()"
        console.log("x: "+event.getLocationX());
        console.log("y: "+event.getLocationY());

        var actionMoverPelota = cc.MoveTo.create( 3,  cc.p( event.getLocationX() , event.getLocationY() )  );
        event.getCurrentTarget().spritePelota.runAction(actionMoverPelota);

    }, update: function(){
        this.spritePelota.x = this.spritePelota.x + this.velocidadX;
        this.spritePelota.y = this.spritePelota.y + this.velocidadY;

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

