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
    checkWord(TABLE){
        this.letters.forEach((letter, i) => {
            let td=this.getCell(TABLE, i);
            if(!td.firstChild.value) return;
            if(this.checkValue(td, letter)){
                td.classList.add("correct");
                td.innerHTML = letter.toUpperCase();
            }
           
        })
    }
    checkValue(td, letter){
        console.log(td.firstChild.value)
        if(td.firstChild.value == undefined) {
            console.log("No Input")
            return true;
        }
        return td.firstChild.value.toUpperCase() == letter.toUpperCase()
    }
    showWord(TABLE){
        console.log("Start Show Word")
        console.log(this.letters)
        this.letters.forEach((letter, i) => {
            console.log(letter)
            console.log(i)
            let td=this.getCell(TABLE, i);
            if(!td.firstChild) return;
            if(this.checkValue(td, letter)){
                td.classList.add("correct");
            } else{
                td.classList.add("wrong")
            }
            td.innerHTML = letter.toUpperCase();
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
    addWords();
    document.getElementById("check").addEventListener("click", () => checkWords());
    document.getElementById("show").addEventListener("click", () => showWords());
}

const WORDS =[
    new Word("test", 0,0,true),
    new Word("test", 0,0,false)
]
function addWords(){
    WORDS.forEach((word) => {
        word.addWord(document.getElementById("crossword"))
    })
}
function checkWords(){
    WORDS.forEach((word) => {
        word.checkWord(document.getElementById("crossword"));
    })
}
function showWords(){
    WORDS.forEach((word) => {
        word.showWord(document.getElementById("crossword"));
    });
}