# Generated by Django 2.2.3 on 2019-07-04 14:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='problem',
            name='answer',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]
