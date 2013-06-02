package model;

import java.io.Serializable;
import java.util.List;

public class Persona implements Serializable {
	private Integer id;
	private String nome;
	private List<Integer> datanascita;
	private List<Integer> datamorte;
	private String immagine;

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public List<Integer> getDatanascita() {
		return datanascita;
	}

	public void setDatanascita(List<Integer> datanascita) {
		this.datanascita = datanascita;
	}

	public List<Integer> getDatamorte() {
		return datamorte;
	}

	public void setDatamorte(List<Integer> datamorte) {
		this.datamorte = datamorte;
	}

	private static final long serialVersionUID = 1L;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getImmagine() {
		return immagine;
	}

	public void setImmagine(String image) {
		this.immagine = image;
	}

	@Override
	public String toString() {
		return this.id + " " + this.nome;
	}
}