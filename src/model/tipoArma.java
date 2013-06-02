package model;
import java.io.Serializable;


public class tipoArma implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer id;
	private String tipoArma;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getTipoArma() {
		return tipoArma;
	}
	public void setTipoArma(String tipoArma) {
		this.tipoArma = tipoArma;
	}
	

}
