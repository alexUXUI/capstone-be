
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
      table.integer('likes').defaultTo(1);
      table.text('comments');
      table.integer('user_id').references('id').inTable('user_table').onDelete('CASCADE');
    }),
    knex.schema.createTableIfNotExists('comments', function(table){
      table.increments('id').primary();
      table.text('text');
      table.integer('user');
      table.integer('work_id').references('id').inTable('work').onDelete('CASCADE');
    }),
    knex.schema.createTableIfNotExists('likes', function(table){
      table.increments('id');
      table.integer('work_id');
      table.integer('user_id').references('id').inTable('user_table').onDelete('CASCADE');
    }),
    knex.schema.createTableIfNotExists('hashtag', function(table){
      table.increments('id').primary();
      table.text('hashtag');
      table.integer('user');
      table.integer('work_id').references('id').inTable('work').onDelete('CASCADE');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('user_table'),
    knex.schema.dropTableIfExists('work'),
    knex.schema.dropTableIfExists('comments'),
    knex.schema.dropTableIfExists('likes'),
    knex.schema.dropTableIfExists('hashtag')
  ]);
};
