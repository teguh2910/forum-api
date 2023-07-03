class ShowThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload);
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload);
    const validatedComments = this._validateDeletedComment(comments);
    return {
      ...thread,
      comments: comments,
    };
  }

  _validateDeletedComment(comments) {
    // eslint-disable-next-line no-restricted-syntax
    for (const comment of comments) {
      if (comment.is_delete) {
        comment.content = '**komentar telah dihapus**';
      }
      delete comment.is_delete;
    }
    return comments;
  }

  _validateDeletedReply(replies) {
    // eslint-disable-next-line no-restricted-syntax
    for (const reply of replies) {
      if (reply.is_delete) {
        reply.content = '**balasan telah dihapus**';
      }
      delete reply.is_delete;
    }
    return replies;
  }
}

module.exports = ShowThreadUseCase;
