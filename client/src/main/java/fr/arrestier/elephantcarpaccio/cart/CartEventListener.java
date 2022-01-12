package fr.arrestier.elephantcarpaccio.cart;

import fr.arrestier.elephantcarpaccio.invoice.InvoiceEventListener;
import fr.arrestier.elephantcarpaccio.invoice.InvoiceGenerator;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import org.json.JSONObject;

public class CartEventListener implements Emitter.Listener {
    public final static String CART_EVENT = "cart";

    private Socket socket;

    public CartEventListener(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void call(Object... objects) {
        Cart cart = new Cart((JSONObject) objects[0]);
        String invoice = InvoiceGenerator.getInvoiceFromCart(cart);

        System.out.println("Generated invoice : " + invoice);
        socket.emit(InvoiceEventListener.INVOICE_EVENT, invoice);
    }
}
