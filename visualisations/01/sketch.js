let buttons = document.querySelectorAll('button');
for (let i=0; i<buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
        console.log(e);
    });
}

let data = [];
let students = [
    {
        name: 'Arthur',
        color: '#00f'
    },
    {
        name: 'Georges',
        color: '#f0f'
    },
    {
        name: 'Francois',
        color: '#0ff'
    }

];

/*****
 *
 *  Pour cette visualisation, la forme du fichier json est de ce type :
 *  - un identifiant unique par "phrase"
 *  - on n'a pas la sentence complète quand on a le score / vote / mots négatifs-positifs
 *
 *  Exemple :
 *  
 -------

 {
   "-L6MBfvODUfd0dfdfnosS" : {
      "score" : 0,
      "vote" : "neutral"
    },
 "-L6MBiVLdfOoDkl39At" : {
      "sentence" : "ah ça continue de sonner longtemps  Ouais ouais  c'est un problème "
    },
 "-L6MBiVsdfF4yBt2w7ph_" : {
      "negativeWords" : [ "problème" ],
      "positiveWords" : [ "ouais", "ouais" ],
      "score" : 0,
      "vote" : "neutral"
    }
   }

 --------
 *
 *
 *
 *****/


function preload() {

    for (let i=0; i<3; i++) {
        data[i] = loadJSON('../../data/' + students[i].name + '-27.02.json');
    }
    console.log(data);
}


function showStudent(studentIndex) {

    let scores = [];

    let currentData = data[studentIndex];

    console.log(currentData);

    let keys = Object.keys(currentData);

    for (let i=0; i<keys.length; i++) {
        if (Object.keys(currentData[keys[i]]).includes('score')) { // on regarde si l'entrée contient un score (elle contient soit une sentence soit un score)
            scores.push({score:currentData[keys[i]].score, negativeWords: currentData[keys[i]].negativeWords, positiveWords: currentData[keys[i]].positiveWords})
            // console.log(data[keys[i]].score);
        }
    }
    console.log("scores");
    console.log(scores);

    drawData(studentIndex, scores);
}



function setup() {
    createCanvas(5000, windowHeight);
    // fill(0,0,255);
}

function getData() {

}

function drawData(student, scores) {

    let coefX = 8;
    let coefY = 20; // les valeurs de y vont de -5 à 5 environ, on ne les verrait pas trop sinon
    coefY = -coefY; // on inverse la valeur du coef pour avoir les valeurs négatives en bas et les valeurs positives en haut
    let offsetY = 300; // s'il n'y a pas de décalage on loupe toutes les valeurs négatives

    for (let i=0; i<scores.length; i++) { // on parcoure la liste des scores
        let x=i*coefX; //
        let y= scores[i].score*coefY + offsetY;
        // y = -y;
        noStroke();
        ellipse(x, y, 3,3);


        // s'il y en a, on affiche les mots responsables de ce score
        if (scores[i].positiveWords && scores[i].positiveWords !== scores[i-1].positiveWords) {
            for (let j=0; j<scores[i].positiveWords.length; j++) {
                let yText = offsetY + coefY*5 + int(random(-100, 0));
                strokeWeight(0.2);
                stroke(0);
                line(x, y, x, yText);
                noStroke();
                text(scores[i].positiveWords[j], x, yText);
            }
        }

        if (scores[i].negativeWords && scores[i].negativeWords !== scores[i-1].negativeWords) {
            for (let j=0; j<scores[i].negativeWords.length; j++) {
                let yText = offsetY - coefY*5 + int(random(0, 100));
                strokeWeight(0.2);
                stroke(0);
                line(x, y, x, yText);
                noStroke();
                text(scores[i].negativeWords[j], x, yText);
            }
        }

        // on trace des lignes pour relier les points
        if (i > 0) { // on le fait si i > 0 car il n'existe pas de i = -1
            let previousX = (i-1)*coefX;
            let previouxY = scores[i-1].score*coefY+offsetY;
            strokeWeight(1);
            stroke(students[student].color);
            line(previousX, previouxY, x, y);
        }
    }

}