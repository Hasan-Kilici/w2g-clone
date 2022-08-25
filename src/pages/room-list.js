<head>
<title>W2G Clone - Rooms</title>
<link href="https://pro.fontawesome.com/releases/v5.13.1/css/all.css" rel="stylesheet"> 
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js" integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<script src="/socket.io/socket.io.js"></script>
</head>
<div class="container-fluid">
<div class="row">
<div class="col-md-3">
<div class="container"><br>
<span>Merhaba <%= user.username %></span><br><br>
<label>Buradan herhangi bir kanala giriş yapıp oradaki insanlar ile beraber video izleyebilirsin!<br>
Ya da kendi odanı açıp arkadaşlarını davet edebilirsin!</label>
<br><br>
<form action="/create/room/<%= user.token %>" method="POST">
<div class="card">
<div class="card-header">
<h5>Oda oluştur</h5>
</div>
<div class="card-body">
<label>Oda adı</label>
<input type="text" id="roomname" name="roomname" class="form-control">
<label>Oda durumu</label>
<select id="private" name="private" class="form-control">
<option value="false">Herkese açık</option>
<option value="true">Özel</option>
</select>
</div>
<div class="card-footer">
<input type="submit" class="btn btn-primary" value="Oda oluştur">
</div>
</div>
</form>
</div>  
</div>
<div class="col-md-9">
<div class="container"><br>
<h4>Aktif odalar</h4>
<hr>
<% rooms.forEach( rooms =>{ %>
<br>
<div class="card">
<div class="card-body">
<h4><%= rooms.roomname %></h4>
</div>  
<div class="card-footer">
<% if(rooms.roomAdminToken == user.token ) { %>
<form method="POST" action="/delete/room/<%= rooms._id %>" style="width:48%; float:left; margin-right:1vw;">
<input type="submit" class="btn btn-danger w-100" value="Odayı sil">
</form>
<% } %>
<button class="btn btn-dark w-50" onclick="window.location.href = '/room/<%= rooms.roomurl %>'">
Odaya katıl  
</button>  
</div>
</div>
<% }) %>
</div>
</div>
</div>
</div>
