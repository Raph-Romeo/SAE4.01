from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Account, CustomUser, Transfer, Withdrawal, Deposit
import random
from django.contrib.auth import get_user_model
from datetime import datetime


def create_account(user):
    name = "Compte Principal"
    repeat = True
    while repeat:
        repeat = False
        rib = generate_RIB()
        for c in Account.objects.all():
            if c.rib == rib:
                repeat = True
    iban = "FR76" + rib
    is_current = True
    nouveau_compte = Account(name=name, is_current=is_current, rib=rib, iban=iban, client=user)
    nouveau_compte.save()
    return nouveau_compte


def generate_RIB():
    banque = "70256"
    guichet = "3428"
    num = []
    for i in range(9):
        num.append(str(random.randint(0, 9)))
    num = "".join(num)
    key = "12"
    return banque + guichet + num + key


class MyAPIView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            data = {'message': 'Authenticated'}
        else:
            data = {'message': 'Unauthenticated'}
        return Response(data)

    def post(self, request):
        # Handle POST request and return data
        data = request.data
        return Response(data)


def balance_format(x: float) -> str:
    if x >= 0:
        f = '{:20,.2f}'.format(x)
        return "+ " + f + " €"
    else:
        x = x * -1
        f = '{:20,.2f}'.format(x)
        return "- " + f + " €"


