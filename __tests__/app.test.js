const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
    if (db.end) db.end()
});

beforeEach(() => {
    return seed(data)
});

describe("GET/api/", () => {
    it("GET 200: responds with a message saying the server is running.", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then((res) => {
                const { body } = res;
                const { msg } = body;
                expect(msg).toBe("Server is up and running!");
            });
    });
});

describe('GET/api/topics', () => {
    it('responds with status 200 view all topics', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then((res) => {
                const { body } = res;
                const { topics } = body;
                expect(topics).toHaveLength(data.topicData.length);
                topics.forEach((topic) => {
                    expect(topic).toHaveProperty('slug', expect.any(String));
                    expect(topic).toHaveProperty('description', expect.any(String));
                });
            });
    });
});

describe('GET/not-a-route', () => {
    it('responds with status 404', () => {
        return request(app)
            .get('/not-a-route')
            .expect(404)
            .send({ msg: 'This route is not available!' });
    });
});

describe('GET/api/articles/:article_id', () => {
    it('responds with status 200 and requested article', () => {
        const articleId = 1;
        return request(app)
            .get(`/api/articles/${articleId}`)
            .expect(200)
            .then((res) => {
                const { body } = res;
                const { article } = body;
                expect(article).toHaveProperty('author', expect.any(String));
                expect(article).toHaveProperty('title', expect.any(String));
                expect(article).toHaveProperty('article_id', articleId);
                expect(article).toHaveProperty('body', expect.any(String));
                expect(article).toHaveProperty('topic', expect.any(String));
                expect(article).toHaveProperty('created_at', expect.any(String));
                expect(article).toHaveProperty('votes', expect.any(Number));
                expect(article).toHaveProperty('article_img_url', expect.any(String));
            });
    });
    it('responds with status 404 if article_id is not found', () => {
        const articleId = 999999;
        return request(app)
            .get(`/api/articles/${articleId}`)
            .expect(404)
            .then((res) => {
                const { body } = res;
                expect(body.msg).toBe(`Article ${articleId} not found`);
            });
    });
    it('responds with status 400 if article_id is not a number', () => {
        const articleId = 'not_a_number';
        return request(app)
            .get(`/api/articles/${articleId}`)
            .expect(400)
            .then((res) => {
                const { body } = res;
                const { msg } = body;
                expect(msg).toBe("Invalid article ID");
            });
    });
});

describe("GET /api/articles", () => {
    it("responds with status 200 and an array of articles", () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then((res) => {
                const { body } = res;
                const { articles } = body;
                expect(Array.isArray(articles)).toBe(true);
                expect(articles.length).toBeGreaterThan(0);
                articles.forEach((article) => {
                    expect(article).toHaveProperty("author", expect.any(String));
                    expect(article).toHaveProperty("title", expect.any(String));
                    expect(article).toHaveProperty("article_id", expect.any(Number));
                    expect(article).toHaveProperty("body", expect.any(String));
                    expect(article).toHaveProperty("topic", expect.any(String));
                    expect(article).toHaveProperty("created_at", expect.any(String));
                    expect(article).toHaveProperty("votes", expect.any(Number));
                    expect(article).toHaveProperty("article_img_url", expect.any(String));
                    expect(article).toHaveProperty("comment_count", expect.any(Number));
                });
            });
    });

});

