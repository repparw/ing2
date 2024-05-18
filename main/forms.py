from django import forms 

class LoginForm(forms.Form):
    mail = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)