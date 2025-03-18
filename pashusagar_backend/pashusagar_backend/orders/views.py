# views.py
import requests
from django.shortcuts import get_object_or_404, redirect
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer
from products.models import Product

class InitiatePaymentView(APIView):
    """
    Initiates the payment with Khalti for an order.
    Requires the frontend to send a valid authentication token.
    """
    permission_classes = [IsAuthenticated]  # This ensures the frontend token is used to authenticate the user

    def post(self, request):
        # Use the OrderSerializer to validate and create the order.
        serializer = OrderSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            order = serializer.save()  # request.user is populated based on the token from the frontend.
            try:
                # Calculate total amount from the order items (converted to the smallest unit, e.g. paisa)
                amount = sum(
                    get_object_or_404(Product, id=item['product']).price * item['quantity']
                    for item in request.data['items']
                ) * 100
            except KeyError:
                return Response({"error": "Invalid product data in items"}, status=status.HTTP_400_BAD_REQUEST)

            # Prepare the payload for Khalti initiation.
            payload = {
                "return_url": "http://127.0.0.1:8000/api/verify-payment/",  # Update with your actual return URL if needed
                "website_url": "http://127.0.0.1:8000",  # Update with your website URL
                "amount": int(amount),
                "purchase_order_id": f"Order_{order.id}",
                "purchase_order_name": f"Order {order.id}",
                "customer_info": {
                    "name": request.user.username,
                    "email": request.user.email,
                    "phone": request.data.get("phone", ""),
                },
            }
            headers = {
                'Authorization': f'Key {settings.KHALTI_SECRET_KEY}',
                'Content-Type': 'application/json',
            }

            try:
                # Send request to Khalti's payment initiation endpoint.
                khalti_response = requests.post(
                    "https://a.khalti.com/api/v2/epayment/initiate/",
                    headers=headers,
                    json=payload
                )
                response_data = khalti_response.json()
                if khalti_response.status_code == 200:
                    # Save the purchase_order_id with the order.
                    order.purchase_order_id = payload["purchase_order_id"]
                    order.save()
                    return Response(response_data, status=status.HTTP_200_OK)
                else:
                    return Response(response_data, status=khalti_response.status_code)
            except requests.RequestException as e:
                return Response({
                    "message": "Failed to initiate payment with Khalti.",
                    "details": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# views.py
import requests
from django.shortcuts import redirect
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Order

class VerifyPaymentView(APIView):
    """
    Verifies the payment with Khalti and then redirects to the frontend.
    This view is open (does not enforce authentication) because Khalti's callback 
    may not include auth credentials.
    """
    def get(self, request):
        pidx = request.query_params.get("pidx")
        if not pidx:
            # If no pidx is provided, redirect to the frontend home page.
            return redirect("http://localhost:5173/")

        # Prepare the Khalti verification request
        url = "https://a.khalti.com/api/v2/epayment/lookup/"
        headers = {
            'Authorization': f'Key {settings.KHALTI_SECRET_KEY}',
            'Content-Type': 'application/json',
        }
        payload = {"pidx": pidx}

        try:
            verification_response = requests.post(url, headers=headers, json=payload)
            response_data = verification_response.json()

            if verification_response.status_code == 200 and response_data.get("status") == "Completed":
                purchase_order_id = response_data.get("purchase_order_id")
                order = Order.objects.filter(purchase_order_id=purchase_order_id).first()
                if order:
                    order.payment_status = "Completed"
                    order.save()
                    # After successful verification, redirect to the frontend payment-success page.
                    frontend_url = f"http://localhost:5173/payment-success?order_id={order.id}"
                    return redirect(frontend_url)
                else:
                    # Order not found: redirect to home page.
                    return redirect("http://localhost:5173/")
            else:
                # Verification failed: redirect to home page (or you could send a message via query params)
                return redirect("http://localhost:5173/")
        except requests.RequestException as e:
            # On error, redirect to the home page.
            return redirect("http://localhost:5173/")
