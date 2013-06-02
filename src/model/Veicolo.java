package model;
import java.io.Serializable;


public class Veicolo implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer id;
	private String veicolo;
	private Integer tipoVeicolo;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getVeicolo() {
		return veicolo;
	}
	public void setVeicolo(String veicolo) {
		this.veicolo = veicolo;
	}
	public Integer getTipoVeicolo() {
		return tipoVeicolo;
	}
	public void setTipoVeicolo(Integer tipoVeicolo) {
		this.tipoVeicolo = tipoVeicolo;
	}
	

}
