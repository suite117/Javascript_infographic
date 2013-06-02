<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<div>
	<!-- <a href="${pageContext.request.contextPath}"> <img
			src="${pageContext.request.contextPath}/resources/logo.png" />
	</a>
	 -->
</div>
<nav>
	<!-- Navigation -->
	<ul>
		<li>
			<a href="home.html">Home page</a>
		</li>
		<li>
			<a href="contatti.html">Contatti</a>
		</li>
		<li>
			<a href="dovesiamo.html">Dove siamo</a>
		</li>
	</ul>
</nav>

<header>
	<h1>${param.title}</h1>
</header>

<section id="intro">
	<!-- Introduction -->
</section>

<section id="error" class="error">
	<!-- Introduction -->
	<div class="error">
		<c:forEach var="error" items="${errors}" varStatus="status">
			<p class="error">
				<c:out value="${error}" />
			</p>
		</c:forEach>
	</div>
</section>
