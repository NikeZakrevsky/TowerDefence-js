"use strict";

var imgTag = new Image();
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var map = 
        [
            ["024","024","024","024","024","003","047","047","047","047","047","047","004","024","024","024","024","024"],
            ["024","024","024","024","024","025","299","001","001","001","001","002","023","024","024","024","024","024"],
            ["024","024","024","024","024","025","023","024","024","024","024","025","023","024","024","024","024","024"],
            ["024","024","024","024","024","025","023","024","024","024","024","025","023","024","024","024","024","024"],
            ["024","024","024","024","024","025","023","024","024","024","024","025","023","024","024","024","024","024"],
            ["024","003","047","047","047","048","023","024","024","024","024","025","023","024","024","024","024","024"],
            ["024","025","299","001","001","001","027","024","024","024","024","025","023","024","024","024","024","024"],
            ["024","025","023","024","024","024","024","024","024","024","024","025","046","047","047","047","047","047"],
            ["024","025","023","024","024","024","024","024","024","024","024","026","001","001","001","001","001","001"],
            ["024","025","023","024","024","024","024","024","024","024","024","024","024","024","024","024","024","024"]
        ]

var mapTower = [
    {x: 200, y: 450, type: "249"}
];
        
var imgs = []

function uniqueArray(array) {
    var result = Array.from(new Set(array));
    return result    
  }

function draw() {
    var loaded = 0;
    var imagesPath = [];
    var uniqueMap = uniqueArray(map.flat());
    for(var i = 0; i < uniqueMap.length; i++) {
        var name = uniqueMap[i] + "";
        imagesPath.push({name: name, path: "assets/PNG/Default size/towerDefense_tile" + uniqueMap[i] + ".png"});
    }
    imagesPath.push({name: "180", path: "assets/PNG/Default size/towerDefense_tile180.png"});
    imagesPath.push({name: "249", path: "assets/PNG/Default size/towerDefense_tile249.png"});
    imagesPath.push({name: "245", path: "assets/PNG/Default size/towerDefense_tile245.png"});

    for(var i = 0; i < imagesPath.length; i++) {
        var img = new Image()
        img.src = imagesPath[i].path;

        imgs.push({name: imagesPath[i].name, image: img});
        img.onload = function() {
            loaded += 1;
            if (loaded == 16) {
                drawAll();
            }
        }
    }
}

var enemyPoints = [{
    x: 100,
    y: 360,
    rotation: -90
},{
    x: 350,
    y: 360,
    rotation: 180
},{
    x: 350,
    y: 40,
    rotation: -90
},{
    x: 740,
    y: 40,
    rotation: 0
},{
    x: 740,
    y: 480,
    rotation: 90
},{
    x: 1100,
    y: 480,
    rotation: 0
}];

function drawAll() {
    loadMap();
    drawTower();
    drawEnemy();
}

var i = 0;
var x = 100;
var y = 500;
async function drawEnemy() {
    for (var i = 0; i < enemyPoints.length; i++) {
        var sign_x;
        var sign_y;
        if(enemyPoints[i].x == x) {
            sign_x = 0;
        }
        if(enemyPoints[i].x < x) {
            sign_x = -1;
        }
        if(enemyPoints[i].x > x) {
            sign_x = 1;
        }

        if(enemyPoints[i].y == y) {
            sign_y = 0;
        }
        if(enemyPoints[i].y < y) {
            sign_y = -1;
        }
        if(enemyPoints[i].y > y) {
            sign_y = 1;
        }
        console.log(sign_x, sign_y)
        await animate(sign_x, sign_y, enemyPoints[i].x, enemyPoints[i].y, enemyPoints[i].rotation);
    }

}


var TO_RADIANS = Math.PI/180; 
function animate(sign_x, sign_y, aim_x, aim_y, rotatation) {
    console.log('animate')
    return new Promise(function(resolve,reject){
        var delta_x = 0;
        var delta_y = 0;

        function subAnimate() {
            loadMap();
            drawTower();
            ctx.translate(x + delta_x + 31, y + delta_y + 31);
            ctx.rotate(rotatation * TO_RADIANS);
            ctx.drawImage(getImageByName("245"), -31, -31, 62, 62);
            ctx.translate(0, 0);
            ctx.setTransform(1,0,0,1,0,0);

            
            console.log()
            delta_x += sign_x;
            delta_y += sign_y;
            console.log((x + delta_x), (y + delta_y))
            if ((x + delta_x) != aim_x || (y + delta_y) != aim_y) { 
                requestAnimationFrame(subAnimate);
            }
            else {
                x = aim_x;
                y = aim_y;
                resolve();
            }
        }

        requestAnimationFrame(subAnimate);
    });
}

function drawTower() {
    ctx.drawImage(getImageByName("180"), mapTower[0].x, mapTower[0].y);
    ctx.drawImage(getImageByName("249"), mapTower[0].x, mapTower[0].y-25);
}

function getImageByName(name) {
    for(var i = 0; i < imgs.length; i++) {
        if (imgs[i].name == name) {
            return imgs[i].image;
        }
    }
    return null;
}

function loadMap() {
    for(var i = 0; i < map.length; i++) {
        for(var j = 0; j < map[0].length; j++) {
            ctx.drawImage(getImageByName(map[i][j]), j*64, i*64);
        }
    }
}

draw();

/*function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(imgTag, x, y);                     
  x += 4;
  y = Math.sqrt(x) * 10;
  console.log(x, y);
  if (x < 1000) requestAnimationFrame(animate);
}*/