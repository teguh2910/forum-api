const ShowThreadUseCase = require('../ShowThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('ShowThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the show thread action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-123';
    const expectedThread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      username: 'user-123',
      date: '2021-08-08T07:26:17.018Z',
    };
    const expectedComments = [
      {
        id: 'comment-123',
        username: 'user-123',
        date: '2021-08-08T07:26:17.018Z',
        content: 'Comment Content',
        is_delete: false,
      },
      {
        id: 'comment-124',
        username: 'user-123',
        date: '2021-08-08T07:26:17.018Z',
        content: 'Comment Content 2',
        is_delete: true,
      },
    ];
    const expectedShownThread = {
      ...expectedThread,
      comments: expectedComments,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));

    /** creating use case instance */
    const showThreadUseCase = new ShowThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const shownThread = await showThreadUseCase.execute(useCasePayload);

    // Assert
    expect(shownThread).toStrictEqual(expectedShownThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload);
  });
});
