const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

       //Function to change backgroud color
       ctx.bgColor= function(color){
        this.beginPath();
        this.rect(0, 0, canvas.width, canvas.height);
        this.fillStyle = color;
        this.fill();
        this.closePath();
    }

    //Function to create a box
    ctx.createBox=function(x, y, width, height, color) {
        this.beginPath();
        this.rect(x, y, width, height);
        this.strokeStyle = color;
        this.stroke();
        this.closePath();
    }
//Function to create a ball
    ctx.createBall=function(x, y, radius, color) {
        this.beginPath();
        this.arc(x, y, radius, 0, 2 * Math.PI);
        this.fillStyle = color;
        this.fill();
        this.closePath();
}
    

function createRandomBall(){
    ctx.bgColor('white')
    const i=Math.round(Math.random()*balls.length)  
    const x=balls[i][0]
    const y=balls[i][1]
    const r=balls[i][2]
    ctx.createBall(x, y, r, 'black');
    ctx.xcorner=x-r
    ctx.ycorner=y-r
    ctx.width=2*r
}   

//Function to create a random number
function randombetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
}

//Function to create a random ball for the training
ctx.createRandomBall=function(){
    this.bgColor('white')
    let r=Math.round(Math.random()*maxd/4)
    r=(r<maxd*20/100)?maxd*20/100:r

    const x=randombetween(0+r,canvas.width-r)
    const y=randombetween(0+r,canvas.height-r)    
    this.createBall(x, y, r, 'black');
    this.xcorner=x-r
    this.ycorner=y-r
    this.width=2*r
}

       // ctx.createRandomBall()
//Function to create a random ball for the training
ctx.addNoise=function(n){
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    
    // Add white noise to imageData
    for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = Math.random() * n;
        imageData.data[i] += noise; // Red channel
        imageData.data[i + 1] += noise; // Green channel
        imageData.data[i + 2] += noise; // Blue channel
       // imageData.data[i + 3] = 10; // Alpha channel
    }
    this.reset( )
    this.putImageData(imageData, 0, 0);
}

    //Function to get the data from a image
    ctx.getData2=function(scale){
        let imageDataReduced=reduceImageData(ctx, canvas, scale)
        //let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let a=[]
        for (let i = 0; i < imageDataReduced.data.length; i += 4) {
            let color=(255-imageDataReduced.data[i])/255
            color=(color>0.5)?1:0
            a.push(color)
        }
        return a
}
function getpoints(result){
    let x=0
    let xi=0
    let y=0
    let yi=0
    let w=0
    let wi=0
    const heads=Object.keys(result)
    const values=Object.values(result)
    heads.forEach((head,i)=>{
       // console.log(head[0])
        if(head[0]==='x'){
            if(x<values[i]){
                x=values[i]
                xi=i
               // console.log(x)
            }
        }
        if(head[0]==='y'){
            if(y<values[i]){
                y=values[i]
                yi=i
            }
        }
        if(head[0]==='w'){
            if(w<values[i]){
                w=values[i]
                wi=i
            }
        }
    })


    return [heads[xi].replace("x",""),heads[yi].replace("y",""),heads[wi].replace("w","")]
   
}

//reduce the image data
function reduceImageData(ctx, canvas, scale) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const lines = canvas.height / scale;
    const columns = canvas.width / scale;
    const newImageData = ctx.createImageData(columns, lines);
    const newData = newImageData.data;

    for (let i = 0; i < lines; i++) {
        for (let j = 0; j < columns; j++) {
            let pixel = [0, 0, 0, 0];

            for (let s = 0; s < scale; s++) {
                for (let t = 0; t < scale; t++) {
                    const index = (i * scale + s) * canvas.width * 4 + (j * scale + t) * 4;
                    pixel[0] += imageData.data[index];
                    pixel[1] += imageData.data[index + 1];
                    pixel[2] += imageData.data[index + 2];
                    pixel[3] += imageData.data[index + 3];
                }
            }

            const newIndex = (i * columns + j) * 4;
            newData[newIndex] = pixel[0] / (scale * scale);
            newData[newIndex + 1] = pixel[1] / (scale * scale);
            newData[newIndex + 2] = pixel[2] / (scale * scale);
            newData[newIndex + 3] = pixel[3] / (scale * scale);
        }
    }

    return newImageData;
}

