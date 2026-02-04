from django.db import models


class ContactMessage(models.Model):
    ROLE_ATHLETE = "athlete"
    ROLE_ORGANIZER = "organizer"
    ROLE_PARTNER = "partner"
    ROLE_OTHER = "other"

    ROLE_CHOICES = [
        (ROLE_ATHLETE, "Athlete"),
        (ROLE_ORGANIZER, "Organizer"),
        (ROLE_PARTNER, "Partner"),
        (ROLE_OTHER, "Other"),
    ]

    name = models.CharField(max_length=120)
    email = models.EmailField()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_OTHER)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} <{self.email}>"
