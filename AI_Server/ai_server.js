const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config();
app.use(express.static('client'))
const cors_app = require('cors');
app.use(cors_app());

function getNLUInstance() {
  let api_key = process.env.API_KEY;
  let api_url = process.env.API_URL;

  const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
  const { IamAuthenticator } = require('ibm-watson/auth');

  const NaturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({
      apikey: api_key,
    }),
    serviceUrl: api_url,
  });

  return NaturalLanguageUnderstanding;
}


app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    /*test text */
    return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    return res.send("url sentiment for "+req.query.url);
});

app.post("/text/emotion", (req,res, next) => {
    getNLUInstance.analyze(req.body, (err, results) => {
      if (err) {
        return next(err);
        console.log(err)
      }
      console.log(res.text)
      return res.json({ query: req.body.query, results: results.result });
    });
});

app.get("/text/sentiment", (req,res) => {
    return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

