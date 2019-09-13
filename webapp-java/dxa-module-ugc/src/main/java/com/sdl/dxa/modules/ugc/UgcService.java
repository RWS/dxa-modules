package com.sdl.dxa.modules.ugc;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sdl.delivery.ugc.client.comment.UgcCommentApi;
import com.sdl.delivery.ugc.client.comment.impl.SimpleCommentsFilter;
import com.sdl.dxa.modules.ugc.data.Comment;
import com.sdl.dxa.modules.ugc.data.User;
import com.sdl.dxa.modules.ugc.exceptions.CannotFetchCommentsException;
import com.sdl.dxa.modules.ugc.exceptions.CannotProcessCommentException;
import com.sdl.dxa.modules.ugc.model.JsonZonedDateTime;
import com.sdl.dxa.performance.Performance;
import com.sdl.web.ugc.Status;
import com.sdl.webapp.common.util.TcmUtils;
import com.tridion.ambientdata.AmbientDataContext;
import com.tridion.ambientdata.claimstore.ClaimStore;
import com.tridion.ambientdata.web.WebContext;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

/**
 * <p>Service providing methods to  create and retrieve comments</p>
 */
@Service
@Slf4j
public class UgcService {

    private static final int maximumThreadsDepth = -1;

    @Autowired
    private UgcCommentApi ugcCommentApi;

    //Todo: use UgcVoteCommentApi implementation when it becomes available

    @Autowired
    public UgcService() {
    }

    /**
     * retrieves a list of {@link Comment}  items for a given page
     *
     * @param publicationId Publication Id
     * @param pageId        Page Id
     * @param descending    Order
     * @param statuses      Limit to specific statuses
     * @param top           maximum number of comments to show
     * @param skip          number of comments to skip
     * @return List of {@link Comment}
     */
    public List<Comment> getComments(int publicationId, int pageId, boolean descending, Integer[] statuses, int top, int skip) {
        final List<Status> statusStatuses = new ArrayList<>();
        Arrays.stream(statuses).forEach(status -> statusStatuses.add(Status.getStatusForId(status)));
        final SimpleCommentsFilter filter = new SimpleCommentsFilter()
                .withTop(top)
                .withSkip(skip)
                .withDepth(maximumThreadsDepth)
                .withStatuses(statusStatuses);

        String pageTcmUri = TcmUtils.buildPageTcmUri(publicationId, pageId);
        try (Performance perf = new Performance(1_000L, "getComments stream")) {
            return convert(ugcCommentApi.retrieveThreadedComments(pageTcmUri, filter, descending, true));
        } catch (Exception ex) {
            throw new CannotFetchCommentsException("Cannot fetch comments for " + pageTcmUri, ex);
        }
    }

    /**
     * Post {@link Comment} for a given page
     *
     * @param publicationId Publication Id
     * @param pageId        Page Id
     * @param username      User name
     * @param email         Email address
     * @param content       Post content
     * @param parentId      parent
     * @param metadata      Meta data
     * @return {@link Comment}
     */
    public Comment postComment(int publicationId, int pageId, @NotNull String username, String email, String content,
                               int parentId, Map<String, String> metadata) {
        if (publicationId <= 0 || pageId <= 0) {
            log.warn("Cannot post comment for negative or zero publicationId {} or pageId {}", publicationId, pageId);
            throw new CannotProcessCommentException("Cannot post comment for negative publicationId/pageId");
        }
        try {
            final ClaimStore claimStore = AmbientDataContext.getCurrentClaimStore();
            if (claimStore != null) {
                claimStore.put(new URI("taf:claim:contentdelivery:webservice:user"), username);
                claimStore.put(new URI("taf:claim:contentdelivery:webservice:post:allowed"), true);
            } else {
                throw new IllegalStateException("No claimstore");
            }
            WebContext.setCurrentClaimStore(claimStore);
        } catch (URISyntaxException e) {
            log.error("Error while adding Claims for user " + username, e);
        }
        String pageTcmUri = TcmUtils.buildPageTcmUri(publicationId, pageId);
        try {
            return convert(ugcCommentApi.postComment(pageTcmUri, username, email, content, parentId, metadata));
        } catch (Exception ex) {
            throw new CannotProcessCommentException("Cannot post comment for " + pageTcmUri, ex);
        }
    }

    private List<Comment> convert(List<com.sdl.delivery.ugc.client.odata.edm.Comment> comments) {
        final List<Comment> convertedComments = new ArrayList<>();
        comments.forEach(comment -> convertedComments.add(convert(comment)));

        return convertedComments;
    }

    private Comment convert(com.sdl.delivery.ugc.client.odata.edm.Comment comment) {
        if (comment == null) {
            throw new CannotProcessCommentException("Comment cannot be converted: " + comment);
        }
        final Comment c = new Comment();
        c.setId(comment.getIdLong());
        if (comment.getParent() != null) {
            c.setParentId(comment.getParent().getIdLong());
        }
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
            c.setCreationDateTime(convert(comment.getCreationDate()));
            try {
                c.setCreationDate(new JsonZonedDateTime(c.getCreationDateTime()).getJson());
            } catch (JsonProcessingException e) {
               log.error("Cannot serialize to Json " + c.getCreationDateTime(), e);
            }
        }
        if (comment.getLastModifiedDate() != null) {
            c.setLastModifiedDateTime(convert(comment.getLastModifiedDate()));
            try {
                c.setLastModifiedDate(new JsonZonedDateTime(c.getLastModifiedDateTime()).getJson());
            } catch (JsonProcessingException e) {
                log.error("Cannot serialize to Json " + c.getLastModifiedDateTime(), e);
            }
        }
        c.setChildren(convert(comment.getChildren()));

        return c;
    }

    /**
     * Converts joda ZonedDateTime to util DateTime.
     * @param zonedDateTime
     * @return
     */
    public DateTime convert(ZonedDateTime zonedDateTime) {
        return new DateTime(zonedDateTime.toInstant().toEpochMilli(),
                DateTimeZone.forTimeZone(TimeZone.getTimeZone(zonedDateTime.getZone())));
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
