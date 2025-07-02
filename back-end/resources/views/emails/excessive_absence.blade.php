<!DOCTYPE html>
<html>

<head>
    <title>Avertissement d'absences excessives</title>
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
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
            @if ($role == 'conseiller' || $role == 'cgcp')
                <p>Bonjour {{ $notifiable->last_name }} {{ $notifiable->first_name }},</p>
            @else
                <p>Bonjour {{ $notifiable->prenom }} {{ $notifiable->nom }},</p>
            @endif
            @if ($role == 'etudiant')
                <p>Nous vous informons que vous avez dépassé un total de {{ $totalDuree }} heures d'absence non
                    justifiée. Il est important de contacter votre conseiller pour un rendez-vous afin de discuter de
                    cette situation.</p>
            @elseif($role == 'conseiller')
                <p>L'étudiant {{ $etudiant->prenom }} {{ $etudiant->nom }} de groupe {{ $etudiant->group->nom }} a
                    dépassé {{ $totalDuree }} heures d'absence non justifiée. Veuillez prendre les mesures nécessaires
                    et planifier un rendez-vous avec l'étudiant.</p>
                <p><a href="{{ url('http://localhost:3000/gestionnaire/rendez_vous') }}" class="button">Planifier un
                        RDV</a></p>
            @elseif($role == 'cgcp')
                <p>L'étudiant {{ $etudiant->prenom }} {{ $etudiant->nom }} de groupe {{ $etudiant->group->nom }} a
                    dépassé {{ $totalDuree }} heures d'absence non justifiée. Veuillez attendre un rendez-vous du
                    conseiller.</p>
            @endif
            <p>Merci pour votre attention.</p>
            <p>Cordialement,</p>
            <p>L'équipe pédagogique de l'OFPPT</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} OFPPT. Tous droits réservés.</p>
        </div>
    </div>
</body>

</html>
