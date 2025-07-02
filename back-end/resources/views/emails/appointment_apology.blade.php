<!DOCTYPE html>
<html>
<head>
    <title>Désolé pour l'annulation</title>
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
            @if ($notifiable->is_conseiller || $notifiable->is_cgcp)
                <p>Bonjour {{ $notifiable->last_name }} {{ $notifiable->first_name }},</p>
            @else
                <p>Bonjour {{ $notifiable->prenom }} {{ $notifiable->nom }},</p>
            @endif
            <p>Nous sommes désolés d'annoncer que le rendez-vous avec l'étudiant {{ $etudiant->prenom }} {{ $etudiant->nom }} prévu pour le {{ $rdv_time }} a été annulé.</p>
            <p>Nous nous excusons pour tout inconvénient que cela pourrait causer.</p>
            <p>Cordialement,</p>
            <p>L'équipe pédagogique de l'OFPPT</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} OFPPT. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
