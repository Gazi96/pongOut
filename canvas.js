var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

var mouse = 
{
    x: undefined,
    y: undefined
}

var audio1 = new Audio('sound/Blaster.mp3');
var audio2 = new Audio('sound/Blaster2.mp3');
var audioLose = new Audio('sound/Chewbaca.mp3')

var score = 0;
var result = document.getElementsByClassName("score")[0];

var sound = true;

var live = 3;
var lives = document.getElementsByClassName("live");

var popUp = document.getElementsByClassName("restart")[0];

addEventListener("mousemove", function(event)
{
    mouse.x = event.x;
    mouse.y = event.y;
});

function soundOf()
{
    if(sound)
    {
        sound = false;
    }
    
    else
    {
        sound = true;
    }
}

Audio.prototype.restart= function() 
{
    this.pause();
    this.currentTime = 0;
    this.play();
};

function Paddle(x, y, width, heigth)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = heigth;
    
    this.draw = function()
    {
        c.fillStyle = "#A1ADB2";
        c.fillRect(this.x, this.y, this.width, this.height);
        c.fillStyle = "#A1ADB2";
    }
    
    this.update = function()
    {
        if(mouse.x != undefined)
        {
            this.x = mouse.x - this.width / 2;
            this.draw();
        }
    }
}

function Ball(x, y, width, height, dx, dy)
{
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.width = width;
    this.height = height;
        
    this.draw = function()
    {
        c.fillStyle = "#DAEBF2";
        c.fillRect(this.x, this.y, this.width, this.height);
        c.fillStyle = "#F24738";
    }
    
    this.update = function()
    {        
        if(this.x - this.width < 0 || this.x + this.width > innerWidth)
        {
            this.dx = -this.dx;
        }
        
        if(this.y + this.height < 0)
        {
            this.dy = -this.dy;
        }
        
        if(this.y + this.height > innerHeight && live > 0)
        {
            console.log(live);
            
            lives[lives.length - 1].parentNode.removeChild(lives[lives.length - 1]);
            live = live - 1;
            if(live > 0)
            {
                ball = new Ball(innerWidth / 2 - 75, 400, 20, 20, 0, 5);
            }
            
            else
            {
                audioLose.restart();
                popUp.style.display = "block";
                popUp.innerHTML = "<h2>Przegrałeś</h2>";
                popUp.innerHTML +=  "<p>Jeżeli chcesz zagrać jeszcze raz, kliknij w planszę.</p>";
            }
        }
        
        if(this.x < paddle.x + paddle.width && this.x + this.width > paddle.x &&   this.y < paddle.y + paddle.height && this.height + this.y > paddle.y)
        {            
            
            if(mouse.x == undefined)
            {
                this.dx = -this.dx;
                this.dy = -this.dy;
            }

            else if(mouse.x - this.x < - 20)
            {
                this.dy = - speed;
                this.dx = -(mouse.x - this.x) / 10;
            }
            
            else if(mouse.x - this.x < 20)
            {
                this.dy = - speed;
                this.dx = -(mouse.x - this.x) /10;
            }
            
            else
            {
                this.dy = - speed;
                this.dx = -(mouse.x - this.x) / 10;
            }
            
            if(sound)
            {
                audio2.restart();
            }
        }
        
        for(var i = 0; i < tabWall.length; i++)
        {
            if(this.x < tabWall[i].x + tabWall[i].width && this.x + this.width > tabWall[i].x &&   this.y < tabWall[i].y + tabWall[i].height && this.height + this.y > tabWall[i].y)
            {
                tabWall.splice(i, 1);
                {
                    this.dx = -this.dx;
                }
                score += 100;
                result.innerHTML = "Score: " + score;
                this.dy = -this.dy;
            }
        }
        
        this.x += this.dx;
        this.y += this.dy;
        this.draw(); 
    }
}

function Wall(x, y, width, height, color)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    
    this.draw = function()
    {
        c.fillStyle = color;
        c.fillRect(this.x, this.y, this.width, this.height);
    }
}

var prevEvent, currentEvent;
document.documentElement.onmousemove=function(event){
  currentEvent = event;
}

setInterval(function()
{
    speed = 1;
    
    if(prevEvent && currentEvent)
    {
        var movementX = Math.abs(currentEvent.screenX-prevEvent.screenX);
        console.log(movementX);
        speed = 9 + 10 * movementX / 30;
        console.log("speed" + speed);
        if(speed > 16)
        {
            speed = 16;
        }
    }
    
    prevEvent = currentEvent;
    
},100);

var paddle;
var ball;
var tabWall;

function init()
{
    paddle = new Paddle(innerWidth / 2 - 75, 600, 150 , 25);
    ball = new Ball(innerWidth / 2, 400, 20, 20, 0, 10);
    tabWall = [];
    
    for(var j = 0; j < 3; j++)
    {
        for(var i = 0; i < 8; i++)
        {
            if(j == 0)
            {
                tabWall.push(new Wall(innerWidth / 2 - 320 + i * 80, 200 + j * 50, 60, 20, "#D73A31"));
            }
            
            if(j == 1)
            {
                tabWall.push(new Wall(innerWidth / 2 - 320 + i * 80, 200 + j * 50, 60, 20, "#56B1BF"));
            }
            
            if(j == 2)
            {
                tabWall.push(new Wall(innerWidth / 2 - 320 + i * 80, 200 + j * 50, 60, 20, "#026B59"));
            } 
        }
    }
}

function animate()
{
    if(tabWall.length > 0)
    {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, innerWidth, innerHeight);

        ball.draw();
        paddle.draw();

        for (var i = 0; i < tabWall.length; i++) {
            tabWall[i].draw();
        }

        paddle.update();
        ball.update();
    }
    
    else
    {
        popUp.style.display = "block";
        popUp.innerHTML = "<h2>Wygrałeś</h2>";
        popUp.innerHTML +=  "<p>Jeżeli chcesz zagrać jeszcze raz, kliknij w planszę.</p>";   
    }
    
}

init();
animate();
