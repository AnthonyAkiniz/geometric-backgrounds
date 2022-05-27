let canvas;
let ctx;
let flowField;
let flowFieldAnimation;

window.onload = function() {
    canvas = document.getElementById('canvas1');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    flowField.animate(0);
}

// Resizes Canvas Background As Browser Window Is Resized
window.addEventListener('resize', function() {
    cancelAnimationFrame(flowFieldAnimation);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    flowField.animate(0);
});

const mouse = {
    x: 0,
    y: 0,
}
window.addEventListener('mousemove', function(e) {
mouse.x = e.x;
mouse.y = e.y;

});

class FlowFieldEffect {
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#ctx.lineWidth = 1;
        this.#width = width;
        this.#height = height;
        this.lastTime = 0;
        this.interval = 1000/60; //effect refresh or frame rate
        this.timer = 0;
        this.cellSize = 15; //increases line size, too low is very processor intensive
        this.gradient;
        this.#createGradient();
        this.#ctx.strokeStyle = this.gradient;
        this.radius = 0; //sets static radius
        this.vr = 0.03;
    }

    #createGradient() {
        this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
        this.gradient.addColorStop("0.4", "purple");
        this.gradient.addColorStop("0.3", "red");
        this.gradient.addColorStop("0.6", "blue");


    }

    #drawLine(angle, x, y) {
        let positionX = x;
        let positionY = y;
        let dx = mouse.x - positionX;
        let dy = mouse.y - positionY;
        let distance = dx * dx + dy * dy;
        if (distance > 5000000) distance = 0.05; //caps max distance length
        else if (distance < 100 ) distance = 5; //caps minimum distance length
        let length = distance/10000;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        this.#ctx.stroke();
    }
    animate(timeStamp) {
        let deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        if (this.timer > this.interval) {
            this.#ctx.clearRect(0, 0, this.#width, this.#height);
            this.radius += this.vr; // activates variable radius or animation
            if (this.radius > 5 || this.radius < -5) this.vr *= -1; //when animation ends, rotates in opposite direction

            for (let y = 0; y < this.#height; y += this.cellSize) {
                for (let x = 0; x < this.#width; x += this.cellSize) {
                    const angle = (x*0.01, y*-0.02) * this.radius; //sets pattern like (x*0.01, y*-0.02), (x*0.01, y*0.005), (x*0.01,y*-0.01)
                    this.#drawLine(angle, x, y);
                }
            }
            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }
        flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
    }
}