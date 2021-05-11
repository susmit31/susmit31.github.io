const clr_fam = {
	grays: [
		'mediumturquoise','turquoise','cadetblue',
	],
	whites: [
		'wheat', 'seashell', 'lavenderblush',		
	],
	yellows: [
		'yellow','greenyellow', 'gold',
	],
	greens:[
		'lawngreen','lime',
		'limegreen', 'mediumseagreen', 'yellowgreen',
		'springgreen', 'palegreen', 'lightgreen'
	],
	blues: [
		'purple', 'dodgerblue', 'blueviolet', 
		'slateblue', 'aqua',
		'magenta', 'mediumblue', 
	],
	reds: [
		'tomato', 'peru', 'orangered',
		'lightcoral', 'lightsalmon', 'orange',
	]
};

let target = document.querySelector('.target');

for (family in clr_fam){
	let container = document.createElement('div');
	container.classList.add('container');
	let heading = document.createElement('h1');
	heading.textContent = family;
	container.appendChild(heading);
	
	clr_fam[family].forEach(clr=>{
		let block = document.createElement('div');
		block.style.background = clr;
		
		let textContainer = document.createElement('div');
		let text = document.createElement('p');
		text.textContent = `${clr}\n(click to copy)`;
		text.style.display='inline';
		text.style.overflowWrap = 'break-word';
		text.classList.add('text');
		
		textContainer.appendChild(text)
		block.appendChild(textContainer);
		block.addEventListener('click', e=>{
			navigator.clipboard.writeText(clr);
			alert('copied!');
		});
		
		container.appendChild(block);
	});
	
	target.appendChild(container);
}