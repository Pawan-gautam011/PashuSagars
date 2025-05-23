# Generated by Django 5.1.3 on 2025-04-26 09:53

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_alter_message_recipient_alter_message_sender'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='recipient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_messages', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='message',
            name='sender',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_messages', to=settings.AUTH_USER_MODEL),
        ),
    ]
