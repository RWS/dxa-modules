package com.sdl.dxa.modules.ugc;

import com.sdl.delivery.ugc.client.comment.UgcCommentApi;
import com.sdl.delivery.ugc.client.comment.UgcVoteCommentApi;
import com.sdl.delivery.ugc.client.comment.impl.SimpleCommentsFilter;
import com.sdl.dxa.modules.ugc.data.Comment;
import com.sdl.dxa.modules.ugc.data.User;
import com.sdl.web.ugc.Status;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.util.TcmUtils;
import com.tridion.ambientdata.AmbientDataContext;
import com.tridion.ambientdata.claimstore.ClaimStore;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.DayOfWeek;
import java.time.Month;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

@Service
@Slf4j
public class UgcService {

    private static final int maximumThreadsDepth = -1;
    private final WebRequestContext webRequestContext;

    @Autowired
    private UgcCommentApi ugcCommentApi;

    @Autowired
    private UgcVoteCommentApi ugcVoteCommentApi;

    @Autowired
    public UgcService(WebRequestContext webRequestContext) {
        this.webRequestContext = webRequestContext;
    }

    /**
     * @param publicationId
     * @param pageId
     * @param descending
     * @param statuses
     * @param top
     * @param skip
     * @return List of Comments
     */
    public List<Comment> getComments(int publicationId, int pageId, boolean descending, List<Integer> statuses, int top, int skip) {
        final List<Status> statusStatuses = new ArrayList<>();
        statuses.stream().forEach(status -> {
            statusStatuses.add(Status.getStatusForId(status));
        });
        final SimpleCommentsFilter filter = new SimpleCommentsFilter()
                .withTop(top)
                .withSkip(skip)
                .withDepth(maximumThreadsDepth)
                .withStatuses(statusStatuses);

        return convert(ugcCommentApi.retrieveThreadedComments(TcmUtils.buildPageTcmUri(publicationId, pageId), filter, descending, true));
    }

    /**
     * @param publicationId
     * @param pageId
     * @param username
     * @param email
     * @param content
     * @param parentId
     * @param metadata
     * @return Comment
     */
    public Comment postComment(int publicationId, int pageId, String username, String email, String content,
                               int parentId, Map<String, String> metadata) {

        try {
            final ClaimStore claimStore = AmbientDataContext.getCurrentClaimStore();
            if (claimStore != null) {
                claimStore.put(new URI("taf:claim:contentdelivery:webservice:user"), username);
                claimStore.put(new URI("taf:claim:contentdelivery:webservice:post:allowed"), true);
            }
        } catch (URISyntaxException e) {
            log.error("Error while Storing Claims", e);
        }
        return convert(
                ugcCommentApi.postComment(TcmUtils.buildPageTcmUri(publicationId, pageId), username, email, content, parentId, metadata));
    }

    /**
     * @param commentId
     */
    public void upVoteComment(long commentId) {
        ugcVoteCommentApi.voteCommentUp(commentId);
    }

    /**
     * @param commentId
     */
    public void downVoteComment(long commentId) {
        ugcVoteCommentApi.voteCommentDown(commentId);
    }


    private List<Comment> convert(List<com.sdl.delivery.ugc.client.odata.edm.Comment> comments) {
        final List<Comment> convertedComments = new ArrayList<>();
        comments.stream().forEach(comment -> {
            convertedComments.add(convert(comment));
        });

        return convertedComments;
    }

    private Comment convert(com.sdl.delivery.ugc.client.odata.edm.Comment comment) {
        if (comment == null) {
            return null;
        }
        final Comment c = new Comment();
        c.setId(comment.getIdLong());
        c.setParentId(comment.getParent().getIdLong());
        c.setItemId(comment.getItemId());
        c.setItemType(comment.getItemType());
        c.setItemPublicationId(comment.getItemPublicationId());
        c.setContent(comment.getContent());
        c.setRating(comment.getScore());
        c.setMetadata(comment.getMetadata());
        if (comment.getUser() != null) {
            c.setUser(convert(comment.getUser()));
        }
        if (comment.getCreationDate() != null) {
            c.setCreationDate(convert(comment.getCreationDate()));
        }
        return c;
    }

    private Comment.CommentDate convert(ZonedDateTime creationDate) {
        final Comment.CommentDate commentDate = new Comment.CommentDate();
        final DateTime dt = new DateTime(
                creationDate.toInstant().toEpochMilli(),
                DateTimeZone.forTimeZone(TimeZone.getTimeZone(creationDate.getZone())));
        commentDate.setDateTime(dt);
        commentDate.setDayOfMonth(dt.getMonthOfYear());
        commentDate.setDayOfWeek(DayOfWeek.of(dt.getDayOfWeek()).name());
        commentDate.setDayOfYear(dt.getDayOfYear());
        commentDate.setMonth(Month.of(dt.getMonthOfYear()).name());
        commentDate.setMonthValue(dt.getMonthOfYear());
        commentDate.setYear(dt.getYear());
        commentDate.setHour(dt.getHourOfDay());
        commentDate.setMinute(dt.getMinuteOfHour());
        commentDate.setSecond(dt.getSecondOfMinute());
        commentDate.setNano(dt.getMillisOfSecond());

        return commentDate;

    }

    private User convert(com.sdl.delivery.ugc.client.odata.edm.User user) {
        final User u = new User();
        u.setId(user.getId());
        u.setExternalId(user.getExternalId());
        u.setName(user.getName());
        u.setEmailAddress(user.getEmailAddress());
        return u;
    }

}
