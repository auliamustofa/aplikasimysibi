
function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}
var stringIMG;

letter_image_array = [
    'a.png','b.PNG','c.png','d.png','e.png','f.png','g.png','h.png','i.png','j.png',
    'k.png','l.PNG','m.png','n.png','o.png','p.png','q.png','r.png','s.png','t.png',
    'u.png','v.png','w.png','x.png','y.png','z.png'
];

word_image_array = [
    "anak.png","anjing.png","apa.png","ayah.png","bagus.png","bau.png",
    "biru.png","cacing.png","hai.png","halo.png","ibu.png","istri.png",
    "kamu.png","makan.png","mengapa.png","mereka.png","minum.png","nenek.png",
    "oranye.png","paman.png","pesawat.png","putih.png","saya.png","siapa.png","suami.png","ular.png",
]

    var timer = document.getElementById("timer");
    var timeLeft = document.getElementById("timeLeft");
    var timesUp = document.getElementById("timesUp");
    var btnMyo = document.getElementById("recorder");
    var btnLeap = document.getElementById("recorderLeap");
    var nextQ = document.getElementById("next");
    var nextWord = document.getElementById("nextWord");
    var soalQ = document.getElementById("soal");
    var check = document.getElementById("check");
    nextWord.hidden =true;
    nextQ.hidden = true;
    btnMyo.hidden = true;
    btnLeap.hidden = true;
    check.hidden = true;
    var startDiv = document.getElementById("start");
    var startQuizBtn = document.getElementById("start-quiz-button");
    var startWordQuizBtn = document.getElementById("start-kata-quiz-button");
    var summary = document.getElementById("summary");
    var submitInitialBtn = document.getElementById("submitInitialBtn");
    var initialInput = document.getElementById("initialInput");
    
    var highScoreSection = document.getElementById("highScoreSection");
    var finalScore = document.getElementById("finalScore");

    var goBackBtn = document.getElementById("goBackBtn");
    var clearHighScoreBtn = document.getElementById("clearHighScoreBtn"); 
    var viewHighScore = document.getElementById("viewHighScore");
    var listOfHighScores = document.getElementById("listOfHighScores");
    var correctAns = 0;
    var questionNum = 0;
    var scoreResult;
    var questionIndex = 0;
    var questions = 26;
    var totalTime = 61;
    //var totalTime = 5
    function newQuiz() {
        questionIndex = 0;
        totalTime = 60;
        timeLeft.textContent = totalTime;
        initialInput.textContent = "";

        startDiv.style.display = "none";
        //questionDiv.style.display = "block";
        timer.style.display = "block";
        timesUp.style.display = "none";
        nextQ.hidden = true;
        nextWord.hidden =true;
        btnMyo.hidden = false;
        btnLeap.hidden = false;
        check.hidden = false;
        var startTimer = setInterval(function() {
            totalTime--;
            timeLeft.textContent = totalTime;
            //checkAnswer();
            if(totalTime <= 0) {
                clearInterval(startTimer);
                if (questionIndex < questions - 1) {
                    gameOver();
                }
            }
        },1000);

        showQuiz();
        
    };

    function newWordQuiz() {
        questionIndex = 0;
        totalTime = 10;
        timeLeft.textContent = totalTime;
        initialInput.textContent = "";

        startDiv.style.display = "none";
        //questionDiv.style.display = "block";
        timer.style.display = "block";
        timesUp.style.display = "none";
        nextQ.hidden = true;
        nextWord.hidden =false;
        btnMyo.hidden = false;
        btnLeap.hidden = true;

        var startTimer = setInterval(function() {
            totalTime--;
            timeLeft.textContent = totalTime;
            if(totalTime <= 0) {
                clearInterval(startTimer);
                if (questionIndex < questions - 1) {
                    gameOver();
                }
            }
        },1000);

        get_random_image_word();
        
    };

    function showQuiz() {
        get_random_image();
        
    }

    function get_random_image(){
        random_index = Math.floor(Math.random() * letter_image_array.length);
        selected_image = letter_image_array[random_index];
        console.log(selected_image);
        document.getElementById('soal').src = './img/soal/'+selected_image+'';
        stringIMG = selected_image.substring(0,1);
        console.log(stringIMG);
    }

    function get_random_image_word(){
        random_index = Math.floor(Math.random() * word_image_array.length);
        selected_image = word_image_array[random_index];
        //console.log(selected_image);
        document.getElementById('soal').src = './img/soal/'+selected_image+'';
        stringIMG = selected_image.substring(0,selected_image.length -4);
        //console.log(stringIMG);
    }

    function checkAnswer() {

        console.log("hasil");
        
        console.log("strOutput ",strOutput);
        //stringIMG.toUpperCase();
        console.log("strimg ",stringIMG);
        if (strOutput.toLocaleLowerCase() === stringIMG.toLocaleLowerCase()) {
            // correct answer, add 1 score to final score
            correctAns++;
            console.log("nilai ",correctAns);
            //answerCheck.innerHTML = "Correct!";
        } else {
            // wrong answer, deduct 10 second from timer
            totalTime -= 1;
            timeLeft.textContent = totalTime;
            //answerCheck.innerHTML = "Wrong!";
        }

        questionIndex++;
        //repeat with the rest of questions 
        if (questionIndex < questions) {
            get_random_image();
        } else {
            // if no more question, run game over function
            gameOver();
        }
    }

    function checkAnswerWord() {

        console.log("hasil");
        
        console.log(strOutput);
        //stringIMG.toUpperCase();
        console.log(stringIMG);
        if (strOutput.toLocaleLowerCase() === stringIMG.toLocaleLowerCase()) {
            // correct answer, add 1 score to final score
            correctAns++;
            console.log("nilai ",correctAns);
            //answerCheck.innerHTML = "Correct!";
        } else {
            // wrong answer, deduct 10 second from timer
            totalTime -= 1;
            timeLeft.textContent = totalTime;
            //answerCheck.innerHTML = "Wrong!";
        }

        questionIndex++;
        //repeat with the rest of questions 
        if (questionIndex < questions) {
            get_random_image_word();
        } else {
            // if no more question, run game over function
            gameOver();
        }
    }
        function gameOver() {
            summary.style.display = "block";
            //questionDiv.style.display = "none";
            startDiv.style.display = "none";
            timer.style.display = "none";
            timesUp.style.display = "block";
            soalQ.hidden = true;
            nextQ.hidden = true;
            nextWord.hidden = true;
            btnMyo.hidden = true;
            btnLeap.hidden = true;
            check.hidden = true;
            // show final score
            finalScore.textContent = correctAns*10;
            alertTU();
            
        }

        function alertTU(){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Times UP!'
              })

        }
        function storeHighScores(event) {
            event.preventDefault();

            // stop function is initial is blank
            if (initialInput.value === "") {
                alert("Please enter your initials!");
                return;
            } 

            startDiv.style.display = "none";
            timer.style.display = "none";
            timesUp.style.display = "none";
            summary.style.display = "none";
            highScoreSection.style.display = "block";   
            soalQ.hidden = true;
            nextQ.hidden = true;
            nextWord.hidden =true;
            btnMyo.hidden = true;
            btnLeap.hidden = true;
            check.hidden = true;
            // store scores into local storage
            var savedHighScores = localStorage.getItem("high scores");
            var scoresArray;
            var thatdate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
            //convertTZ(thatdate, "Asia/Jakarta");
            //console.log(thatdate);

            if (savedHighScores === null) {
                scoresArray = [];
                //date = [];
            } else {
                scoresArray = JSON.parse(savedHighScores)
            }

            var userScore = {
                initials: initialInput.value,
                score: finalScore.textContent,
                date: thatdate
            };

            console.log(userScore);
            scoresArray.push(userScore);

            // stringify array in order to store in local
            var scoresArrayString = JSON.stringify(scoresArray);
            window.localStorage.setItem("high scores", scoresArrayString);
            
            // show current highscores
            showHighScores();
        }

        // function to show high scores
        var i = 0;
        function showHighScores() {

            startDiv.style.display = "none";
            timer.style.display = "none";
            //questionDiv.style.display = "none";
            timesUp.style.display = "none";
            summary.style.display = "none";
            highScoreSection.style.display = "block";
            soalQ.hidden = true;
            nextQ.hidden = true;
            nextWord.hidden = true;
            btnMyo.hidden = true;
            btnLeap.hidden = true;
            check.hidden = true;
            var savedHighScores = localStorage.getItem("high scores");

            // check if there is any in local storage
            if (savedHighScores === null) {
                return;
            }
            console.log(savedHighScores);

            var storedHighScores = JSON.parse(savedHighScores);

            for (; i < storedHighScores.length; i++) {
                var eachNewHighScore = document.createElement("p");
                eachNewHighScore.innerHTML = storedHighScores[i].initials + ": " + storedHighScores[i].score+ " time: " + storedHighScores[i].date;
                listOfHighScores.appendChild(eachNewHighScore);
            }
        }

        /**
         * ADD EVENT LISTENERS
         */
        //  document.getElementById("recorderLeap").onclick = event => {
        //     this.checkAnswer(event);
        //   }

        startQuizBtn.addEventListener("click", newQuiz);
        startWordQuizBtn.addEventListener("click", newWordQuiz);
        //nextQ.addEventListener("mouseover", checkAnswer);
        submitInitialBtn.addEventListener("click", function(event){ 
            storeHighScores(event);
        });

        viewHighScore.addEventListener("click", function(event) { 
            showHighScores(event);
        });

        goBackBtn.addEventListener("click", function() {
            startDiv.style.display = "block";
            highScoreSection.style.display = "none";
        });

        clearHighScoreBtn.addEventListener("click", function(){
            window.localStorage.removeItem("high scores");
            listOfHighScores.innerHTML = "High Scores Cleared!";
            listOfHighScores.setAttribute("style", "font-family: 'Archivo', sans-serif; font-style: italic;")
        });