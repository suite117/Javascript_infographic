<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<table id="user-table" class="tablesorter">
	<tr>
		<th>Id</th>
		<th>Username</th>
		<th>Password</th>
		<th>Email</th>
		<th colspan="2">Operazioni</th>
	</tr>
	<c:forEach var="user" items="${users}" varStatus="status">
		<tr>
			<td><c:out value="${user.id}" /></td>
			<td><c:out value="${user.username}" /></td>
			<td><c:out value="${user.password}" /></td>
			<td><c:out value="${user.email}" /></td>
			<td><a href="${pageContext.request.contextPath}/user/edit/${user.id}">Modifica</a></td>
			<td><a href="${pageContext.request.contextPath}/user/delete/${user.id}">Elimina</a></td>
		</tr>
	</c:forEach>
</table>

<p>
	<a href="${pageContext.request.contextPath}/user/add">Aggiungi utente</a>
</p>