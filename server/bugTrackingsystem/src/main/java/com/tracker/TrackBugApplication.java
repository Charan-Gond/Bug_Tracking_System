package com.tracker;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TrackBugApplication {

	public static void main(String[] args) {

		Dotenv d= Dotenv.load();
		d.entries().forEach(e->
				System.setProperty(e.getKey(),e.getValue())
		);

		SpringApplication.run(
				TrackBugApplication.class, args);
	}



}
