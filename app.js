const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
const fs = require('fs');

const { getTopics,
  getArticleById,
  getArticles,
  getComments,
  postComments,
  updateArticle,
  removeComment,
  getAllUsers
} = require('./controllers/controllers');
const { send } = require("process");

app.use(express.json());

app.get("/api", (req, res) => {
  fs.readFile('endpoints.json', 'utf-8', (err, data) => {
    send(data);
  })
  res.status(200).send({ msg: "Server is up and running!" });
});

app.get(`/api/topics`, getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles);

app.get(`/api/articles/:article_id/comments`, getComments);

app.post('/api/articles/:article_id/comments', postComments);

app.patch('/api/articles/:article_id', updateArticle)

app.delete('/api/comments/:comment_id', removeComment);

app.get('/api/users', getAllUsers);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Route not found' })
});

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ msg: err.msg });
  } else if (err.status === 400) {
    res.status(400).send({ msg: err.msg });
  } else {
    console.error(err)
    res.status(500).send('Server error!');
  }
});

module.exports = app;