process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app.js");
const chai = require("chai");
const { expect } = chai;
const connection = require("../db/connection.js");
const chaiSorted = require("chai-sorted");

chai.use(chaiSorted);

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
    it("GET: status 200, returns a JSON of all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("object");
        });
    });
    it("INVALID METHOD: status 405", () => {
      const invalidMethods = ["patch", "put", "post", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    describe("/topics", () => {
      it("GET: status 200, returns all topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
          });
      });
      it("INVALID METHOD: status 405", () => {
        const invalidMethods = ["patch", "put", "post", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });

    describe("/users", () => {
      it("INVALID METHOD: status 405", () => {
        const invalidMethods = ["get", "patch", "put", "post", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/users")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });

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
        it("INVALID METHOD: status 405", () => {
          const invalidMethods = ["patch", "put", "post", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/users/rogersop")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });

    describe("/articles", () => {
      it("GET: status 200, displays all articles, sorting them by date and in descending order by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an("array");
            expect(body.articles[0]).to.contain.keys(
              "article_id",
              "title",
              "comment_count",
              "votes",
              "topic",
              "author",
              "created_at"
            );
            expect(body.articles).to.be.descendingBy("created_at");
          });
      });
      it("GET: status 200, displays all articles, sorted appropriately when provided a sort_by query", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("title");
          });
      });
      it("GET: status 200, displays all articles, sorted in ascending order when provided that query", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.ascendingBy("created_at");
          });
      });
      it("GET: status 200, displays all articles, filtered by a selected author", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("author");
          });
      });
      it("GET: status 200, displays all articles, filtered by a selected topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("topic");
          });
      });
      it("GET: status 200, displays all articles, filtered by a selected author and topic", () => {
        return request(app)
          .get("/api/articles?author=rogersop&topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("topic");
            expect(body.articles[0].topic).to.equal("mitch");
          });
      });
      it("GET: status 400, displays an error if provided with an invalid sort_by value", () => {
        return request(app)
          .get("/api/articles?sort_by=not-a-column")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request - invalid sort by value");
          });
      });
      it("GET: status 400, displays an error if provided with an invalid sort_by value", () => {
        return request(app)
          .get("/api/articles?order=invalid-order")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request - invalid order value");
          });
      });
      it("GET: status 404, displays an error if provided with an invalid author", () => {
        return request(app)
          .get("/api/articles?author=no-one")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Author not found");
          });
      });
      it("GET: status 404, displays an error if provided with an invalid topic", () => {
        return request(app)
          .get("/api/articles?topic=nothing")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Topic not found");
          });
      });
      it("INVALID METHOD: status 405", () => {
        const invalidMethods = ["patch", "put", "post", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/articles")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
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
              expect(body.msg).to.equal("Bad request - invalid value");
            });
        });
        it("PATCH: status 200, increments the selected article's vote by the stated number", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(101);
            });
        });
        it("PATCH: status 200, decrements the selected article's vote by the stated number", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -40 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(60);
            });
        });
        it("PATCH: status 200, ignores any additional element passed in through the body", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -40, pet: "cat" })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(60);
            });
        });
        it("PATCH: status 200, returns the article unchanged if no valid body to patch is provided", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({})
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(100);
            });
        });
        it("PATCH: status 400, returns an error where an invalid inc_votes value is provided", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "hello" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request - invalid value");
            });
        });
        it("INVALID METHOD: status 405", () => {
          const invalidMethods = ["put", "post", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles/1")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });

        describe("/comments", () => {
          it("POST: status 201, posts a comment to the selected article and displays that comment", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                body:
                  "I have a controvertial opinion regarding the subject matter of this article",
                username: "butter_bridge"
              })
              .expect(201)
              .then(({ body }) => {
                expect(body.comment).to.contain.keys(
                  "body",
                  "votes",
                  "comment_id",
                  "author",
                  "created_at",
                  "article_id"
                );
                expect(body.comment.article_id).to.equal(1);
              });
          });
          it("POST: status 404, returns an error if a non-existent article_id is used", () => {
            return request(app)
              .post("/api/articles/1999/comments")
              .send({
                body:
                  "I have a controvertial opinion regarding the subject matter of this article",
                username: "butter_bridge"
              })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  'Not found - Key (article_id)=(1999) is not present in table "articles".'
                );
              });
          });
          it("POST: status 400, returns an error if an invalid article_id is used", () => {
            return request(app)
              .post("/api/articles/hello/comments")
              .send({
                body:
                  "I have a controvertial opinion regarding the subject matter of this article",
                username: "butter_bridge"
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request - invalid value");
              });
          });
          it("POST: status 400, returns an error if no username is provided", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                body:
                  "I have a controvertial opinion regarding the subject matter of this article"
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  "Bad request - username and comment text are both required"
                );
              });
          });
          it("POST: status 400, returns an error if no body is provided", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "butter_bridge"
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  "Bad request - username and comment text are both required"
                );
              });
          });
          it("GET: status 200, displays all comments for specified article, sorting comments by created_at and in descending order by default", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0]).to.contain.keys(
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body"
                );
                expect(body.comments).to.be.descendingBy("created_at");
              });
          });
          it("GET: status 200, returns an empty array if an article containing no comments is entered", () => {
            return request(app)
              .get("/api/articles/3/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.eql([]);
              });
          });
          it("GET: status 404, returns an error if a non-existent article is entered", () => {
            return request(app)
              .get("/api/articles/99/comments")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Article not found");
              });
          });
          it("GET: status 200, displays all comments for specified article, sorting comments by the specified sort_by query when provided with a valid query", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=author")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0].author).to.equal("icellusedkars");
              });
          });
          it("GET: status 200, displays all comments for specified article, sorting comments in the specified order when provided with a valid query", () => {
            return request(app)
              .get("/api/articles/1/comments?order=asc")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.ascendingBy("created_at");
              });
          });
          it("GET: status 200, displays all comments for specified article, sorting comments by the specified column and in the specified order when provided with a valid query", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes&order=asc")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.ascendingBy("votes");
              });
          });
          it("GET: status 400, displays an error if provided with an invalid sort_by value", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=not-a-column")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  "Bad request - invalid sort by value"
                );
              });
          });
          it("GET: status 400, displays an error if provided with an invalid order value", () => {
            return request(app)
              .get("/api/articles/1/comments?order=invalid-order")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad request - invalid order value");
              });
          });
          it("INVALID METHOD: status 405", () => {
            const invalidMethods = ["put", "patch", "delete"];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/articles/1/comments")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Method not allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
    describe("/comments", () => {
      it("INVALID METHOD: status 405", () => {
        const invalidMethods = ["get", "post", "put", "patch", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/comments")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
      describe("/:comment_id", () => {
        it("PATCH: 200, increments the vote count by the stated number", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(17);
            });
        });
        it("PATCH: 200, decrements the vote count by the stated number", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -2 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(14);
            });
        });
        it("PATCH: status 200, ignores any additional element passed in through the body", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1, pet: "cat" })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(17);
            });
        });
        it("PATCH: status 400, returns an error where no inc_votes value is provided", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({})
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(16);
            });
        });
        it("PATCH: status 400, returns an error where an invalid inc_votes value is provided", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "hello" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request - invalid value");
            });
        });
        it("PATCH: status 404, returns an error if provided a comment_id that does not exist", () => {
          return request(app)
            .patch("/api/comments/99")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Comment with ID 99 not found");
            });
        });
        it("DELETE: status 204", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204);
        });
        it("DELETE: status 404, returns an error message if provided a comment_id that does not exist", () => {
          return request(app)
            .delete("/api/comments/99")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Comment with ID 99 not found");
            });
        });
        it("INVALID METHOD: status 405", () => {
          const invalidMethods = ["get", "post", "put"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/comments/1")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
});
