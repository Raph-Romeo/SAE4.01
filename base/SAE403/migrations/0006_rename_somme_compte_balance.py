# Generated by Django 4.2.1 on 2023-06-07 16:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SAE403', '0005_alter_compte_date_created_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='compte',
            old_name='somme',
            new_name='balance',
        ),
    ]