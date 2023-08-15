from rest_framework import permissions

class IsStaffOrSuperuserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow staff or superusers to modify (POST, PUT, DELETE) objects.
    GET requests are allowed to everyone.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user and request.user.is_staff or request.user.is_superuser