
from rest_framework.views import exception_handler
from rest_framework.response import Response
from stock.models import BrandMismatchError, InsufficientStockError

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        response = Response()

    if isinstance(exc, (BrandMismatchError, InsufficientStockError)):
        response.data = {'detail': str(exc)}
        response.status_code = 400

    return response

