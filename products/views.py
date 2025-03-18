from requests import Response
from rest_framework import generics, permissions
from .models import Category, Product, Message, Appointment
from .serializers import (
    CategorySerializer,
    DashboardStatsSerializer,
    ProductSerializer,
    MessageSerializer,
    AppointmentSerializer,
    ProductStockUpdateSerializer
)


# Category Views
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# Product Views
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# Message Views
class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(sender=user) | Message.objects.filter(recipient=user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class MessageDetailView(generics.RetrieveDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]


# Appointment Views
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer
from notifications.models import Notification

class AppointmentDetailUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        appointment = self.get_object()
        old_status = appointment.status  # Capture the old status before update

        serializer = self.get_serializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # Save first

            # Fetch the updated status from the database
            appointment.refresh_from_db()
            new_status = appointment.status

            if old_status != new_status:
                message = f"Your appointment #{appointment.id} status has changed to {new_status}."
                
                # If the appointment is canceled, customize the message
                if new_status.lower() == "cancelled":
                    message = f"Your appointment #{appointment.id} has been cancelled."

                # Ensure appointment has a valid user before creating notification
                if hasattr(appointment, "customer") and appointment.customer:
                    Notification.objects.create(
                        user=appointment.customer,  # Make sure this field exists
                        notification_type="appointment",
                        message=message
                    )
                else:
                    return Response({"error": "Customer field missing in appointment."}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"detail": "Appointment updated successfully."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Appointment.objects.all()  # Admins see all appointments
        return Appointment.objects.filter(customer=user)  # Customers only see their own appointments

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)




class VeterinarianAppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(veterinarian=self.request.user).order_by('-appointment_date')


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProductRestockView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductStockUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        product = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            quantity = serializer.validated_data['quantity']
            product.restock(quantity)
            return Response({'detail': f'Stock increased by {quantity}. Current stock: {product.stock}.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Reduce Stock
class ProductReduceStockView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductStockUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        product = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            quantity = serializer.validated_data['quantity']
            try:
                product.reduce_stock(quantity)
                return Response({'detail': f'Stock reduced by {quantity}. Current stock: {product.stock}.'}, status=status.HTTP_200_OK)
            except ValidationError as e:
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from .serializers import ProductSerializer

class ProductSearchView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        query = self.request.query_params.get('q', None)
        if query:
            queryset = queryset.filter(title__icontains=query)
        return queryset

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

# API View to Fetch Dashboard Statistics
class DashboardStatsView(APIView):
    def get(self, request):
        total_products = Product.objects.count()
        total_appointments = Appointment.objects.count()
        pending_appointments = Appointment.objects.filter(is_confirmed=False).count()
        total_messages = Message.objects.count()
        unread_messages = Message.objects.filter(content__isnull=False).count()

        stats = {
            "total_products": total_products,
            "total_appointments": total_appointments,
            "pending_appointments": pending_appointments,
            "total_messages": total_messages,
            "unread_messages": unread_messages,
        }

        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data, status=status.HTTP_200_OK)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from auths.models import CustomUser
from orders.models import Order, OrderItem
from .serializers import AdminDashboardSerializer, ReportSerializer
from django.db.models import Sum, Q

class AdminDashboardView(APIView):
    def get(self, request):
        total_users = CustomUser.objects.count()
        total_products = Product.objects.count()
        total_appointments = Appointment.objects.count()
        total_orders = Order.objects.count()
        total_revenue = OrderItem.objects.aggregate(total_revenue=Sum('product__price'))['total_revenue'] or 0

        data = {
            "total_users": total_users,
            "total_products": total_products,
            "total_appointments": total_appointments,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
        }

        serializer = AdminDashboardSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminReportView(APIView):
    def get(self, request):
        total_users = CustomUser.objects.count()
        total_products = Product.objects.count()
        total_appointments = Appointment.objects.count()
        total_orders = Order.objects.count()
        total_revenue = OrderItem.objects.aggregate(total_revenue=Sum('product__price'))['total_revenue'] or 0

        pending_orders = Order.objects.filter(payment_status="Pending").count()
        completed_orders = Order.objects.filter(payment_status="Completed").count()
        failed_orders = Order.objects.filter(payment_status="Failed").count()
        refunded_orders = Order.objects.filter(payment_status="Refunded").count()

        report_data = {
            "total_users": total_users,
            "total_products": total_products,
            "total_appointments": total_appointments,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "pending_orders": pending_orders,
            "completed_orders": completed_orders,
            "failed_orders": failed_orders,
            "refunded_orders": refunded_orders,
        }

        serializer = ReportSerializer(report_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
