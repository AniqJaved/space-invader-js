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

        //Using the spaceship image 
        if(this.image){              //Runs only when the image is loaded.
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        }
    }
}

const player = new Player()
player.draw()


function animate(){  
    requestAnimationFrame(animate) //we are using this request animation frame because it will be running after every few milliseconds and if we dont use it then the image that we are extracting will not load. But in this case as it is reloading then the image gets load.
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.draw()
}

animate()