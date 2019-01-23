"use strict";

var imgTag = new Image();
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
canvas.addEventListener("mousedown", doMouseDown, false);

function doMouseDown(event) {
    console.log(event.pageX, event.pageY)
    var tower = new Tower(event.pageX-31, event.pageY-31, '249');
    towers.push(tower)
}

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
            ["024","025","023","024","024","024","024","024","024","024","024","024","024","024","024","024","024","024"],
            ["024","024","024","024","024","024","024","024","024","024","024","024","024","024","024","024","024","024"],
        ]
        
var imgs = []

function uniqueArray(array) {
    var result = Array.from(new Set(array));
    return result    
  }

function loadImages() {
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
    imagesPath.push({name: "275", path: "assets/PNG/Default size/towerDefense_tile275.png"});
    imagesPath.push({name: "204", path: "assets/PNG/Default size/towerDefense_tile204.png"});
    imagesPath.push({name: "206", path: "assets/PNG/Default size/towerDefense_tile206.png"});

    for(var i = 0; i < imagesPath.length; i++) {
        var img = new Image()
        img.src = imagesPath[i].path;

        imgs.push({name: imagesPath[i].name, image: img});
        img.onload = function() {
            loaded += 1;
            if (loaded == 16) {
                drawAll();
            }ctx.clearRect(20, 20, 100, 50);
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
    rotation: 0
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

class Bullet {
    constructor(initPointX, initPointY) {
        this.initPointX = initPointX;
        this.initPointY = initPointY;
        this.currentPointX = initPointX;
        this.currentPointY = initPointY;
    }
}

class Tower {
    constructor(x, y, imageId) {
        this.x = x;
        this.y = y;
        this.imageId = imageId;
        this.bullets = [];
        this.lastShoot = 0;
    }
}

var tower1 = new Tower(200, 450, '249');
var tower2 = new Tower(450, 200, '249');
var towers = [tower1 ,tower2];

class Enemy {
    constructor(initPointX, initPointY) {
        this.health = 10;
        this.initPointX = initPointX;
        this.initPointY = initPointY;
        this.currentPointX = initPointX;
        this.currentPointY = initPointY;
        this.hits = 0;
        this.enemyPointIndex = 0;
    }

    set setCurrentPointX(X) {
        this.currentPointX = X;
    }

    set setCurrentPointY(Y) {
        this.currentPointY = Y;
    }
}

var enemies = []

function draw() {
    ctx.clearRect(0, 0, 1800, 600);
    loadMap();
    drawEnemy();
    drawTower();
    drawBullet();
    drawMenu()
    requestAnimationFrame(draw)
}

function drawAll() {
    requestAnimationFrame(draw);
}

var i = 0;
var TO_RADIANS = Math.PI/180; 
var delta_x = 0;
var delta_y = 0;

var enemyPointIndex = 0;
var lastEnemy = 0;
var generatedEnemiesAmount = 0;

function drawEnemy() {  
    lastEnemy += 1;
    if (lastEnemy == 100 && generatedEnemiesAmount < 5) {
        var enemy = new Enemy(100, 500);
        enemies.push(enemy);
        generatedEnemiesAmount += 1;
        lastEnemy = 0;
    }
    for(var i = 0; i < enemies.length; i++) {
        var signX;
        var signY;
        if(enemyPoints[enemies[i].enemyPointIndex].x == enemies[i].currentPointX) {
            signX = 0;
        }
        if(enemyPoints[enemies[i].enemyPointIndex].x <  enemies[i].currentPointX) {
            signX = -1;
        }
        if(enemyPoints[enemies[i].enemyPointIndex].x >  enemies[i].currentPointX) {
            signX = 1;
        }

        if(enemyPoints[enemies[i].enemyPointIndex].y ==  enemies[i].currentPointY) {
            signY = 0;
        }
        if(enemyPoints[enemies[i].enemyPointIndex].y < enemies[i].currentPointY) {
            signY = -1;
        }
        if(enemyPoints[enemies[i].enemyPointIndex].y > enemies[i].currentPointY) {
            signY = 1;
        }

        

        ctx.translate(enemies[i].currentPointX + 31, enemies[i].currentPointY + 31);

        ctx.beginPath();
        ctx.fillStyle = "rgba(0,255,0,1)";
        ctx.fillRect(-18, -32, (enemies[i].health - enemies[i].hits)*3, 5)
        ctx.lineWidth = "2";
        ctx.strokeStyle = "black";
        ctx.rect(-18, -32, 30, 5); 
        ctx.stroke();

        ctx.rotate(enemyPoints[enemies[i].enemyPointIndex].rotation * TO_RADIANS);
        ctx.drawImage(getImageByName("245"), -31, -31, 62, 62);

        ctx.translate(0, 0);
        ctx.setTransform(1,0,0,1,0,0);

        enemies[i].currentPointX = enemies[i].currentPointX + signX;
        enemies[i].currentPointY = enemies[i].currentPointY + signY;

        if (enemies[i].currentPointX == enemyPoints[enemies[i].enemyPointIndex].x &&  enemies[i].currentPointY == enemyPoints[enemies[i].enemyPointIndex].y) {
            enemies[i].enemyPointIndex += 1;
        }
    }
}

function getAngle(tower) {
    if (enemies.length == 0) {
        return -Math.PI / 2;
    }
    for (var i = 0; i < enemyPoints.length; i++) {
        var result = Math.sqrt(Math.pow(enemies[0].currentPointX-tower.x, 2) + Math.pow(enemies[0].currentPointY-tower.y, 2))
    }
    if (result < 1000) {
        return Math.atan2(enemies[0].currentPointY - tower.y, enemies[0].currentPointX - tower.x);
    }
    else return -Math.PI / 2;
}

var bullet_current_x = 0;
var bullet_current_y = 0

function drawTower() {
    for (var j = 0; j < towers.length; j++) {
        towers[j].lastShoot += 1;
        ctx.drawImage(getImageByName("180"), towers[j].x, towers[j].y);
        ctx.translate(towers[j].x+31, towers[j].y + 62 - 25);
        var angle = getAngle(towers[j]);
        ctx.rotate(angle + Math.PI / 2); 
        ctx.drawImage(getImageByName("249"), -31, -62, 62, 62);
        ctx.translate(0, 0);
        ctx.setTransform(1,0,0,1,0,0);
    }  
}

function drawBullet() {
    for (var j = 0; j < towers.length; j++) {
        var angle = getAngle(towers[j]);
        var angle1 = (angle + Math.PI / 2);
        if (angle1 < 0)
            angle1 += Math.PI * 2
        if (towers[j].lastShoot > 30 && enemies.length != 0) {
            towers[j].lastShoot = 0;
            var bullet = new Bullet(towers[j].x + 60 * Math.sin(angle1),  towers[j].y - 60 * Math.cos(angle1));
            towers[j].bullets.push(bullet);
        }
        var i = 0;
        while (i < towers[j].bullets.length) {
            ctx.drawImage(getImageByName("275"), towers[j].bullets[i].currentPointX, towers[j].bullets[i].currentPointY);
            if (Math.hypot(towers[j].bullets[i].currentPointX-enemies[0].currentPointX, towers[j].bullets[i].currentPointY-enemies[0].currentPointY) < 15) {
                towers[j].bullets.splice(i,1);
                enemies[0].hits += 1;
                if (enemies[0].hits == 10) {
                    enemies.splice(0,1)

                    if (enemies.length == 0) {
                        for(var k = 0; k < towers.length; k++) {
                            towers[k].bullets = [];
                            towers[k].lastShoot = 0;
                        }
                    }
                }
            }
            else {
                var a = (towers[j].bullets[i].currentPointY - enemies[0].currentPointY) / (towers[j].bullets[i].currentPointX - enemies[0].currentPointX)
                var b = enemies[0].currentPointY - a * enemies[0].currentPointX;
                
                if ((angle >= Math.PI / 2 && angle <= Math.PI) || (angle >= -Math.PI && angle <= -Math.PI / 2)) {
                    towers[j].bullets[i].currentPointX -= 2
                }
                else {
                    towers[j].bullets[i].currentPointX += 2
                }
                towers[j].bullets[i].currentPointY = a * towers[j].bullets[i].currentPointX + b; 
                i += 1;
            }
        }
    }
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

function drawMenu() {
    ctx.drawImage(getImageByName("180"), 350, 630);
    ctx.drawImage(getImageByName("249"), 350, 630-25);

    ctx.drawImage(getImageByName("180"), 410, 630);
    ctx.drawImage(getImageByName("204"), 410, 630-25);

    ctx.drawImage(getImageByName("180"), 470, 630);
    ctx.drawImage(getImageByName("206"), 470, 630-15);
}

loadImages();