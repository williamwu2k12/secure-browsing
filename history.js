var cipher = { '0': 't', '1': 'S', '2': ' ', '3': 'm', '4': '9', '5': 'L', '6': 'h', '7': 'q', '8': 'B', '9': '4', u: 'd', d: 'u', '<': 'W', W: '<', m: '3', '$': '(', '(': '$', ' ': '2', B: '8', Q: '#', '#': 'Q', '[': ',', ',': '[', N: '\'', '\'': 'N', v: 'O', O: 'v', s: '?', '?': 's', ')': '`', '`': ')', '>': '}', '}': '>', q: '7', E: 'Z', Z: 'E', H: 'V', V: 'H', '.': '|', '|': '.', S: '1', D: 'y', y: 'D', n: '^', '^': 'n', '&': ':', ':': '&', J: '_', _: 'J', K: 'b', b: 'K', c: 'g', g: 'c', X: 'f', f: 'X', T: '-', '-': 'T', h: '6', r: '/', '/': 'r', '*': 'k', k: '*', M: '%', '%': 'M', I: 'i', i: 'I', '+': 'p', p: '+', R: ';', ';': 'R', j: 'l', l: 'j', U: 'w', w: 'U', '~': 'z', z: '~', t: '0', L: '5', ']': '=', '=': ']', '{': 'F', F: '{', e: 'P', P: 'e', '"': 'a', a: '"', o: 'x', x: 'o', '@': 'Y', Y: '@', '\\': 'G', G: '\\', C: '', '': 'C', '!': 'A', A: '!' };
chrome.storage.local.get(null, function(objects)
{
    var keys = Object.keys(objects);
    for (var i = 0; i < 30; i++)
    {
        var object = JSON.parse(decrypt(objects[keys[i]]));
        var newLink = document.createElement("div");
        newLink.innerHTML = object["url"];
        document.body.appendChild(newLink);
    }
});