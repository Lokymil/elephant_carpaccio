package fr.arrestier.elephantcarpaccio.invoice;

import io.socket.emitter.Emitter;
import org.json.JSONObject;

public class CartEventListener implements Emitter.Listener {
    public final static String CART_EVENT = "cart";

    @Override
    public void call(Object... objects) {
        Cart cart = new Cart((JSONObject) objects[0]);
        System.out.println("Received message !");
    }
}
