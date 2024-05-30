from rest_framework.permissions import BasePermission, IsAuthenticated


class IsAdminOrReadOnly(BasePermission):
    """
    Permission for administrators or read-only.
    """

    def has_permission(self, request, view):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return request.user and request.user.is_staff
        return True


class AllowAnyPostAndAuthenticatedReadOnly(BasePermission):
    """
    Allow all on POST, and view only for authorized users.
    """

    def has_permission(self, request, view):
        if request.method == "POST":
            return True
        return request.user and request.user.is_authenticated
