var a = {
        'a': 'aaaa',
        'b': { name: 'bbbb'}
}
for (var key in a){
    console.log(a[key]);
}
console.log(Object.keys(a));
