# Generated by Django 4.2.1 on 2023-06-07 15:07

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SAE403', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='compte',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2023, 6, 7, 15, 7, 31, 443449, tzinfo=datetime.timezone.utc)),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='date_joined',
            field=models.DateTimeField(default=datetime.datetime(2023, 6, 7, 15, 7, 31, 440418, tzinfo=datetime.timezone.utc)),
        ),
    ]
