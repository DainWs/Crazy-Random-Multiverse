package com.dainws.games.crm.console.controllers;

import java.io.Closeable;
import java.io.IOException;
import java.util.Scanner;

import org.springframework.stereotype.Component;

@Component
public class Console implements Closeable {
	
	private Scanner scanner;
	
	public Console() {
		this.scanner = new Scanner(System.in);
	}

	public void show(String text) {
		System.out.println(text);
	}

	public String ask(String question) {
		System.out.print(question);
		return this.scanner.nextLine();
	}

	public int select(String... options) {
		int selected = -1;
		while(selected <= -1) {
			try {
				this.showOptions(options);
				selected = this.scanner.nextInt();
			} catch (Exception e) {
				this.scanner.next();
				selected = -1;
			}
		}

		return selected;
	}
	
	private void showOptions(String[] options) {
		this.show("");
		this.show("");
		this.show("");
		this.show("============================");
		for (int i = 0; i < options.length; i++) {
			this.show("["+i+"] "+options[i]);
		}
		this.show("============================");
	}
	
	@Override
	public void close() throws IOException {
		this.scanner.close();	
	}
	
}
