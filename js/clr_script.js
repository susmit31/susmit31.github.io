const colours = [
	'purple',
	'tomato',
	'mediumseagreen',
	'yellow',
	'aqua',
	'slateblue',
	'dodgerblue',
	'cadetblue',
	'chocolate',
	'blueviolet'
]

let container = document.querySelector('.container');

colours.forEach(clr=>{
	let div = document.createElement('div');
	div.style.background = clr;
	container.appendChild(div);
	div.addEventListener('mouseover', e=>{
		e.target.textContent = clr;
		setTimeout(()=>{e.target.textContent='';}, 200);
		console.log(clr);
	});
});