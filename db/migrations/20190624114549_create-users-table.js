
exports.up = (connection, Promise) => {
  return connection.schema.createTable("users", usersTable => {
    usersTable.string("username").primary();
    usersTable.string("avatar_url").notNullable();
    usersTable.string('name').notNullable();
  });
};

exports.down = (connection, Promise) => {
  return connection.schema.dropTable("users");
};
