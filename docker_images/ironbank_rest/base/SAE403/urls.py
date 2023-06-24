from django.urls import path
from .views import index, login_request, logout_request, signup, staff
from .api_views import MyAPIView, ApiClientAccount, ApiClientAccountDetail, ApiClient, ApiCreateClient, ApiTransaction, ApiTransactionStaff
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [

    # _____WEB_____
    path('user', index),
    path('', index),
    path('login', login_request),
    path('logout', logout_request),
    path('signup', signup),
    path('staff', staff),

    # _______________________API_______________________
    path('api/client/create', ApiCreateClient.as_view()),

    # _____CLIENT_____
    path('api/client', ApiClient.as_view()),  # GET client details ||| PUT edit client
    path('api/client/transaction', ApiTransaction.as_view()),  # Get transactions || Post create transaction
    path('api/client/notification', MyAPIView.as_view()),  # Get client notifications ||| POST clear notifications
    path('api/client/account', ApiClientAccount.as_view()),  # Get client accounts ||| POST create account
    path('api/client/account/<int:id>', ApiClientAccountDetail.as_view()),  # GET account details ||| PUT edit account ||| DELETE delete account
    path('api/transaction/virement', MyAPIView.as_view()),  # POST create ||| GET LIST
    path('api/transaction/depot', MyAPIView.as_view()),  # POST create ||| GET LIST
    path('api/transaction/prelevement', MyAPIView.as_view()),  # POST create ||| GET LIST

    # _____STAFF_____
    path('api/staff/transaction/<int:id>/<int:type>', ApiTransactionStaff.as_view()), #GET list of validations

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
