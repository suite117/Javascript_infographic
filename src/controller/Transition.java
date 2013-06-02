package controller;

public class Transition {

	private State state;
	private State prevState;
	
	public Transition(State prevState, State state) {
		setState(state);
		setPrevState(prevState);
	}
	
	
	public State getPrevState() {
		return prevState;
	}
	public void setPrevState(State prevState) {
		this.prevState = prevState;
	}
	public State getState() {
		return state;
	}
	
	public void setState(State state) {
		this.prevState = this.state;
		this.state = state;
	}
	
}
