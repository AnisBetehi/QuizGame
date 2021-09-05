
// Variables
const categoriesContainer = document.querySelector('.choose-category');

// Category Names
const categories = document.querySelectorAll('.category');
const welcome = document.querySelector('.welcome-buttons');
// Home buttons
const startGameBtn = document.querySelector('#start-game');
const continueGameBtn = document.querySelector('#continue');
const nextButton = document.querySelector('#next-button');
const score = document.querySelector('#score');
const progressBar = document.querySelector('.progress-bar')
const volumeButton = document.querySelector('.volumeButton');
const musicButton = document.querySelector('.musicButton');
const musicButtonSlash = musicButton.querySelector('.slash');
const themeButton = document.querySelector('.themeButton');
const mainMenuButton = document.querySelector('#main-menu');
const music = document.querySelector('.music');
const currentTheme = document.querySelector('.current-theme');

// Container for the game
const quizContainer = document.querySelector('.questions-container');

// The Question
const questionContainer = document.querySelector('.question h1');
// The Options
const optionsContainer = document.querySelectorAll('.answers div');
// get progresses

const progresses = document.querySelectorAll('.category-progress');

// Audios

const clickSound = document.querySelector('.click');
const correctAnswerSound = document.querySelector('.correct-answer');
const wrongAnswerSound = document.querySelector('.wrong-answer');
const settingsButton = document.querySelector('.settings-button');
const settings = document.querySelector('.settings');

// Play sounds

function playClickSound() {
    clickSound.load();
    clickSound.play();
}

function playCorrectAnswerSound() {
    correctAnswerSound.load();
    correctAnswerSound.play();
}

function playWrongAnswerSound() {
    wrongAnswerSound.load();
    wrongAnswerSound.play();
}


// open and close settings
settingsButton.addEventListener('click', () => {
    playClickSound();
    settings.classList.toggle('shrink');
});


// Check if sound is muted
let mutedSound = JSON.parse(localStorage.getItem('soundMuted')) || false;

toggleSound(mutedSound);

// Function to toggle Sound on click
function toggleSound(mutedSound) {
    const mutedIcon = '<i class="fas fa-volume-mute"></i>';
    const volumeIcon = '<i class="fas fa-volume-down"></i>';
    correctAnswerSound.muted = mutedSound;
    wrongAnswerSound.muted = mutedSound;
    clickSound.muted = mutedSound;
    localStorage.setItem('soundMuted', JSON.stringify(mutedSound));
    mutedSound ? volumeButton.innerHTML = mutedIcon : volumeButton.innerHTML = volumeIcon;
}

// Trigger toggleSound
volumeButton.addEventListener('click', () => {
    mutedSound = !mutedSound;
    toggleSound(mutedSound);
    playClickSound();
})

// Get theme saved in local storage 
let theme = localStorage.getItem('theme') || 'dark';

// set it when page loads
toggleTheme(theme);

// function to toggleTheme
function toggleTheme(theme) {
    const darkThemeIcon = '<i class="fas fa-moon"></i>';
    const lightThemeIcon = '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', theme)
    theme == 'dark' ? themeButton.innerHTML = darkThemeIcon : themeButton.innerHTML = lightThemeIcon;
    if (theme == 'dark') {
        currentTheme.href = "";
    } else {
        currentTheme.href = "light.css";
    }

}


// toggle theme when clicking the theme button
themeButton.addEventListener('click', () => {
    playClickSound();
    if (theme == 'light') {
        theme = 'dark';
    } else if (theme == 'dark') {
        theme = 'light';
    };
    toggleTheme(theme);
})

// Check if music is muted;

let musicMuted = JSON.parse(localStorage.getItem('musicMuted')) ?? true;
toggleMusic(musicMuted);

// function to toggleMusic
function toggleMusic(musicMuted) {
    music.muted = musicMuted;
    localStorage.setItem('musicMuted', JSON.stringify(musicMuted));
    musicMuted ? musicButtonSlash.style.opacity = '1' : musicButtonSlash.style.opacity = '0';
}

// Toggle music when clicking music button
musicButton.addEventListener('click', () => {
    playClickSound();
    musicMuted = !musicMuted;
    toggleMusic(musicMuted);
})


// Game Blueprint
class Game {

    constructor(questions, currentQuestion = 0, category, score = 0) {
        this.questions = questions;
        this.currentQuestion = currentQuestion;
        this.options = questions[currentQuestion].options;
        this.answer = questions[currentQuestion].answer;
        this.category = category;
        this.score = score
    }

