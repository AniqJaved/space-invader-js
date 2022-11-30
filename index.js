const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Player { 
    constructor(){ 
        
        this.velocity = { 
            x: 0, 
            y: 0 
        } 
        
        //tilting of spaceship when it moves
        this.rotation = 0

        //getting image

        const image = new Image()
        image.src = './images/spaceship.png'

        image.onload = () =>{        //This function runs only when the image is completely loaded
            const scale = 0.10
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = { 
                x: canvas.width / 2 - this.width / 2,  // we are using this.width so the area covered by image itself is also distributed evenly
                y: canvas.height - this.height - 20 
            } 
        }
    } 

    //Apperance of our player
    draw(){
        //Just making a box
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)


        //Functionalty for tilting the spaceship as it moves from left to right or right to left
        //So basically we are rotating the whole canvas as the spaceship moves left or right. c.save and c.restore takes a snapshot of the rotated canvas and then brings it back to original position instead of rotating it.
        c.save()
        c.translate(  //Rotated canvas
            player.position.x + player.width / 2,
            player.position.y + player.height / 2 
        )

        c.rotate(this.rotation)

        c.translate(  //canvas back to its original position
            -player.position.x - player.width / 2,
            -player.position.y - player.height / 2
        )

        //Using the spaceship image 
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        
        c.restore()
    }

    update(){
        if(this.image){  //Runs only when the image is loaded.
            this.draw()
            this.position.x += this.velocity.x
        } 
    }
}

//The bullets are the projectile that we will be shooting to the enemies
class Projectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 3
    }

    draw(){
        // This is begin to close is used to make a circle
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)  // So this function will bascially create an arc in which second last value is the start of angle and last value is the angle where the arc ends.
        c.fillStyle = 'red'  // fillStyle will put the color of the circle
        c.fill()
        c.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}



//Explosion when the bullet hits enemy
class Particle {
    constructor({position, velocity, radius, color}){
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color

        this.opacity = 1
    }

    draw(){
        // This is begin to close is used to make a circle
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)  // So this function will bascially create an arc in which second last value is the start of angle and last value is the angle where the arc ends.
        c.fillStyle = this.color  // fillStyle will put the color of the circle
        c.fill()
        c.closePath()
        c.restore()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.opacity -= 0.01
    }
}





class Invader { 
    constructor({ position }){ 
        
        this.velocity = { 
            x: 0, 
            y: 0 
        } 
        
        

        //getting image

        const image = new Image()
        image.src = './images/enemy.png'

        image.onload = () =>{        //This function runs only when the image is completely loaded
            const scale = 0.03
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = { 
                x: position.x,  // we are using position which will be giving dynamic value
                y: position.y 
            } 
        }
    } 

    //Apperance of our player
    draw(){
        //Just making a box
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)


        

        //Using the spaceship image 
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update({velocity}){
        if(this.image){  //Runs only when the image is loaded.
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        } 
    }

    shoot(invaderProjectiles){
        invaderProjectiles.push(
            new invaderProjectile({
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height
                },
                velocity: {
                    x: 0,
                    y: 5
                }
            })
        )
    }
}

//The bullets are the invaderProjectile that enemy will be shooting to the spaceship.
class invaderProjectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.width = 3
        this.height = 10
    }

    draw(){
        // This is fillRect to close is used to make a rectangle
        c.fillStyle = 'white'
        c.fillRect(this.position.x,  this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    
    
}


// Grid is bascially used to create a matrix in which we will be storing the enemies.
class Grid{
    constructor(){
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders = []

        const columns = Math.floor(Math.random() * 10 + 2)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width = columns * 60  //we have written 60 cuz there are 60 invaders in one column.
        //Here the grid is being made in which element corresponds to an object
        for(let x=0; x < columns; x++){
            for(let y=0; y < rows; y++){
                this.invaders.push(
                    new Invader({
                        position: {
                            x: x * 55,
                            y: y * 35
                        }
                    })
                )
            }
        }
    }

    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0
        //To bounce the invaders off the side when the touch the sides while moving from left to right and vice versa.
        if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
            this.velocity.x = -this.velocity.x

            //Pushing the grid down everytime the grid hit the boundary. Then aboe we are setting it to zero so that it
            //won't be moving down constantly.
            this.velocity.y = 30
        }
    }
}

const player = new Player()
//const invader = new Invader()
const projectiles = []
const grids = [new Grid()]
const invaderProjectiles = []
const particles = []

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

let frames = 0


