document.addEventListener("DOMContentLoaded", () => genTable(10,10))

function genTable(colLen, rowLen){
    const TABLE = document.getElementById("crossword")
    for(let i=0; i<rowLen; i++){
        let row = document.createElement("tr")
            for(let j=0; j<colLen; j++){
                let col = document.createElement('td')
                row.appendChild(col)
            }
        TABLE.appendChild(row)
    }
    addWord("squid", 2,1,true)
    addWord("splatoon",2,1,false)
}

function addWord(word, col, row, vert){
    const TABLE = document.getElementById("crossword")
    let array = word.split('')
    console.log(array)
    array.forEach((letter, i) => {
        if(vert) TABLE.rows[row+i].cells[col].innerHTML = letter.toUpperCase();
        else TABLE.rows[row].cells[i+col].innerHTML = letter.toUpperCase();

    });
}