    startGame() {
        this.currentQuestion = 0;
        this.score = 0;
        let percentage = (this.score) * 100 / this.questions.length;
        score.innerHTML = `${percentage}%`;
        progressBar.style.width = `${percentage}%`;
        localStorage.setItem(`${this.category}QuestionsIndex`, 0);
        welcome.classList.add('hidden');
        quizContainer.classList.remove('hidden');
    }


    continueGame() {
        welcome.classList.add('hidden');
        quizContainer.classList.remove('hidden');
    }

    updateGame(newQuestions, newCurrentQuestion, newCategory, newScore) {
        this.questions = newQuestions;
        this.currentQuestion = newCurrentQuestion;
        this.options = newQuestions[newCurrentQuestion].options;
        this.answer = newQuestions[newCurrentQuestion].answer;
        this.category = newCategory;
        this.score = newScore
    }

    HandleQuestionUI() {
        optionsContainer.forEach(option => {
            option.classList.remove('correct');
            option.classList.remove('wrong');
            option.classList.remove('inactive');
        })
        let percentage = (this.score) * 100 / this.questions.length;
        score.innerHTML = `${percentage}%`;
        progressBar.style.width = `${percentage}%`;
        nextButton.classList.add('hidden');
        questionContainer.innerHTML = `${parseInt(this.currentQuestion) + 1}- ${this.questions[this.currentQuestion].question}`;

        shuffle(this.questions[this.currentQuestion].options);
        for (let counter = 0; counter < this.questions[this.currentQuestion].options.length; counter++) {
            optionsContainer[counter].innerHTML = this.questions[this.currentQuestion].options[counter];
        }

    }

    HandleEvents(option) {
        if (option.innerHTML == game.questions[game.currentQuestion].answer && game.currentQuestion == game.questions.length - 1) {
            playCorrectAnswerSound();
            option.classList.remove('inactive');
            option.classList.add('correct');
            progressBar.style.width = `100%`;
            score.innerHTML = `100%`;
            localStorage.setItem(`${game.category}QuestionsIndex`, game.currentQuestion);
            nextButton.classList.remove('hidden');
            nextButton.innerHTML = 'You Win';
        } else if (option.innerHTML == game.questions[game.currentQuestion].answer && game.    currentQuestion != game.questions.length) {
            playCorrectAnswerSound();
            game.currentQuestion++;
            game.score++;
            option.classList.remove('inactive');
            option.classList.add('correct')
            localStorage.setItem(`${game.category}QuestionsIndex`, game.currentQuestion);
            nextButton.classList.remove('hidden');
            nextButton.innerHTML = 'Next';
            //Restart if question is incorrect
        } else if (option.innerHTML != game.questions[game.currentQuestion].answer && game.currentQuestion != game.questions.length) {
            playWrongAnswerSound();
            option.classList.remove('inactive');
            option.classList.add('wrong');
            nextButton.classList.remove('hidden');
            game.currentQuestion = 0;
            game.score = 0;
            localStorage.setItem(`${game.category}QuestionsIndex`, game.currentQuestion);
            nextButton.innerHTML = 'Restart';
        }
    }
}