describe("GET /api/articles/:article_id/comments", () => {
    it("responds with an array of comments for the given article_id of which each comment should have the correct properties", () => {
        const articleId = 1
        return request(app)
            .get(`/api/articles/${articleId}/comments`)
            .expect(200)
            .then((res) => {
                const { body } = res;
                const { comments } = body;
                expect(Array.isArray(comments)).toBe(true);
                expect(comments.length).toBeGreaterThan(0);
                comments.forEach((comment) => {
                    expect(comment).toHaveProperty("comment_id", expect.any(Number));
                    expect(comment).toHaveProperty("votes", expect.any(Number));
                    expect(comment).toHaveProperty("created_at", expect.any(String));
                    expect(comment).toHaveProperty("author", expect.any(String));
                    expect(comment).toHaveProperty("body", expect.any(String));
                    expect(comment).toHaveProperty("article_id", expect.any(Number));
                });

                const firstElementDate = new Date(comments[0].created_at).getDate();
                const lastElementDate = new Date(comments[comments.length - 1].created_at).getDate();

                expect(firstElementDate).toBeGreaterThan(lastElementDate);
            });
    });
    it('responds with status 404 if article_id is not found', () => {
        const articleId = 999999;
        return request(app)
            .get(`/api/articles/${articleId}`)
            .expect(404)
            .then((res) => {
                const { body } = res;
                expect(body.msg).toBe(`Article ${articleId} not found`);
            });
    });
    it('responds with status 400 if article_id is not a number', () => {
        const articleId = 'not_a_number';
        return request(app)
            .get(`/api/articles/${articleId}`)
            .expect(400)
            .then((res) => {
                const { body } = res;
                const { msg } = body;
                expect(msg).toBe("Invalid article ID");
            });
    });
    it("responds with an empty array if article_id is valid but has no comments", () => {
        const articleId = 2;
        return request(app)
            .get(`/api/articles/${articleId}/comments`)
            .expect(200)
            .then((res) => {
                const { body } = res;
                const { comments } = body;
                expect(Array.isArray(comments)).toBe(true);
                expect(comments.length).toBe(0);
            });
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    it('responds with the posted comment', () => {
        const articleId = 1;
        const newComment = {
            username: data.userData[0].username,
            body: 'This is a test comment.'
        };
        return request(app)
            .post(`/api/articles/${articleId}/comments`)
            .send(newComment)
            .expect(201)
            .then((res) => {
                const { body } = res;
                expect(body).toHaveProperty('comment');
                const { comment } = body;
                expect(comment).toEqual(expect.objectContaining({
                    comment_id: expect.any(Number),
                    author: newComment.username,
                    body: newComment.body,
                    article_id: articleId,
                    created_at: expect.any(String)
                }))

            })
    });

    it('responds with status 404 if article_id is not found', () => {
        const articleId = 999999;
        const newComment = {
            username: 'testuser',
            body: 'This is a test comment.'
        };
        return request(app)
            .post(`/api/articles/${articleId}/comments`)
            .send(newComment)
            .expect(404)
            .then((res) => {
                const { body } = res;
                expect(body.msg).toBe(`Article ${articleId} not found`);
            });
    });

    it('responds with status 400 if article_id is not a number', () => {
        const articleId = 'not_a_number';
        const newComment = {
            username: 'testuser',
            body: 'This is a test comment.'
        };
        return request(app)
            .post(`/api/articles/${articleId}/comments`)
            .send(newComment)
            .expect(400)
            .then((res) => {
                const { body } = res;
                const { msg } = body;
                expect(msg).toBe('Invalid article ID');
            });
    });

    it('responds with status 400 if request body is missing required properties', () => {
        const articleId = 1;
        const invalidComment = {
            username: 'testuser'
        };
        return request(app)
            .post(`/api/articles/${articleId}/comments`)
            .send(invalidComment)
            .expect(400)
            .then((res) => {
                const { body } = res;
                const { msg } = body;
                expect(msg).toBe('Invalid request body');
            });
    });
    
    it('responds with the posted comment, ignoring unnecessary property', () => {
        const articleId = 1;
        const newComment = {
            username: data.userData[0].username,
            body: 'This is a test comment.',
            unnecessaryProperty: 'This should be ignored.'
        };
        return request(app)
            .post(`/api/articles/${articleId}/comments`)
            .send(newComment)
            .expect(201)
            .then((res) => {
                const { body } = res;
                expect(body).toHaveProperty('comment');
                const { comment } = body;
                expect(comment).toEqual(expect.objectContaining({
                    comment_id: expect.any(Number),
                    author: newComment.username,
                    body: newComment.body,
                    article_id: articleId,
                    created_at: expect.any(String)
                }))
            })
    });

    it('responds with status 400 if username does not exist', () => {
        const articleId = 1;
        const newComment = {
            username: 'thisusernamedoesnotexist',
            body: 'This is a test comment.'
        };
        return request(app)
            .post(`/api/articles/${articleId}/comments`)
            .send(newComment)
            .expect(400)
            .then((res) => {
                const { body } = res;
                const { msg } = body;
                expect(msg).toBe('Invalid username');
            });
    });
    
});

describe('PATCH /api/articles/:article_id', () => {
    it('increments the current article vote property by the given amount', () => {
        const articleId = 1;
        const initialVotes = 100;
        const incrementVotes = 15;
        return request(app)
          .patch(`/api/articles/${articleId}`)
          .send({ inc_votes: incrementVotes })
          .expect(200)
          .then((res) => {
            const updatedArticle = res.body.article;
            const updatedVotes = updatedArticle.votes;
            expect(updatedVotes).toBe(initialVotes + incrementVotes);
            expect(updatedArticle).toMatchObject({
              article_id: articleId,
              title: expect.any(String),
              body: expect.any(String),
              votes: expect.any(Number),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
            });
          });
      });

    it('decrements the current article vote property by the given amount when given inc_votes of negative value', () => {
        const articleId = 1;
        const initialVotes = 100;
        const decrementVotes = -90;
        return request(app)
          .patch(`/api/articles/${articleId}`)
          .send({ inc_votes: decrementVotes })
          .expect(200)
          .then((res) => {
            const updatedVotes = res.body.article.votes;
            expect(updatedVotes).toBe(initialVotes + decrementVotes);
        });
    });

    test('responds with updated article', () => {
        const articleId = 1;
        return request(app)
          .patch(`/api/articles/${articleId}`)
          .send({ inc_votes: 10 })
          .expect(200)
          .then((res) => {
            const expectedKeys = ['article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at'];
            expect(Object.keys(res.body.article)).toEqual(expect.arrayContaining(expectedKeys));
            expect(res.body.article.votes).toBe(110);
          });
      });
      
    it('returns a 404 error for invalid article ID', () => {
        const articleId = 999999999;
        return request(app)
          .patch(`/api/articles/${articleId}`)
          .send({ inc_votes: 5 })
          .expect(404)
          .then((res) => {
            const { body } = res;
            expect(body.msg).toBe('Article not found');
        });
    });
    
    it('returns a 400 error for invalid vote value', () => {
        const articleId = 1;
        const inc = 'not-a-num';
        return request(app)
          .patch(`/api/articles/${articleId}`)
          .send({ inc_votes: inc })
          .expect(400)
          .then((res) => {
            const { body } = res;
            expect(body.msg).toBe('Invalid vote value');
        });
    });
    
    it('returns the article without any changes', () => {
        const articleId = 1;
        const votes = data.articleData[0].votes;
        return request(app)
          .patch(`/api/articles/${articleId}`)
          .send({inc_votes: 0})
          .expect(200)
          .then((res) => {
            const updatedVotes = res.body.article.votes;
            expect(updatedVotes).toBe(votes);
        });
    });
});


  