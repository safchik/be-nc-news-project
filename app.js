const express = require("express");
const {getTopics, getArticleById, getArticles } = require('./controllers/controllers');

const app = express();
app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "Server is up and running!" });
});

app.get(`/api/topics`, getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles); 

app.all('/*', (req, res) => {
  res.status(404).send({msg: 'Route not found'})
});

app.use((err, req, res, next) => {
  if(err.status === 404) {
    res.status(404).send({ msg: err.msg });
  } else if (err.status === 400) {
    res.status(400).send({ msg: err.msg });
  } else {
    console.error(err)
    res.status(500).send('Server error!');
  }
});

module.exports = app;