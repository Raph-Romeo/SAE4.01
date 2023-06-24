import django.utils.timezone
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class CustomUser(AbstractUser):
    is_staff = models.BooleanField(default=False, null=False)
    date_of_birth = models.DateTimeField(blank=True, null=True)
    profile_image = models.ImageField(null=True)
    date_joined = models.DateTimeField(default=django.utils.timezone.now, null=False)

    def __str__(self):
        return " ".join([self.first_name, self.last_name])


class Account(models.Model):
    name = models.CharField(null=False, max_length=40)
    balance = models.FloatField(default=0, null=False)
    is_current = models.BooleanField(default=True, null=False)
    rib = models.CharField(null=False, max_length=50, unique=True)
    iban = models.CharField(null=False, max_length=50, unique=True)
    date_created = models.DateTimeField(default=django.utils.timezone.now, null=False)
    client = models.ForeignKey(CustomUser, null=False, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Transaction(models.Model):
    name = models.CharField(null=True, max_length=40)
    is_pending = models.BooleanField(null=False, default=False)
    amount = models.FloatField(null=False)
    transaction_date = models.DateTimeField(default=django.utils.timezone.now, null=False)

    def __str__(self):
        return self.name

    def amount_str(self, x=1):
        amount = self.amount * x
        if amount >= 0:
            f = '{:20,.2f}'.format(amount)
            return "+ " + f + " €"
        else:
            amount = amount * -1
            f = '{:20,.2f}'.format(amount)
            return "- " + f + " €"

    class Meta:
        abstract = True


class Deposit(Transaction):
    source = models.ForeignKey(CustomUser, null=False, on_delete=models.CASCADE)
    destination = models.ForeignKey(Account, null=False, on_delete=models.CASCADE)

    def serialize(self, user):
        if self.name is None:
            name = [False, f"Depot sur {self.destination}"]
        else:
            name = [True, self.name]
        return {"id":self.id,"name": name, "is_pending": self.is_pending, "amount": self.amount_str(), "type": 1, "transaction_date": self.transaction_date, "from": [str(self.source)], "to": [str(self.destination), str(self.destination.client)]}


class Withdrawal(Transaction):
    source = models.ForeignKey(Account, null=False, on_delete=models.CASCADE)
    destination = models.ForeignKey(CustomUser, null=False, on_delete=models.CASCADE)

    def serialize(self, user):
        if self.name is None:
            name = [False, f"Prelevement sur {self.source}"]
        else:
            name = [True, self.name]
        return {"id":self.id,"name": name, "is_pending": self.is_pending, "amount": self.amount_str(-1), "type": 2, "transaction_date": self.transaction_date, "from": [str(self.source), str(self.source.client)], "to": [str(self.destination)]}


class Transfer(Transaction):
    source = models.ForeignKey(Account, null=False, on_delete=models.CASCADE, related_name='transfers_from')
    destination = models.ForeignKey(Account, null=False, on_delete=models.CASCADE, related_name='transfers_to')

    def serialize(self, user):
        if self.source.client == user:
            if self.destination.client == user:
                if self.name is None:
                    name = [True, f"Vir vers {self.destination} (vous)"]
                else:
                    name = [True, self.name]
                return {"id":self.id,"name": name, "is_pending": self.is_pending, "amount": (self.amount_str()), "type": 3,"transaction_date": self.transaction_date, "from": [str(self.source), str(self.source.client)],"to": [str(self.source), str(self.source.client)]}
            else:
                if self.name is None:
                    name = [True, f"Vir vers {self.destination} ({self.destination.client})"]
                else:
                    name = [True, self.name]
                return {"id":self.id,"name": name, "is_pending": self.is_pending, "amount": (self.amount_str(-1)), "type": 3, "transaction_date": self.transaction_date, "from": [str(self.source), str(self.source.client)], "to": [str(self.source), str(self.source.client)]}
        elif self.destination.client == user:
            if self.name is None:
                name = [True, f"Vir de {self.source} ({self.source.client})"]
            else:
                name = [True, self.name]
            return {"id":self.id,"name": name, "is_pending": self.is_pending, "amount": self.amount_str(), "type": 3, "transaction_date": self.transaction_date, "from": [str(self.source), str(self.source.client)], "to": [str(self.source), str(self.source.client)]}
        else:
            return {"id":self.id,"name": [True,"test"], "is_pending": self.is_pending, "amount": self.amount_str(), "type": 3, "transaction_date": self.transaction_date, "from": [str(self.source), str(self.source.client)], "to": [str(self.source), str(self.source.client)]}
