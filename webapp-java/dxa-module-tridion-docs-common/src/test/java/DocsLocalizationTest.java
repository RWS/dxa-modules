import com.sdl.dxa.modules.docs.localization.DocsLocalization;
import org.junit.Test;

public class DocsLocalizationTest {
    @Test
    public void testLocalization() {
        DocsLocalization docsLocalization = new DocsLocalization();
        System.out.println(docsLocalization.getCmUriScheme());
    }
}
