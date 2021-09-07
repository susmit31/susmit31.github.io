let canvas = document.querySelector('#canvas');
canvas.width = window.innerWidth/2;
canvas.height = window.innerWidth/(window.innerWidth > 700? 3 : 2);
canvas.style.border = '2px solid black';
canvas.style.borderRadius = '8px';

let ctx = canvas.getContext('2d');
ctx.font = '24px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('No file selected',canvas.width/2, canvas.height/2)

canvas.addEventListener('mousemove',evt=>{
    pickColour(evt,hover);
})


let hover = document.querySelector('#hover');
hover.addEventListener('click', e=>{
    navigator.clipboard.writeText(hover.textContent);
    alert('Copied colour!')
})


const pickColour = (evt, destn)=>{
    let x = evt.clientX - canvas.offsetLeft - canvas.scrollLeft;
    console.log(canvas.offsetLeft)
    let y = evt.clientY - canvas.offsetTop - canvas.scrollTop;
    let pixel = Array.from(ctx.getImageData(x,y,1,1).data);
    let clr = `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3]/255})`;
    destn.style.backgroundColor = clr;
    let hex = pixel.map(v=>d2h(v));
    if (magnitude(pixel) < 1e5) 
        destn.style.color = 'white';
    else  
        destn.style.color='black';
    destn.textContent = `#${hex[0]}${hex[1]}${hex[2]}`;
}

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

document.querySelector('input[type="file"]').addEventListener('change', evt=>{
    const selectedFile = document.querySelector('input').files[0];

    let upimg_preview = document.createElement('img');
    const reader = new FileReader();
    reader.onload = evt=>{
        if (selectedFile) {
            upimg_preview.src = reader.result;
            upimg_preview.onload = ()=>{
                let im_wd = upimg_preview.width;
                let multiplier = im_wd > window.innerWidth/2 ? window.innerWidth/(2*im_wd) : 1
                canvas.height = upimg_preview.height*multiplier;
                canvas.width = upimg_preview.width*multiplier;
                ctx.drawImage(upimg_preview,0,0, canvas.width, canvas.height);
            }
        }
    }
    reader.readAsDataURL(selectedFile);
});