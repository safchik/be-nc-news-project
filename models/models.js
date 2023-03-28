const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((result) => {
      return result.rows;
    });
  };
  
  exports.fetchArticleById = (articleId) => {
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
      .then((result) => {
        if (result.rows.length === 0) {
          return null; // article with provided ID not found
        }
        return result.rows[0]; // return article object
      });
  };