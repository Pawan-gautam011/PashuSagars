from rest_framework import generics, permissions
from .models import Category, Product, Message, Appointment
from .serializers import (
    CategorySerializer,
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
class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Appointment.objects.all()
        return Appointment.objects.filter(customer=user) | Appointment.objects.filter(veterinarian=user)

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
