package fr.arrestier.elephantcarpaccio.cart;

import fr.arrestier.elephantcarpaccio.invoice.InvoiceGenerator;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import org.json.JSONObject;

public class CartEventListener implements Emitter.Listener {
    public final static String CART_EVENT = "cart";
    private final static String INVOICE_EVENT = "invoice";

    private Socket socket;

    public CartEventListener(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void call(Object... objects) {
        Cart cart = new Cart((JSONObject) objects[0]);
        String invoice = InvoiceGenerator.getInvoiceFromCart(cart);

        socket.emit(INVOICE_EVENT, invoice);
    }
}
