async function text_decoder(text_url){
	const utf8decoder = new TextDecoder('utf-8');
	const resp = await fetch(text_url);

	// Response().body is a ReadableStream object
	// that contains the contents of the response
	const reader = resp.body.getReader();

	// The reader.read() method is an asynchronous generator
	// that yields contents from the fetched URL as they get received.
	// Subsequent calls will deliver chunks from the same URL.
	let {value: chunk, done: done_reading} = await reader.read();
	// Decoding the first chunk
	chunk = chunk? utf8decoder.decode(chunk) : '';

	return chunk;
}

const tokenise_text = text =>{
	text = text.replaceAll(/[~`!@#\$%\^&\*\(\)\-\+=\[\]\{\};:'"\<\>,\?/]/g," ")
    text = text.replaceAll(/\.([^0-9]+)/g,' $1')
	let words = text.split(' ').filter(x=> x!='')//.map(sent => sent.split(' ').filter(x => x!=''));
    return words;
};

const normalize_word = word => {
};

const term_freqs = text => {};

const summariser = text =>{};

const fetch_article = async (title) =>{
	//###########################################
	//## Allow user to input URL as well #######
	//##########################################
	let url = 'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({
		origin: '*',
		action: 'parse',
		page: title,
		format: 'json',
	});
	let url_search = 'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({
		origin: '*',
		action: 'opensearch',
		search: title,
		limit: '5',
		format: 'json',
	});

	try{
		const response = await fetch(url);
		const response_search = await fetch(url_search);
		const json = await response.json();
		const json_search = await response_search.json();
		console.log(json_search);
		const html = json.parse.text['*'];

		const parser = new DOMParser();
		const parsed = parser.parseFromString(html, "text/html");
		let txt = parsed.getElementsByTagName('body')[0].textContent;
		let idx = txt.indexOf('Notes');
		if (idx == -1){
			txt = txt.slice(0,txt.indexOf('References'));
		} else {
			txt = txt.slice(0, idx);
		}
		const tags = /<\/?(.)+?\>/ig;
		const css = /(\n)+((@|\.|body|html|\.mw)[^\{]+\{[^\}]+?\})/ig;

		// painful brute-force way to eliminate the CSS and HTML
		txt = txt.replaceAll('}', '}\n')
		txt = txt.replaceAll(tags,'');

		txt = txt.replaceAll(css,'');
		txt = txt.replaceAll(/\n+/g, '\n');
		txt = txt.replaceAll('}','');

		// Erasing all references
		txt = txt.replace(/\[[0-9]+\]/g, '');
		txt = txt.replaceAll(/([^\.])\n/ig, '$1.\n')
		
		// Fetching stopwords
		url = 'https://raw.githubusercontent.com/igorbrigadir/stopwords/master/en/spacy.txt';

		stops = await text_decoder(url);
		const stopwords = stops.split('\n');


		// Splitting txt
		let lines_words = txt.replaceAll(/'\w+/g,"").toLowerCase().replaceAll(/[\.,;\(\)\[\]\n:/\-\+=\*&]/g,' ').replaceAll("'",'').replaceAll('"','').replaceAll(/[0-9]+\w?/g,'').split(' ').filter(word => word!='');
		
		// Replacing the stopwords
		/*let txt_filtered = lines_words.map(words => {
			for (stop of stopwords)
				words = words.filter(word => word != stop)
			return words.join(' ')
		});*/
		for (stop of stopwords){
			lines_words = lines_words.filter(word => word!=stop);
		}
		//txt_filtered = txt_filtered.join(' ');


		let word_scores = {};
		for (word of lines_words){
			if (word_scores[word])
				word_scores[word]+=1;
			else word_scores[word] = 1;
		}

		let max_count = curr_count = 0;
		for (word of Object.keys(word_scores)){
			curr_count = word_scores[word]
			if (curr_count > max_count)
				max_count = curr_count; 
		}

		const TITLE_PENALTY = 0.7;

		for (word of Object.keys(word_scores)){
			word_scores[word] /= max_count;
			if (title.toLowerCase().includes(word)) word_scores[word] *= TITLE_PENALTY;
		}

		let lines_scores = {};
		let total_score = word_score = 0;
		for (line of txt.split('.')){
			for (word of line.split(' ')){
				word = word.toLowerCase();
				if (word_scores[word]){
				  word_score = word_scores[word];
				  total_score += word_score;
				}
			}
			lines_scores[line] = total_score/line.split(' ').length;
			score = 0;
		}

		let exclusion_keywords = ['See also', 'Further info', 'Main article', 'disambiguation', 'template message', 'List of']
		let lines_sorted = Object.keys(lines_scores).sort((x,y) => lines_scores[y] - lines_scores[x])
		.filter(x => x.split(' ').length > 8)
		for (kw of exclusion_keywords){
			lines_sorted = lines_sorted.filter(line => !line.includes(kw));
		}
		let top_words = Object.keys(word_scores).sort((x,y) => word_scores[y] - word_scores[x]).slice(title.split(' ').length,15+title.split(' ').length);
		console.log(top_words);
		console.log(word_scores);
		//##############################################
		//## Let the user decide this #################
		//#############################################

		lines_sorted = lines_sorted.slice(0,30);

		lines_sorted = lines_sorted.sort((line_a,line_b)=>{
			let words_a = line_a.split(' ');
			let words_b = line_b.split(' ');
			let title_frac_a = words_a.filter(word => title.toLowerCase().includes(word.toLowerCase())).length;
			let title_frac_b = words_b.filter(word => title.toLowerCase().includes(word.toLowerCase())).length;
			let top_words_a = words_a.filter(word => top_words.includes(word.toLowerCase())).length;
			//top_words_a = top_words_a.length ? top_words_a.reduce((x,y) => word_scores[y]+word_scores[x]) : 0;
			let top_words_b = words_b.filter(word => top_words.includes(word.toLowerCase())).length;
			//top_words_b = top_words_b.length ? top_words_b.reduce((x,y) => x+y) : 0;
			return (title_frac_b+top_words_b - title_frac_a-top_words_a)
		})

		console.log(lines_sorted.map(line => [line, lines_scores[line]]));

		let w_regex;
		for (word of top_words){
			w_regex = new RegExp('(^|\\s)('+word+')(\\-)?(\\w*)','gim');
			lines_sorted = lines_sorted.map(line => line.replaceAll(w_regex,'<b>$1$2$3$4</b>'));
		}

		
		let out_body = document.querySelector('.out-body');
		let out_title = document.querySelector('.out-title');
		out_title.innerText = title;
		out_body.innerHTML = lines_sorted.join('\n\n').replaceAll(/\n\n+/g,'<br><br>');
		document.body.style.border = '2px solid black';
		document.querySelector('input').value = '';


} catch (err) {
		console.error(err);
	}
}

generate_summary = (e)=>{
	document.querySelector('.out-title').innerText = '';
	document.querySelector('.out-body').innerText = "Please wait, generating summary...";
	fetch_article(document.querySelector('input').value)
};
