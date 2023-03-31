const { fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchComments,
  addNewComment,
  incrementArticleVotes,
  deleteCommentById,
  fetchAllUsers
} = require("../models/models")


exports.getTopics = (req, res) => {

  fetchTopics().then((output) => {
    res.status(200).send({ topics: output })
  })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: "Unable to retrieve topics!" });
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    return next({ status: 400, msg: 'Invalid article ID' });
  }

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      if (err.status === 404) {
        res.status(404).send({ msg: err.msg });
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

exports.postComments = (req, res, next) => {
  const commentToAdd = req.body;

  if (!commentToAdd.body) {
    res.status(400).send({ msg: "Invalid request body" });
  } else if (!commentToAdd.username) {
    res.status(400).send({ msg: "Username is required" });
  } else if(isNaN(req.params.article_id)) {
    res.status(400).send({ msg: "Invalid article ID" });
  } else {
    fetchArticleById(req.params.article_id)
      .then(article => {
        return addNewComment({
          article_id: parseInt(article.article_id),
          username: commentToAdd.username,
          body: commentToAdd.body,
        }).then((comment) => {
          res.status(201).send({ comment });
        })
          .catch(err => {
            next(err)
          })
      })
      .catch((err) => {
        next(err);
      })
  }
};

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  incrementArticleVotes(article_id, inc_votes)
    .then(updatedArticle => {
      res.status(200).send({ article: updatedArticle});
    })
    .catch(next);
};

exports.removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
