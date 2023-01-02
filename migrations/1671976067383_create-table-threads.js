exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // set foreign key constraints on owner column to id from users table
  // format: fk_<tabel foreign key>.<kolom foreign key>_<tabel primary key>.<kolom primary key>
  pgm.addConstraint('threads', 'fk_threads.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // drop constraint fk_threads.owner_users.id from threads table
  pgm.dropConstraint('threads', 'fk_threads.owner_users.id');

  pgm.dropTable('threads');
};
