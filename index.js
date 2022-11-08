let words = [
    {
        word: "kalafior",
        category: "vegetables"
    },
    {
        word: "portugalia",
        category: "countries"
    },
]

let tries = 7
let chosenIndex = 0
let choices = []
let wrongChoices = []
let chosenWord = ''
let newWordLettersList = []
let usedLetters = []
let showCategory = false
let gameIsStarted = false // if game is started changes in settings will render a game, otherwise nothing happens
let messageWindowIsActive = false  // whenever message window is open, you can't use input field

const deathToolImg = document.getElementById("death-tool")
const startGameContainer = document.querySelector(".start-game-container")
const gameContainer = document.querySelector(".game-container")
const startGameBtn = document.querySelector(".start-game-btn")
const messageContainer = document.querySelector(".message-container")
const closeBtn = document.querySelector(".close-btn")
const messageText = document.querySelector(".message-text")
const settingsContainer = document.querySelector(".settings-container")

const settingsBtn = document.getElementById("settings-icon")
const closeSettingsBtn = document.getElementById("close-settings-btn")
const offBtn = document.getElementById("btn-off")
const onBtn = document.getElementById("btn-on")



// gameContainer.style.height = 0
startGameBtn.addEventListener("click", function() {
    startGame()
})

closeBtn.addEventListener("click", function() {
    messageContainer.style.display = 'none'
    messageWindowIsActive = false
    renderGame()
})

offBtn.addEventListener("click", function() {
    onBtn.className = "on-btn-inactive"
    offBtn.className = "btn-off"
    showCategory = false
})

onBtn.addEventListener("click", function() {
    offBtn.className = "off-btn-inactive"
    onBtn.className = 'btn-on'
    showCategory = true
})

settingsBtn.addEventListener("click", function() {
    if (showCategory) {
        offBtn.className = "off-btn-inactive"
        onBtn.className = 'btn-on'
    } else {
        onBtn.className = "on-btn-inactive"
        offBtn.className = "btn-off"
    }
    settingsContainer.style.display = 'flex'
})

closeSettingsBtn.addEventListener("click", function() {
    settingsContainer.style.display = 'none'
    if (gameIsStarted) {
        renderGame()
    }
})

// functions

function startGame() {
    choices = []
    wrongChoices = []
    usedLetters = []
    tries = 7
    gameIsStarted = true
    startGameContainer.style.display = 'none'
    gameContainer.style.display = 'flex'
    gameContainer.style.height = '400px'
    chosenWord = chooseWord(words)
    renderGame()
}

function renderGame() {
    if (tries > 0) {
        displayGraphic()
        displayList(chosenWord)

        let testContainer = document.querySelector(".word-container")
        if (!testContainer.innerText.includes("_")) {
            console.log("brawo, udało ci się odgadnąć hasło")
        }
    } else {
        displayGraphic()
        console.log("koniec gry, renderuję start game")
        startGameContainer.style.display = 'flex'
        gameContainer.style.display = 'none'
    }
}

function makeNewWordLetterList(word) {
    for (let i = 0; i < word.length; i++) {
        let letter = word[i]
        newWordLettersList.push(letter)
    }
    return newWordLettersList
}

function displayList(chosenWord) {
    gameContainer.innerHTML = `
    <div class="word-container">
    </div>`
    const wordContainer = document.querySelector(".word-container")
    wordContainer.innerHTML = ''
    for (let i = 0; i < chosenWord.length; i++) {
        let letter = chosenWord[i]
        if (choices.includes(letter)) {
            wordContainer.innerHTML += `<p class="word-par">${letter.toUpperCase()}</p>`
        } else {
            wordContainer.innerHTML += `<p class="word-par">_<p>`
        }
    } 
    addForm()
    if (messageWindowIsActive) { // when message window is displayed, input field and submit button is 
        const inputEl = document.getElementById("letter-input")
        const submitBtnEl = document.getElementById("submit-btn")
        inputEl.removeAttribute('enabled')
        inputEl.setAttribute('disabled', '')
        submitBtnEl.removeAttribute('enabled')
        submitBtnEl.setAttribute('disabled', '')
        inputEl.enabled = false
    }
}

