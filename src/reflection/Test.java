package reflection;

import java.lang.reflect.Method;

public class Test {
	public static void main(String[] args) {

		Class<?> c = null;

		try {
			c = Class.forName("model.User");
			Method listaMetodi[] = c.getDeclaredMethods();

			for (int i = 0; i < listaMetodi.length; i++) {
				Method currentMethod = listaMetodi[i];
				
				// Nome e Modificatore del Metodo
				System.out.println("Nome: " + currentMethod.getName());
			}

		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}
