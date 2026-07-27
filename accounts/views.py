import json

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import SignupForm, LoginForm
from django.contrib.auth.decorators import login_required


def signup(request):
    if request.method == "POST":
        form = SignupForm(request.POST, request.FILES)

        if form.is_valid():
            form.save()
            messages.success(request, "Account created successfully.")
            return redirect("login")

    else:
        form = SignupForm()

    return render(request, "accounts/signup.html", {"form": form})


def user_login(request):
    if request.method == "POST":
        form = LoginForm(request, data=request.POST)

        if form.is_valid():
            login(request, form.get_user())
            return redirect("dashboard")

    else:
        form = LoginForm()

    return render(request, "accounts/login.html", {"form": form})


@csrf_exempt
def api_login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username = data.get("username", "")
    password = data.get("password", "")

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return JsonResponse({
            "success": True,
            "message": "Login successful",
            "user": {
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        })

    return JsonResponse({"error": "Invalid username or password"}, status=401)


@csrf_exempt
def api_signup(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "Method not allowed"},
            status=405
        )

    try:
        data = json.loads(request.body)

        print("DATA RECEIVED FROM REACT:", data)

    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON"},
            status=400
        )

    form = SignupForm({
        "first_name": data.get("firstName", ""),
        "last_name": data.get("lastName", ""),
        "username": data.get("username", ""),
        "email": data.get("email", ""),
        "password1": data.get("password", ""),
        "password2": data.get("confirmPassword", ""),
    })

    if form.is_valid():

        user = form.save()

        print("USER SAVED:", user.username)

        return JsonResponse({
            "success": True,
            "message": "Account created successfully"
        }, status=201)

    error_map = {
        "first_name": "firstName",
        "last_name": "lastName",
        "password2": "confirmPassword",
        "password1": "password",
    }

    errors = {}
    general_errors = []

    for field, field_errors in form.errors.items():
        mapped = error_map.get(field)
        if mapped:
            errors[mapped] = field_errors[0]
        else:
            general_errors.append(field_errors[0])

    print("FORM ERRORS:", errors)

    response_data = {"success": False, "errors": errors}
    if general_errors:
        response_data["error"] = " ".join(general_errors)

    return JsonResponse(response_data, status=400)
@login_required
def api_account(request):

    user = request.user

    return JsonResponse({
        "success": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
    })