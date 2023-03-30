const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");


afterAll(() => {
    if (db.end) db.end()
});

beforeEach(() =>{
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
          const { articles }  = body;
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
            const { comments }  = body;
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
});