function chooseWord(arr) {
    chosenIndex = Math.floor(Math.random() * arr.length)
    return arr[chosenIndex].word.toUpperCase()
}

function addForm() {
    let colorUsedLetters = colorLetters(usedLetters)
    gameContainer.innerHTML += 
    `<div class="form-container">
        <form id="input-form">
            <input 
                type="text" 
                name="input-letter" 
                placeholder="Enter letter"
                id="letter-input"
                enabled
                >
            <button type="submit" class="confirm-btn" id="submit-btn" enabled>CONFIRM</button>
        </form>
    </div>
    <div class="show-chosen-letters">
        <p class="medium-par">Used letters: ${colorUsedLetters}</p>
    </div>
    <div class="category-container">
    <p class="medium-par" id="category">&nbsp;</p>
  </div> 
    `
    // showing category if it's set in settings window
    if (showCategory) {
        const categoryContainer = document.querySelector(".category-container")
        categoryContainer.innerHTML =
        `<p class="medium-par">Category - ${words[chosenIndex].category.toUpperCase()}</p>`
    }
    

    const inputForm = document.getElementById("input-form")
    inputForm.addEventListener("submit", function(e){
        e.preventDefault()

    const inputFormData = new FormData(inputForm)
    let letter = inputFormData.get("input-letter")
    letter = letter.toUpperCase()
    if (letter.length > 1) {
        renderMessageToLongString(letter)
    } else if (letter.toUpperCase() != letter.toLowerCase()) {
        if (isInChosenWord(letter) === true && !choices.includes(letter)) {
            letter = letter.toUpperCase()
            choices.push(letter)
            usedLetters.push(letter)
            // renderGame()
        } else if (!isInChosenWord(letter) && !usedLetters.includes(letter)) {
            tries -= 1
            letter = letter.toUpperCase()
            wrongChoices.push(letter)
            if (!usedLetters.includes(letter)) {
                usedLetters.push(letter)
            }
            // renderGame()
        } else {
            renderMessage(letter)
            // renderGame()
        }
    } else {
        renderMessageNotALetter(letter)
    }
    renderGame()
    })
}

function isInChosenWord(letter) {
    if (usedLetters.includes(letter)){
        renderMessage(letter)
    }
    if (chosenWord.includes(letter)) {
        return true
    } else {
        return false
    }
}

function displayGraphic() {
    deathToolImg.src = `images/gallows${tries}.png`
}
// displaying colored letters - green when letter is correct, red when it's not correct
function colorLetters(letters) {
    const coloredLetters = []
    let newItem = ''
    for (let i = 0; i < letters.length; i++) {
        if (!wrongChoices.includes(letters[i])) {
            newItem = ("<span class='green'>" + letters[i] + "</span>")
            coloredLetters.push(newItem)
        } else {
            newItem = ("<span class='red'>" + letters[i] + "</span>")
            coloredLetters.push(newItem)
        } 
    }
    console.log(coloredLetters)
    return coloredLetters
}

function renderMessage(letter) {
    messageWindowIsActive = true
    messageContainer.style.display = 'flex'
    messageText.innerHTML = `Letter "${letter.toUpperCase()}" was already chosen. Please try another letter.`
}

function renderMessageNotALetter(letter) {
    messageWindowIsActive = true
    messageContainer.style.display = 'flex'
    messageText.innerHTML = `"${letter.toUpperCase()}" is not a letter.`
}

function renderMessageToLongString(letter) {
    messageWindowIsActive = true
    messageContainer.style.display = 'flex'
    messageText.innerHTML = `You can only pick one letter, not a string.`
}

// function showChosenLetters() {
//     gameContainer.innerHTML += `<p id="chosen-letters></p>`
//     console.log(gameContainer)
//     // const chosenLettersEl = document.getElementById("chosen-letters")
//     // console.log(chosenLettersEl)
//     // chosenLettersEl.innerText = "Already chosen letters are: "
//     // if (choices.length > 0) {
//     //     for (let i = 0; i < choices.length; i++) {
//     //         if (choices.length > 0) {
//     //             gameContainer.innerText += choices[i].toUpperCase() + " "
//     //         }
//     //         console.log("Already chosen letters are:", choices[i].toUpperCase())
//     //     }
//     // }
 
// }