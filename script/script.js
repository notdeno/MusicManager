let Info = function(artist, song, releaseYear, duration, rank) {
	this.artist = artist;
	this.song = song;
	this.releaseYear = releaseYear; 
	this.duration = duration;
	this.rank = rank;
};

let Songs = [];

function getData() {
	getLocalData();
	
	if (Songs.length > 0) {
		drawTable();
		return;
	}
	
	$.ajax({
		method: "GET",
		url: "http://demo6418849.mockable.io/songs",
		dataType: 'json',
		success: function (data) {
			parseData(data);
		},
		error: function (error) {
			console.log(error);
		}
	});
}

function parseData(jsonData) {
	$(jsonData).each(function(index, song) {
		Songs.push(new Info(song.artist, song.song, song.releaseYear, song.duration, song.rank));
	});
	
	drawTable();
}

function drawTable() {
	$('#artists').empty();
	
	$(Songs).each(function(index, song) {
		var tableRow = '<tr>' + 
			'<td>' + song.rank + '</td>' + 
			'<td>' + song.song + '</td>' + 
			'<td>' + song.artist + '</td>' + 
			'<td>' + song.releaseYear + '</td>' + 
			'<td>' + song.duration + '</td>' + 
		'</tr>';
		
		$('#artists').append(tableRow);
	});
	
	setLocalData(Songs);
	
	initSorting();
}

function initSorting() { 
	$('.sorting-header').each(function(index, header) {
		$(header).off('click').on('click', function(event) {
			doSort(this);
		});
	});
}

function doSort(oHeader) {
	var sortBy = $(oHeader).attr('data-sort');
	var sortDir = $(oHeader).attr('data-direction');
	var sortingFunction = null;
	
	switch (sortBy) {
		case "rank": //sort by rank
			sortingFunction = (song1, song2) => {
				return parseInt(song1.rank) - parseInt(song2.rank);
			};
			break;
		case "song": //sort by song name
			sortingFunction = (song1, song2) => {
				return song1.song.localeCompare(song2.song);
			}
			break;
		case "artist": //sort by artist name
			sortingFunction = (song1, song2) => {
				return song1.artist.localeCompare(song2.artist);
			}
			break;
		case "releaseYear": //sort by release year
			sortingFunction = (song1, song2) => {
				return parseInt(song1.releaseYear) - parseInt(song2.releaseYear);
			}
			break;
		case "duration": //sort by duration
			sortingFunction = (song1, song2) => {
				return evaluateMinuteToSeconds(song1.duration) -
					evaluateMinuteToSeconds(song2.duration);
			}
			break;
		default: 
			break;
	}
	$(oHeader).attr('data-direction', sortDir == 'asc' ? 'desc' : 'asc');
	
	if (sortDir == 'desc')
		Songs.sort(sortingFunction).reverse();
	else
		Songs.sort(sortingFunction);

	drawTable();
}

function evaluateMinuteToSeconds(minutes) {
	let minutesArray = minutes.split(":");
	return (minutesArray[0] * 60) + minutesArray[1];
}

function setLocalData(jsonData) {
	localStorage.setItem('songs', JSON.stringify(jsonData));
}

function getLocalData() {
	var data = localStorage.getItem('songs');

	//Check localstorage
	if (data != null) {
		//Set to runs
		Songs = JSON.parse(data);
	}
}

$(function() {
	getData();
});