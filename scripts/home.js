// 変数定義
let question_number = 0;
let client = true;
let mode = "easy";
let modeName = { "easy": "イージー", "normal": "ノーマル", "hard": "ハード" };
let selected_questions;
let timer = { state: false, time: 21 };
let wrong_answer_count = 0;
let answer;
let correct_audio = document.getElementById("correct_audio");
let wrong_audio = document.getElementById("wrong_audio");
let new_question_audio = document.getElementById("new_question_audio");
// 関数定義
const wait = function (seconds) {
    return new Promise(function (resolve) {
        setTimeout(resolve, seconds);
    });
};

function unique_random(min, max, number) {
    let result = [];

    while (result.length < number) {
        let random_number = Math.floor(Math.random() * (max - min) + min);
        if (result.includes(random_number) === false) {
            result.push(random_number);
        }
    }
    return result;
}

function generateProgressBar(current_question) {
    let progressBar = document.getElementById("progress_bar");
    progressBar.innerHTML = ""
    for (let i = 0; i < 10; i++) {
        let countDiv = document.createElement("div");
        countDiv.textContent = String(i + 1);
        countDiv.setAttribute("class", "progress_count")
        if (current_question >= i + 1) {
            countDiv.setAttribute("isColorful", i + 1)
        };
        progressBar.appendChild(countDiv);

    };
}

function selectQuestions(mode) {
    let selected_questions = [
        { level: "", question_ids: [] },
        { level: "", question_ids: [] },
        { level: "", question_ids: [] }
    ];
    if (mode === "easy") {
        selected_questions[0].level = "level1";
        selected_questions[0].question_ids = unique_random(0, questions.level1.length, 5);
        selected_questions[1].level = "level2";
        selected_questions[1].question_ids = unique_random(0, questions.level2.length, 5);
        selected_questions[2].level = "level3";
        selected_questions[2].question_ids = unique_random(0, questions.level3.length, 5);
    } else if (mode === "normal") {
        selected_questions[0].level = "level2";
        selected_questions[0].question_ids = unique_random(0, questions.level2.length, 5);
        selected_questions[1].level = "level3";
        selected_questions[1].question_ids = unique_random(0, questions.level3.length, 5);
        selected_questions[2].level = "level4";
        selected_questions[2].question_ids = unique_random(0, questions.level4.length, 5);
    } else if (mode === "hard") {
        selected_questions[0].level = "level3";
        selected_questions[0].question_ids = unique_random(0, questions.level2.length, 5);
        selected_questions[1].level = "level4";
        selected_questions[1].question_ids = unique_random(0, questions.level4.length, 5);
        selected_questions[2].level = "level5";
        selected_questions[2].question_ids = unique_random(0, questions.level5.length, 5);
    }
    return selected_questions
}


// function generateQuestion(number, quiz_array) {
//     document.getElementById("answer").removeAttribute("disabled")
//     if (number < 10) {
//         let k, l;
//         if (number <= 3) {
//             k = 0;
//             l = 0;
//         } else if (number <= 7) {
//             k = 1;
//             l = 4;
//         } else if (number <= 10) {
//             k = 2;
//             l = 8;
//         }
//         document.getElementById("question_number").textContent = `第${number + 1}問`;
//         document.getElementById("answer_field").value = "";
//         let buttons = document.querySelectorAll(".selects button");
//         for (let i = 0; i < buttons.length; i++) {
//             const button = buttons[i];
//             button.setAttribute("class", "");
//             button.textContent = quiz_array[selected_questions[k].level][selected_questions[k].question_ids[number - l]].selects[i]
//         };
//         answer = quiz_array[selected_questions[k].level][selected_questions[k].question_ids[number - l]].answer
//     } else {
//         document.querySelector(".playground").style.display = "none";
//         document.getElementById("finished").style.display = "flex";
//     }
// };

function selectMode(modeValue) {
    mode = modeValue;
    // ボタンのdisabledを変更
    let elements = document.querySelectorAll(".decide_mode");
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.getAttribute("value") === modeValue) {
            element.setAttribute("disabled", true);
        } else {
            element.removeAttribute("disabled");
        }
    }
    mode = modeValue
    // ボタンのテキストを変更
    document.querySelector(".select_mode_button").textContent = modeName[modeValue]
}

function modeSelectionModal(flag) {
    const modal = document.getElementById("select_mode_modal");
    if (flag) {
        modal.style.display = "block";
    } else {
        modal.style.display = "none";
    }
}


function answerBtn(element) {
    document.getElementById("answer_field").value = element.textContent;
    let buttons = document.querySelectorAll(".selects button");
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        button.setAttribute("class", "");
    };
    element.setAttribute("class", "selected")
    document.getElementById("answer").removeAttribute("disabled")
}

