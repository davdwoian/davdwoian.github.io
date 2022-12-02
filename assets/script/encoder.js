const ints = "0123456789".split('');
const alphas = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const specials = "(~!@#$%^&*_-+=`|\\(){}[]:;\"\'<>,.?/)".split('');

var dm = document.querySelector("#dom");
var ky = document.querySelector("#key");
var re = document.querySelector("#res");
var recpy = document.querySelector("#res-copy");

async function encode() {
    let sha = await sha256(String(dm.value) + String(ky.value));

    let nbs = (await sha256(sha)).split(/(.{8})/).filter(o=>o).map(o=>o.split(/(.{2})/).filter(o=>o).map(x=>ints[(x.charCodeAt(0)+x.charCodeAt(1))%ints.length]));
    let als = (await sha256((await sha256(sha)))).split(/(.{8})/).filter(o=>o).map(o=>o.split(/(.{2})/).filter(o=>o).map(x=>alphas[(x.charCodeAt(0)+x.charCodeAt(1))%alphas.length]));
    let sps = (await sha256((await sha256((await sha256(sha)))))).split(/(.{8})/).filter(o=>o).map(o=>o.split(/(.{2})/).filter(o=>o).map(x=>specials[(x.charCodeAt(0)+x.charCodeAt(1))%specials.length]));
    let grid = [nbs,als,sps];

    re.textContent = sha.split(/(.{4})/).filter(o=>o).map(x=>grid[(((x.charCodeAt(2)+x.charCodeAt(3))%12)/4) >> 0][(x.charCodeAt(0)+x.charCodeAt(1)) % 8][((x.charCodeAt(2)+x.charCodeAt(3))%12)%4]).join('');
}



dm.addEventListener('change', encode);
ky.addEventListener('change', encode);
recpy.addEventListener('click', () => navigator.clipboard.writeText(re.textContent));
