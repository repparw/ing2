# Generated by Django 5.0.6 on 2024-05-27 03:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0012_alter_user_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='tradeproposal',
            name='date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
