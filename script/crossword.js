document.addEventListener("DOMContentLoaded", () => genTable(10,10))

function genTable(rowLen, colLen){
    const TABLE = document.getElementById("crossword")
    for(let i=0; i<rowLen; i++){
        let row = document.createElement("tr")
            for(let j=0; j<colLen; j++){
                let col = document.createElement('td')
                row.appendChild(col)
            }
        TABLE.appendChild(row)
    }
}

function addWord(word, row, col, vert){
    const TABLE = document.getElementById("crossword")
    let array = word.split('')
    console.log(array)
    array.forEach((letter, i) => {
        if(vert) TABLE.rows[row+i].cells[col].innerHTML = letter;
        else TABLE.rows[row].cells[i+col].innerHTML = letter;
    });
}