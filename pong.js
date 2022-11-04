// Initial setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 450;

// Variables
const paddleSpeed = 5;
const ballSpeed = 8;

let keys = {
    w: false,
    s: false,
    arrowUp: false,
    arrowDown: false
}

// Utility functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function calculateAngle() {
    let angle;
    do {
        angle = randomIntFromRange(0, 360);
    } while((angle < 120 && angle > 60) || angle < 300 && angle > 240)
    
    return angle;
}

function controlPaddles() {
    if (keys.w === true) leftPaddle.dy = -paddleSpeed;
    else if (keys.s === true) leftPaddle.dy = paddleSpeed;
    else leftPaddle.dy = 0;

    if (keys.arrowUp === true) rightPaddle.dy = -paddleSpeed;
    else if (keys.arrowDown === true) rightPaddle.dy = paddleSpeed;
    else rightPaddle.dy = 0;
}
  
// Classes
class Ball {
    constructor(x, y, velocity, angle, radius, color){
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.angle = angle;
        this.dx = Math.cos(this.angle*(Math.PI/180)) * this.velocity;
        this.dy = Math.sin(this.angle*(Math.PI/180)) * this.velocity;
        this.radius = radius;
        this.color = color;

        this.updateVelocity = function() {
            this.dx = Math.cos(this.angle*(Math.PI/180)) * this.velocity;
            this.dy = Math.sin(this.angle*(Math.PI/180)) * this.velocity;
        }

        this.draw = function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }

        this.update = function() {
            // bouncing from top and bottom
            if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
                this.dy = -this.dy;
            }

            // checking if anyone won point
            if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
                this.angle = calculateAngle();
                this.updateVelocity();
                this.x = canvas.width/2;
                this.y = randomIntFromRange(0.25 * canvas.height, 0.75 * canvas.height);
            }

            // collision
            paddles.forEach(paddle => {
                // leftPaddle
                if (paddle.isLeft === true) {
                    if (this.x - this.radius <= paddle.x + paddle.w &&
                        this.y <= paddle.y + paddle.h &&
                        this.y >= paddle.y) {
                            this.dx = -this.dx;

                            // rotating ball after collision based on distance from center of paddle
                            let distanceFromCenter = this.y - paddle.y - paddle.h * 0.5;
                            if (distanceFromCenter < 0) {
                                distanceFromCenter = -distanceFromCenter;
                                this.angle = -60 * (distanceFromCenter / (paddle.h/2));
                                this.updateVelocity();
                            }
                            else if (distanceFromCenter > 0) {
                                this.angle = 60 * (distanceFromCenter / (paddle.h/2));
                                this.updateVelocity();
                            }
                            else {
                                this.angle = 0;
                                this.updateVelocity();
                            }
                    }
                } 

                // rightPddle
                    else {
                    if (this.x + this.radius >= paddle.x - paddle.w &&
                        this.y <= paddle.y + paddle.h &&
                        this.y >= paddle.y) {
                            this.dx = -this.dx

                            // rotating ball after collision based on distance from center of paddle
                            let distanceFromCenter = this.y - paddle.y - paddle.h * 0.5;
                            if (distanceFromCenter < 0) {
                                distanceFromCenter = -distanceFromCenter;
                                this.angle = 180 + 60 * (distanceFromCenter / (paddle.h/2));
                                this.updateVelocity();
                            }
                            else if (distanceFromCenter > 0) {
                                this.angle = 180 - 60 * (distanceFromCenter / (paddle.h/2));
                                this.updateVelocity();
                            }
                            else {
                                this.angle = 180;
                                this.updateVelocity();
                            }
                    }
                }
            })

            this.x += this.dx;
            this.y += this.dy;

            this.draw();
        }
    }
}

class Paddle {
    constructor(x, y, w, h, isLeft) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dy = 0;
        this.isLeft = isLeft;

        this.draw = function() {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.w, this.h);
            ctx.fill();
            ctx.closePath();
        }

        this.update = function() {
            if (this.y + this.dy > 0 && this.y + this.h + this.dy < canvas.height) {
                this.y += this.dy
            }
            this.draw();
        }
    }
}

// Implementation

let ball;
let leftPaddle;
let rightPaddle;
const paddles = [];

function init() {
    ball = new Ball(canvas.width/2, canvas.height/2, ballSpeed, calculateAngle(), 5, '#f3f3f3');

    const hPaddle = 100;
    const wPaddle = 5;

    leftPaddle = new Paddle(5, canvas.height/2 - hPaddle/2, wPaddle, hPaddle, true);
    rightPaddle = new Paddle(canvas.width - 10, canvas.height/2 - hPaddle/2, wPaddle, hPaddle, false);
    paddles.push(leftPaddle, rightPaddle);
}

// Animation loop

const animate = function() {
    requestAnimationFrame(animate);
    ctx.fillStyle='rgba(79, 79, 79, 0.7)'
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ball.update();
    leftPaddle.update();
    rightPaddle.update();
}

// Event listeners

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'w':
            keys.w = true;
            break;
        case 's':
            keys.s = true;
            break;
        case 'ArrowUp':
            keys.arrowUp = true;
            break;
        case 'ArrowDown':
            keys.arrowDown = true;
            break;
    }
    controlPaddles()
})

window.addEventListener('keyup', e => {
    switch (e.key) {
        case 'w':
            keys.w = false;
            break;
        case 's':
            keys.s = false;
            break;
        case 'ArrowUp':
            keys.arrowUp = false;
            break;
        case 'ArrowDown':
            keys.arrowDown = false;
            break;
    }
    controlPaddles();
})

// window.addEventListener('keydown', e => {
//     switch (e.key) {
//         case 'w':
//             leftPaddle.dy = -paddleSpeed;
//             break;
//         case 's':
//             leftPaddle.dy = paddleSpeed;
//             break;
//         case 'ArrowUp':
//             rightPaddle.dy = -paddleSpeed;
//             break;
//         case 'ArrowDown':
//             rightPaddle.dy = paddleSpeed;
//             break;
//     }
// })

// window.addEventListener('keyup', e => {
//     switch (e.key) {
//         case 'w':
//             leftPaddle.dy = 0;
//             break;
//         case 's':
//             leftPaddle.dy = 0;
//             break;
//         case 'ArrowUp':
//             rightPaddle.dy = 0;
//             break;
//         case 'ArrowDown':
//             rightPaddle.dy = 0;
//             break;
//     }
// })


init();

animate();