const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Background {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }

    const image = new Image()
    image.src = './images/bg/brickwall.jpg'

    this.image = image
    this.width = canvas.width
    this.height = canvas.height
  }

  draw() {
    
    context.drawImage(
      this.image, 
      this.position.x, 
      this.position.y, 
      canvas.width, 
      canvas.height
    )
  }
}

class Player {
  constructor() {
    
    this.speed = {
      x: 0,
      y: 0
    }
    
    const image = new Image()
    image.src = './images/player/spaceship.png' 
    image.onload = () => {
      const scale = 0.15
      this.image = image
     
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: (canvas.width / 2) - (this.width / 2),
        y: canvas.height - this.height - 20
      }
    } 
  }
  
  draw() {
    if(this.image)
      context.drawImage(
        this.image,
        this.position.x, 
        this.position.y,
        this.width,
        this.height
      )
  }
}

class Enemy {
  constructor() {
    
    this.speed = {
      x: 0,
      y: 0
    }

    const image = new Image()
    image.src = './images/enemy/bat.png' 
    image.onload = () => {
      const scale = 0.6
      this.image = image
      this.width = 100 * scale
      this.height = 100 * scale
      this.position = {
        x: canvas.width - this.width,
        y: canvas.height - this.height - 50
      }
    } 
  }
  
  draw() {
    if(this.image)
      context.drawImage(
        this.image, 
        this.position.x, 
        this.position.y,
        this.width,
        this.height
      )
  }
}

class Bullet {
  constructor({position, speed, radius, style}) {
    this.position = position
    this.speed = speed

    this.radius = radius
    this.style = style
  }
  
  draw() {
    context.beginPath()
    context.arc(
      this.position.x, 
      this.position.y,
      this.radius,
      0, 
      Math.PI * 2
    )
    // context.fillStyle = 'red'
    context.fillStyle = this.style
    context.fill()
    context.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.speed.x
    this.position.y += this.speed.y
  }
}

const background = new Background()
const player = new Player()
const enemy = new Enemy()
const bullets = [new Bullet({
  position: {
    x: 300,
    y: 300,
  },
  speed: {
    x: 0,
    y: 0,
  },
  radius: 5,
  style: 'red'
}
)]
// enemy.draw()

function animate() {
  requestAnimationFrame(animate)
  background.draw();
  player.draw();
  enemy.draw();
  bullets.forEach(bullet => {
    bullet.update();
  });
}

animate()