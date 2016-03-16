exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.createTable('user_table', function(table){
      table.increments().primary();
      table.string('oauthid');
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.string('user_image');
    }),
    knex.schema.createTable('work', function(table){
      table.increments().primary();
      table.string('title');
      table.text('text_content');
      table.text('image_content');
      table.text('hashtag');
      table.boolean('for_sale');
      table.integer('price');
      table.integer('likes');
      table.text('comments');
      table.string('user_id');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('user_table'),
    knex.schema.dropTableIfExists('work')
  ])
};
