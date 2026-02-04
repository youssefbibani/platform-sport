from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("events", "0003_event_status_pending_rejected"),
    ]

    operations = [
        migrations.DeleteModel(name="Review"),
        migrations.DeleteModel(name="EventParticipant"),
        migrations.DeleteModel(name="Ticket"),
        migrations.DeleteModel(name="OrderItem"),
        migrations.DeleteModel(name="Order"),
    ]
