from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email) 
        user = self.model(
          email=email, 
          **extra_fields
        )

        user.set_password(password) 
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
      user = self.create_user(
        email,
        password=password,
        **extra_fields
    )

      user.is_superuser = True 
      user.is_staff = True 
      user.save(using=self._db) 
      return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    image = models.URLField(max_length = 400, blank=True, null=True, default='https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png')
    about = models.CharField(max_length=500, blank=True, null=True, default='No data')
    created_date = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, blank=True, null=True)
    is_active = models.BooleanField(default=True) 
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    objects = UserAccountManager() 

    USERNAME_FIELD = "email" 
    REQUIRED_FIELDS = ['first_name', 'last_name'] 

    class Meta:
      ordering = (
          'id',
          ) 

    def get_full_name(self):
        return self.first_name + self.last_name

    def get_short_name(self):
        return self.first_name
    
    def __str__(self):
        return self.email

