**[Run](#run)** |
**[Using You're Own Data](#data)** |
noisyNYC
========

D3 Choropleth of the noisiest neighborhoods in NYC.

** Update - Now with heating and graffiti data

Live Demo - http://noisynyc.herokuapp.com/

![alt tag](http://i.imgur.com/cu2kPxx.jpg)
![alt tag](http://i.imgur.com/qG0H1zK.jpg)

## Run
You will need flask > 0.10.1
```
python routes.py
```
Built using D3. Foundation CSS for styling

## Data
If you provide an object with values associated with zipcodes you can map you're own values. 

``` .js
var noiseData = {
  "10032": 264,
  "10003": 197,
  "10012": 187,
  "10002": 177,
  "10013": 167,
  "10016": 155,
  "10023": 155,
...
}
```

You can have multiple datasets. You also need to pass in default color scheme and a max domain range value
``` .js
var dataSets = {
	"noise": {
		"data": noiseData,
		"color": "Blues",
		"maxDomain": 425
	},
	"heat": {
		"data": heatData,
		"color": "Reds",
		"maxDomain": 375
	},
	"graffiti": {
		"data": graffitiData,
		"color": "RdPu",
		"maxDomain": 30
	}
};

```
