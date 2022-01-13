package fr.arrestier.elephantcarpaccio.invoice;

import io.socket.emitter.Emitter;

public class InvoiceEventListener implements Emitter.Listener {
    public final static String INVOICE_EVENT = "invoice";

    @Override
    public void call(Object... objects) {
        String result = (String) objects[0];
        System.out.println("Result : " + result);
    }
}
