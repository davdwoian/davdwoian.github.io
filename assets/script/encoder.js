// @ sha256.min.js

const ints = "0123456789";
const alps = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const spes = "(~!@#$%^&*_-+=`|\\(){}[]:;\"\'<>,.?/)";

const divide  = (s, i) => s.split(new RegExp(`(.{${i}})`)).filter(o=>o);
const ascii   = (s) => s.split('').reduce((t, c) => t + c.charCodeAt(0), 0);  

var dm =    document.querySelector("#dom");
var ky =    document.querySelector("#key");
var re =    document.querySelector("#res");
var recpy = document.querySelector("#res-copy");
var remsk = document.querySelector("#res-mask");

function modifyResTextContent(content) {
    re.data = content;
    re.textContent = remsk.data == 'visible' ? content : '*'.repeat(content.length);
}

async function encode() {
    let sha0 = await sha256(String(dm.value) + String(ky.value));
    let sha1 = await sha256(sha0);
    let sha2 = await sha256(sha1);
    let sha3 = await sha256(sha2);

    let grid = [
        divide(sha1, 8).map(o => divide(o, 2).map(x => ints.charAt(ascii(x) % ints.length))),
        divide(sha2, 8).map(o => divide(o, 2).map(x => alps.charAt(ascii(x) % alps.length))),
        divide(sha3, 8).map(o => divide(o, 2).map(x => spes.charAt(ascii(x) % spes.length)))
    ];

    let i = (x) => parseInt(ascii(x.slice(2, 4)) % 12 / 4);
    let j = (x) => parseInt(ascii(x.slice(0, 2)) % 8);
    let k = (x) => parseInt(ascii(x.slice(2, 4)) % 4);
    modifyResTextContent(divide(sha0, 4).map(x => grid[i(x)][j(x)][k(x)]).join(''));

    if (dm.value && ky.value) recpy.click();
}

dm.addEventListener('change', encode);
ky.addEventListener('change', encode);

recpy.addEventListener('click', () => navigator.clipboard.writeText(re.data));
remsk.addEventListener('click', () => {
    remsk.data = remsk.data == 'visible' ? 'invisible' : 'visible';
    remsk.style['background-image'] = `url(/assets/image/${remsk.data}.png)`;
    re.textContent = remsk.data == 'visible' ? re.data : '*'.repeat(re.data.length);
})
