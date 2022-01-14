package fr.arrestier.elephantcarpaccio.socket;

import fr.arrestier.elephantcarpaccio.cart.CartEventListener;
import fr.arrestier.elephantcarpaccio.invoice.InvoiceEventListener;
import fr.arrestier.elephantcarpaccio.url.UrlGenerator;
import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Component;

@EnableAsync
@Component
public class SocketListener {
    private final static String AUTH_EVENT = "auth";

    @Autowired
    private UrlGenerator urlGenerator;
    @Value("${name}")
    private String name;

    // TODO implement a timeout to auto kill connection
    private Socket socket;

    public void listen() {
        socket = IO.socket(urlGenerator.getUrl());
        socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                System.out.println("Connected to server!");
            }
        });

        socket.on(CartEventListener.CART_EVENT, new CartEventListener(socket));
        socket.on(InvoiceEventListener.INVOICE_EVENT, new InvoiceEventListener());
        socket.connect();
        this.authenticate();
    }

    // TODO make it a handshake instead of emitting an event
    private void authenticate() {
        socket.emit("auth", name);
    }
}
