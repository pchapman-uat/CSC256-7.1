document.addEventListener("DOMContentLoaded", () => genTable(10,10))

function genTable(rowLen, colLen){
    const TABLE = document.getElementById("crossword")
    for(let i=0; i<rowLen; i++){
        let row = document.createElement("tr")
            for(let j=0; j<colLen; j++){
                let col = document.createElement('col')
                row.appendChild(col)
            }
        TABLE.appendChild(row)
    }
}
