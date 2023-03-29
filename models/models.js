const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`).then((result) => {
      return result.rows;
    });
  };
  
exports.fetchArticleById = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({status: 404, msg: `Article ${article_id} not found`});
        }
        return result.rows[0];
    });
};

exports.fetchArticles = () => { 
  return db.query(`
  SELECT articles.*, 
  COUNT(comments.comment_id) ::INT AS comment_count 
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC;
  `)
  .then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'No articles found' });
    }
    return result.rows;
  });
};

  


