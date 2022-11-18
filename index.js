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

const player = new Player()
const projectiles = [
    
]
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


function animate(){  
    requestAnimationFrame(animate) //we are using this request animation frame because it will be running after every few milliseconds and if we dont use it then the image that we are extracting will not load. But in this case as it is reloading then the image gets load.
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    projectiles.forEach( (projectile, index) => {  //Here we are using update method on every projectile to make a bullet of it.
        if(projectile.position.y + projectile.radius <= 0){  //Removing the projectile from the array when they are out of the canvas.
            setTimeout(()=>{           //Sometimes the update and the splice would happen it same time which will be creating bug. TO solve it we are using setTimeOut in order to say that the splicing and updating should have a one frame difference.
                projectiles.splice(index,1)
            },0)
        }
        else{       //Making the new projectile or bullets.
            projectile.update()
        }
        
        projectile.update()
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