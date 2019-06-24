exports.up = (connection, Promise) => {
  return connection.schema.createTable("topics", topicsTable => {
    topicsTable.string("slug").unique().primary();
    topicsTable.string("description").notNullable();
  });
};

exports.down = (connection, Promise) => {
  return connection.schema.dropTable("topics");
};
