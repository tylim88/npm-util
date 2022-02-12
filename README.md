# npm-util

[![GitHub](https://img.shields.io/github/license/tylim88/npm-util?color=blue)](https://github.com/tylim88/npm-util/blob/main/LICENSE) [![dependencies](https://img.shields.io/badge/dynamic/json?color=brightgreen&label=dependencies&query=%24.dependencies.count&url=https%3A%2F%2Fapi.npmutil.com%2Fpackage%2Fnpm-util)](https://www.npmjs.com/package/npm-util?activeTab=dependencies) [![circleci](https://circleci.com/gh/tylim88/npm-util.svg?style=shield)](https://app.circleci.com/pipelines/github/tylim88/npm-util) [![codecov](https://codecov.io/gh/tylim88/npm-util/branch/main/graph/badge.svg?token=ydKwaMs7Yl)](https://codecov.io/gh/tylim88/npm-util)

backend for npm utility.

## api

GET `https://api.npmutil.com/package/<packageName>/<version(optional)>`

return `{ dependencies:{ count: <number> } }`

POST `https://api.npmutil.com/package/availableNames`

payload :

```json
{
    "filters":"<filter>"[][]
}
```

filter type

```
<alphabet>-<alphabet> eg "a-z"
<digit>-<digit> eg "0-9"
<alphabet> eg "k"
<digit> eg "6"
"-"
"."
"_"
"vowels"
"consonants"
"*" <--- all characters

```

example:

```json
{
	"filters": [["a-z"], ["a-z"], ["a-z"]]
}
```

```json
{
	"filters": [
		["a-c", "1"],
		["1-3", "k"],
		["vowels", "."]
	]
}
```
