from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("events", "0002_event_cancellation_policy_event_cancellation_public"),
    ]

    operations = [
        migrations.AlterField(
            model_name="event",
            name="status",
            field=models.CharField(
                choices=[
                    ("draft", "Draft"),
                    ("pending", "Pending"),
                    ("published", "Published"),
                    ("rejected", "Rejected"),
                    ("cancelled", "Cancelled"),
                    ("completed", "Completed"),
                ],
                default="draft",
                max_length=20,
            ),
        ),
    ]
