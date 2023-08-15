from rest_framework import serializers
class FixSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    user_id = serializers.IntegerField(required=False, read_only=True)

    class Meta:
        read_only_fields = ('created_date', 'updated_date')

    def create(self, validated_data):
        validated_data['user_id'] = self.context['request'].user.id
        return super().create(validated_data)
    
from .models import (
    Category,
    Brand,
    Product,
    Firm,
    Purchase,
    Sale,
)
class CategorySerializer(FixSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        exclude = []

    def get_product_count(self,obj):
        return Product.objects.filter(category_id=obj.id).count()
class BrandSerializer(FixSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        exclude = []

    def get_product_count(self,obj):
        return Product.objects.filter(brand_id=obj.id).count()
class ProductSerializer(FixSerializer):
    category_id = serializers.PrimaryKeyRelatedField(source='category',queryset=Category.objects.all())
    category = serializers.StringRelatedField()
    brand_id = serializers.PrimaryKeyRelatedField(source='brand',queryset=Brand.objects.all())
    brand = serializers.StringRelatedField()

    class Meta:
        model = Product
        exclude = []

class FirmSerializer(FixSerializer):
    class Meta:
        model = Firm
        exclude = []

class PurchaseSerializer(FixSerializer):
    firm = serializers.StringRelatedField()
    firm_id = serializers.PrimaryKeyRelatedField(source="firm",queryset=Firm.objects.all())
    brand = serializers.StringRelatedField()
    brand_id = serializers.PrimaryKeyRelatedField(source="brand",queryset=Brand.objects.all())
    product = serializers.StringRelatedField()
    product_id = serializers.PrimaryKeyRelatedField(source="product",queryset=Product.objects.all())
    category = serializers.SerializerMethodField()

    class Meta:
        model = Purchase
        exclude = []
        read_only_fields = ['price_total']

    def get_category(self, obj):
        category = obj.product.category
        return {"id": category.id, "name": category.name}

class SaleSerializer(FixSerializer):
    brand = serializers.StringRelatedField()
    brand_id = serializers.PrimaryKeyRelatedField(source="brand",queryset=Brand.objects.all())
    product = serializers.StringRelatedField()
    product_id = serializers.PrimaryKeyRelatedField(source="product",queryset=Product.objects.all())
    category = serializers.SerializerMethodField()

    class Meta:
        model = Sale
        exclude = []
        read_only_fields = ['price_total']

    def get_category(self, obj):
        category = obj.product.category
        return {"id": category.id, "name": category.name}

    def validate(self, data):
        product = data.get('product')
        if data.get('quantity') > product.stock:
            raise serializers.ValidationError(f'Dont have enough stock. Current stock is {product.stock}')
        return data

class CategoryProductsSerializer(CategorySerializer):
    category_products = ProductSerializer(many = True)