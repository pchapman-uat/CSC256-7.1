document.addEventListener("DOMContentLoaded", () => genTable(10,10))

class Word{
    reaminingLetters = [];
    solved = false;
    constructor(word, col, row, vertical, hint){
        this.word = word;
        this.col = col;
        this.row = row;
        this.vertical = vertical;
        this.letters = this.word.split('')
        this.reaminingLetters = this.letters.slice(0);
        this.hint = hint;
    }
    addWord(TABLE){
       
        this.letters.forEach((letter, i) => {
            let td=this.getCell(TABLE,i)
            // td.innerHTML = letter.toUpperCase;
            if(td.childElementCount != 0) return;
            let input = document.createElement("input");
            input.setAttribute("maxLength", "1");
            td.appendChild(input)
            td.classList.remove("unused");
        });
    }
    checkWord(TABLE){
        this.letters.forEach((letter, i) => {
            let td=this.getCell(TABLE, i);
            if(!td.firstChild.value) return;
            if(this.checkValue(td, letter)){
                td.classList.add("correct");
                this.updateSolved(td, i)
            } else if(this.forThisWord(i)) this.updateSolved(td, i);
           
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
    showRandomLetter(TABLE){
        let randomIndex = Math.floor(Math.random() * this.letters.length);
        let td = this.getCell(TABLE, randomIndex);
        if(this.reaminingLetters.filter((val) => val!==null).length == 0){
            console.log("No More Letters")
            return false;
        }
        else if(td.firstChild.value == undefined) {
            console.log("Already Used")
            console.log(this.reaminingLetters)
            if(this.forThisWord(randomIndex)){
                console.log("Used for differnt word")
                console.log(this.letters)
                console.log(this.letters[randomIndex])
                this.updateSolved(td,randomIndex)
                return this.showRandomLetter(TABLE)
            } else {
                return this.showRandomLetter(TABLE)
            }
        }
        else {
            this.updateSolved(td, randomIndex)
            return true;
        }
    }
    updateSolved(td, index){
        td.innerHTML = this.letters[index].toUpperCase();
        this.reaminingLetters[index] = null;
        console.log(this.reaminingLetters.filter((val) => val !== null))
        if(this.reaminingLetters.filter((val) => val !== null).length == 0){
            this.solved = true;
        }
    }
    forThisWord(index) {
        return this.reaminingLetters[index] == this.letters[index]
    }
}

function genTable(colLen, rowLen){
    const TABLE = document.getElementById("crossword")
    for(let i=0; i<rowLen; i++){
        let row = document.createElement("tr")
            for(let j=0; j<colLen; j++){
                let col = document.createElement('td')
                col.classList.add("unused");
                row.appendChild(col)
            }
        TABLE.appendChild(row)
    }
    addWords();
    document.getElementById("check").addEventListener("click", () => checkWords());
    document.getElementById("show").addEventListener("click", () => showWords());
    document.getElementById("randomLetter").addEventListener("click", () => randomLetter())
    document.getElementById("randomHint").addEventListener("click", () => randomHint());
}

const WORDS =[
    new Word("Tentacle", 1,7,false,"A long, flexible limb used by squids for grasping and sensing."),
    new Word("Cephalopod", 0,5,false, "The class of mollusks that includes squids, octopuses, and cuttlefish."),
    new Word("Mantle", 4,4,true, "The main body part of a squid, covering its organs.")
]
function addWords(){
    let hints = document.getElementById("hints")
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
var usedHints = []
var secondHints = []
function randomHint(){
    let hints = document.getElementById("hints")
    let randomIndex = Math.floor(Math.random()*WORDS.length)
    let randomWord;
    if(usedHints.length + secondHints.length >= WORDS.length*2) return;
    if(usedHints.length >= WORDS.length){
        while(secondHints.includes(randomIndex)){
            randomIndex = Math.floor(Math.random()*WORDS.length)
            console.log(randomIndex)
        }
        randomWord = "Word "+(randomIndex+1)+" has "+WORDS[randomIndex].letters.length+" letters";
        secondHints.push(randomIndex)
    } else{
        while(usedHints.includes(randomIndex)){
            randomIndex = Math.floor(Math.random()*WORDS.length)
            console.log(randomIndex)
        }
        randomWord = (randomIndex+1)+". "+WORDS[randomIndex].hint;
        usedHints.push(randomIndex)
    }
    
   
    
    let hint = document.createElement("p");
    hint.innerHTML = randomWord;
    hints.appendChild(hint)
}
function randomLetter(){
    let filteredWords = WORDS.filter((word) => !word.solved)
    console.log(filteredWords)
    if(filteredWords.length == 0) return;
    let randomIndex = Math.floor(Math.random()*filteredWords.length)
    let result = filteredWords[randomIndex].showRandomLetter(document.getElementById("crossword"))
    if(!result) randomLetter();
}