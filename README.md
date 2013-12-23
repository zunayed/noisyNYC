**[Run](#run)** |
**[Using You're Own Data](#data)** |
noisyNYC
========

D3 Choropleth of the noisiest neighborhoods in NYC.

** Update - Now with heating and graffiti data

Live Demo - http://noisynyc.herokuapp.com/

![alt tag](http://i.imgur.com/cu2kPxx.jpg)
![alt tag](http://i.imgur.com/h5ilV4U.jpg)

## Run
You will need flask > 0.10.1
```
python routes.py
```
Built using D3. Foundation CSS for styling

## Using You're Own Data
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
