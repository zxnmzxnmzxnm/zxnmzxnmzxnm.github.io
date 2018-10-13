


 var openFile = function(event) {
	var input = event.target;
var text = "";
	var reader = new FileReader();
	var onload = function(event) {
		text = reader.result;
		parseFile(text);

	};
    
	reader.onload = onload;
	reader.readAsText(input.files[0]);

};

var parseFile = function(text) {
	xmlDoc = $.parseHTML( text ),
    $xml = $( xmlDoc ),
    $score = $xml.find( "Score" );

   
	var arr = [];
	var dec = 0;
    $score.each(function(idx, v) {
		if($(v).find("Overall").text()!=""){
        	arr[idx-dec] = [];
        	arr[idx-dec].push($(v).find("DateTime").text().split(' ')[0]);
			arr[idx-dec].push($(v).find("Overall").text());
		}
		else
		{
			dec++
		}
    });

	

	var a = Array();
	for( var i = 0; i < arr.length; i++)
	{
		if(a[arr[i][0]]!=undefined)
			a[arr[i][0]] = Array.prototype.concat(a[arr[i][0]] , Number.parseFloat(arr[i][1]));
		else
			a[arr[i][0]] = Array.prototype.concat( Number.parseFloat(arr[i][1]));
	}

	var b = Array();
	

	for (var key in a) {
		console.log(get_variance(a[key]));
		b.push(Array.prototype.concat(new Date(key),new Array([Math.min.apply(Math, a[key])/*get_mean(a[key])-get_variance(a[key])*/,get_mean(a[key]),/*get_mean(a[key])+get_variance(a[key])*/Math.max.apply(Math, a[key])])));
	}
	b.sort(function(a,b){
  return a[0]- b[0];
});
	

	new Dygraph(
          document.getElementById("graph"),
		  b
			,
          {
			labels: [ "Date", "Average"],
      		 customBars: true,
            showRangeSelector: true,
          }
      );
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

};