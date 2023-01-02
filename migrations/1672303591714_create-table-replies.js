/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('replies', {
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
    comment_id: {
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
  pgm.addConstraint('replies', 'fk_replies.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  // set foreign key constraints on comment_id column to id from comments table
  pgm.addConstraint('replies', 'fk_replies.comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // drop constraint fk_replies.owner_users.id from replies table
  pgm.dropConstraint('replies', 'fk_replies.owner_users.id');

  // drop constraint fk_replies.comment_id_comments.id from replies table
  pgm.dropConstraint('replies', 'fk_replies.comment_id_comments.id');

  pgm.dropTable('replies');
};
