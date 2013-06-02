package reflection;

import java.lang.reflect.Field;

public class TestFields {
	public static void main(String[] args) {

		Class<?> c = null;

		try {
			c = Class.forName("model.User");
		
			Field[] declaredFields = c.getDeclaredFields();
			
			for (int i = 0; i < declaredFields.length; i++) {
				Field field = declaredFields[i];
				
				System.out.println("Nome: " + field.getType().getSimpleName() + " " + field.getName());
			}

		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}
