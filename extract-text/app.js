const btn = document.querySelector('button')
const fileUpload = document.querySelector('input[type="file"]');

btn.onclick = e=>{
    const upimg = fileUpload.files[0];
    
    const formdata = new FormData();
    formdata.append('uploaded-image',upimg);

    const options = {method: 'POST', body: formdata}

    fetch('https://susmit27.herokuapp.com/extract-text', options)
        .then(res=>res.json())
        .then(jsonData=>{
            let textEl = document.querySelector('#text-target');
            textEl.textContent = jsonData.text;
            textEl.parentElement.style.display = 'block';
        })
}

fileUpload.addEventListener('change', e=>{
    const upimg = fileUpload.files[0];
    const target = document.querySelector('#target');
    const preview = document.createElement('img');

    const reader = new FileReader();
    reader.onload = e=>{
        preview.src = reader.result;
        preview.onload = ()=>{
            target.appendChild(preview);
        }
    }
    reader.readAsDataURL(upimg);
})
