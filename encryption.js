/*****************************
**  Encryption Preparation  **
*****************************/

/**
* function setupCipher()
* @purpose: switch characters and produce a dictionary
**/
function setupCipher()
{
    var cipher = {};
    var codes = setupChars();
    var valx, valy, x, y;
    while (codes.length > 2)
    {
        x = Math.floor(Math.random() * (codes.length - 1) + 1);
        y = Math.floor(Math.random() * (codes.length - 1) + 1);
        if (x == y)
        {
            continue;
        }
        valx = codes[x];
        valy = codes[y];
        cipher[valx] = valy;
        cipher[valy] = valx;
        codes.splice(x, 1);
        if (x > y)
        {
            codes.splice(y, 1);
        }
        else
        {
            codes.splice(y - 1, 1);
        }
    }
    cipher[codes[0]] = codes[1];
    cipher[codes[1]] = codes[0];
    return cipher;
}

/**
* function setupChars()
* @purpose: create an array of the possible characters
**/
function setupChars()
{
    var codes = new Array();
    var i = 33;
    var letter;
    while (i < 128)
    {
        letter = String.fromCharCode(i);
        codes.push(letter);
        i++;
    }
    codes.push(" ");
    return codes;
}