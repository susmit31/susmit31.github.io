const ACTIVE_CLR = 'rgb(255, 255, 255)';
const INACTIVE_CLR = '#5F9EA0';
let simuln = null;

let game = document.querySelector('#game');
console.log();

const N_COL = 18;
const BOX_SIZE = parseInt(
		window.getComputedStyle(game).width
	)/ N_COL;
const N_ROW = Math.floor(window.innerHeight * .9/BOX_SIZE);

Array(N_ROW*N_COL).fill(0).forEach(i=>{
	game.appendChild(document.createElement('div'));
});

let sqrs = game.children;
let sqrs_grid = (()=>{
	let grid = [];
	for (let i = 0; i<N_ROW; i++){
		let row = [];
		for (let j =0; j<N_COL; j++){
			row.push(sqrs[N_COL*i + j]);
		}
		grid.push(row);
	}
	return grid;
})();

Array.from(sqrs).forEach(c=>{
	c.style.height = window.getComputedStyle(c).width;
});

const drawOnDrag = e=>{
	if (simuln!==null){
		clearInterval(simuln);
		console.log('hi');
		simuln = null;
	}
	if (e.target.style.backgroundColor!==ACTIVE_CLR)
		e.target.style.backgroundColor = ACTIVE_CLR;
	else e.target.style.backgroundColor = INACTIVE_CLR;
};

game.onmousedown = ()=>{
	Array.from(sqrs).forEach(c=>{
		c.addEventListener('mouseenter',drawOnDrag);
	});
};

const mobileDrawOnDrag = e=>{
	let x = e.clientX, y = e.clientY;
	console.log(x);
	console.log(y);
	toggleLife(document.elementFromPoint(x,y))
}

game.ontouchstart = (e)=>{
	e.target.addEventListener('touchmove',mobileDrawOnDrag);
};

game.onmouseup = ()=>{
	Array.from(sqrs).forEach(c=>{
		c.removeEventListener('mouseenter',drawOnDrag);
	})
};

game.ontouchend = (e)=>{
	e.target.removeEventListener('touchmove',mobileDrawOnDrag);
};

const range = n => n==1? [0] : [...range(n-1),n-1];

const findNeighbours = sqr => {
	let neighbours = [];
	let idx = Array.from(sqrs).findIndex(s=>s==sqr);
	let pos_x = Math.floor(idx/N_COL), pos_y = idx%N_COL;
	
	const start_x = pos_x > 0? -1 : 0;
	const end_x = pos_x < N_ROW-1? 1 : 0;
	const start_y = pos_y > 0? -1 : 0;
	const end_y = pos_y < N_COL-1? 1 : 0;
	for (let i = start_x; i<=end_x; i++){
		for (let j=start_y; j<=end_y; j++){
			if (i!==0 || j!==0){
				let neigh = sqrs[idx + N_COL*i + j]
				if (neigh)
					neighbours.push(neigh);
			}
		}
	}
	
	return neighbours
}

const isAlive = sqr=>
	window.getComputedStyle(sqr).backgroundColor == ACTIVE_CLR? 
	true : false;

const toggleLife = sqr=>{
	if (isAlive(sqr)) sqr.style.backgroundColor = INACTIVE_CLR;
	else sqr.style.backgroundColor = ACTIVE_CLR;
}



let simBtn = document.querySelector('.sim');
let resetBtn = document.querySelector('.reset');

resetBtn.addEventListener('click', e=>{
	window.location.reload();
});

simBtn.addEventListener('click', e=>{
	if (simuln===null){
		simuln = setInterval(()=>{
			Array.from(sqrs).forEach(sqr=>{
				let neighs = findNeighbours(sqr);
				const live_neighs = neighs.map(n=>isAlive(n)).reduce((a,b)=>a+b);
				if (isAlive(sqr)){
					if (live_neighs==2 || live_neighs==3) null;
					else toggleLife(sqr);
				}
				else{
					if (live_neighs==3) toggleLife(sqr);
					else null;
				}
			});
		},500);
		simBtn.addEventListener('click',e=>{
			clearInterval(simuln);
			simuln = null;
		})
	}
});