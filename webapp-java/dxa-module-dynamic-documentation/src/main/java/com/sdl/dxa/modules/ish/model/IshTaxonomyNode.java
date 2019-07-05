package com.sdl.dxa.modules.ish.model;

import com.sdl.webapp.common.api.model.entity.SitemapItem;
import com.sdl.webapp.common.api.model.entity.TaxonomyNode;
import org.jetbrains.annotations.Nullable;
import org.springframework.util.comparator.NullSafeComparator;

import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Overwrites default Taxonomy Node.
 * Needed to overwrite sorting (which was done by title).
 */
public class IshTaxonomyNode extends TaxonomyNode {

    private static final Pattern TOC_KEYWORD_ID = Pattern.compile("t\\d+-k(\\d+)");

    private static final Comparator<SitemapItem> SITEMAP_SORT_BY_ID = new NullSafeComparator<>(
            new Comparator<SitemapItem>() {
                @Override
                public int compare(SitemapItem o1, SitemapItem o2) {
                    Matcher matcher1 = TOC_KEYWORD_ID.matcher(o1.getId());
                    Matcher matcher2 = TOC_KEYWORD_ID.matcher(o2.getId());
                    if (matcher1.find() && matcher2.find()) {
                        Long keywordId1 = Long.valueOf(matcher1.group(1));
                        Long keywordId2 = Long.valueOf(matcher2.group(1));
                        return keywordId1.compareTo(keywordId2);
                    } else {
                        return o1.getId().compareTo(o2.getId());
                    }
                }
            }, true);

    @Override
    protected Set<SitemapItem> wrapItems(@Nullable Set<SitemapItem> items) {
        TreeSet<SitemapItem> treeSet = new TreeSet<>(SITEMAP_SORT_BY_ID);
        if (items != null) {
            treeSet.addAll(items);
        }
        return treeSet;
    }
}
