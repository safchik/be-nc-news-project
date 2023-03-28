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
        .then((res) => {
            const { body } = res;
            const { msg } = body;
            expect(msg).toBe(`Article ${articleId} not found`);
        });
    });
    it('responds with status 400 if article_id is not a number', () => {
        const articleId = 'not-a-number';
        return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(400)
        .send({msg: "Invalid article ID"});
    });
});
