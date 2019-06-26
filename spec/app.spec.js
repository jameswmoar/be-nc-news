process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app.js");
const chai = require("chai");
const { expect } = chai;
const connection = require("../db/connection.js");

describe("/", () => {
  after(() => connection.destroy());
  beforeEach(() => connection.seed.run());

  describe("/invalid-endpoint", () => {
    it("GET: status 404, when provided an endpoint that does not exist", () => {
      return request(app)
        .get("/invalid-endpoint")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Page not found");
        });
    });
  });

  describe("/api", () => {
    describe("/topics", () => {
      it("GET: status 200, returns all topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
          });
      });
    });
    describe("/users", () => {
      describe("/:username", () => {
        it("GET: status 200, displays the correct username", () => {
          return request(app)
            .get("/api/users/rogersop")
            .expect(200)
            .then(({ body }) => {
              expect(body.user).to.contain.keys(
                "username",
                "name",
                "avatar_url"
              );
            });
        });
        it("GET: status 404, when provided a username that does not exist", () => {
          return request(app)
            .get("/api/users/rogersock")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("User not found");
            });
        });
      });
    });

    describe("/articles", () => {
      describe("/:article_id", () => {
        it("GET: status 200, displays the correct article", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.contain.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes"
              );
              expect(body.article).to.contain.keys("comment_count");
            });
        });
        it("GET: status 404, when provided with an article_id that does not exist", () => {
          return request(app)
            .get("/api/articles/954")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Article not found");
            });
        });
        it("GET: status 400, when provided with an article_id that is invalid", () => {
          return request(app)
            .get("/api/articles/not-a-number")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
            });
        });
        it("PATCH: status 200, increments the selected article's vote by the stated number", () => {
          return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 1})
          .expect(200)
          .then(({body}) => {
            expect(body.updatedArticle.votes).to.equal(101)
          })
        });
        it("PATCH: status 200, decrements the selected article's vote by the stated number", () => {
          return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: -40})
          .expect(200)
          .then(({body}) => {
            expect(body.updatedArticle.votes).to.equal(60)
          })
        });
      });
      describe('/comments', () => {
        it('POST: status 201, posts a comment to the selected article and displays that comment', () => {
          return request(app)
          .post('/api/articles/1/comments')
          .send({
            body: 'I have a controvertial opinion regarding the content of this article',
            author: 'butter_bridge'
          })
          .expect(201)
          .then(({body}) => {
            expect(body.newComment).to.contain.keys('body', 'votes', 'comment_id', 'author', 'created_at', 'article_id')
            expect(body.newComment.article_id).to.equal(1)
          })
        });
      });
    });

    describe("/comments", () => {});
  });
});