function generateQuestionConsole(number, quiz_array) {
    timer = { state: true, time: 21 };
    generateProgressBar(number);
    new_question_audio.play();
    if (number < 10) {
        let k, l;
        if (number <= 3) {
            k = 0;
            l = 0;
        } else if (number <= 7) {
            k = 1;
            l = 4;
        } else if (number <= 10) {
            k = 2;
            l = 8;
        }
        document.getElementById("question_number").textContent = `第${number + 1}問`;
        let selects = document.querySelectorAll(".selects .select");
        for (let i = 0; i < selects.length; i++) {
            const select = selects[i];
            const label = quiz_array[selected_questions[k].level][selected_questions[k].question_ids[number - l]].selects[i];
            select.textContent = label;
        };
        document.getElementById("question").textContent = quiz_array[selected_questions[k].level][selected_questions[k].question_ids[number - l]].question;
        answer = quiz_array[selected_questions[k].level][selected_questions[k].question_ids[number - l]].answer;
        document.getElementById("correct_answer").textContent = answer;
        document.getElementById("result_area").style.display = "none";
    } else {
        document.querySelector(".playground").style.display = "none";
        document.getElementById("finished").style.display = "flex";
        tenth_correct = true
    }
};

function answer_response(element) {
    let user_answer = element.textContent;
    document.getElementById("timer").style.display = "none";
    timer.state = false;
    if (user_answer === answer) {
        answer_show(true);
    } else {
        answer_show(false);
        wrong_answer_count += 1;
    };
}

function answer_show(result) {
    if (result) {
        document.getElementById("answer_view_icon").textContent = "⭕";
        document.getElementById("answer_view_text").textContent = "正解";
        document.getElementById("answer_view").style.display = "flex";
        correct_audio.play();
    } else {
        document.getElementById("answer_view_icon").textContent = "❌";
        document.getElementById("answer_view_text").textContent = "不正解";
        document.getElementById("answer_view").style.display = "flex";
        wrong_audio.play()
    }

    wait(500)
        .then(() => {
            document.getElementById("answer_view").style.display = "none";
            document.getElementById("result_area").style.display = "flex";
            return wait(2000);
        })
        .then(() => {
            if (wrong_answer_count > 1 | question_number === 9) {
                document.getElementById("finished").style.display = "flex";
                document.getElementById("playground").style.display = "none";
                if (question_number === 9) {
                    document.getElementById("last-message").textContent = "ゲームクリア！";
                    particlesJS("particles-js",{
                        "particles":{
                            "number":{
                                "value":125,//この数値を変更すると紙吹雪の数が増減できる
                                "density":{
                                    "enable":false,
                                    "value_area":400
                                }
                            },
                            "color": {
                            "value": ["#EA5532", "#F6AD3C", "#FFF33F", "#00A95F", "#00ADA9", "#00AFEC","#4D4398", "#E85298"]//紙吹雪の色の数を増やすことが出来る
                            },
                            "shape":{
                                "type":"polygon",//形状はpolygonを指定
                                "stroke":{
                                    "width":0,
                                },
                                "polygon":{
                                    "nb_sides":5//多角形の角の数
                                }
                                },
                                "opacity":{
                                    "value":1,
                                    "random":false,
                                    "anim":{
                                        "enable":true,
                                        "speed":100000,
                                        "opacity_min":0,
                                        "sync":false
                                    }
                                },
                                "size":{
                                    "value":5.305992965476349,
                                    "random":true,//サイズをランダムに
                                    "anim":{
                                        "enable":true,
                                        "speed":1.345709068776642,
                                        "size_min": 10,
                                        "sync":false
                                    }
                                },
                                "line_linked":{
                                    "enable":false,
                                },
                                "move":{
                                    "enable":true,
                                "speed":10,//この数値を小さくするとゆっくりな動きになる
                                "direction":"bottom",//下に向かって落ちる
                                "random":false,//動きはランダムにならないように
                                "straight":false,//動きをとどめない
                                "out_mode":"out",//画面の外に出るように描写
                                "bounce":false,//跳ね返りなし
                                    "attract":{
                                        "enable":false,
                                        "rotateX":600,
                                        "rotateY":1200
                                    }
                                }
                            },
                            "interactivity":{
                                "detect_on":"canvas",
                                "events":{
                                    "onhover":{
                                        "enable":false,
                                    },
                                    "onclick":{
                                        "enable":false,
                                    },
                                    "resize":true
                                },
                            },
                            "retina_detect":true
                        });
                }
            } else {
                question_number += 1;
                generateQuestionConsole(question_number, questions)
            }
        })

};

//ここから各種イベント類
document.getElementById("start_game").addEventListener("click", () => {
    document.getElementById("start_game_area").style.display = "none";
    document.getElementById("playground").style.display = "flex";
    selected_questions = selectQuestions(mode);
    generateQuestionConsole(question_number, questions);
    generateProgressBar(question_number);
});

setInterval(() => {
    let timerElement = document.getElementById("timer");
    if (timer.state) {
        timer.time -= 1;
        if (timer.time < 0) {
            timerElement.style.display = "none";
            timer.state = false;
            answer_response("");
        } else {
            timerElement.textContent = timer.time
            timerElement.style.display = "block";
        }

    } else {
        timerElement.style.display = "none"
    }
}, 1000);