function createParticles({object, color}){
    for (let i = 0; i < 15; i++){ // We are producing 15 particles for every explosion.
        particles.push(new Particle({
        position:{
            x: object.position.x + object.width / 2,
            y: object.position.y + object.height / 2
        },
        velocity:{
            x: (Math.random() - 0.5) * 2, //This will create particles which moves in all direction.
            y: (Math.random() - 0.5) * 2
        },
        radius: Math.random() * 3,
        color: color || 'yellow'
    }))
}
}

function animate(){  
    requestAnimationFrame(animate) //we are using this request animation frame because it will be running after every few milliseconds and if we dont use it then the image that we are extracting will not load. But in this case as it is reloading then the image gets load.
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    //invader.update()
    player.update()

    particles.forEach((particle,i) =>{

        // Previously when the particles opacity reached 0 they move to negative and their opacity increased negatively, which respawns them. But now we are just splicing them out.
        if(particle.opacity <= 0){

            setTimeout(()=>{
                particles.splice(i,1)
            }, 0)
        }
        else{
            particle.update()
        }
    })

    //Making projectiles of enemies.
    invaderProjectiles.forEach(invaderProjectile =>{
        invaderProjectile.update()
    })


    projectiles.forEach( (projectile, index) => {  //Here we are using update method on every projectile to make a bullet of it.
        if(projectile.position.y + projectile.radius <= 0){  //Removing the projectile from the array when they are out of the canvas.
            setTimeout(()=>{           //Sometimes the update and the splice would happen it same time which will be creating bug. TO solve it we are using setTimeOut in order to say that the splicing and updating should have a one frame difference.
                projectiles.splice(index,1)
            },0)
        }
        else{       //Making the new projectile or bullets.
            projectile.update()
        }
        
        //projectile.update()
    })
    console.log(grids)
    //Here we are moving the grid and along with that we are moving each individual invader as well.
    grids.forEach((grid) => {
        grid.update()

        
        // spawn enemy projectiles after some specific amount of frames.
        // if(frames % 100 === 0 && grid.invaders.length > 0){
        //     grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        //         invaderProjectiles
        //     )
        // }

        console.log(invaderProjectiles)

        grid.invaders.forEach((invader,i) =>{
            invader.update({velocity: grid.velocity})

            // When the projectile hit the enemy, 
            projectiles.forEach((projectile,j) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height && 
                    projectile.position.x + projectile.radius >= invader.position.x && 
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width && 
                    projectile.position.y + projectile.radius >= invader.position.y){

                    setTimeout(()=>{ 
                        //Finding that particular invader which is currently being iterated in the forEach loop.
                        const invaderFound = grid.invaders.find((invader2) =>{
                            return invader2 === invader
                        })
                        //Finding that particular projectile which is currently being iterated in the forEach loop.
                        const projectileFound = projectiles.find((projectiles2) =>{
                            return projectiles2 === projectile
                        })
                        
                        //Removing the the invader as well as the projectile by using the splice method.
                        if(invaderFound && projectileFound){


                            //Showing explosions when bullets hit the enemy.
                            createParticles({
                                object: invader
                            })

                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)
                        }
                    }, 0)
                }
            })
        })
    })

    if(keys.a.pressed && player.position.x >= 0){
        player.velocity.x = - 5
        player.rotation = -0.15
    }
    else if(keys.d.pressed && player.position.x + player.width <= canvas.width){
        player.velocity.x = 5
        player.rotation = 0.15
    }
    else{
        player.velocity.x = 0
        player.rotation = 0
    }

    if((frames % (Math.random() * 500)) + 500 === 0){
        grids.push(new Grid())
    }
    frames++
}

animate()

addEventListener('keydown', ({key}) => { //{key} it is object destructuring
    switch (key){
        case 'a':
            // console.log("left")
            keys.a.pressed = true
            break
        case 'd':
            // console.log("right")
            keys.d.pressed = true
            break
        case ' ':
            // console.log('space')
            projectiles.push(   //Here we are adding the projectile to an projectiles array.
                new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y
                    },
                    velocity: {
                        x: 0,
                        y: -10
                    }
                })
            )
            break
            
    }
})  

addEventListener('keyup', ({key}) => { //{key} it is object destructuring
    switch (key){
        case 'a':
            // console.log("left")
            keys.a.pressed = false
            break
        case 'd':
            // console.log("right")
            keys.d.pressed = false
            break
        case ' ':
            // console.log('space')
            break
            
    }
})  