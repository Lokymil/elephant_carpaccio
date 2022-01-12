package fr.arrestier.elephantcarpaccio.socket;

import fr.arrestier.elephantcarpaccio.url.UrlGenerator;
import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Component;

@EnableAsync
@Component
public class SocketListener {
    @Autowired
    private UrlGenerator urlGenerator;

    private Socket socket;

    public void listen() {
        socket = IO.socket(urlGenerator.getUrl());
        socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                System.out.println("Connected to server!");
            }
        });
        socket.connect();
    }
}
