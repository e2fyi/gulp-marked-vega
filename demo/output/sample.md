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
![barchart](data:image/png;base64,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)

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
![barchart](data:image/png;base64,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)
