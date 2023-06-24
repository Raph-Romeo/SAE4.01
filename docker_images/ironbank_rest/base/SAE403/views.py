from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, get_user_model, login, logout
from .models import CustomUser, Account
from .api_views import create_account


def index(request):
    user = request.user
    if user.is_authenticated:
        if not user.is_staff:
            return render(request, 'index.html', {"user": user})
        else:
            return HttpResponseRedirect("/staff")
    else:
        return HttpResponseRedirect("/login")


def staff(request):
    if request.user.is_authenticated:
        if request.user.is_staff:
            return render(request, 'staff.html')
        else:
            return HttpResponseRedirect("/user")
    else:
        return HttpResponseRedirect("/login")


def login_request(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if CustomUser.objects.filter(username=username).exists():
            if user is None:
                return render(request, 'login.html', {"error_message": "Mot de passe incorrect", "username": username})
            else:
                login(request, user)
                if CustomUser.objects.get(username=username).is_staff:
                    return HttpResponseRedirect('/staff')
                else:
                    return HttpResponseRedirect('/user')
        else:
            return render(request, 'login.html', {"error_message": "Identifiants incorrects", "username": username})
    else:
        return render(request, 'login.html')


def signup(request):
    if request.method == "POST":
        username = request.POST.get("username")
        first_name = request.POST.get("nom")
        last_name = request.POST.get("prenom")
        password = request.POST.get("password")
        password_attempt = request.POST.get("password_attempt")
        email = request.POST.get("email")
        date_of_birth = request.POST.get("date_of_birth")
        if not CustomUser.objects.filter(username=username).exists():
            if len(password) >= 8:
                if password == password_attempt:
                    try:
                        profile_image = request.FILES.get("profile_picture")
                    except:
                        profile_image = None
                    if email is not None and date_of_birth is not None and first_name is not None and last_name is not None:
                        user = get_user_model()
                        user = user.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name, date_of_birth=date_of_birth)
                        user.profile_image = profile_image
                        user.save()
                        create_account(user)
                        return render(request, 'login.html', {"username": username})
                    else:
                        return render(request, 'signup.html', {"username": username,"email":email,"password":password,"first_name":first_name,"last_name":last_name,"date_of_birth":date_of_birth,"password_attempt": password_attempt,"error_message":"Veuillez renseigner tous les champs!"})
                else:
                    return render(request, 'signup.html', {"username": username, "email": email, "password": password, "first_name": first_name,"last_name": last_name, "date_of_birth":date_of_birth,"error_message":"les mots de passe ne correspondent pas"})
            else:
                return render(request, 'signup.html', {"username": username, "email": email, "password": password, "first_name": first_name,"last_name": last_name, "date_of_birth": date_of_birth,"error_message": "Votre mot de passe doit faire au moins 8 caracteres de longueur"})
        else:
            return render(request, 'signup.html', {"username": username, "email": email, "password": password, "first_name": first_name,"last_name": last_name, "date_of_birth": date_of_birth,"error_message": "Ce nom d'utilisateur est déja utilisé"})
    else:
        return render(request, 'signup.html')


def logout_request(request):
    logout(request)
    return HttpResponseRedirect('/login')
