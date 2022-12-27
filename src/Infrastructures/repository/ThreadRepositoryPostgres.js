const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, body, owner',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new CreatedThread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
