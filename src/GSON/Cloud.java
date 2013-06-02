package GSON;

import java.util.List;

import model.PP;

public class Cloud {
	private int id;
	private String name;
	private List<PP> elements;
	private String domain;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<PP> getElements() {
		return elements;
	}
	public void setElements(List<PP> personePartecipanti) {
		this.elements = personePartecipanti;
	}
	public String getDomain() {
		return domain;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	
}
