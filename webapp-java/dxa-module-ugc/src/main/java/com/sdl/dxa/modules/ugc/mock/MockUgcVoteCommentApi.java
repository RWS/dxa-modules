package com.sdl.dxa.modules.ugc.mock;

import com.sdl.delivery.ugc.client.comment.UgcVoteCommentApi;

/**
 * <p>Dummy implementation,  to  be replaced by an  actual one in  the ugc-client-api</p>
 */
public class MockUgcVoteCommentApi implements UgcVoteCommentApi {
    /**
     * <p>Upvotes a comment, using the comment Id</p>
     *
     * @param id Comment Id
     */
    @Override
    public void voteCommentUp(long id) {
    }

    /**
     * <p>Downvotes a comment, using the comment Id</p>
     *
     * @param id Comment Id
     */
    @Override
    public void voteCommentDown(long id) {
    }
}
