
var scoresArray;

var openFile = function(event) {
	var input = event.target;
	var text = "";
	var reader = new FileReader();
	var onload = function(event) {
		text = reader.result;
		buildPlots(text);

	};
    
	reader.onload = onload;
	reader.readAsText(input.files[0]);

};

var parseScores = function(text)
{
	xmlDoc = $.parseHTML( text ),
    $xml = $( xmlDoc ),
    $score = $xml.find( "Score" );
	return $score
}

var scoresToArray = function(scores)
{
	scoresArray = [];
	var dec = 0;
	scores.each(function(idx, v) {
		if($(v).find("Overall").text()!="")
		{
			scoresArray[idx-dec] = [];
			scoresArray[idx-dec].push($(v).find("DateTime").text().split(' ')[0]);
			scoresArray[idx-dec].push($(v).find("Overall").text());
			scoresArray[idx-dec].push($(v).find("Stream").text());
			scoresArray[idx-dec].push($(v).find("Jumpstream").text());
			scoresArray[idx-dec].push($(v).find("Handstream").text());
			scoresArray[idx-dec].push($(v).find("Stamina").text());
			scoresArray[idx-dec].push($(v).find("JackSpeed").text());
			scoresArray[idx-dec].push($(v).find("Chordjack").text());
			scoresArray[idx-dec].push($(v).find("Technical").text());
		}
		else
		{
			dec++
		}
	});
}

var buildPlots = function(xml)
{
	var scores = parseScores(xml)
	scoresToArray(scores);
	
	plotAverageByDay(scores);
	plotDeviation(scores);
	plotSkills(scores);
	plotPlayCount(scores);
}


var plotPlayCount = function(scores)
{
	var a = Array();
	for( var i = 0; i < scoresArray.length; i++)
	{
		if(a[scoresArray[i][0]] != undefined)
			a[scoresArray[i][0]] += 1;
		else
			a[scoresArray[i][0]] = 0;
	}

	var b = Array();
	for (var key in a) 
	{
		b.push(Array.prototype.concat(new Date(key),new Array([0,a[key],a[key]])));
	}
	b.sort(function(a,b){
  		return a[0]- b[0];
	});

		new Dygraph(
          	document.getElementById("graphPlCo"),
		  b
			,
          {
			labels: [ "Date", "Play count"],
			title:"play count",
			
              fillAlpha: 0.4,
			  color:"secondary",
      		 customBars: true,
            showRangeSelector: true,
          }
      );
}

var plotSkills = function(scores)
{
	var a = Array();
	
	for( var i = 0; i < scoresArray.length; i++)
	{
		for( var j = 0; j < 7; j++)
		{
			if(a[scoresArray[i][0]] != undefined){
				
				a[scoresArray[i][0]][j] = Array.prototype.concat(
					a[scoresArray[i][0]][j],
					Number.parseFloat(scoresArray[i][2+j])
				);
			}
			else{
				a[scoresArray[i][0]] = [[],[],[],[],[],[],[]]
				a[scoresArray[i][0]][j] = Array.prototype.concat(  
					Number.parseFloat(scoresArray[i][2+j])
				);
			}
		}
		
	}

	var b = Array();
	for (var key in a) 
	{
		var c = Array();
		for(var j = 0; j < 7; j++)
		{
			c.push([
				get_mean(a[key][j])
				]
			);
		}
		b.push(Array.prototype.concat(
			new Date(key),
			c
			
			));
	}
	b.sort(function(a,b){
  		return a[0]- b[0];
	});

	new Dygraph(
          	document.getElementById("graphSkil"),
		  b
			,
          {
			labels: [ "Date", "Stream", "Jumpstream", "Handstream", "Stamina", "JackSpeed", "Chordjack", "Technical" ],
			
			title:"average for each day by skills",
			stackedGraph: false,

			highlightCircleSize: 2,
			strokeWidth: 1,
			strokeBorderWidth: 1,

			highlightSeriesOpts: {
			strokeWidth: 2,
			strokeBorderWidth: 1,
			highlightCircleSize: 5
			},
            showRangeSelector: true,
          }
      );
}

var plotAverageByDay = function(scores)
{
	
	var a = Array();
	for( var i = 0; i < scoresArray.length; i++)
	{
		if(a[scoresArray[i][0]] != undefined)
			a[scoresArray[i][0]] = Array.prototype.concat(a[scoresArray[i][0]] , Number.parseFloat(scoresArray[i][1]));
		else
			a[scoresArray[i][0]] = Array.prototype.concat( Number.parseFloat(scoresArray[i][1]));
	}

	var b = Array();
	for (var key in a) 
	{
		b.push(Array.prototype.concat(new Date(key),new Array([Math.min.apply(Math, a[key])/*get_mean(a[key])-get_variance(a[key])*/,get_mean(a[key]),/*get_mean(a[key])+get_variance(a[key])*/Math.max.apply(Math, a[key])])));
	}
	b.sort(function(a,b){
  		return a[0]- b[0];
	});

	new Dygraph(
          	document.getElementById("graphAver"),
		  b
			,
          {
			labels: [ "Date", "Average"],
			title:"average for each day",
      		 customBars: true,
            showRangeSelector: true,
          }
      );
	  
}

var plotDeviation = function(scores)
{
	
	var a = Array();
	for( var i = 0; i < scoresArray.length; i++)
	{
		if(a[scoresArray[i][0]] != undefined)
			a[scoresArray[i][0]] = Array.prototype.concat(a[scoresArray[i][0]] , Number.parseFloat(scoresArray[i][1]));
		else
			a[scoresArray[i][0]] = Array.prototype.concat( Number.parseFloat(scoresArray[i][1]));
	}
	
	var b = Array();
	for (var key in a) 
	{
		//var meanByDay = get_mean(a[key])
		for(var i = 0 ; i < a[key].length; i++)
		{
			b.push(a[key][i]);
		}
		//b.push(Array.prototype.concat(new Date(key),new Array([Math.min.apply(Math, a[key])/*get_mean(a[key])-get_variance(a[key])*/,get_mean(a[key]),/*get_mean(a[key])+get_variance(a[key])*/Math.max.apply(Math, a[key])])));
	}

	var div = 10;

	var c = Array();
	var min = Math.round(Math.min.apply(Math, b)*div);
	var max =   Math.round(Math.max.apply(Math, b)*div);
	for (var i = min; i < max ; i+=1)
	{
		c[i] = 0;
	}
	for (var j = 0; j < b.length; j++)
	{
		c[Math.round(b[j]*div)] += 1;
	}

	var d = Array();
	for (var key in c)
	{
		d.push(new Array(Number.parseFloat(key)/div, [0, c[key], c[key]]));
	}

	d.sort(function(a,b){
  		return a[0]- b[0];
	});

	new Dygraph(
          document.getElementById("graphDevi"),
		  d
			,
          {
			labels: [ "deviation", "count"],
			title: 'scores distribution',
			 customBars: true,
          }
      );

	  $("#graphDeviText").text("dependence chart of scores count from the score value");
}

function add(a, b) {
    return a + b;
}

function get_mean(ar)
{
	return ar.reduce(add, 0)/ar.length;

}

function get_variance(ar)
{
	var sum = 0;
	var mean = get_mean(ar);
	for(var i = 0; i < ar.length; i++)
	{
		sum += Math.pow((ar[i] - mean),2);
	}

	return (1/(ar.length-1))*(sum);
}
