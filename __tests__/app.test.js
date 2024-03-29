const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
require("jest-sorted");

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
            .get("/api/articles")
            .expect(200)
            .then((res) => {
                const { body } = res;
                const { articles } = body;
                expect(articles.length).toBe(data.articleData.length);
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
    it("responds with status 200 and filters the articles by the topic value specified in the query", () => {
        return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then((res) => {
                const { body } = res;
                const { articles } = body;
                expect(articles.length).toBe(1);
                const article = articles[0];
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
    it("responds with status 200 and sorts the articles by any valid column", () => {
        const column = "title";
        return request(app)
            .get(`/api/articles?sort_by=${column}`)
            .expect(200)
            .then((res) => {
                const { body } = res;
                const { articles } = body;
                expect(articles.length).toBe(data.articleData.length);
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
                expect(articles).toBeSortedBy(column, { descending: true });
            });
    });
    it("responds with status 400 and error if sort column is not valid", () => {
        const column = "not_valid";
        return request(app)
            .get(`/api/articles?sort_by=${column}`)
            .expect(400)
            .then((res) => {
                const { body } = res;
                const { msg } = body;
                expect(msg).toBe("Invalid sort_by column");
            });
    });
    it("responds with status 200 and sorts in asc order", () => {
        return request(app)
            .get(`/api/articles?order=asc`)
            .expect(200)
            .then((res) => {
                const { body } = res;
                const { articles } = body;
                expect(articles.length).toBe(data.articleData.length);
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
                expect(articles).toBeSortedBy("created_at", { descending: false });
            });
    });
    it("responds with status 400 and error when sort order invalid", () => {
        return request(app)
            .get(`/api/articles?order=blabla`)
            .expect(400)
            .then((res) => {
                const { body } = res;
                const { msg } = body;
                expect(msg).toBe("Invalid sort order");
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

    it('responds with updated article', () => {
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

    it('returns the article without any changes when the vote increment or decrement is 0', () => {
        const articleId = 1;
        const votes = data.articleData[0].votes;
        return request(app)
            .patch(`/api/articles/${articleId}`)
            .send({ inc_votes: 0 })
            .expect(200)
            .then((res) => {
                const updatedVotes = res.body.article.votes;
                expect(updatedVotes).toBe(votes);
            });
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    it('should respond with status 204 and delete the given comment by its ID', () => {
        const comment_id = 1;
        return request(app)
            .delete(`/api/comments/${comment_id}`)
            .expect(204)
            .then(() => {
                return request(app)
                    .get(`/api/comments/${comment_id}`)
                    .expect(404)
            });
    });

    it('should respond with an error status 400 if the comment_id is not a number', () => {
        const comment_id = 'not_a_number';
        return request(app)
            .delete(`/api/comments/${comment_id}`)
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('Invalid comment ID');
            });
    });

    it('should respond with an error status 404 if the comment with the given ID is not found', () => {
        const comment_id = 999;
        return request(app)
            .delete(`/api/comments/${comment_id}`)
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('Comment not found');
            });
    });
});

describe('GET /api/users', () => {
    it('responds with an array of user objects containing username, name, and avatar_url properties', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then((res) => {
                expect(Array.isArray(res.body.users)).toBe(true);
                expect(res.body.users.length).toBeGreaterThan(0);
                expect(res.body.users[0]).toHaveProperty('username');
                expect(res.body.users[0]).toHaveProperty('name');
                expect(res.body.users[0]).toHaveProperty('avatar_url');
            });
    });
});