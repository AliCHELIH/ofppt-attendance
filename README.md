# OFPPT Attendance 📋

Application complète de gestion de présence pour les établissements de formation, développée avec **React**, **Laravel** et **MySQL**.

---

## 🛠️ Technologies utilisées

- 🔥 **Frontend** : React.js
- ⚙️ **Backend** : Laravel 
- 🛢️ **Base de données** : MySQL
- 📦 **API RESTful** entre Laravel & React

---

## 📸 Fonctionnalités principales

- Authentification des utilisateurs (admin, formateur, étudiant)
- Saisie et suivi des présences en temps réel
- Vue historique par date, classe, module, etc.
- Interface admin pour gérer les utilisateurs et les sessions
- Export des données (PDF)
- Notifications en cas d'absence fréquente

---

## 🚀 Installation locale

### 1. Cloner le projet

```bash
git clone https://github.com/AliCHELIH/ofppt-attendance.git
cd ofppt-attendance
```
### 2. Backend Laravel (API)
```
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configurer .env avec vos infos MySQL
php artisan migrate --seed
php artisan serve
```
### 3. Frontend React
```
cd ../frontend
npm install
npm run dev
