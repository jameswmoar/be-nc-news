const { expect } = require("chai");
const { formatDate, makeRefObj, formatComments } = require("../db/utils/utils");

describe("formatDate", () => {
  it("returns an empty array when passed an empty array", () => {
    expect(formatDate([])).to.eql([]);
  });
  it("when passed an array containing one object, returns that array with the created_at value changed into a javascript date object", () => {
    expect(
      formatDate([
        {
          body: "test-body",
          belongs_to: "test-owner",
          created_by: "test-author",
          votes: 12,
          created_at: 1468087638932
        }
      ])
    ).to.eql([
      {
        body: "test-body",
        belongs_to: "test-owner",
        created_by: "test-author",
        votes: 12,
        created_at: new Date("2016-07-09T18:07:18.932Z")
      }
    ]);
  });
  it("when passed an array containing one object, returns that array with the created_at value changed into a javascript date object", () => {
    expect(
      formatDate([
        {
          body: "test-body-1",
          belongs_to: "test-owner-1",
          created_by: "test-author-1",
          votes: 12,
          created_at: 1468087638932
        },
        {
          body: "test-body-2",
          belongs_to: "test-owner-2",
          created_by: "test-author-2",
          votes: 16,
          created_at: 1479818163389
        }
      ])
    ).to.eql([
      {
        body: "test-body-1",
        belongs_to: "test-owner-1",
        created_by: "test-author-1",
        votes: 12,
        created_at: new Date("2016-07-09T18:07:18.932Z")
      },
      {
        body: "test-body-2",
        belongs_to: "test-owner-2",
        created_by: "test-author-2",
        votes: 16,
        created_at: new Date("2016-11-22T12:36:03.389Z")
      }
    ]);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object when passed an empty array", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("returns a reference object with one key value pair when passed an array containing a single object", () => {
    const data = [
      {
        article_id: 1,
        title: "A"
      }
    ];
    const refKey = "title";
    const refValue = "article_id";
    const actual = makeRefObj(data, refKey, refValue);
    const expected = {
      A: 1
    };
    expect(actual).to.eql(expected);
  });
  it("returns a reference object with multiple key value pairs when passed an array containing multiple objects", () => {
    const data = [
      {
        article_id: 1,
        title: "A"
      },
      {
        article_id: 2,
        title: "B"
      }
    ];
    const refKey = "title";
    const refValue = "article_id";
    const actual = makeRefObj(data, refKey, refValue);
    const expected = {
      A: 1,
      B: 2
    };
    expect(actual).to.eql(expected);
  });
});

describe("formatComments", () => {
  it("returns an empty array when passed an empty array", () => {
    expect(formatComments([])).to.eql([]);
  });

  it("returns an array containing a formatted comment with the correct keys when passed an array containing a single comment", () => {
    const comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const articleRef = { "Living in the shadow of a great man": 1 };
    const formattedComments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date("2016-11-22T12:36:03.389Z")
      }
    ];
    const actual = formatComments(comments, articleRef);
    expect(actual[0]).to.contain.key("author");
    expect(actual[0]).to.contain.key("article_id");
  });

  it("returns an array containing a formatted comment with a javascript data object as created_at when passed an array containing a single comment", () => {
    const comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const articleRef = { "Living in the shadow of a great man": 1 };
    const formattedComments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date("2016-11-22T12:36:03.389Z")
      }
    ];
    const actual = formatComments(comments, articleRef);
    expect(actual[0].created_at).to.eql(new Date("2016-11-22T12:36:03.389Z"));
  });
  
  it("returns an array that maintains unchanged existing elements when passed an array containing a single comment", () => {
    const comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const articleRef = { "Living in the shadow of a great man": 1 };
    const formattedComments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date("2016-11-22T12:36:03.389Z")
      }
    ];
    const actual = formatComments(comments, articleRef);
    expect(actual[0].body).to.eql(comments[0].body);
    expect(actual[0].votes).to.eql(comments[0].votes);
  });
  
  it("returns an array containing a single formatted comment when passed an array containing a single comment", () => {
    const comments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const articleRef = { "Living in the shadow of a great man": 1 };
    const formattedComments = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date("2016-11-22T12:36:03.389Z")
      }
    ];
    const actual = formatComments(comments, articleRef);
    expect(actual).to.eql(formattedComments);
  });
});
