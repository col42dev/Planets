//(function() {


    using(Box2D, "b2.+");

    //Having to type 'Box2D.' in front of everything makes porting
    //existing C++ code a pain in the butt. This function can be used
    //to make everything in the Box2D namespace available without
    //needing to do that.
    function using(ns, pattern) {    
        if (pattern == undefined) {
            // import all
            for (var name in ns) {
                this[name] = ns[name];
            }
        } else {
            if (typeof(pattern) == 'string') {
                pattern = new RegExp(pattern);
            }
            // import only stuff matching given pattern
            for (var name in ns) {
                if (name.match(pattern)) {
                    this[name] = ns[name];
                }
            }       
        }
    }


    'use strict';


    console.log("embox2dTest_planetary......................");


    function embox2dTest_planetary() {


            //constructor
            console.log("embox2dTest_planetary constructor");

            this.world = new b2World( new b2Vec2(0.0, 0.0) );

            this.mPlanets = new Array();
            this.mBodies = new Array();
            this.mousePosWorld;
            this.PTM = 26;
            console.log(">>>>" + document.getElementById("canvas"));
            this.canvas = document.getElementById("canvas");
            this.context = this.canvas.getContext( '2d' );
            this.myDebugDraw = null;         

            this.prevMousePosPixel = {
                x: 0,
                y: 0
            };        
            this.mousePosWorld = {
                x: 0,
                y: 0
            };        
            this.canvasOffset = {
                x: 0,
                y: 0
            };        
            console.log("!!!!!!!!!!!!!!!!!!!!!");
            this.viewCenterPixel = {
                x:320,
                y:240
            };    

        
            this.canvasOffset.x = this.canvas.width/2;
            this.canvasOffset.y = this.canvas.height/2;    

            //embox2dTest_planetary.prototype.myDebugDraw = embox2dTest_planetary.prototype.getCanvasDebugDraw();         
            //embox2dTest_planetary.prototype.myDebugDraw.SetFlags(e_shapeBit);



            //embox2dTest_planetary.prototype.setViewCenterWorld( new b2Vec2(0,8), true );

        };


