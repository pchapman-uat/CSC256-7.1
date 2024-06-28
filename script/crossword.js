document.addEventListener("DOMContentLoaded", () => genTable(10,10))
class Word{
    /**
     * The string will contain singular letters, and null for correct letters
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
     * - This iterates through all letters and adds an input element to the table
     * - It will also remove the "unused" class
     * @param {HTMLTableElement} TABLE - HTML Table element to add the word to
     */
    addWord(TABLE){
        // Itterate through all letters
        this.letters.forEach((letter, i) => {
            // Get the cell based on the index
            let td=this.getCell(TABLE,i)
            // Check if has an input element
            if(td.childElementCount != 0) return;
            // Add the input element
            let input = document.createElement("input");
            // Set the max length
            input.setAttribute("maxLength", "1");
            // Add the input to the column to the table
            td.appendChild(input)
            // Remove the unused class
            td.classList.remove("unused");
        });
    }
    /**
     * Check if the word is correct
     * - This will iterate through all letters and check if they are correct
     * - It will also update the solved array
     * @param {HTMLTableElement} TABLE - HTML Table element to check if the word is correct
     */
    checkWord(TABLE){
        // Itterate through all letters
        this.letters.forEach((letter, i) => {
            // Get the cell
            let td=this.getCell(TABLE, i);
            // Check if has an input element
            if(!td.firstChild.value) return;
            // Check if the value is correct
            if(this.checkValue(td, letter)){
                // Add the correct class
                td.classList.add("correct");
                // Update the solved array
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
        // Check if there is an input
        if(td.firstChild.value == undefined) {
            console.log("No Input")
            return true;
        }
        // Check if the value is correct
        return td.firstChild.value.toUpperCase() == letter.toUpperCase()
    }
    /**
     * Show the word in the table, while checking if it is correct or not
     * - This will add the clsas relative if it is correct or not, as well locking the input
     * - Compared to checkValue, this one will display if the value is wrong
     * @param {HTMLTableElement} TABLE - HTML Table element to show the word
     */
    showWord(TABLE){
        // For each letter
        this.letters.forEach((letter, i) => {
            // Get the cell
            let td=this.getCell(TABLE, i);
            // Check if there is an input
            if(!td.firstChild) return;
            // Add correct or wrong class
            if(this.checkValue(td, letter)){
                td.classList.add("correct");
            } else{
                td.classList.add("wrong")
            }
            // Lock the input by removing it and displaying the value
            td.innerHTML = letter.toUpperCase();
        })
    }
    /**
     * Get the cell based on the index
     * @param {HTMLTableElement} TABLE - HTML table to get the cell from
     * @param {Number} i - Index to be added to the row/column
     * - this.vertical: true | row + i
     * - this.vertical: false | col + i
     * @returns {HTMLTableColElement} The table column of the 
     */
    getCell(TABLE, i){
        /**
         * @type {HTMLTableColElement}
         */
        let td;
        if(this.vertical) td = TABLE.rows[this.row+i].cells[this.col];
        else td = TABLE.rows[this.row].cells[i+this.col];
        return td;
    }
    /**
     * Will continue to attempt to show letters until one is shown.
     * - There are 4 possible states:
     * 1. All letters are correct (Return false)
     * 2. Already Used, but for different word (Try again with new letter & update remainingLetters)
     * 3. Already Used, but for this word (Try again with new letter)
     * 4. Not shown (Show letter and return true)
     * @param {HTMLTableElement} TABLE - HTML table element to display the random letter
     * @returns {boolean} 
     * - False: No more letters left
     * - True: Sucsesfully showed letter
     */
    
    showRandomLetter(TABLE){
        // Get a random index
        let randomIndex = Math.floor(Math.random() * this.letters.length);
        // Get the cell based on the index
        let td = this.getCell(TABLE, randomIndex);
        // Filter out all nulls, if there are no letters, return false
        if(this.reaminingLetters.filter((val) => val!==null).length == 0){
            console.log("No More Letters")
            return false;
        }
        // Check if there is not an input
        else if(td.firstChild.value == undefined) {
            // If the letter is used for this word
            // This only happens if the remaining letters at that index is not null, and matches the letter array
            if(this.forThisWord(randomIndex)){
                // Update the solved array
                this.updateSolved(td,randomIndex)
                
            }
            // Attempt another letter
            // Even if the letter was for this words remaining letters, the upper condition will only run if it has already been entered/revieald
            // If the letter is not in the remaining, that means it is a duplicate
            // Thus the function will call again to always show a new letter
            
            return this.showRandomLetter(TABLE)
        }
        // If the letter is not in the remaining, and there is still an input
        else {
            // Update the solved array
            this.updateSolved(td, randomIndex)
            // Return that a letter was shown
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
    // Get the table element
    const TABLE = document.getElementById("crossword")
    // For each row
    for(let i=0; i<rowLen; i++){
        // Create row element
        let row = document.createElement("tr")
        // For each column
        for(let j=0; j<colLen; j++){
            // Create cell element
            let col = document.createElement('td')
            // Add unused class
            col.classList.add("unused");
            // Append cell to row
            row.appendChild(col)
        }
        // Append row to table
        TABLE.appendChild(row)
    }
    // Add words to table
    addWords();
    // Add Event Listeners
    document.getElementById("check").addEventListener("click", () => checkWords());
    document.getElementById("show").addEventListener("click", () => showWords());
    document.getElementById("randomLetter").addEventListener("click", () => randomLetter())
    document.getElementById("randomHint").addEventListener("click", () => randomHint());
}

/**
 * Array of words to be used in the crossword
 */
const WORDS =[
    new Word("Tentacle", 1,7,false,"A long, flexible limb used by squids for grasping and sensing."),
    new Word("Cephalopod", 0,5,false, "The class of mollusks that includes squids, octopuses, and cuttlefish."),
    new Word("Mantle", 4,4,true, "The main body part of a squid, covering its organs.")
]

/**
 * Adds the words to the table
 * - For each word it will call the addWord method of the object
 */
function addWords(){
    WORDS.forEach((word) => {
        word.addWord(document.getElementById("crossword"))
    })
}
/**
 * Checks the words to see if they are correct
 * - For each word it will call the checkWord method of the object
 */
function checkWords(){
    WORDS.forEach((word) => {
        word.checkWord(document.getElementById("crossword"));
    })
}
/**
 * Show all words with the correct values
 * - For each word it will call the showWord method of the object
 */
function showWords(){
    WORDS.forEach((word) => {
        word.showWord(document.getElementById("crossword"));
    });
}
/**
 * List of used hints
 * - This contains the index for the word
 * @type {Array<Number>}
 */
var usedHints = []
/**
 * List of second level hints
 * - These hints will display the letters in the word
 * - This contains the index for the word
 * @type {Array<Number>}
 */
var secondHints = []
/**
 * Display a random hint
 * - Uses the hints from the words
 * - Once a hint is used it is added to usedHints
 * - If all hints are used it will generate hints based on the lenght of the word
 */
function randomHint(){
    // Get the hints element
    let hints = document.getElementById("hints")
    // Get a random index
    let randomIndex = Math.floor(Math.random()*WORDS.length)
    /**
     * @type {String}
     */
    let hintResult;
    // If all used hints are greater than possible hints, stop execution
    if(usedHints.length + secondHints.length >= WORDS.length*2) return;
    // If first set of hints have been used
    if(usedHints.length >= WORDS.length){
        // Generate a random hint until a new one is found
        while(secondHints.includes(randomIndex)) randomIndex = Math.floor(Math.random()*WORDS.length);
        // Generate the hint result
        hintResult = "Word "+(randomIndex+1)+" has "+WORDS[randomIndex].letters.length+" letters";
        // add the index to the seen hints
        secondHints.push(randomIndex)
    // If there are still aviaiable normal hints
    } else{
        // while the hint is already used, generate a new one
        while(usedHints.includes(randomIndex)){
            randomIndex = Math.floor(Math.random()*WORDS.length)
            console.log(randomIndex)
        }
        // Generate the hint result
        hintResult = (randomIndex+1)+". "+WORDS[randomIndex].hint;
        // Add index to used hints
        usedHints.push(randomIndex)
    }
    // Create a hint element and add text
    let hint = document.createElement("p");
    hint.innerHTML = hintResult;
    hints.appendChild(hint)
}
/**
 * Display a random letter
 * This function will call itself until there is a letter to display
 * If there are no letters to display it will stop execution
 */
function randomLetter(){
    // Filter out for unsolved words
    let filteredWords = WORDS.filter((word) => !word.solved)
    // If there are no unsolved words, stop execution
    if(filteredWords.length == 0) return;
    // Get a random index
    let randomIndex = Math.floor(Math.random()*filteredWords.length)
    // Show the random letter by running the showRandomLetter method of the object
    let result = filteredWords[randomIndex].showRandomLetter(document.getElementById("crossword"))
    // If there is no letter is shown, attempt again
    if(!result) randomLetter();
}