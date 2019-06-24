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

describe("makeRefObj", () => {});

describe("formatComments", () => {});
