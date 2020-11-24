export function rain(customOptionsRain) {

    let w = canvas.width;
    let h = canvas.height;
    ctx.strokeStyle = "rgba(174,194,224,0.5)";
    ctx.lineWidth = customOptionsRain.dropWidth;
    ctx.lineCap = "round";
  
    let init = [];
    let maxParts = customOptionsRain.dropAmound;
    for (let a = 0; a < maxParts; a++) {
      init.push({
        x: Math.random() * w,
        y: Math.random() * h,
        l: Math.random() * 1,
        xs: -4 + Math.random() * 4 + 2,
        ys: Math.random() * 10 + 10
      });
    }
  
    let particles = [];
    for (let b = 0; b < maxParts; b++) {
      particles[b] = init[b];
    }
  
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let c = 0; c < particles.length; c++) {
        let p = particles[c];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
        ctx.stroke();
      }
      move();
  
    }
  
    function move() {
      for (let b = 0; b < particles.length; b++) {
        let p = particles[b];
        p.x += p.xs;
        p.y += p.ys;
        if (p.x > w || p.y > h) {
          p.x = Math.random() * w;
          p.y = -20;
        }
      }
    }
  
    timerRain = setInterval(draw, 30);
  
  }