process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app.js");
const chai = require("chai");
const { expect } = chai;
const connection = require("../db/connection.js");

describe("/", () => {
  after(() => connection.destroy());
  beforeEach(() => connection.seed.run());

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
      });
    });

    describe("/articles", () => {
      describe('/:article_id', () => {
        it('GET: status 200, displays the correct article', () => {
          return request(app)
          .get('/api/articles/8')
          .expect(200)
          .then(({body}) => {
            expect(body.article).to.contain.keys(
              'title',
              'author',
              'article_id'
            )
          })
        });
      });
    });

    describe("/comments", () => {});
  });
});
