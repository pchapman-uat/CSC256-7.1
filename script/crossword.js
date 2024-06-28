document.addEventListener("DOMContentLoaded", () => genTable(10,10))
class Word{
    /**
     * @type {Array<String>}
     */
    reaminingLetters = [];
    solved = false;
    /**
     * Generate a new word for the cross word puzzle
     * @param {String} word - The word to be added to the crossword
     * @param {Number} col - The starting collumn for the word (left=0) 
     * - MUST be positive whole number
     * @param {Number} row - The starting row for the word (top=0)
     * - MUST be positive whole number
     * @param {Boolean} vertical - Whether the word is vertical or horizontal 
     * @param {String} hint - The hint that will be provided
     */
    constructor(word, col, row, vertical, hint){
        this.word = word;
        this.col = col;
        this.row = row;
        this.vertical = vertical;
        /** 
         * @type {Array<String>}
        */
        this.letters = this.word.split('')
        /**
         * @type {Array<String>}
         */
        this.reaminingLetters = this.letters.slice(0);
        this.hint = hint;
    }
    /**
     * Add the word to the table
     * @param {HTMLTableElement} TABLE - HTML Table element to add the word to
     */
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
    /**
     * Check if the word is correct
     * @param {HTMLTableElement} TABLE - HTML Table element to check if the word is correct
     */
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
    /**
     * Check if the value (letter) is correct, handles no value inputed
     * @param {HTMLTableColElement} td - Table Column for the letter to check
     * @param {String} letter The correct letter
     * @returns {boolean} 
     * - True: The value is correct
     * - False: The value is incorrect
     */
    checkValue(td, letter){
        console.log(td.firstChild.value)
        if(td.firstChild.value == undefined) {
            console.log("No Input")
            return true;
        }
        return td.firstChild.value.toUpperCase() == letter.toUpperCase()
    }
    /**
     * Show the word in the table, while checking if it is correct or not
     * @param {HTMLTableElement} TABLE - HTML Table element to show the word
     */
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
    /**
     * 
     * @param {HTMLTableElement} TABLE - HTML table to get the cell from
     * @param {Number} i - Index to be added to the row/column
     * - this.vertical: true | row + i
     * - this.vertical: false | col + i
     * @returns {HTMLTableColElement} The table column of the 
     */
    getCell(TABLE, i){
        let td;
        if(this.vertical) td = TABLE.rows[this.row+i].cells[this.col];
        else td = TABLE.rows[this.row].cells[i+this.col];
        return td;
    }
    /**
     * Will continue to attempt to show letters until one is shown.
     * @param {HTMLTableElement} TABLE - HTML table element to display the random letter
     * @returns {boolean} 
     * - False: No more letters left
     * - True: Sucsesfully showed letter
     */
    
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
    /**
     * Using the cell and index it will update the remaning letters and solved value
     * @param {HTMLTableColElement} td 
     * @param {Number} index - Index of the letter to update 
     */
    updateSolved(td, index){
        td.innerHTML = this.letters[index].toUpperCase();
        this.reaminingLetters[index] = null;
        console.log(this.reaminingLetters.filter((val) => val !== null))
        if(this.reaminingLetters.filter((val) => val !== null).length == 0){
            this.solved = true;
        }
    }
    /**
     * Using the index check if that letter has been found
     * @param {number} index - Index of the letter relative to the letters
     * @returns {boolean}
     * - True: Values Match
     * - False: Values do not match
     */
    forThisWord(index) {
        return this.reaminingLetters[index] == this.letters[index]
    }
}
/**
 * Generate the table based on the collumn and row length
 * The table will be colLen * rowlen in size
 * Add Event Listeners to the buttons for the table
 * Calls the addWords function
 * @param {Number} colLen Total ammount of collumns
 * - MUST be positive whole number 
 * @param {Number} rowLen Total ammount of rows
 * - MUST be positive whole number
 */
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

/**
 * Adds the words to the table
 * For each word it will call the addWord method of the object
 */
function addWords(){
    WORDS.forEach((word) => {
        word.addWord(document.getElementById("crossword"))
    })
}
/**
 * Checks the words to see if they are correct
 * for each word it will call the checkWord method of the object
 */
function checkWords(){
    WORDS.forEach((word) => {
        word.checkWord(document.getElementById("crossword"));
    })
}
/**
 * Show all words with the correct values
 * For each word it will call the showWord method of the object
 */
function showWords(){
    WORDS.forEach((word) => {
        word.showWord(document.getElementById("crossword"));
    });
}
var usedHints = []
var secondHints = []
/**
 * Display a random hint
 * Uses the hints from the words
 * Once a hint is used it is added to usedHints
 * If all hints are used it will generate hints based on the lenght of the word
 */
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
/**
 * Display a random letter
 * This function will call itself until there is a letter to display
 * If there are no letters to display it will return
 */
function randomLetter(){
    let filteredWords = WORDS.filter((word) => !word.solved)
    console.log(filteredWords)
    if(filteredWords.length == 0) return;
    let randomIndex = Math.floor(Math.random()*filteredWords.length)
    let result = filteredWords[randomIndex].showRandomLetter(document.getElementById("crossword"))
    if(!result) randomLetter();
}