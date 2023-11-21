let printStopWords = async () => {
	const response = await fetch('https://raw.githubusercontent.com/igorbrigadir/stopwords/master/en/nltk.txt');
	const stopwords = await response.text();
	return stopwords.split('\n');
}

printStopWords().then(res => {console.log(res)})
