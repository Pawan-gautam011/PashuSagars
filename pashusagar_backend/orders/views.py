# orders/views.py - Updated payment integration

from django.db.models import Q
from django.shortcuts import redirect, get_object_or_404
from django.conf import settings
import requests
import json
from django.http import HttpResponse, FileResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from .models import Order, OrderItem
from .serializers import OrderSerializer
from notifications.models import Notification
from products.models import Product, Appointment
from products.serializers import AppointmentSerializer
import os
from .models import Order


class InitiatePaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Log the incoming request for debugging
            print("Payment request received:")
            print(f"Content Type: {request.content_type}")
            print(f"Data: {request.data}")
            
            # Parse items data if it's a string (from FormData)
            if 'items' in request.data and isinstance(request.data['items'], str):
                try:
                    items_data = json.loads(request.data['items'])
                    # Create a mutable copy of request.data
                    mutable_data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
                    mutable_data['items'] = items_data
                    serializer = OrderSerializer(data=mutable_data, context={'request': request})
                except json.JSONDecodeError:
                    return Response(
                        {"error": "Invalid items data format", "detail": "The items field must be a valid JSON array"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                serializer = OrderSerializer(data=request.data, context={'request': request})
            
            # Validate the order data
            if serializer.is_valid():
                # Save the order with all shipping details
                order = serializer.save()
                print(f"Order created with ID: {order.id}")
                
                # Calculate total including shipping
                subtotal = sum(item.product.price * item.quantity for item in order.items.all())
                shipping_fee = 100  # Fixed shipping fee
                total_amount = subtotal + shipping_fee
                
                # Handle different payment methods
                payment_method = request.data.get('payment_method')
                
                if payment_method == 'Khalti':
                    # Prepare payload for Khalti
                    payload = {
                        "return_url": "http://127.0.0.1:8000/api/verify-payment/",
                        "website_url": "http://127.0.0.1:8000",
                        "amount": int(total_amount * 100),  # Convert to paisa
                        "purchase_order_id": f"Order_{order.id}",
                        "purchase_order_name": f"Order {order.id}",
                        "customer_info": {
                            "name": request.data.get("shipping_name", request.user.username),
                            "email": request.data.get("shipping_email", request.user.email),
                            "phone": request.data.get("shipping_phone", ""),
                        },
                    }

                    headers = {
                        'Authorization': f'Key {settings.KHALTI_SECRET_KEY}',
                        'Content-Type': 'application/json',
                    }
                    
                    print(f"Sending to Khalti: {payload}")
                    
                    # Initiate Khalti payment
                    try:
                        khalti_response = requests.post(
                            "https://a.khalti.com/api/v2/epayment/initiate/",
                            headers=headers,
                            json=payload
                        )
                        
                        # Log the Khalti response for debugging
                        print(f"Khalti response status: {khalti_response.status_code}")
                        print(f"Khalti response: {khalti_response.text}")
                        
                        response_data = khalti_response.json()

                        if khalti_response.status_code == 200:
                            pidx = response_data.get("pidx")
                            payment_url = response_data.get("payment_url")
                            
                            # Save the pidx to the order
                            if pidx:
                                order.khalti_pidx = pidx
                                order.save()
                            
                            # Return the payment URL
                            return Response({
                                "status": "success",
                                "message": "Payment initiated successfully",
                                "payment_url": payment_url,
                                "pidx": pidx,
                                "order_id": order.id
                            }, status=status.HTTP_200_OK)
                        else:
                            # Payment initiation failed
                            order.payment_status = "Failed"
                            order.save()
                            
                            # Try to get detailed error message
                            error_message = response_data.get("detail", "Failed to initiate payment")
                            if isinstance(error_message, dict) and "message" in error_message:
                                error_message = error_message["message"]
                                
                            return Response({
                                "status": "error",
                                "message": error_message,
                                "khalti_error": response_data
                            }, status=status.HTTP_400_BAD_REQUEST)

                    except requests.RequestException as e:
                        # Handle Khalti API connection errors
                        order.payment_status = "Failed"
                        order.save()
                        
                        print(f"Khalti request exception: {str(e)}")
                        return Response({
                            "status": "error",
                            "message": "Failed to connect to payment gateway",
                            "detail": str(e)
                        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
                elif payment_method == 'Cash on Delivery':
                    # For COD, mark the order as pending and return success
                    order.payment_status = 'Pending'
                    order.save()
                    
                    # Create notification for customer
                    Notification.objects.create(
                        user=order.user,
                        notification_type='order',
                        message=f"Your order #{order.id} has been placed successfully with Cash on Delivery."
                    )
                    
                    # Return success response with order ID
                    return Response({
                        "status": "success",
                        "message": "Order placed successfully with Cash on Delivery",
                        "order_id": order.id
                    }, status=status.HTTP_200_OK)
                
                else:
                    # Invalid payment method
                    order.delete()  # Delete the order if payment method is invalid
                    return Response({
                        "status": "error",
                        "message": "Invalid payment method"
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # If serializer is not valid
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(f"Unexpected error in payment processing: {str(e)}")
            import traceback
            traceback.print_exc()
            
            return Response({
                "status": "error",
                "message": "An unexpected error occurred",
                "detail": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# class VerifyPaymentView(APIView):
#     def get(self, request):
#         pidx = request.query_params.get("pidx")
#         if not pidx:
#             return redirect("http://localhost:5173/payment-failed")

#         lookup_url = "https://a.khalti.com/api/v2/epayment/lookup/"
#         headers = {
#             'Authorization': f'Key {settings.KHALTI_SECRET_KEY}',
#             'Content-Type': 'application/json',
#         }
#         payload = {"pidx": pidx}

#         try:
#             verification_response = requests.post(lookup_url, headers=headers, json=payload)
#             print("Khalti lookup status code:", verification_response.status_code)
#             print("Khalti lookup response:", verification_response.text)
            
#             if verification_response.status_code == 200:
#                 data = verification_response.json()
#                 khalti_status = data.get("status")

#                 order = Order.objects.filter(khalti_pidx=pidx).first()
#                 if order and khalti_status == "Completed":
#                     order.payment_status = "Completed"
#                     order.save()

#                     # Create notification for the user
#                     Notification.objects.create(
#                         user=order.user,
#                         notification_type='order',
#                         message=f"Your order #{order.id} payment is now {order.payment_status}."
#                     )

#                     # Reduce product stock
#                     for item in order.items.all():
#                         product = item.product
#                         product.stock = max(0, product.stock - item.quantity)
#                         product.save()

#                     return redirect(f"http://localhost:5173/payment-success?order_id={order.id}")
#                 else:
#                     # Payment failed or order not found
#                     if order:
#                         order.payment_status = "Failed"
#                         order.save()
                        
#                         Notification.objects.create(
#                             user=order.user,
#                             notification_type='order',
#                             message=f"Your order #{order.id} payment has failed. Please try again."
#                         )
                    
#                     return redirect("http://localhost:5173/payment-failed")
#             else:
#                 # Khalti verification failed
#                 return redirect("http://localhost:5173/payment-failed")
#         except requests.RequestException as e:
#             print("Exception calling Khalti lookup:", str(e))
#             return redirect("http://localhost:5173/payment-failed")



class VerifyPaymentView(APIView):
    def get(self, request):
        pidx = request.query_params.get("pidx")
        if not pidx:
            return redirect("http://localhost:5173/payment-failed")

        lookup_url = "https://a.khalti.com/api/v2/epayment/lookup/"
        headers = {
            'Authorization': f'Key {settings.KHALTI_SECRET_KEY}',
            'Content-Type': 'application/json',
        }
        payload = {"pidx": pidx}

        try:
            verification_response = requests.post(lookup_url, headers=headers, json=payload)
            print("Khalti lookup status code:", verification_response.status_code)
            print("Khalti lookup response:", verification_response.text)
            
            if verification_response.status_code == 200:
                data = verification_response.json()
                khalti_status = data.get("status")

                order = Order.objects.filter(khalti_pidx=pidx).first()
                if order:
                    if khalti_status == "Completed":
                        # Change this to "Pending" instead of "Completed"
                        order.payment_status = "Pending"
                        order.save()

                        # Create notification for the user
                        Notification.objects.create(
                            user=order.user,
                            notification_type='order',
                            message=f"Your order #{order.id} payment is now {order.payment_status}."
                        )

                        return redirect(f"http://localhost:5173/payment-success?order_id={order.id}")
                    else:
                        # Payment failed
                        order.payment_status = "Failed"
                        order.save()
                        
                        Notification.objects.create(
                            user=order.user,
                            notification_type='order',
                            message=f"Your order #{order.id} payment has failed. Please try again."
                        )
                    
                    return redirect("http://localhost:5173/payment-failed")
            else:
                # Khalti verification failed
                return redirect("http://localhost:5173/payment-failed")
        except requests.RequestException as e:
            print("Exception calling Khalti lookup:", str(e))
            return redirect("http://localhost:5173/payment-failed")


            
class HistoryListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user

        # Fetch ALL orders for the user
        orders = Order.objects.filter(user=user).order_by('-created_at')
        orders_serializer = OrderSerializer(orders, many=True)

        # Fetch appointments
        appointments = Appointment.objects.filter(Q(customer=user)).order_by('-appointment_date')
        appointments_serializer = AppointmentSerializer(appointments, many=True)

        return Response({
            'orders': orders_serializer.data,
            'appointments': appointments_serializer.data,
        }, status=status.HTTP_200_OK)


# New views for order management
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_all_orders(request):
    """
    Get all orders. Admin users see all orders, regular users see only their orders.
    """
    user = request.user
    # Check if user is an admin (assuming role 0 is admin)
    if hasattr(user, 'role') and user.role == 0:
        orders = Order.objects.all().order_by('-created_at')
    else:
        orders = Order.objects.filter(user=user).order_by('-created_at')
    
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_order(request, pk):
    """
    Get a specific order. Admin users can see any order, regular users can only see their own orders.
    """
    user = request.user
    try:
        order = Order.objects.get(pk=pk)
        
        # Check if user is admin or the order owner
        if (hasattr(user, 'role') and user.role == 0) or order.user == user:
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        else:
            return Response({"detail": "You do not have permission to view this order."}, 
                           status=status.HTTP_403_FORBIDDEN)
    except Order.DoesNotExist:
        return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_order_status(request, pk):
    """
    Update an order's status. Only admin users can update order status.
    """
    user = request.user
    
    # Check if user is admin
    if not hasattr(user, 'role') or user.role != 0:
        return Response({"detail": "You do not have permission to update order status."}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    try:
        order = Order.objects.get(pk=pk)
        
        # Get the new status from request data
        new_status = request.data.get('status')
        if not new_status:
            return Response({"detail": "Status is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the order status
        order.payment_status = new_status
        order.save()
        
        # Create notification for the user
        Notification.objects.create(
            user=order.user,
            notification_type='order',
            message=f"Your order #{order.id} status has been updated to {new_status}."
        )
        
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_orders(request):
    """
    Get all orders for admin view.
    """
    user = request.user
    
    # Check if user is admin
    if not hasattr(user, 'role') or user.role != 0:
        return Response({"detail": "You do not have permission to view all orders."}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_order_prescription(request, pk):
    try:
        # Get the order with permission check
        if request.user.is_staff or request.user.is_superuser:
            order = Order.objects.get(pk=pk)
        else:
            order = Order.objects.get(pk=pk, user=request.user)
        
        if not order.prescription_file:
            return Response(
                {"error": "No prescription file found for this order"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if file exists in storage
        if not order.prescription_file.storage.exists(order.prescription_file.name):
            return Response(
                {"error": "Prescription file not found on server"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get the file and return it
        file = order.prescription_file
        filename = os.path.basename(file.name)
        
        # Set content type based on file extension
        content_type = 'application/octet-stream'
        if filename.lower().endswith('.pdf'):
            content_type = 'application/pdf'
        elif filename.lower().endswith('.png'):
            content_type = 'image/png'
        elif filename.lower().endswith(('.jpg', '.jpeg')):
            content_type = 'image/jpeg'
        
        response = FileResponse(file.open('rb'), content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
        
    except Order.DoesNotExist:
        return Response(
            {"error": "Order not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error retrieving prescription: {str(e)}")
        return Response(
            {"error": "Failed to retrieve prescription"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )