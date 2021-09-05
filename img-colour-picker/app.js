let img = new Image();
img.crossOrigin = 'anonymous';
img.src = 'https://cdn.pixabay.com/photo/2015/06/19/21/24/avenue-815297__480.jpg';


let canvas = document.querySelector('#canvas');
canvas.height = img.height;
canvas.width = img.width;
let ctx = canvas.getContext('2d');

img.onload = ()=>{
    ctx.drawImage(img,0,0);
    console.log('kosu')
}


let hover = document.querySelector('#hover');

canvas.addEventListener('mousemove',evt=>{
    pickColour(evt,hover);
})


const pickColour = (evt, destn)=>{
    let x = evt.layerX;
    let y = evt.layerY;
    let pixel = Array.from(ctx.getImageData(x,y,1,1).data);
    let clr = `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3]/255})`;
    destn.style.backgroundColor = clr;
    let hex = pixel.map(v=>d2h(v));
    if (magnitude(pixel) < 1e5) destn.style.color = 'white';
    else destn.style.color='black';
    destn.textContent = `#${hex[0]}${hex[1]}${hex[2]}`;
}

navigator.clipboard.writeText;

const range = n => n==1 ? [0] : [...range(n-1),n-1];
const d2h = d=>{
    if (d==0) return '00';
    let h = '';
    let num = d;
    let syms = [...range(10),...('ABCDEF'.split(''))];
    while (num > 0){
        h = syms[num%16]+h;
        num /= 16;
        num = Math.floor(num);
    }
    return h.length>1? h: '0'+h;
}

const magnitude = arr=>{
    return arr.map(n=>n*n).reduce((m,n)=>m+n);
}