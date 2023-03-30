const articles = require("../db/data/test-data/articles");
const { fetchTopics,
        fetchArticleById,
        fetchArticles, 
        fetchComments } = require("../models/models")

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((output) => {
      res.status(200).send({ topics: output });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  if(isNaN(article_id)) {
    return next({status: 400, msg: 'Invalid article ID'});
  }

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      if(err.status === 404) {
        res.status(404).send({ msg: err.msg});
      } else {
        next(err);
      }
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
  .then((articles) => {
    res.status(200).send({ articles });
  })
  .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    return next({ status: 400, msg: 'Invalid article ID' });
  }

  fetchComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
