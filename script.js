
const themeImg = document.querySelectorAll('.theme');
let current = document.documentElement.getAttribute('data-theme');
document.getElementById('switch').addEventListener('click', () =>{
    current = current === "dark" ? "light" : "dark";
    console.log(current);
    document.documentElement.setAttribute('data-theme', current);
    themeImg.forEach(img =>{img.classList.toggle('hidden')});
})

let quizzes = [];
fetch('./data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();

    })
    .then(data => {
        quizzes = data.quizzes;
        console.log("JSON Data:", data);
    })
    .catch(error => {
        console.error("Error reading JSON:", error);
    });




    const card = document.querySelectorAll('.card');
    const subject = document.querySelectorAll('.sunject');
    const header = document.querySelector('.header__right');
    const color = ["orange", "green", "blue", "purple"];
    const questionNo = document.getElementById('question -no');
    const progresBar = document.querySelector('.bar__fill');
    const question = document.getElementById('question');
    const optionsAnswers = document.querySelectorAll('.options');
    const optionsButton = document.querySelectorAll('.card__btn--answer');
    const submitAnswer = document.getElementById('submit');
    const error = document.querySelector('.error');
    const correctImg = document.querySelectorAll('.correct');
    const incorrectImg = document.querySelectorAll('.incorrect');
    const showResult = document.getElementById('result');
    const subjectScore = document.getElementById('subject-score');
    const playAgainBtn = document.getElementById('play-again');

    let answerIndex = null;
    let questionIndex = 0;
    let subjectIndex = 0;
    let selectedAnswer = null;
    let rightAnswers = 0;
    let isAnswerSubmited = false;

    function updateProgressBar(){
        questionNo.innerHTML = questionIndex + 1;
        progresBar.style.width = questionIndex * 10 + "%";
    };
    function updateQuestion(subjectIndex,questionIndex){
        
        question.innerText = quizzes[subjectIndex].questions[questionIndex].question;
            optionsAnswers.forEach((option,optionIndex) => {
                option.innerText = quizzes[subjectIndex].questions[questionIndex].options[optionIndex];
            });
    };

    function selectYourAnswer(btn,index){
        /*select the answer, if you select a new answer the button selected befor will deselect */
        error.classList.add('hidden');
        if (selectedAnswer === null) {
            btn.classList.add('selected');
        }else if (selectedAnswer !== btn ) {
            selectedAnswer.classList.remove('selected');
            btn.classList.add('selected');
        }
        answerIndex = index;
        selectedAnswer = btn;
    }
    function selectSubject(){
        card[0].classList.add('hidden');
            card[1].classList.remove('hidden');
            header.innerHTML = `
            <img 
                class="card__btn-index card__btn-index--${color[subjectIndex]}" 
                src="${quizzes[subjectIndex].icon}" 
                alt=""
            > ${quizzes[subjectIndex].title}
            `;
            updateProgressBar();
            updateQuestion(subjectIndex,questionIndex);
            
            optionsButton.forEach((btn,index) => {
                btn.addEventListener('click', () => {
                     selectYourAnswer(btn,index)
                })
            })
    }
    function handleSubmit(){
        /*submit answer button will change in to next question btn
                first we check if the answer has been submited - meaning we have submit answer button*/
                if (!isAnswerSubmited){
                    /*check if any option had been selected*/
                    if (selectedAnswer === null) {
                        /*show error message*/
                        error.classList.remove('hidden');
                    } else {
                        /*if we had selected an answer and press submit, all the option button wil be disabled*/
                        optionsButton.forEach(btn => {btn.disabled = true});
                        /*at the last question the button will change to show result*/
                        if (questionIndex < 9) {
                            submitAnswer.innerText = "Next Question";
                        
                        }else {
                            submitAnswer.innerText = "Show Rezult";
                        };         
                        /*check if we had selected a correct answer and style it acordingly */
                        checkAnswer();
                    }
                    /*the answer has been submited*/
                    isAnswerSubmited = true;
                } else {
                    /*after we sebmit the answer we move to the next question*/
                    /* if the qusetion index is smaler than 9 (we have 10 questins) we increse the index
                        if it is 9 mean we are athe the last question -Quizz completed*/
                    if (questionIndex < 9) {
                        questionIndex ++;
                    } else {
                        isQuizzCompleted();
                    }
                    /*load the next question and reset the style */
                    
                    loadNextQuestion();
                    
                    answerIndex = null;
                    selectedAnswer = null;
                    optionsButton.forEach(btn => {btn.disabled = false});
                    isAnswerSubmited = false;
                } 
    }
    function checkAnswer(){
        if (optionsAnswers[answerIndex].innerText ===  quizzes[subjectIndex].questions[questionIndex].answer){
                            selectedAnswer.classList.add('correct-btn');
                            selectedAnswer.classList.remove('selected');
                            correctImg[answerIndex].classList.remove('hidden');
                            rightAnswers ++;
                        } else {
                            selectedAnswer.classList.add('incorrect-btn');
                            selectedAnswer.classList.remove('selected');
                            incorrectImg[answerIndex].classList.remove('hidden');
                            optionsAnswers.forEach((option, index) => {
                                /*if the answer selected is incorect we search for the right answer*/
                                 if (option.innerText ===  quizzes[subjectIndex].questions[questionIndex].answer){
                                    optionsButton[index].classList.add('correct-btn');
                                    correctImg[index].classList.remove('hidden');
                                }
                            })
                        }
    }
    function isQuizzCompleted(){
        card[1].classList.add('hidden');
                        card[2].classList.remove('hidden');
                        showResult.innerText = rightAnswers;
                        subjectScore.innerHTML = `
                        <img 
                            class="card__btn-index card__btn-index--${color[subjectIndex]}" 
                            src="${quizzes[subjectIndex].icon}" 
                            alt=""
                        > ${quizzes[subjectIndex].title}`;
    }
    function loadNextQuestion(){
        updateProgressBar();
                    updateQuestion(subjectIndex,questionIndex);           
                    submitAnswer.innerText = "Submit Answer";
                    optionsAnswers.forEach((option, index) => {
                        optionsButton[index].classList.remove('selected');
                        optionsButton[index].classList.remove('correct-btn');
                        optionsButton[index].classList.remove('incorrect-btn');
                        correctImg[index].classList.add('hidden');
                        incorrectImg[index].classList.add('hidden');
                    });
    }
    function resetQuizz(){
        card[2].classList.add('hidden');
        card[0].classList.remove('hidden');
        questionIndex = 0;
        rightAnswers = 0;
        header.innerHTML = "";
    }
    subject.forEach((btn, si) => {
        
        /* when a button is clicket we select a subject, 
        ubdate it in header and load the first question */
        btn.addEventListener('click', () => {
            subjectIndex = si;
            selectSubject(btn);

           
        })
    })
     submitAnswer.addEventListener('click', () => {
                handleSubmit();
            })   
    
    playAgainBtn.addEventListener('click', () =>{
        resetQuizz();
    })