/*
   window.onload = function() {

        console.log("window.onload");

        embox2dTest_planetary();

   };*/


    embox2dTest_planetary.prototype.animate = function() {
        if ( true ) {
            requestAnimFrame( gameworld.animate );
        }
        gameworld.step();
    }



    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function( callback ){
                  window.setTimeout(callback, 1000 / 60);
                };
    })();

    embox2dTest_planetary.prototype.myRound =function(val,places) {
        var c = 1;
        for (var i = 0; i < places; i++)
            c *= 10;
        return Math.round(val*c)/c;
    }

    embox2dTest_planetary.prototype.getWorldPointFromPixelPoint = function(pixelPoint) {
        return {                
            x: (pixelPoint.x - this.canvasOffset.x)/this.PTM,
            y: (pixelPoint.y - (this.canvas.height - this.canvasOffset.y))/this.PTM
        };
    };

    embox2dTest_planetary.prototype.setViewCenterWorld = function(b2vecpos, instantaneous) {
        var currentViewCenterWorld = this.getWorldPointFromPixelPoint( this.viewCenterPixel );
        var toMoveX = b2vecpos.get_x() - currentViewCenterWorld.x;
        var toMoveY = b2vecpos.get_y() - currentViewCenterWorld.y;
        var fraction = instantaneous ? 1 : 0.25;
        this.canvasOffset.x -= this.myRound(fraction * toMoveX * this.PTM, 0);
        this.canvasOffset.y += this.myRound(fraction * toMoveY * this.PTM, 0);
    };

    embox2dTest_planetary.prototype.drawAxes = function(ctx) {
        ctx.strokeStyle = 'rgb(192,0,0)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(1, 0);
        ctx.stroke();
        ctx.strokeStyle = 'rgb(0,192,0)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 1);
        ctx.stroke();
    };

    embox2dTest_planetary.prototype.setColorFromDebugDrawCallback = function(color) {            
        var col = Box2D.wrapPointer(color, b2Color);
        var red = (col.get_r() * 255)|0;
        var green = (col.get_g() * 255)|0;
        var blue = (col.get_b() * 255)|0;
        var colStr = red+","+green+","+blue;
        this.context.fillStyle = "rgba("+colStr+",0.5)";
        this.context.strokeStyle = "rgb("+colStr+")";
    };

    embox2dTest_planetary.prototype.drawSegment = function(vert1, vert2) {
        var vert1V = Box2D.wrapPointer(vert1, b2Vec2);
        var vert2V = Box2D.wrapPointer(vert2, b2Vec2);                    
        this.context.beginPath();
        this.context.moveTo(vert1V.get_x(),vert1V.get_y());
        this.context.lineTo(vert2V.get_x(),vert2V.get_y());
        this.context.stroke();
    };

    embox2dTest_planetary.prototype.drawPolygon = function(vertices, vertexCount, fill) {
        this.context.beginPath();
        for(tmpI=0;tmpI<vertexCount;tmpI++) {
            var vert = Box2D.wrapPointer(vertices+(tmpI*8), b2Vec2);
            if ( tmpI == 0 )
                this.context.moveTo(vert.get_x(),vert.get_y());
            else
                this.context.lineTo(vert.get_x(),vert.get_y());
        }
        this.context.closePath();
        if (fill)
            this.context.fill();
        this.context.stroke();
    };

    embox2dTest_planetary.prototype.drawCircle = function(center, radius, axis, fill) {                    
        var centerV = Box2D.wrapPointer(center, b2Vec2);
        var axisV = Box2D.wrapPointer(axis, b2Vec2);
        
        this.context.beginPath();
        this.context.arc(centerV.get_x(),centerV.get_y(), radius, 0, 2 * Math.PI, false);
        if (fill)
            this.context.fill();
        this.context.stroke();
        
        if (fill) {
            //render axis marker
            var vert2V = copyVec2(centerV);
            vert2V.op_add( scaledVec2(axisV, radius) );
            this.context.beginPath();
            this.context.moveTo(centerV.get_x(),centerV.get_y());
            this.context.lineTo(vert2V.get_x(),vert2V.get_y());
            this.context.stroke();
        }
    };

    embox2dTest_planetary.prototype.drawTransform = function(transform) {
        var trans = Box2D.wrapPointer(transform,b2Transform);
        var pos = trans.get_p();
        var rot = trans.get_q();
        
        this.context.save();
        this.context.translate(pos.get_x(), pos.get_y());
        this.context.scale(0.5,0.5);
        this.context.rotate(rot.GetAngle());
        this.context.lineWidth *= 2;
        this.drawAxes(this.context);
        this.context.restore();
    };

    embox2dTest_planetary.prototype.getCanvasDebugDraw = function() {
        var debugDraw = new Box2D.b2Draw();
        var _this = this;
                
        Box2D.customizeVTable(debugDraw, [{
        original: Box2D.b2Draw.prototype.DrawSegment,
        replacement:
            function(ths, vert1, vert2, color) {                    
                _this.setColorFromDebugDrawCallback(color);                    
                _this.drawSegment(vert1, vert2);
            }
        }]);
        
        Box2D.customizeVTable(debugDraw, [{
        original: Box2D.b2Draw.prototype.DrawPolygon,
        replacement:
            function(ths, vertices, vertexCount, color) {                    
                _this.setColorFromDebugDrawCallback(color);
                _this.drawPolygon(vertices, vertexCount, false);                    
            }
        }]);
        
        Box2D.customizeVTable(debugDraw, [{
        original: Box2D.b2Draw.prototype.DrawSolidPolygon,
        replacement:
            function(ths, vertices, vertexCount, color) {                    
                _this.setColorFromDebugDrawCallback(color);
                _this.drawPolygon(vertices, vertexCount, true);                    
            }
        }]);
        
        Box2D.customizeVTable(debugDraw, [{
        original: Box2D.b2Draw.prototype.DrawCircle,
        replacement:
            function(ths, center, radius, color) {                    
                _this.setColorFromDebugDrawCallback(color);
                var dummyAxis = b2Vec2(0,0);
                _this.drawCircle(center, radius, dummyAxis, false);
            }
        }]);
        
        Box2D.customizeVTable(debugDraw, [{
        original: Box2D.b2Draw.prototype.DrawSolidCircle,
        replacement:
            function(ths, center, radius, axis, color) {                    
                _this.setColorFromDebugDrawCallback(color);
                _this.drawCircle(center, radius, axis, true);
            }
        }]);
        
        Box2D.customizeVTable(debugDraw, [{
        original: Box2D.b2Draw.prototype.DrawTransform,
        replacement:
            function(ths, transform) {
                _this.drawTransform(transform);
            }
        }]);
        
        return debugDraw;
    };



    embox2dTest_planetary.prototype.setup = function() {
        //set up the Box2D scene here - the world is already created
        
        console.log("JJJJJJJJJJJJJJJJJJJJJJJJJ");

        var shape = new b2EdgeShape();
        shape.Set(new b2Vec2(-40.0, 0.0), new b2Vec2(40.0, 0.0));
        
        var ground = this.world.CreateBody(new b2BodyDef());
        ground.CreateFixture(shape, 0.0);
        
        //shape = new b2PolygonShape();
        //shape.SetAsBox(0.25, 1.5, new b2Vec2(-7.0, 4.0), 0.0);
        //ground.CreateFixture(shape, 0.0);


        this.addPlanet(1, 7 ,  1.0);
        this.addPlanet(8, 7, 1.0);
        this.addPlanet(-4, 10, 1.0);

        this.addVessel(-5, 5);

        //var body;
        //body = this.addBody(3.0, 6.0, 0.3);
        //body.ApplyForce(new b2Vec2(0, 100), body.GetWorldCenter());
        //body = this.addBody(8.0, 4.0, 0.3);
        //body.ApplyForce(new b2Vec2(0, 100), body.GetWorldCenter());
       
        
        var _this = this;
        
        this.canvas.addEventListener('mousedown', function(evt) {
            _this.updateMousePos(canvas, evt);
            //body = _this.addBody(_this.mousePosWorld.x, _this.mousePosWorld.y, 0.3);
        }, false);


        this.canvas.addEventListener('keydown', function(evt) {
            _this.onKeyDown(canvas,evt);
        }, false);
        
        this.canvas.addEventListener('keyup', function(evt) {
            _this.onKeyUp(canvas,evt);
        }, false);


    };

    embox2dTest_planetary.prototype.onKeyDown = function(canvas, evt) {
        if ( evt.keyCode == 87 ) { // 'w'
            for (var bodyKey in this.mBodies) {
                var baseOrientation = new b2Vec2(1, 1);

                baseOrientation.set_x(this.mBodies[bodyKey].GetWorldVector( new b2Vec2(1, 0) ).get_x());
                baseOrientation.set_y(this.mBodies[bodyKey].GetWorldVector( new b2Vec2(1, 0) ).get_y());

                baseOrientation.set_x(0.2 * baseOrientation.get_x());
                baseOrientation.set_y(0.2 * baseOrientation.get_y());

                this.mBodies[bodyKey].ApplyLinearImpulse(baseOrientation, this.mBodies[bodyKey].GetWorldCenter());
            }
        }
        else if ( evt.keyCode == 65 ) {// 'a'

            for (var bodyKey in this.mBodies) {
                this.mBodies[bodyKey].ApplyAngularImpulse(.005);
                //this.mBodies[bodyKey].ApplyTorque(.005);
            }

        }
        else if ( evt.keyCode == 68 ) {// 'd'
            for (var bodyKey in this.mBodies) {
                this.mBodies[bodyKey].ApplyAngularImpulse(-.005);
                //this.mBodies[bodyKey].ApplyTorque(-.005);
            }
        }

    };

    embox2dTest_planetary.prototype.onKeyUp = function (canvas, evt) {
        if ( evt.keyCode == 16 ) {//shift
            shiftDown = false;
        }
    };


    embox2dTest_planetary.prototype.updateMousePos = function (canvas, evt) {
        var canvas = document.getElementById("canvas");
        var rect = this.canvas.getBoundingClientRect();
        mousePosPixel = {
            x: evt.clientX - rect.left,
            y: canvas.height - (evt.clientY - rect.top)
        };
        this.mousePosWorld = this.getWorldPointFromPixelPoint(mousePosPixel);
    } ;   


    // Box2D does not implemnet air resistance 
    // http://ilearnsomethings.blogspot.com/2013/05/air-resistance-in-box2d.html
    embox2dTest_planetary.prototype.applyAirResistance = function() {


        for (var bodyKey in this.mBodies) {

            var  dragForce;
            var appliedDrag = new b2Vec2();
            var dragAngle;
            var p = 5.0;  // ρ is the density of the fluid,
            var A;  // A is the cross-sectional area
            var Cd;  // Cd is the drag coefficient – a dimensionless number.
            var v;  // v is the speed of the object relative to the fluid,

            /*
                sample drag co-efficients (http://en.wikipedia.org/wiki/Drag_coefficient)
                    cube = 1.05
                    sphere = 0.47
                    streamlined-body (smooth wing shape) = 0.04
            */

            // it's not necessary to calculate fluid density as I have, try 1.0 and change it until it looks nice
            p = 5.0;  // density of the fluid


            // we can just leave this, cross-sections are beyond the scope of what we want to simulate
            A = 1.0; 

            // a very sleek object
            Cd = 0.05; 

            v = Math.pow(this.mBodies[bodyKey].GetLinearVelocity().Length(), 2);  // speed squared
            dragForce = 0.5 * p * v * Cd * A;

            // we need the angle of the body's current velocity to know which angle we should set the drag force
            dragAngle = Math.atan2( this.mBodies[bodyKey].GetLinearVelocity().get_x(), this.mBodies[bodyKey].GetLinearVelocity().get_y());

            // align the drag to the same angle as our velocity
            appliedDrag = new b2Vec2(Math.sin(dragAngle) * dragForce, Math.cos(dragAngle) * dragForce);

            // drag should slow down velocity when added to current velocity, so we make it negative
            appliedDrag.set_x(-appliedDrag.get_x());
            appliedDrag.set_y(-appliedDrag.get_y());

            this.mBodies[bodyKey].ApplyForceToCenter(appliedDrag, true);

        }
    };


    embox2dTest_planetary.prototype.applyAngularAirResistance = function() {

        for (var bodyKey in this.mBodies) {

            var  dragForce;
            var appliedDrag = new b2Vec2();
            var dragAngle;
            var p, A, Cd, v;  // elements of the formula see wikipedia entry for Drag (physics)

            p = 1.0;
            A = 1.0;
            Cd = 0.05;
            v = Math.pow(this.mBodies[bodyKey].GetAngularVelocity(), 2);

            if ( this.mBodies[bodyKey].GetAngularVelocity() > 0) {
                dragForce = -0.5 * p * v * Cd * A;
            } 
            else if ( this.mBodies[bodyKey].GetAngularVelocity() < 0) {
                dragForce = 0.5 * p * v * Cd * A;
            } else {
                dragForce = 0.0;
            }

            this.mBodies[bodyKey].ApplyTorque(dragForce);        
        }

    };

    embox2dTest_planetary.prototype.step = function() {

        console.log("step");
        this.applyAirResistance();
        this.applyAngularAirResistance();


        for (var bodyKey in this.mBodies) {


            var bodyPosition = this.mBodies[bodyKey].GetWorldCenter();

            for (var planetKey in this.mPlanets) {

                var planetShape = this.mPlanets[planetKey].GetFixtureList().GetShape();
                var planetRadius = planetShape.get_m_radius();
                var planetPosition = this.mPlanets[planetKey].GetWorldCenter();

                var planetDistance = new b2Vec2(bodyPosition.get_x() - planetPosition.get_x() , bodyPosition.get_y() - planetPosition.get_y());

                planetDistance.set_x(-planetDistance.get_x() );
                planetDistance.set_y(-planetDistance.get_y() );

                var force = 5.0 / (planetDistance.Length() * planetDistance.Length());

                planetDistance.Normalize();

                var  scaledF = new b2Vec2(planetDistance.get_x() * force, planetDistance.get_y() * force);

                this.mBodies[bodyKey].ApplyForce(scaledF, this.mBodies[bodyKey].GetWorldCenter());
            }
        }


        this.world.Step(1/60, 3, 2);


        //black background
        this.context.fillStyle = 'rgb(0,0,0)';
        this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );
        
        this.context.save();            
            this.context.translate(this.canvasOffset.x, this.canvasOffset.y);
            this.context.scale(1,-1);                
            this.context.scale(this.PTM,this.PTM);
            this.context.lineWidth /= this.PTM;
            
            this.drawAxes(this.context);
            
            this.context.fillStyle = 'rgb(255,255,0)';
            this.world.DrawDebugData();
            
        this.context.restore();            



    };

    embox2dTest_planetary.prototype.addPlanet = function(x,y,r) {

        var radius = r;
        var shape = new b2CircleShape();
        shape.set_m_radius(radius);

        var bd = new b2BodyDef();
        bd.set_type(b2_staticBody);
        bd.set_position(new b2Vec2(x, y));
        var body = this.world.CreateBody(bd);
        body.CreateFixture(shape, 0.0);   

        this.mPlanets[this.mPlanets.length] = body;

        return body;
    };

    embox2dTest_planetary.prototype.addBody = function(x,y,r) {

        var radius = r;
        var shape = new b2CircleShape();
        shape.set_m_radius(radius);

        var bd = new b2BodyDef();
        bd.set_type(b2_dynamicBody);
        bd.set_position(new b2Vec2(x, y));
        var body = this.world.CreateBody(bd);
        body.CreateFixture(shape, 10.0);   

        this.mBodies[this.mBodies.length] = body;

        return body;
    };


    embox2dTest_planetary.prototype.addVessel = function(x,y) {

        var verts = [];
        verts.push( new b2Vec2( 0,-0.25 ) );
        verts.push( new b2Vec2( 1,0 ) );
        verts.push( new b2Vec2( 0, 0.25 ) );
        var shape = this.createPolygonShape( verts );


        var bd = new b2BodyDef();
        bd.set_type(b2_dynamicBody);
        bd.set_position(new b2Vec2(x, y));
        //bd.set_angle(3.0);
        //bd.linearDamping = 20.0;
        //bd.angularDamping = 3.8;    

        var body = this.world.CreateBody(bd);

        //var fixtureDef = new b2FixtureDef();
        //fixtureDef.set_density( 2.5 );
        //fixtureDef.set_friction( 0.6 );
        //fixtureDef.set_shape( circleShape );

        body.CreateFixture(shape, 1.0);


        this.mBodies[this.mBodies.length] = body;

        return body;
    };

    embox2dTest_planetary.prototype.createPolygonShape = function(vertices) {
        var shape = new b2PolygonShape();            
        var buffer = Box2D.allocate(vertices.length * 8, 'float', Box2D.ALLOC_STACK);
        var offset = 0;
        for (var i=0;i<vertices.length;i++) {
            Box2D.setValue(buffer+(offset), vertices[i].get_x(), 'float'); // x
            Box2D.setValue(buffer+(offset+4), vertices[i].get_y(), 'float'); // y
            offset += 8;
        }            
        var ptr_wrapped = Box2D.wrapPointer(buffer, Box2D.b2Vec2);
        shape.Set(ptr_wrapped, vertices.length);
        return shape;
    };



    var e_shapeBit = 0x0001;
    var e_jointBit = 0x0002;
    var e_aabbBit = 0x0004;
    var e_pairBit = 0x0008;
    var e_centerOfMassBit = 0x0010;


    //to replace original C++ operator =
    function copyVec2(vec) {
        return new b2Vec2(vec.get_x(), vec.get_y());
    }

    //to replace original C++ operator * (float)
    function scaleVec2(vec, scale) {
        vec.set_x( scale * vec.get_x() );
        vec.set_y( scale * vec.get_y() );            
    }

    //to replace original C++ operator *= (float)
    function scaledVec2(vec, scale) {
        return new b2Vec2(scale * vec.get_x(), scale * vec.get_y());
    }


    // http://stackoverflow.com/questions/12792486/emscripten-bindings-how-to-create-an-accessible-c-c-array-from-javascript
    function createChainShape(vertices, closedLoop) {
        var shape = new b2ChainShape();            
        var buffer = Box2D.allocate(vertices.length * 8, 'float', Box2D.ALLOC_STACK);
        var offset = 0;
        for (var i=0;i<vertices.length;i++) {
            Box2D.setValue(buffer+(offset), vertices[i].get_x(), 'float'); // x
            Box2D.setValue(buffer+(offset+4), vertices[i].get_y(), 'float'); // y
            offset += 8;
        }            
        var ptr_wrapped = Box2D.wrapPointer(buffer, Box2D.b2Vec2);
        if ( closedLoop )
            shape.CreateLoop(ptr_wrapped, vertices.length);
        else
            shape.CreateChain(ptr_wrapped, vertices.length);
        return shape;
    }

    function createPolygonShape(vertices) {
        var shape = new b2PolygonShape();            
        var buffer = Box2D.allocate(vertices.length * 8, 'float', Box2D.ALLOC_STACK);
        var offset = 0;
        for (var i=0;i<vertices.length;i++) {
            Box2D.setValue(buffer+(offset), vertices[i].get_x(), 'float'); // x
            Box2D.setValue(buffer+(offset+4), vertices[i].get_y(), 'float'); // y
            offset += 8;
        }            
        var ptr_wrapped = Box2D.wrapPointer(buffer, Box2D.b2Vec2);
        shape.Set(ptr_wrapped, vertices.length);
        return shape;
    }

    function createRandomPolygonShape(radius) {
        var numVerts = 3.5 + Math.random() * 5;
        numVerts = numVerts | 0;
        var verts = [];
        for (var i = 0; i < numVerts; i++) {
            var angle = i / numVerts * 360.0 * 0.0174532925199432957;
            verts.push( new b2Vec2( radius * Math.sin(angle), radius * -Math.cos(angle) ) );
        }            
        return createPolygonShape(verts);
    }


//}()); //IIFE