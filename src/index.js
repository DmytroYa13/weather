
import { EMPTY, fromEvent } from 'rxjs';
import { tap, map, debounceTime, distinctUntilChanged, switchMap, mergeMap, catchError, filter, take, first } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax';
import './style.css'

setTimeout(() => { document.getElementById('preload').classList.remove('preload') }, 3000)

const back = document.getElementById('back')
const search = document.getElementById('text')
const temp = document.getElementById('temp')
const img = document.getElementById('imgChild')
const darkBackground = document.getElementById('dark-background')
const fog = document.getElementById('fog')
const sun = document.getElementById('sun')
const darkCloud = document.getElementById('dark-cloud')
const cityName = document.getElementById('city')
const wetherText = document.getElementById('wether-text')
const textA = document.getElementById('text1')
const textB = document.getElementById('text2')
const info = document.getElementById('info')
const seasonsOfYear = document.getElementById('seasons')

let seasons = ""
let timerRain
let timerSnow
let timerThund

const date = new Date().getMonth();

switch (date) {
  case 0:
  case 1:
  case 11:
    back.style.backgroundImage = `url(./img/0.jpg)`;
    seasons = 'Winter'
    break;

  case 2:
  case 3:
  case 4:
    back.style.backgroundImage = `url(./img/1.jpg)`;
    seasons = 'Spring'

    break;
  case 5:
  case 6:
  case 7:
    back.style.backgroundImage = `url(./img/2.jpg)`;
    seasons = 'Summer'

    break;
  case 8:
  case 9:
  case 10:
    back.style.backgroundImage = `url(./img/3.jpg)`;
    seasons = 'Autumn'

    break;
}

seasonsOfYear.innerHTML = seasons

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

window.addEventListener('resize', function () {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  console.log(w, h);
});





const stream$ = fromEvent(search, 'input')
  .pipe(
    map(val => val.target.value),
    debounceTime(1000),
    distinctUntilChanged(),
    tap((v) => {
      if (!v) {
        clearInfo('Type city')
      }
      info.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
      img.removeAttribute('src')
    }),

    filter((log) => log.trim()),
    switchMap(v => ajax.getJSON(`https://api.weatherbit.io/v2.0/forecast/daily?city=${v}&key=43a46402bc514f63a920f501e8612a41`)
      .pipe(
        catchError(item => EMPTY),
      )),
    tap(v => {
      if (!v) {
        clearInfo('No city');
        }
    }
    ),
    filter(log => log != null),
    tap(v => cityName.innerHTML = v.city_name),
    map(res => res.data[1])
  )

stream$.subscribe((user) => {
  console.log(user)
  clearCanvasLoad()
  textA.innerHTML = 'The weather in'
  textB.innerHTML = 'for tomorrow is'
  temp.innerHTML = user.temp + '°'
  wetherText.innerHTML = user.weather.description
  let code = user.weather.code
  
  if (code >= 200 && code <= 202) {

    let customOptionsRain = {
      dropAmound: 1000,
      dropWidth: 1
    }
    img.setAttribute('src', './img/spring/springRain.png')
    darkBackground.classList.add('visible-block')
    rain(customOptionsRain)
    thunder()
  }

  else if (code >= 230 && code <= 233) {

    img.setAttribute('src', './img/spring/springTund.png')
    darkBackground.classList.add('visible-block')
    thunder()

  }

  else if (code >= 300 && code <= 302) {

    img.setAttribute('src', './img/spring/springDrizzle.png')
    let customOptionsRain = {
      dropAmound: 100,
      dropWidth: 1
    }
    rain(customOptionsRain)
  }

  else if (code >= 500 && code <= 522) {

    img.setAttribute('src', './img/spring/springRain.png')
    let customOptionsRain = {
      dropAmound: 1000,
      dropWidth: 1
    }
    rain(customOptionsRain)
    darkCloud.classList.add('visible-block')
  }


  else if (code >= 600 && code <= 623) {

    img.setAttribute('src', './img/winter/winterSnow.png')

    let customOptionsSnow = {
      flakeDensity: 3,
      fallingSpeed: 3
    };
    snow(customOptionsSnow);
    // darkCloud.classList.add('visible-block') 
  }



  else if (code >= 700 && code <= 751) {

    img.setAttribute('src', './img/winter/winterBlow.png')
    fog.classList.add('visible-block')
  }

  else if (code === 800) {

    img.setAttribute('src', './img/summer/summerBase.png')
    sun.classList.add('visible-block')

  }

  else if (code >= 801 && code <= 802) {

    img.setAttribute('src', './img/summer/summerCloud.png')
    darkCloud.classList.add('visible-block')
    sun.classList.add('visible-block')

  }

  else if (code >= 803) {

    img.setAttribute('src', './img/spring/sptingDarkCloud.png')
    darkCloud.classList.add('visible-block')

  }


})


document.addEventListener('DOMContentLoaded', function(){ 
  setTimeout(function () {
      console.log(window.outerWidth);
      let viewheight = window.outerHeight;
      let viewwidth = window.outerWidth;
      let viewport = document.querySelector("meta[name=viewport]");
      viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0");
  }, 300);
});



