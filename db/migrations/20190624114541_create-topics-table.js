exports.up = (connection, Promise) => {
  return connection.schema.createTable("topics", topicsTable => {
    topicsTable.unique("slug", 40).primary();
    topicsTable.string("description").notNullable();
  });
};

exports.down = (connection, Promise) => {
  return connection.schema.dropTable("topics");
};
