package model;
import java.io.Serializable;


public class GerarchiaEvento implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer id;
	private String tipo;
	private Integer idGenitore;
	private Integer profondita;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public Integer getIdGenitore() {
		return idGenitore;
	}
	public void setIdGenitore(Integer idGenitore) {
		this.idGenitore = idGenitore;
	}
	public Integer getProfondita() {
		return profondita;
	}
	public void setProfondita(Integer profondita) {
		this.profondita = profondita;
	}

}
