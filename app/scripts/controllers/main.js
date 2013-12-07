'use strict';

console.log();

var gameworld = null;

angular.module('planetsApp')
  .controller('MainCtrl', ['$scope', function ($scope) {

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma',
      'SitePoint'
    ];


    console.log("MainCtrl");


    gameworld = new embox2dTest_planetary();
    gameworld.myDebugDraw = gameworld.getCanvasDebugDraw();         
    gameworld.myDebugDraw.SetFlags(e_shapeBit);
    gameworld.world.SetDebugDraw(gameworld.myDebugDraw);
    console.log("<><><"+gameworld.viewCenterPixel);
    gameworld.setViewCenterWorld( new b2Vec2(0,8), true );
    gameworld.animate();
    gameworld.setup();

 




  }]);


