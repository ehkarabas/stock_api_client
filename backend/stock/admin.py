from django.contrib import admin
from .models import (
    Category,
    Brand,
    Product,
    Firm,
    Purchase,
    Sale,
)
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from django.contrib.admin.options import ModelAdmin
class CustomModelAdmin(ModelAdmin):
    readonly_fields = ('user', 'user_id',)

    def delete_queryset(self, request, queryset):
        for obj in queryset:
            obj.delete()
    def save_model(self, request, obj, form, change):

        obj.user = request.user
        obj.user_id = request.user.id
        super().save_model(request, obj, form, change)
class ProductModelResource(resources.ModelResource): 
    class Meta:
        model = Product

class ProductModelAdmin(ImportExportModelAdmin, CustomModelAdmin):
    
    resource_class = ProductModelResource

class PurchaseModelResource(resources.ModelResource): 
    class Meta:
        model = Purchase

class PurchaseModelAdmin(ImportExportModelAdmin, CustomModelAdmin):
    
    resource_class = PurchaseModelResource

class SaleModelResource(resources.ModelResource): 
    class Meta:
        model = Sale

class SaleModelAdmin(ImportExportModelAdmin, CustomModelAdmin):
    
    resource_class = SaleModelResource
admin.site.register(Category, CustomModelAdmin)
admin.site.register(Brand, CustomModelAdmin)
admin.site.register(Product, ProductModelAdmin)
admin.site.register(Firm, CustomModelAdmin)
admin.site.register(Purchase, PurchaseModelAdmin)
admin.site.register(Sale, SaleModelAdmin)