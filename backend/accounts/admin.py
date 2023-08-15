from django.contrib import admin
from django.contrib.auth.models import User

if User in admin.site._registry: 
    admin.site.unregister(User)

from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import UserAccount
class UserAccountChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = UserAccount
        fields = ('email', 'first_name', 'last_name', 'password')

class UserAccountCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = UserAccount
        fields = ('email', 'first_name', 'last_name', 'password')

from django.contrib.auth.admin import UserAdmin 
class UserAccountAdmin(UserAdmin):
    form = UserAccountChangeForm 
    add_form = UserAccountCreationForm 

    list_display = ['id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser', 'created_date', 'updated_date']

    list_display_links = ["id", 'email']

    ordering = ('id','email',) 

    readonly_fields = ('last_login', 'created_date', 'updated_date')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {
            "classes": ("collapse",),
            'fields': (('first_name','last_name'),'image', 'about'), 
            'description': "You can use this section to see user informations",
            }),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {
            "classes": ("collapse",),
            'fields': ('last_login', ('created_date', 'updated_date')),
            'description': "You can use this section to see date informations"
            }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password'),
        }),
    )

admin.site.register(UserAccount, UserAccountAdmin)

