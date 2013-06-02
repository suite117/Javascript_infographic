<p>
	<a href="${pageContext.request.contextPath}/user/list">Lista utenti</a>
</p>

<form id="user-form" action="${pageContext.request.contextPath}/user/${state}/${user.id}"
	method="POST">
	<input id="prevState" name="prevState" type="hidden" value="${prevState}" />
	<fieldset>
		<legend>Your details</legend>
		<ol>
			<li>
				<label for="username">Username*</label>
				<input id="username" name="username" type="text" value="${user.username}"
					placeholder="Type an username" required autofocus />
			</li>
			<li>
				<label for="password">Password*</label>
				<input id="password" name="password" type="text" value="${user.password}"
					placeholder="Type a Password" required autofocus />
			</li>
			<li>
				<label for="email">Email</label>
				<input id="email" name="email" type="email" value="${user.email}"
					placeholder="example@domain.com" required />
				<p class="validation validation-email">
					<span class="invalid">Please enter a valid email address e.g. example@domain.com</span>
					<span class="valid">Thank you for entering a valid email</span>
				</p>
			</li>
		</ol>
	</fieldset>


	<fieldset>
		<legend>Delivery address</legend>
		<ol>
			<li>
				<label for=address>Address</label>
				<textarea id="address" name="address" rows=5 required></textarea>
			</li>
			<li>
				<label for=postcode>Post code</label>
				<input id=postcode name=postcode type=text required>
			</li>
			<li>
				<label for=country>Country</label>
				<input id=country name=country type=text required>
			</li>
		</ol>
	</fieldset>

	<fieldset>
		<legend>Card details</legend>
		<ol>
			<li>
				<fieldset>
					<legend>Card type</legend>
					<ol>
						<li>
							<input id=visa name=cardtype type=radio>
							<label for=visa>VISA</label>
						</li>
						<li>
							<input id=amex name=cardtype type=radio>
							<label for=amex>AmEx</label>
						</li>
						<li>
							<input id=mastercard name=cardtype type=radio>
							<label for=mastercard>Mastercard</label>
						</li>
					</ol>
				</fieldset>
			</li>
			<li>
				<label for=cardnumber>Card number</label>
				<input id=cardnumber name=cardnumber type=number required>
			</li>
			<li>
				<label for=secure>Security code</label>
				<input id=secure name=secure type=number required>
			</li>
			<li>
				<label for=namecard>Name on card</label>
				<input id=namecard name=namecard type=text placeholder="Exact name as on the card" required>
			</li>
		</ol>
	</fieldset>


	<fieldset>
		<button type="submit">${state}</button>
	</fieldset>
</form>