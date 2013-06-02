package model;

import java.util.List;

public class Tempo {
	private int idTempo;
	private List<Integer> start;
	private List<Integer> end;
	private String nome;

	public List<Integer> getStart() {
		return start;
	}

	public void setStart(List<Integer> start) {
		this.start = start;
	}

	public List<Integer> getEnd() {
		return end;
	}

	public void setEnd(List<Integer> end) {
		this.end = end;
	}

	public int getIdTempo() {
		return idTempo;
	}

	public void setIdTempo(int idTempo) {
		this.idTempo = idTempo;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}
}
