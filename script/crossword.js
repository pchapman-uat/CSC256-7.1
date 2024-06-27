document.addEventListener("DOMContentLoaded", () => genTable(10,10))

class Word{
    constructor(word, col, row, vertical){
        this.word = word;
        this.col = col;
        this.row = row;
        this.vertical = vertical;
        this.letters = this.word.split('')
    }
    addWord(TABLE){
       
        this.letters.forEach((letter, i) => {
            let td=this.getCell(TABLE,i)
            // td.innerHTML = letter.toUpperCase;
            if(td.childElementCount != 0) return;
            let input = document.createElement("input");
            input.setAttribute("maxLength", "1");
            td.appendChild(input)
        });
    }
    showWord(TABLE){
        this.letters.forEach((letter, i) => {
            let td=this.getCell(TABLE, i);
            td.innerHTML = letter;
        })
    }
    getCell(TABLE, i){
        let td;
        if(this.vertical) td = TABLE.rows[this.row+i].cells[this.col];
        else td = TABLE.rows[this.row].cells[i+this.col];
        return td;
    }
}

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
    addWrods();
    document.getElementById("show").addEventListener("click", () => showWords());
}

const WORDS =[
    new Word("test", 0,0,true),
    new Word("test", 0,0,false)
]
function addWrods(){
    WORDS.forEach((word) => {
        word.addWord(document.getElementById("crossword"))
    })
}
function showWords(){
    WORDS.forEach((word) => {
        word.showWord(document.getElementById("crossword"));
    })
}