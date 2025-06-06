# Generated by Django 5.0.6 on 2024-06-15 19:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0025_rename_venta_sales_alter_tradeproposal_status"),
    ]

    operations = [
        migrations.CreateModel(
            name="AdsImage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("image", models.ImageField(upload_to="photos/ads")),
                ("uploaded_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
