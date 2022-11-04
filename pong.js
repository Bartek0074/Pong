// Initial setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 450;

// Variables

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
  

// Event listeners

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
            this.angle = calculateAngle();
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
                this.updateVelocity();
                this.x = canvas.width/2;
                this.y = randomIntFromRange(0.25 * canvas.height, 0.75 * canvas.height);
            }

            this.x += this.dx;
            this.y += this.dy;

            this.draw();
        }
    }
}

// Implementation

let ball;

function init() {
    const x = canvas.width/2;
    const y = canvas.height/2;
    const velocity = 5;
    const angle = calculateAngle();
    const radius = 5;
    const color = '#f3f3f3'
    ball = new Ball(x, y, velocity, angle, radius, color);
}

// Animation loop

const animate = function() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball.update();
}

init();

animate();