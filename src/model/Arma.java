package model;
import java.io.Serializable;


public class Arma implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer id;
	private Integer idTipo;
	private String nomeArma;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getIdTipo() {
		return idTipo;
	}
	public void setIdTipo(Integer idTipo) {
		this.idTipo = idTipo;
	}
	public String getNomeArma() {
		return nomeArma;
	}
	public void setNomeArma(String nomeArma) {
		this.nomeArma = nomeArma;
	}

}
