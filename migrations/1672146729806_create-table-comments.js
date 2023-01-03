exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
  });

  // set foreign key constraints on owner column to id from users table
  // format: fk_<tabel foreign key>.<kolom foreign key>_<tabel primary key>.<kolom primary key>
  pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  // set foreign key constraints on thread_id column to id from threads table
  pgm.addConstraint('comments', 'fk_comments.thread_id_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // drop constraint fk_comments.owner_users.id from comments table
  pgm.dropConstraint('comments', 'fk_comments.owner_users.id');

  // drop constraint fk_comments.thread_id_threads.id from comments table
  pgm.dropConstraint('comments', 'fk_comments.thread_id_threads.id');

  pgm.dropTable('comments');
};
