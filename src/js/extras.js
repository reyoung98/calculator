// Some extra code I decided not to use: instead of making separate eventListeners for each operator key, I put the keys in an array of objects and looped through them. More elegant? Maybe. But took up more lines of code in the end. 

const opKeys = [
    {
        key: '+',
        operation: 'add',
        btnName: addBtn
    },
    {
        key: '-',
        operation: 'subtract',
        btnName: minusBtn
    },
    {
        key: '*',
        operation: 'multiply',
        btnName: multBtn
    },
    {
        key: '/',
        operation: 'divide',
        btnName: divBtn
    }
]

for (let opKey of opKeys) {
    document.addEventListener('keydown', (e) => {
        if (e.key == opKey.key) {
            operate(opKey.operation, opKey.btnName);
        };
    });
}