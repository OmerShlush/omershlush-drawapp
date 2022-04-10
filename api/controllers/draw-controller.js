const randomWords = require('random-words');
const fs = require('fs');

const HighScore = require('../models/HighScore');
const { response } = require('express');


// getWords
const getWords = (req, res, next) => {
  let counter = 0;
  if(req.params.diff === 'easy') {
    while(counter != 3){
      myWords = randomWords({ exactly: 3, maxLength: 4 });
      myWords.map((word) => {
        if(word.length === 3 || word.length === 4){
          counter += 1;;
        } else {
          counter = 0;
        };
      });
    }

  } else if (req.params.diff === 'medium') {
    while(counter != 3){
      myWords = randomWords({ exactly: 3, maxLength: 5 });
      myWords.map((word) => {
        if(word.length === 5){
          counter += 1;;
        } else {
          counter = 0;
        };
      });
    }
  } else {

    while(counter != 3){
      myWords = randomWords({ exactly: 3 });
      myWords.map((word) => {
        if(word.length >= 6){
          counter += 1;;
        } else {
          counter = 0;
        };
      });
    }
  }

  res.status(200).json({words: myWords});
}

const getCanvas = async (req, res, next) => {
  fs.readFile('images/lastcanvas.png', (err, data) => {
    if (err) throw err;
    res.status(200).setHeader('Content-Type', 'image/png');
    res.end(data);
  });
};


const getHs = async (req, res, next) => {
  const HighScores = [];
   HighScore.find().sort({'score': -1}).limit(3)
  .then(result => {
    result.map(hs => {
         HighScores.push(hs);
    });
    res.status(200).setHeader('Content-Type', 'application/json');
    res.send(HighScores);
  });


};

exports.getHs = getHs;
exports.getWords = getWords;
exports.getCanvas = getCanvas;
