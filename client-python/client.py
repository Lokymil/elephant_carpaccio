import socketio
from invoice.invoice import generate_invoice
from cart.cart import Cart
from config import socket


class NameSpacedSocket(socketio.ClientNamespace):
    def on_connect(self):
        print("Connected with id : " + self.client.sid)
        self.emit("auth", socket["name"])

    def on_disconnect(self):
        print("Disconnect")

    def on_cart(self, data):
        cart = Cart(data["prices"], data["quantities"],
                    data["country"], data["reduction"])
        invoice = generate_invoice(cart)
        self.emit("invoice", invoice)

    def on_invoice(self, data):
        print(data)


sio = socketio.Client()

sio.register_namespace(NameSpacedSocket('/team'))

sio.connect("http://" + socket["host"]+":3000")
