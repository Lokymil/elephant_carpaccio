package fr.arrestier.elephantcarpaccio;

import fr.arrestier.elephantcarpaccio.socket.SocketListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class ElephantCarpaccioApplication {
	@Autowired
	private SocketListener socketListener;

	public static void main(String[] args) {
		SpringApplication.run(ElephantCarpaccioApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void run() {
		socketListener.listen();
	}
}
