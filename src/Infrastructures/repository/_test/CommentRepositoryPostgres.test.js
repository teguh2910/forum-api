const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist create comment and return created comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' }); // add user with id user-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); // add thread with id thread-123
      const createComment = new CreateComment({
        content: 'Comment content',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdComment = await commentRepositoryPostgres.createComment(createComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(createdComment.id);
      expect(comments).toHaveLength(1);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment not found', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyCommentIsExist('hello-world'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw UnauthorizedError when provided userId is not the comment owner', async () => {
      // Arrange
      const commentId = 'comment-123';
      const userId = 'user-123';
      const wrongUserId = 'user-456';
      await UsersTableTestHelper.addUser({ id: userId }); // add user with id user-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); // add thread with id thread-123
      await CommentsTableTestHelper.addComment({ id: commentId }); // add comment with id comment-123
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      expect(commentRepositoryPostgres.verifyCommentOwner(commentId, wrongUserId))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should verify the comment owner correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId }); // add user with id user-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); // add thread with id thread-123
      await CommentsTableTestHelper.addComment({ id: commentId }); // add comment with id comment-123
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment not found', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.deleteCommentById('hello-world'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should delete comment by id and return success correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' }); // add user with id user-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); // add thread with id thread-123
      await CommentsTableTestHelper.addComment({ id: commentId }); // add comment with id comment-123
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });
});
