// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
@val external concat: (. 'a, 'b) => 'c = "Array.prototype.concat.call"

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
@val external push: (. 'a ,'b)=> 'c = "Array.prototype.push.call"

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
@val external map: (. 'a, 'b) => 'c = "Array.prototype.map.call"

@val external isArray: 'a => 'b = "Array.isArray"