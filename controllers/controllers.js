const articles = require("../db/data/test-data/articles");
const { fetchTopics,
        fetchArticleById,
        fetchArticles, 
        fetchCommentsCount } = require("../models/models")

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
      const newArticles = articles.map(article => Object.assign({}, article, {
        comment_count: parseInt(article.comment_count) //Object.assign because couldnt use spread operator
      }));
      res.status(200).send(newArticles);
    })
    .catch(next);
}

