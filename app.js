const express = require("express");
const {getTopics, getArticleById } = require('./controllers/controllers');

const app = express();

app.get("/api", (req, res) => {
    res.status(200).send({ msg: "Server is up and running!" });
  });


app.get(`/api/topics`, getTopics);

app.get('/api/articles/:article_id', getArticleById)

module.exports = app;