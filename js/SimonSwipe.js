document.getElementById("submit").addEventListener("click", startGame);
let sequence = [];
let roundNr;
let actualRound;
let chrono;
let second = 0;
function startGame() {
    disable();
    document.getElementById("message").innerHTML = "PLAYING...";
    document.getElementById("score").innerHTML = "Score: 0";
    document.getElementById("chrono").innerHTML = "Seconds: 0";
    drawField(document.getElementById("rows").value, document.getElementById("columns").value);
    sequence = generateSequence(document.getElementById("columns").value, document.getElementById("rows").value, document.getElementById("level").value);
    roundNr = 1;
    playSequence(roundNr);

}
function seconds() {
    second++;
    document.getElementById("chrono").innerHTML = "Seconds: " + second;
}
function disable() {
    let rows = document.getElementById("rows");
    rows.setAttribute('disabled', true);
    let columns = document.getElementById("columns");
    columns.setAttribute('disabled', true);
    let level = document.getElementById('level');
    level.disabled = true;
    let submit = document.getElementById('submit');
    submit.disabled = true;
}

function drawField(height, width) {
    let colors = [
        "#FFC0CB", "#00FF00", "#0000FF", "#00CED1", "#00FFFF", "#008000",
        "#000080", "#808000", "#800080", "#008080", "#FFA500", "#00FF7F",
        "#DA70D6", "#ADFF2F", "#7FFFD4", "#FFE4C4", "#40E0D0", "#00BFFF",
        "#7B68EE", "#EE82EE", "#BC8F8F", "#C0C0C0", "#90EE90", "#8A2BE2",
        "#1E90FF"
    ];
    for (let i = colors.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    let vgrid = document.getElementById("field");
    vgrid.innerHTML = "";
    vgrid.style.width = (width * 50 + 5) + "px";
    let counter = 0;
    for (let i = 0; i < height; i++) {
        let rowDiv = document.createElement("div");
        for (let j = 0; j < width; j++) {
            let newButton = document.createElement("button");
            newButton.id = i + "_" + j;
            newButton.setAttribute('aria-label', `Button ${i}, ${j}`);
            newButton.style.height = "50px";
            newButton.style.width = "50px";
            newButton.className = "buttonGrid";
            newButton.style.backgroundColor = colors[counter];
            newButton.style.marginRight = "1px";
            rowDiv.appendChild(newButton);
            counter++;
        }
        vgrid.appendChild(rowDiv);
    }
}
function generateSequence(width, height, level) {
    let nElements = 5 * level;
    let sequence = [];
    for (let i = 0; i < nElements; i++) {
        let x = Math.floor(Math.random() * height);
        let y = Math.floor(Math.random() * width);
        sequence.push([x, y]);
    }
    return sequence;
}

function playSequence(roundNr) {
    let col = parseInt(document.getElementById("columns").value);
    let rows = parseInt(document.getElementById("rows").value);
    document.getElementById("overlay").style.display = "block"; 
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < col; j++) {
            let btn = document.getElementById(i + "_" + j);
            let newBtn = btn.cloneNode(true);
            newBtn.disabled = true;
            btn.parentNode.replaceChild(newBtn, btn);
        }
    }

    if (roundNr === 1) {
        chrono = setInterval(seconds, 1000);
    }

    let speed;
    switch (document.getElementById("level").value) {
        case "1": speed = 1000; break;
        case "2": speed = 800; break;
        case "3": speed = 500; break;
    }

    let counter = 0;

    function showNext() {
        if (counter < roundNr) {
            let [x, y] = sequence[counter];
            let button = document.getElementById(x + "_" + y);
            let originalColor = button.dataset.originalColor || button.style.backgroundColor;
            if (!button.dataset.originalColor) {
                button.dataset.originalColor = originalColor;
            }

            button.style.backgroundColor = "red";
            setTimeout(() => {
                button.style.backgroundColor = originalColor;
                setTimeout(() => {
                    counter++;
                    showNext();
                }, 200);
            }, speed);
        } else {
            document.getElementById("overlay").style.display = "none";
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < col; j++) {
                    let btn = document.getElementById(i + "_" + j);
                    btn.disabled = false;
                    btn.addEventListener("click", check);
                }
            }
            actualRound = 1;
        }
    }

    showNext();
}

function check(e) {
    let button = e.target;
    let id = sequence[actualRound - 1][0] + "_" + sequence[actualRound - 1][1];

    if (button.id == id) {
        if (actualRound == document.getElementById("level").value * 5) {
            document.getElementById("score").innerHTML = "Score: " + roundNr;
            document.getElementById("message").innerHTML = "Congratulations, you won!!!";
            for (let i = 0; i < document.getElementById("rows").value; i++) {
                for (let j = 0; j < document.getElementById("columns").value; j++) {
                    document.getElementById(i + "_" + j).disabled = true;
                }
            }
            clearInterval(chrono);
        } else if (actualRound == roundNr) {
            document.getElementById("score").innerHTML = "Score: " + roundNr;
            roundNr++;
            playSequence(roundNr);
        } else {
            actualRound++;
        }
    } else {
        document.getElementById("submit").disabled = false;
        document.getElementById("message").innerHTML = "Wrong button, you lost. GAME OVER";
        for (let i = 0; i < document.getElementById("rows").value; i++) {
            for (let j = 0; j < document.getElementById("columns").value; j++) {
                document.getElementById(i + "_" + j).disabled = true;
            }
        }
        document.getElementById("field").innerHTML = "";
        clearInterval(chrono);
    }
}



