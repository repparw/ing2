# Generated by Django 5.0.6 on 2024-05-27 03:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_alter_user_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='date',
            field=models.DateField(blank=True, default='2000-01-01'),
        ),
    ]
