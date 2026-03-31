/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
                .createTable('users', table => {
                    table.increments('id').primary();
                    table.string('username').unique().notNullable();
                    table.string('password_hash').notNullable();
                    table.string('role').defaultTo('user');
                    table.boolean('can_create').defaultTo(true);
                    table.boolean('can_edit').defaultTo(true);
                    table.boolean('can_delete').defaultTo(true);
                    table.timestamp('created_at').defaultTo(knex.fn.now());
                })
                .createTable('postits', table => {
                    table.increments('id').primary();
                    table.text('text').notNullable();
                    table.decimal('x').notNullable();
                    table.decimal('y').notNullable();
                    table.timestamp('created_at').defaultTo(knex.fn.now());
                    table.string('color').defaultTo('#FFE566');
                    table.integer('user_id').unsigned().notNullable();
                    table.boolean('modified').defaultTo(false);
                    table.string('modified_by');
                    table.timestamp('modified_at');
                    table.integer('zindex').defaultTo(1);
                    table.foreign('user_id').references('users.id').onDelete('CASCADE');
                });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('postits')
                      .dropTableIfExists('users');
  
};
