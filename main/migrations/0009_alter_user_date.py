# Generated by Django 5.0.6 on 2024-05-27 02:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_tradeproposal_delete_admin_alter_user_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='date',
            field=models.DateField(blank=True, default='1970-01-01'),
        ),
    ]
