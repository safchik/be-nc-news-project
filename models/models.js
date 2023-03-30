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

exports.fetchComments = (article_id) => {
  const sql = `
  SELECT comments.*
  FROM comments 
  WHERE article_id = $1 
  ORDER BY created_at DESC;
  `
  return db.query(sql, [article_id])
  .then((result) => {
    return result.rows;
  });
};
  
exports.addNewComment = (commentAdd) => {
  const { username, body, article_id } = commentAdd;

  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 400, msg: 'Invalid username' });
      }

      const arrayValue = [username, body, article_id];
      const sql = `
        INSERT INTO comments
        (author, body, article_id)
        VALUES
        ($1, $2, $3)
        RETURNING *;
      `;
      return db.query(sql, arrayValue);
    })
    .then(({ rows }) => {
      const commentAdded = rows[0];
      return commentAdded;
    });
};

exports.updateArticleById = (article_id, newVotes) => {
  if (newVotes === null) {
    return Promise.reject({ status: 400, msg: 'Invalid votes value' });
  }

  const sql = `
    UPDATE articles
    SET votes = GREATEST(0, $2)
    WHERE article_id = $1
    RETURNING *;
  `;
  const values = [article_id, newVotes];
  return db.query(sql, values)
    .then(({ rows }) => {
      if(rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'No articles found' });
      }
      return rows[0];
    });
};


