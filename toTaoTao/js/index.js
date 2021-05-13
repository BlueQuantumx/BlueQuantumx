$('#login-button').click(function (event) {
	var userName = document.getElementById("userName").value;
	var pwd = document.getElementById("pwd").value;
	var date = new Date();
	if (userName == "李昕韬" && pwd == "0514") {
		if (date.getTime() < 1620921600000) {
			alert("时辰未到");
		} else {
			event.preventDefault();
			$('form').fadeOut(500);
			$('.wrapper').addClass('form-success');
			setTimeout(function () { location.href = "BirthdayCake.html"; }, 2000);
		}
	}
	else if (userName == "admin" && pwd == "0514") {
		event.preventDefault();
		$('form').fadeOut(500);
		$('.wrapper').addClass('form-success');
		setTimeout(function () { location.href = "BirthdayCake.html"; }, 2000);
	}
	else {
		alert("Wrong Password");
	}
});