class ApiClientAccount(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        comptes = Account.objects.all().filter(client=request.user.id)
        data = []
        for c in comptes:
            data.append({"id": c.id, "name": c.name, "balance": balance_format(c.balance), "balance_raw": c.balance, "iban": c.iban, "is_current": c.is_current, "owner": str(c.client)})
        return Response({"accounts": data})

    def post(self, request):
        if not request.user.is_staff:
            name = request.data.get("name")
            for c in Account.objects.all().filter(client=request.user.id):
                if c.name == name:
                    return Response({"error":"Plusieurs comptes ne peuvent pas porter le meme nom"})
            repeat = True
            while repeat:
                repeat = False
                rib = generate_RIB()
                for c in Account.objects.all():
                    if c.rib == rib:
                        repeat = True
            iban = "FR76" + rib
            is_current = request.data.get("is_current")
            new_account = Account(name=name, is_current=is_current, rib=rib, iban=iban, client=request.user)
            new_account.save()
            return Response({"name": new_account.name, "id": new_account.id})
        else:
            if request.data.get("id") is None or request.data.get("username") is None:
                return Response({"error": "Veuillez renseigner l'id ou le username du client auquel vous voulez creer un compte"})
            else:
                if request.data.get("username") is not None:
                    try:
                        user = CustomUser.objects.get(username=request.data.get("username"))
                    except:
                        return Response({"error": "User doesn't exist"})
                if request.data.get("id") is not None:
                    try:
                        user = CustomUser.objects.get(id=request.data.get("id"))
                    except:
                        return Response({"error": "User doesn't exist"})
                name = request.data.get("name")
                for c in Account.objects.all().filter(client=user.id):
                    if c.name == name:
                        return Response({"error": "Plusieurs comptes ne peuvent pas porter le meme nom"})
                repeat = True
                while repeat:
                    repeat = False
                    rib = generate_RIB()
                    for c in Account.objects.all():
                        if c.rib == rib:
                            repeat = True
                iban = "FR76" + rib
                is_current = request.data.get("is_current")
                balance = request.data.get("balance")
                new_account = Account(name=name, is_current=is_current, rib=rib, iban=iban, client=user, balance=balance)
                new_account.save()
                return Response({"name": new_account.name, "id": new_account.id})


class ApiClientAccountDetail(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        if request.user.is_staff or Account.objects.get(pk=id).client == request.user:
            c = Account.objects.get(pk=id)
            transactions = []
            transactions_pending = []
            for transaction in list(Deposit.objects.all()) + list(Transfer.objects.all()) + list(
                    Withdrawal.objects.all()):
                if type(transaction) is Deposit:
                    if transaction.destination == c:
                        if transaction.is_pending:
                            transactions_pending.append(transaction.serialize(request.user))
                        else:
                            transactions.append(transaction.serialize(request.user))
                elif type(transaction) is Withdrawal:
                    if transaction.source == c:
                        if transaction.is_pending:
                            transactions_pending.append(transaction.serialize(request.user))
                        else:
                            transactions.append(transaction.serialize(request.user))
                elif type(transaction) is Transfer:
                    if transaction.destination == c or transaction.source == c:
                        if transaction.is_pending:
                            transactions_pending.append(transaction.serialize(request.user))
                        else:
                            transactions.append(transaction.serialize(request.user))
            transactions = sorted(transactions, key=lambda x: x["transaction_date"], reverse=True)
            transactions_pending = sorted(transactions_pending, key=lambda x: x["transaction_date"], reverse=True)
            data = {"id": c.id, "name": c.name, "balance": balance_format(c.balance), "balance_raw": c.balance, "rib": c.rib, "iban": c.iban, "is_current": c.is_current, "date_created": str(c.date_created).split(" ")[0], "owner": str(c.client), "transactions_pending": transactions_pending, "transactions": transactions}
            return Response(data)
        else:
            return Response({"error": "Ce compte ne vous appartient pas."})

    def put(self, request, id):
        if request.user.is_staff or Account.objects.get(pk=id).client == request.user:
            c = Account.objects.get(pk=id)
            data = {"name": c.name}
            if request.data.get("name") is not None:
                if 40 >= len(request.data.get("name")) >= 3:
                    if len(list(Account.objects.all().filter(client=request.user.id, name=request.data.get("name")))) == 0:
                        c.name = request.data.get("name")
                        c.save()
                        data = {"name": c.name}
                    else:
                        data = {"error": "un compte avec ce nom existe deja"}
                else:
                    data = {"error": "longueur maximale du nom est de 40 characteres et minimale est de 3"}
            return Response(data)
        else:
            return Response({"error": "Ce compte ne vous appartient pas."})

    def delete(self, request, id):
        if request.user.is_staff or Account.objects.get(pk=id).client == request.user:
            count = 0
            c = Account.objects.get(pk=id)
            if c.is_current:
                for acc in list(Account.objects.all().filter(client=request.user.id)):
                    if acc.is_current:
                        count += 1
                if count == 1:
                    return Response({"error": "le client necesite au moins un compte courant."})
            c.delete()
            return Response({"ok": "account deleted"})
        else:
            return Response({"error": "Ce compte ne vous appartient pas."})


class ApiClient(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    #Get account details

    def get(self, request):
        client = request.user
        try:
            profile_image = [str(client.profile_image), client.profile_image.url]
        except:
            profile_image = None
        return Response({"username": client.username, "first_name": client.first_name, "last_name": client.last_name, "profile_image": profile_image, "date_of_birth": client.date_of_birth, "email": client.email})

    #Edit account
    def put(self, request):
        pass


class ApiCreateClient(APIView):

    def post(self, request):
        username = request.data.get("username")
        first_name = request.data.get("nom")
        last_name = request.data.get("prenom")
        password = request.data.get("password")
        email = request.data.get("email")
        date_of_birth = request.data.get("date_of_birth")
        if not CustomUser.objects.filter(username=username).exists():
            if len(password) >= 8:
                try:
                    profile_image = request.FILES.get("profile_picture")
                except:
                    profile_image = None
                if email is not None and date_of_birth is not None and first_name is not None and last_name is not None:
                    user = get_user_model()
                    user = user.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name, date_of_birth=date_of_birth)
                    user.profile_image = profile_image
                    user.save()
                    create_account(user)
                    return Response({"success": "200"})
                else:
                    return Response({"error": "Veuillez renseigner tous les champs!"})
            else:
                return Response(request, 'signup.html', {"error": "Votre mot de passe doit faire au moins 8 caracteres de longueur"})
        else:
            return Response(request, 'signup.html', {"error": "Ce nom d'utilisateur est déja utilisé"})


class ApiTransaction(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            transactions = []
            transactions_pending = []
            for transaction in list(Deposit.objects.all()) + list(Transfer.objects.all()) + list(Withdrawal.objects.all()):
                if type(transaction) is Deposit:
                    if transaction.source == request.user or transaction.destination.client == request.user:
                        if transaction.is_pending:
                            transactions_pending.append(transaction.serialize(request.user))
                        else:
                            transactions.append(transaction.serialize(request.user))
                elif type(transaction) is Withdrawal:
                    if transaction.destination == request.user or transaction.source.client == request.user:
                        if transaction.is_pending:
                            transactions_pending.append(transaction.serialize(request.user))
                        else:
                            transactions.append(transaction.serialize(request.user))
                elif type(transaction) is Transfer:
                    if transaction.destination.client == request.user or transaction.source.client == request.user:
                        if transaction.is_pending:
                            transactions_pending.append(transaction.serialize(request.user))
                        else:
                            transactions.append(transaction.serialize(request.user))
            transactions = sorted(transactions, key=lambda x: x["transaction_date"], reverse=True)
            transactions_pending = sorted(transactions_pending, key=lambda x: x["transaction_date"], reverse=True)
            data = {"transactions_pending": transactions_pending, "transactions": transactions}
            return Response(data)
        else:
            transactions = []
            for transaction in list(Deposit.objects.all().filter(is_pending=True)) + list(Transfer.objects.all().filter(is_pending=True)) + list(Withdrawal.objects.all().filter(is_pending=True)):
                transactions.append(transaction.serialize(request.user))
            transactions = sorted(transactions, key=lambda x: x["transaction_date"], reverse=True)
            data = {"transactions": transactions}
            return Response(data)

    def post(self, request):
        if not request.user.is_staff:
            name = request.data.get("name")
            amount = request.data.get("amount")
            if amount <= 0:
                return Response({"error": "la valeur du montant doit etre supérieur a 0"})
            if request.data.get("type") == 1:
                destination = request.data.get("destination")
                if Account.objects.get(pk=destination).client == request.user:
                    if amount >= 10000:
                        transaction = Deposit(name=name, is_pending=True, amount=amount, source=request.user, destination=Account.objects.get(pk=destination))
                        transaction.save()
                    else:
                        transaction = Deposit(name=name, is_pending=False, amount=amount, source=request.user, destination=Account.objects.get(pk=destination))
                        transaction.save()

                        # NAT REQUEST WILL REPLACE THIS __________________________

                        a = Account.objects.get(pk=destination)
                        a.balance += amount
                        a.save()

                else:
                    return Response({"error": "Vous n'avez pas l'autorisation d'effectuer cette opération"})
            elif request.data.get("type") == 2:
                source = request.data.get("source")
                if Account.objects.get(pk=source).client == request.user:
                    if amount >= 1000:
                        transaction = Withdrawal(name=name, is_pending=True, amount=(amount * -1), source=Account.objects.get(pk=source), destination=request.user)
                        transaction.save()
                    else:
                        transaction = Withdrawal(name=name, is_pending=False, amount=(amount * -1),source=Account.objects.get(pk=source), destination=request.user)
                        transaction.save()

                        # NAT REQUEST WILL REPLACE THIS __________________________

                        a = Account.objects.get(pk=source)
                        a.balance -= amount
                        a.save()

                else:
                    return Response({"error": "Vous n'avez pas l'autorisation d'effectuer cette opération"})
            elif request.data.get("type") == 3:
                source = request.data.get("source")
                destination = request.data.get("destination")
                if request.user == Account.objects.get(pk=source).client:
                    try:
                        send_to = Account.objects.get(rib=destination)
                    except:
                        try:
                            send_to = Account.objects.get(iban=destination)
                        except:
                            return Response({"error": "Le compte vers lequel vous desirez faire un virement n'existe pas"})
                    if Account.objects.get(pk=source) != send_to:
                        if amount >= 10000:
                            transaction = Transfer(name=name, is_pending=True, amount=amount, source=Account.objects.get(pk=source), destination=send_to)
                            transaction.save()
                        else:
                            transaction = Transfer(name=name, is_pending=False, amount=amount, source=Account.objects.get(pk=source), destination=send_to)
                            transaction.save()

                            # NAT REQUEST WILL REPLACE THIS __________________________

                            a = Account.objects.get(pk=source)
                            b = Account.objects.get(iban=destination)
                            a.balance -= amount
                            b.balance += amount
                            a.save()
                            b.save()

                    else:
                        return Response({"error": "Le compte de source et de destination du virement ne peuvent pas etre les memes."})
                else:
                    return Response({"error": "Vous n'avez pas l'autorisation d'effectuer cette operation"})
            else:
                Response({"error": "type de transaction invalide"})
            return Response(transaction.serialize(request.user))
        else:
            return Response({"error": "Vous n'etes pas un client"})


class ApiTransactionStaff(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, id, type):
        if request.user.is_staff:
            if type == 1:
                transaction = Deposit.objects.get(pk=id)
                if request.data.get("authorize"):
                    transaction.is_pending = False
                    transaction.save()

                    # REPLACE WITH NATS REQUEST --------------------------
                    transaction.destination.balance += transaction.amount
                    transaction.destination.save()
                    # REPLACE WITH NATS REQUEST --------------------------

                    return Response(transaction.serialize(request.user))
                else:
                    transaction.delete()
                    return Response({"OK": 200})
            elif type == 2:
                transaction = Withdrawal.objects.get(pk=id)
                if request.data.get("authorize"):
                    transaction.is_pending = False
                    transaction.save()

                    #REPLACE WITH NATS REQUEST --------------------------
                    transaction.source.balance -= transaction.amount
                    transaction.source.save()
                    # REPLACE WITH NATS REQUEST --------------------------

                    return Response(transaction.serialize(request.user))
                else:
                    transaction.delete()
                    return Response({"OK": 200})
            elif type == 3:
                transaction = Transfer.objects.get(pk=id)
                if request.data.get("authorize"):
                    transaction.is_pending = False
                    transaction.save()

                    # REPLACE WITH NATS REQUEST --------------------------
                    transaction.source.balance -= transaction.amount
                    transaction.source.save()
                    transaction.destination.balance += transaction.amount
                    transaction.destination.save()
                    # REPLACE WITH NATS REQUEST --------------------------

                    return Response(transaction.serialize(request.user))
                else:
                    transaction.delete()
                    return Response({"OK": 200})