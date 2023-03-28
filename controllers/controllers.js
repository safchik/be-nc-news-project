const { fetchTopics, fetchArticleById } = require("../models/models")

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((output) => {
      res.status(200).send({ topics: output });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: "Unable to retrieve topics!" });
    });
};

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  if (!Number.isInteger(parseInt(articleId))) {
    return res.status(400).send({ msg: "Invalid article ID" });
  }
  fetchArticleById(articleId)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: `Article ${articleId} not found` });
      }
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

