from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
from django.contrib.auth.forms import AuthenticationForm
class SignupForm(UserCreationForm):

    email = forms.EmailField(required=True)

    class Meta:
        model = CustomUser
        fields = [
            "first_name",
            "last_name",
            "username",
            "email",
            "phone",
            "company_name",
            "job_title",
            "password1",
            "password2",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["first_name"].widget.attrs.update({
            "class": "form-control",
            "placeholder": "Enter your first name"
        })

        self.fields["last_name"].widget.attrs.update({
            "class": "form-control",
            "placeholder": "Enter your last name"
        })

        self.fields["username"].widget.attrs.update({
            "class": "form-control",
            "placeholder": "Enter your username"
        })

        self.fields["email"].widget.attrs.update({
            "class": "form-control",
            "placeholder": "Enter your email"
        })

        self.fields["phone"].widget.attrs.update({
            "class": "form-control",
            "placeholder": "Enter your phone number"
        })

        self.fields["company_name"].widget.attrs.update({
            "class": "form-control",
            "placeholder": "Enter your company name"
        })

        self.fields["job_title"].widget.attrs.update({
            "class": "form-control",
            "placeholder": "Enter your job title"
        })

        self.fields["password1"].widget.attrs.update({
            "class": "form-control",
            "placeholder": "Enter your password"
        })

        self.fields["password2"].widget.attrs.update({
            "class": "form-control",
            "placeholder": "Confirm your password"
        })
        
class LoginForm(AuthenticationForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["username"].widget.attrs.update({
            "class": "form-control",
            "placeholder": "Enter your username"
        })

        self.fields["password"].widget.attrs.update({
            "class": "form-control",
            "placeholder": "Enter your password"
        })