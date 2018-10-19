 
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
			scoresArray[idx-dec].push($(v).find("SSRNormPercent").text());
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
	
	plotAverageByDay();
	plotPlayCount();
	plotDistribution();
	plotDeviation();
	plotSkills();
	plotWife();
}


var plotPlayCount = function()
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

	var c = Array();
	for (var d = new Date(b[0][0].getTime()), i = 0; d < b[b.length-1][0]; d.setDate(d.getDate() + 1)) {
		if(d.getTime() === b[i][0].getTime())
		{
			c.push(b[i]);
			i++;
		}
		else 
		{
			c.push(Array.prototype.concat(new Date(d.getTime()),new Array([0,0,0])));
		}
	}

		new Dygraph(
          	document.getElementById("graphPlCo"),
		 c
			,
          {
			labels: [ "Date", "Play count"],
			title:"play count",
			
                drawAxesAtZero: false,
              fillAlpha: 0.4,
			  color:"secondary",
      		 customBars: true,
            showRangeSelector: true,
          }
      );
	  
}

var plotSkills = function()
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

var plotAverageByDay = function()
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

var plotDistribution = function()
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
          document.getElementById("graphDist"),
		  d
			,
          {
			labels: [ "distribution", "count"],
			title: 'scores distribution',
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
			color:"indigo",
=======
			color:"yellow",
>>>>>>> b2c3d67... Update sc.js
=======
			color:"#a6c1b9",
>>>>>>> c74efa2... Update sc.js
=======
			color:"#487165",
>>>>>>> 7c12ca0... Update sc.js
=======
			color:"indigo",
>>>>>>> 19afe8c... Update sc.js
			 customBars: true,
          }
      );

	  //$("#graphDeviText").text("dependence chart of scores count from the score value");
}


var plotDeviation = function()
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
		var mean = get_mean(a[key]);
		for(var i = 0 ; i < a[key].length; i++)
		{
			b.push(a[key][i]-mean);
		}
		
		//b.push(Array.prototype.concat(new Date(key),new Array([Math.min.apply(Math, a[key])/*get_mean(a[key])-get_variance(a[key])*/,get_mean(a[key]),/*get_mean(a[key])+get_variance(a[key])*/Math.max.apply(Math, a[key])])));
	}

	var div = 50;

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
			title: 'scores deviation',
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
			  color:"purple",
=======
			  color:"yellow",
>>>>>>> b2c3d67... Update sc.js
=======
			  color:"#a6c1b9",
>>>>>>> c74efa2... Update sc.js
=======
			  color:"##487165",
>>>>>>> 7c12ca0... Update sc.js
=======
			  color:"purple",
>>>>>>> 19afe8c... Update sc.js
			 customBars: true,
          }
      );

	  //$("#graphIndepDeviText").text("independent of skill changes gain over time");
}

var plotWife = function()
{
	var a = Array();
	for( var i = 0; i < scoresArray.length; i++)
	{
		if(a[scoresArray[i][0]] != undefined)
			a[scoresArray[i][0]] = Array.prototype.concat(a[scoresArray[i][0]] , Number.parseFloat(scoresArray[i][9]));
		else
			a[scoresArray[i][0]] = Array.prototype.concat( Number.parseFloat(scoresArray[i][9]));
	}
	
	var b = Array();
	for (var key in a) 
	{
		
		for(var i = 0 ; i < a[key].length; i++)
		{
			b.push(a[key][i]);
		}
		//b.push(Array.prototype.concat(new Date(key),new Array([Math.min.apply(Math, a[key])/*get_mean(a[key])-get_variance(a[key])*/,get_mean(a[key]),/*get_mean(a[key])+get_variance(a[key])*/Math.max.apply(Math, a[key])])));
	}

	var div = 1000;

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
		d.push(new Array(Number.parseFloat(key)*100/div, [0, c[key], c[key]]));
	}

	d.sort(function(a,b){
  		return a[0]- b[0];
	});

	new Dygraph(
          document.getElementById("graphWife"),
		  d
			,
          {
			labels: [ "distribution", "count"],
			title: 'percent distribution',
			color:"#980649",
			dateWindow:[0,100],
			 customBars: true,
          }
      );

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
