package fr.arrestier.elephantcarpaccio.socket;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Component;

import java.net.URI;

@EnableAsync
@Component
public class SocketListener {
    private Socket socket;

    public void listen() {
        socket = IO.socket(URI.create("http://localhost:3000/team"));
        socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                System.out.println("Connected to server!");
            }
        });
        socket.connect();
    }
}
