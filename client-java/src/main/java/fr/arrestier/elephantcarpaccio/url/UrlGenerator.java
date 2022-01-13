package fr.arrestier.elephantcarpaccio.url;

import org.springframework.stereotype.Component;

import java.net.URI;

@Component
public class UrlGenerator {
    // TODO move these in property file
    private final static String PROTOCOL = "http";
    private final static String HOST = "localhost";
    private final static int PORT = 3000;
    private final static String SUB_DOMAIN = "team";

    public URI getUrl() {
        return URI.create(PROTOCOL + "://" + HOST + ":" + PORT + "/" + SUB_DOMAIN);
    }
}
