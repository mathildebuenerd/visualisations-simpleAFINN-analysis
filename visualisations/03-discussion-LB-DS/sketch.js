let buttons = document.querySelectorAll('button');
for (let i=0; i<buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
        console.log(e);
    });
}

let data = [];


/*****
 *
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

    data = loadJSON('../../data/rendez-vous-gordan.json');
    console.log(data);
}




function setup() {
    createCanvas(5000, windowHeight);
    // fill(0,0,255);
    let scores = [];

    let currentData = data;

    console.log(currentData);

    let keys = Object.keys(data);
    console.log('keys');
    console.log(keys);

    for (let i=0; i<keys.length; i++) {
        if (Object.keys(currentData[keys[i]]).includes('score')) { // on regarde si l'entrée contient un score (elle contient soit une sentence soit un score)
            scores.push({score:currentData[keys[i]].score, negativeWords: currentData[keys[i]].negativeWords, positiveWords: currentData[keys[i]].positiveWords, tokens:currentData[keys[i]].tokens});
            // console.log(data[keys[i]].score);
        }
    }
    console.log("scores");
    console.log(scores);

    drawData(scores);
}

function getData() {

}

function drawData(scores) {

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

        // ------------------------------------------------------------
        //   s'il y en a, on affiche les mots responsables de ce score (positiveWords ou negativeWords)
        // ------------------------------------------------------------
        // On vérifie d'abord que ces mots ne sont pas undefined
        // Puis si le score d'avant contenait des mots
        // Puis si ces mots sont identiques
        // comme on ne peut pas directement checker l'égalité entre deux arrays en javascript
        // on teste uniquement le premier mot


        // Affichage des mots positifs
        if (scores[i].positiveWords && scores[i-1]) {
            if (scores[i-1].positiveWords) {
                if (scores[i].positiveWords[0] !== scores[i-1].positiveWords[0]) {
                    addWord('positive');
                }
            } else {
                addWord('positive');
            }
        }

        // Affichage des mots négatifs
        if (scores[i].negativeWords) {
            if (scores[i-1].negativeWords) {
                if (scores[i].negativeWords[0] !== scores[i-1].negativeWords[0]) {
                    addWord('negative');
                }
            } else {
                addWord('negative');
            }
        }

        function addWord(valence) {
            if (valence === 'positive') {
                for (let j=0; j<scores[i].positiveWords.length; j++) { // 'positiveWords' est un tableau avec potentiellement plusieurs mots donc il faut le parcourir
                    let yText = offsetY + coefY*5 + int(random(-100, 0)); // la position y du texte est random pour éviter les superpositions de mots
                    strokeWeight(0.2);
                    stroke('#00f');
                    line(x, y, x, yText);
                    noStroke();
                    fill('#00f');
                    text(scores[i].positiveWords[j], x, yText);
                }
            }

            if (valence === 'negative') {
                for (let j=0; j<scores[i].negativeWords.length; j++) {
                    let yText = offsetY - coefY*5 + int(random(0, 100));
                    strokeWeight(0.2);
                    stroke('#00f');
                    line(x, y, x, yText);
                    noStroke();
                    fill('#00f');
                    text(scores[i].negativeWords[j], x, yText);
                }
            }
        }

        // on trace des lignes pour relier les points
        if (i > 0) { // on le fait si i > 0 car il n'existe pas de i = -1
            let previousX = (i-1)*coefX;
            let previouxY = scores[i-1].score*coefY+offsetY;
            strokeWeight(1);
            stroke('#00f');
            line(previousX, previouxY, x, y);
        }
    }

}