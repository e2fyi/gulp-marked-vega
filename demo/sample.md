#### 1. Render markdown with Vega-Lite charts with `image` markdown
~~~
![vega-lite](barchart-vl.json)

or

![vl](barchart-vl.json)
~~~
will renders as:
![vega-lite](barchart-vl.json)

#### 2. Render markdown with Vega charts with `image` markdown
~~~
![vega](barchart-vg.json)

or

![vg](barchart-vg.json)
~~~
will renders as:
![vg](barchart-vg.json)


#### 3. Render markdown with Vega/Vega-Lite charts with codeblock
vega-lite JSON spec in a markdown codeblock:
~~~~
```vega-lite
{
  "description": "barchart",
  "data": {
    "values": [
      {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
      {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
      {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
```
~~~~
will renders as:
```vega-lite
{
  "description": "barchart",
  "data": {
    "values": [
      {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
      {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
      {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
```

vega-lite spec as YAML in a markdown codeblock:
~~~~
```vega-lite
description: barchart
data:
  values:
    - x: A
      y: 13
    - x: B
      y: 55
    - x: C
      y: 43
    - x: D
      y: 91      
    - x: E
      y: 81      
    - x: F
      y: 53      
    - x: G
      y: 19      
    - x: H
      y: 87      
    - x: I
      y: 52      
mark:
  bar
encoding:
  x:
    field: x
    type: ordinal
  y:
    field: y
    type: quantitative
```
~~~~
will renders as:
```vega-lite
description: barchart
data:
  values:
    - x: A
      y: 13
    - x: B
      y: 55
    - x: C
      y: 43
    - x: D
      y: 91      
    - x: E
      y: 81      
    - x: F
      y: 53      
    - x: G
      y: 19      
    - x: H
      y: 87      
    - x: I
      y: 52      
mark:
  bar
encoding:
  x:
    field: x
    type: ordinal
  y:
    field: y
    type: quantitative
```