// fetch questions from json file
let fetchQuestions = async () => {
    let data = await fetch('./questions.json');
    let questions = await data.json();
    //assign the questions to variables
    let {historyQuestions, sportsQuestions, scienceQuestions, gamesQuestions, religionQuestions} = questions;

    updateProgressUI(historyQuestions, sportsQuestions, scienceQuestions, gamesQuestions, religionQuestions);



    let clickedCategoryQuestions, clickedCategoryQuestionIndex, clickedCategoryName;
    // Choose the category on click
    categories.forEach(category => {
        category.addEventListener('click', () => {
            playClickSound();
            updateProgress();
            // Get clicked category title
            clickedCategoryName = category.querySelector('h1').innerHTML;

            // Figure out which category was clicked
            switch (clickedCategoryName) {
                case 'Sports':
                    clickedCategoryQuestions = sportsQuestions;
                    clickedCategoryQuestionIndex = sportQuestionsIndex || 0;
                    break;
                case 'History':
                    clickedCategoryQuestions = historyQuestions;
                    clickedCategoryQuestionIndex = historyQuestionsIndex || 0;
                    break
                case 'Games':
                    clickedCategoryQuestions = gamesQuestions;
                    clickedCategoryQuestionIndex = gamesQuestionsIndex || 0;
                    break;
                case 'Science':
                    clickedCategoryQuestions = scienceQuestions;
                    clickedCategoryQuestionIndex = scienceQuestionsIndex || 0;
                    break;

                case 'Religion':
                    clickedCategoryQuestions = religionQuestions;
                    clickedCategoryQuestionIndex = religionQuestionsIndex || 0;
                    break;

            }

            if (clickedCategoryQuestionIndex > 0 && clickedCategoryQuestionIndex != clickedCategoryQuestions.length - 1) {
                continueGameBtn.classList.remove('inactive');
            } else {
                continueGameBtn.classList.add('inactive');
            }


            // enable continue button
            categoriesContainer.style.transitionDelay = '.1s';
            categoriesContainer.classList.add('hidden');
            welcome.classList.remove('hidden');


        })
    })


    startGameBtn.addEventListener('click', () => {
        game = new Game(shuffle(clickedCategoryQuestions), clickedCategoryQuestionIndex, clickedCategoryName, clickedCategoryQuestionIndex);
        playClickSound();
        game.startGame();
        game.HandleQuestionUI();
    })

    continueGameBtn.addEventListener('click', () => {
        game = new Game(clickedCategoryQuestions, clickedCategoryQuestionIndex, clickedCategoryName, clickedCategoryQuestionIndex);
        playClickSound();
        game.continueGame();
        game.HandleQuestionUI();
    })

    mainMenuButton.addEventListener('click', () => {
        playClickSound();
        updateProgress();
        updateProgressUI(historyQuestions, sportsQuestions, scienceQuestions, gamesQuestions, religionQuestions);
        categoriesContainer.style.transitionDelay = '.4s';
        categoriesContainer.classList.remove('hidden');
        welcome.classList.add('hidden');
        quizContainer.classList.add('hidden');
    })


    optionsContainer.forEach(option => {
        option.addEventListener('click', () => {
            optionsContainer.forEach(op => {
                op.classList.add('inactive');
            })
            game.HandleEvents(option);
            // Advance if question is correct

        })

    })


    nextButton.addEventListener('click', () => {
        playClickSound();
        if (nextButton.innerHTML == 'Restart') return startGameBtn.click();  
        if (nextButton.innerHTML == 'You Win') return mainMenuButton.click();  
        return game.HandleQuestionUI();
     
    })

}


fetchQuestions();


// Get Current question for all Categories
let sportQuestionsIndex, historyQuestionsIndex, scienceQuestionsIndex, religionQuestionsIndex, gamesQuestionsIndex;


// update progress from local storage
function updateProgress() {
    sportQuestionsIndex = localStorage.getItem('SportsQuestionsIndex');

    historyQuestionsIndex = localStorage.getItem('HistoryQuestionsIndex');

    scienceQuestionsIndex = localStorage.getItem('ScienceQuestionsIndex');

    religionQuestionsIndex = localStorage.getItem('ReligionQuestionsIndex');

    gamesQuestionsIndex = localStorage.getItem('GamesQuestionsIndex');
}

updateProgress();


// function to shuffle an array

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// update Progress UI in Categories

function updateProgressUI(historyQuestions, sportsQuestions, scienceQuestions, gamesQuestions, religionQuestions) {
    progresses.forEach(progress => {
        if (progress.previousElementSibling.querySelector('.category-name').innerHTML == 'History') {
            progress.innerHTML = `Progress: ${parseInt(historyQuestionsIndex) + 1|| 1}/${historyQuestions.length}`
        } else if (progress.previousElementSibling.querySelector('.category-name').innerHTML == 'Science') {
            progress.innerHTML = `Progress: ${parseInt(scienceQuestionsIndex) + 1|| 1}/${scienceQuestions.length}`
        } else if (progress.previousElementSibling.querySelector('.category-name').innerHTML == 'Religion') {
            progress.innerHTML = `Progress: ${parseInt(religionQuestionsIndex) + 1|| 1}/${religionQuestions.length}`
        } else if (progress.previousElementSibling.querySelector('.category-name').innerHTML == 'Games') {
            progress.innerHTML = `Progress: ${parseInt(gamesQuestionsIndex) + 1|| 1}/${gamesQuestions.length}`
        } else if (progress.previousElementSibling.querySelector('.category-name').innerHTML == 'Sports') {
            progress.innerHTML = `Progress: ${parseInt(sportQuestionsIndex) + 1|| 1}/${sportsQuestions.length}`
        }
    })
}