function thunder() {

  let lightning = [];
  let lightTimeCurrent = 0;
  let lightTimeTotal = 0;

  // let w = canvas.width = window.innerWidth;
  // let h = canvas.height = window.innerHeight;

  // window.addEventListener('resize', function () {
  //   w = canvas.width = window.innerWidth;
  //   h = canvas.height = window.innerHeight;
  // });

  function random(min, max) {
    return Math.random() * (max - min + 1) + min;
  }

  function clearCanvas() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,' + random(1, 30) / 100 + '';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
  };

  function createRainTrough() {

  }

  function createLightning() {
    let x = random(50, w - 300);
    let y = 20;

    let createCount = random(0, 2);
    for (let i = 0; i < createCount; i++) {
      let single = {
        x: x,
        y: y,
        xRange: random(5, 20),
        yRange: random(3, 8),
        path: [{
          x: x,
          y: y
        }],
        pathLimit: random(40, 55)
      };
      lightning.push(single);
    }
  };


  function drawLightning() {
    for (let i = 0; i < lightning.length; i++) {
      let light = lightning[i];

      light.path.push({
        x: light.path[light.path.length - 1].x + (random(0, light.xRange) - (light.xRange / 2)),
        y: light.path[light.path.length - 1].y + (random(0, light.yRange))
      });

      if (light.path.length > light.pathLimit) {
        lightning.splice(i, 1);
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, .5)';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(light.x, light.y);
      for (let pc = 0; pc < light.path.length; pc++) {
        ctx.lineTo(light.path[pc].x, light.path[pc].y);
      }
      if (Math.floor(random(0, 30)) === 1) {
        ctx.fillStyle = 'rgba(255, 255, 255, ' + random(1, 3) / 100 + ')';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.lineJoin = 'miter';
      ctx.stroke();
    }
  };


  function animateLightning() {
    clearCanvas();
    lightTimeCurrent++;
    if (lightTimeCurrent >= lightTimeTotal) {
      createLightning();
      lightTimeCurrent = 10;
      lightTimeTotal = 200;
    }
    drawLightning();
  }

  function init() {
    createRainTrough();
    window.addEventListener('resize', createRainTrough);
  }
  init();

  function animloop() {
    animateLightning();
    timerThund = requestAnimationFrame(animloop);
  }
  animloop();

  // document.addEventListener('click', ()=>{
  //   console.log('8');
  //   cancelAnimationFrame(timerThund)
  // })


}



























































// RAINNNNNNNNNNNNNNNN

function rain(customOptionsRain) {

  // let w = canvas.width;
  // let h = canvas.height;
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


//SNOWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

function snow(customOptionsSnow) {

  let flakeDensity = customOptionsSnow.flakeDensity;
  let fallingSpeed = customOptionsSnow.fallingSpeed;

  let W = canvas.width;
  let H = canvas.height;

  let numFlakes = 0;
  let flakes = [];

  if (!!(canvas.getContext && canvas.getContext('2d'))) {
    //Canvas exists
    setPositions();
    drawSnowflakes();
  }

  //Give each snowflake a random position
  function setPositions() {
    //canvas dimensions
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W;
    canvas.height = H;

    //This varies the number of snowflakes showing dependent on size of the element
    numFlakes = Math.floor(W / (10 / flakeDensity));
    ctx.clearRect(0, 0, W, H);

    //snowflake flakes
    flakes = [];
    for (let i = 0; i < numFlakes; i++) {
      flakes.push({
        x: Math.random() * W, //x-coordinate
        y: Math.random() * H, //y-coordinate
        r: Math.random() * 9 + 1 //radius
      });
    }

    window.addEventListener("resize", setPositions);

  }

  //Long function which we could tidy up
  function drawSnowflakes() {
    ctx.clearRect(0, 0, W, H);
    // console.log('1');

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();

    for (let i = 0; i < numFlakes; i++) {

      let p = flakes[i];
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);

    }
    ctx.fill();

    let angle = 0;

    for (let i = 0; i < numFlakes; i++) {

      angle += 0.01;

      let p = flakes[i];
      //Updating X and Y coordinates
      p.y += (Math.cos(angle) + 0.5 + p.r) / (10 / fallingSpeed);
      p.x += Math.sin(angle) * 0.75;


      //Checks if flakes has left screen
      if (p.x > W + 5 || p.x < -5 || p.y > H) {

        if (i % 3 > 0) {

          flakes[i] = {
            x: Math.random() * W,
            y: -10,
            r: p.r,
            d: p.d
          };

        } else {
          //If the flake has exited from the right
          if (p.x > W) {
            //Enter from the left
            flakes[i] = {
              x: -5,
              y: Math.random() * H,
              r: p.r
            };
          } else {
            //Enter from the right
            flakes[i] = {
              x: W + 5,
              y: Math.random() * H,
              r: p.r
            };
          }
        }
      }
    }

    // timerSnow = requestAnimationFrame(drawSnowflakes);


  };
  timerSnow = setInterval(drawSnowflakes, 20)
  // requestAnimationFrame(drawSnowflakes);


}




function clearCanvasLoad() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clearInterval(timerRain)
  cancelAnimationFrame(timerThund)
  clearInterval(timerSnow)

  darkCloud.classList.remove('visible-block')
  sun.classList.remove('visible-block')
  fog.classList.remove('visible-block')
  darkBackground.classList.remove('visible-block')

}

function clearInfo(mes = null){
  clearCanvasLoad()
  temp.innerHTML = ''
  wetherText.innerHTML = ''
  textA.innerHTML = ''
  textB.innerHTML = ''
  cityName.innerHTML = mes
}


