package com.sdl.dxa.modules.ugc.mock;

import com.sdl.delivery.ugc.client.comment.UgcVoteCommentApi;

public class MockUgcVoteCommentApi implements UgcVoteCommentApi {
    /**
     * @param id Comment Id
     */
    @Override
    public void voteCommentUp(long id) {
    }

    /**
     * @param id Comment Id
     */
    @Override
    public void voteCommentDown(long id) {
    }
}
