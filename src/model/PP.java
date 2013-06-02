package model;

import java.util.List;

public class PP {

	private Integer id;
	private String nome;
	private List<Integer> datanascita;
	private List<Integer> datamorte;
	private String immagine;
	private List<Integer> start;
	private List<Integer> end;
	private Double lat;
	private Double lon;
	private Integer idEventType;
	private Integer idEvento;
	private String nomeEvento;
	private Integer idPersona;
	private Integer idTipoRuolo;
	private Integer idPericolosita;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
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
	public String getImage() {
		return immagine;
	}
	public void setImage(String image) {
		this.immagine = image;
	}
	
	public Double getLat() {
		return lat;
	}
	public void setLat(Double lat) {
		this.lat = lat;
	}
	public Double getLon() {
		return lon;
	}
	public void setLon(Double lon) {
		this.lon = lon;
	}
	public Integer getIdEventType() {
		return idEventType;
	}
	public void setIdEventType(Integer idEventType) {
		this.idEventType = idEventType;
	}
	public Integer getIdEvento() {
		return idEvento;
	}
	public void setIdEvento(Integer idEvento) {
		this.idEvento = idEvento;
	}
	public Integer getIdPersona() {
		return idPersona;
	}
	public void setIdPersona(Integer idPersona) {
		this.idPersona = idPersona;
	}
	public Integer getIdTipoRuolo() {
		return idTipoRuolo;
	}
	public void setIdTipoRuolo(Integer idTipoRuolo) {
		this.idTipoRuolo = idTipoRuolo;
	}
	public Integer getIdPericolosita() {
		return idPericolosita;
	}
	public void setIdPericolosita(Integer idPericolosita) {
		this.idPericolosita = idPericolosita;
	}
	public String getNomeEvento() {
		return nomeEvento;
	}
	public void setNomeEvento(String nomeEvento) {
		this.nomeEvento = nomeEvento;
	}
	public List<Integer> getEnd() {
		return end;
	}
	public void setEnd(List<Integer> end) {
		this.end = end;
	}
	public List<Integer> getStart() {
		return start;
	}
	public void setStart(List<Integer> start) {
		this.start = start;
	}
	
	public String toString() {
		return getId() + " " + getNome() + " " + getIdEvento();
	}
}
