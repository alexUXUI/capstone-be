
exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.createTableIfNotExists('user_table', function(table){
      table.increments('id').primary();
      table.string('oauthid');
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.string('user_image');
    }),
    knex.schema.createTableIfNotExists('work', function(table){
      table.increments('id').primary();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.string('title');
      table.text('text_content');
      table.text('image_content');
      table.text('hashtag');
      table.boolean('for_sale');
      table.integer('price');
      table.integer('likes');
      table.text('comments');
      table.integer('user_id').references('id').inTable('user_table').onDelete('CASCADE');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('user_table'),
    knex.schema.dropTableIfExists('work'),
  ]);
};
