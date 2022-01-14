package fr.arrestier.elephantcarpaccio.url;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;

@Component
public class UrlGenerator {

    @Value("${host}")
    private String host;

    public URI getUrl() {
        return URI.create("http://" + host + ":3000/team");
    }
}
