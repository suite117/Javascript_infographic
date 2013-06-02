<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE HTML>
<html>
<head>
<title>${param.title}</title>
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/template/style.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/template/form.css" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

</head>
<body>
	<jsp:include page="header.jsp" />
	<section id="content">
		<!-- Main content area -->
		<c:import url="${param.content}" />
		
	</section>
	<aside>
		<!-- Sidebar -->
	</aside>
	<footer>
		<!-- Footer -->
		<jsp:include page="footer.jsp" />
	</footer>

</body>
</html>