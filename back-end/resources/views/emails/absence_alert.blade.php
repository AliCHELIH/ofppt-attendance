<!DOCTYPE html>
<html>
<head>
    <title>Alerte d'Absence</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            max-width: 500px;
            height: auto;
        }
        .content {
            margin: 0 auto;
            width: 80%;
            text-align: left;
        }
        .content p {
            margin-bottom: 15px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            font-size: 16px;
            color: #fff;
            background-color: #007BFF;
            text-decoration: none;
            border-radius: 5px;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{ asset('images/ista.png') }}" alt="Logo">
        </div>
        <div class="content">
            <p>Bonjour {{ $etudiantName }},</p>
            <p>Nous espérons que vous allez bien.</p>
            <p>Nous vous informons que vous avez dépassé un total de {{ $hours }} heures d'absence. Il est important de prendre en compte ces absences et d'agir en conséquence pour éviter tout impact négatif sur votre parcours académique.</p>
            <p>Nous vous encourageons à consulter vos absences en cliquant sur le bouton ci-dessous :</p>
            <p><a href="{{ url('/etudiant/absences') }}" class="button">Consulter vos absences</a></p>
            <p>Si vous avez des questions ou des préoccupations, n'hésitez pas à contacter votre responsable de formation.</p>
            <p>Merci de votre attention.</p>
            <p>Cordialement,</p>
            <p>L'équipe pédagogique de l'OFPPT</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} OFPPT. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
