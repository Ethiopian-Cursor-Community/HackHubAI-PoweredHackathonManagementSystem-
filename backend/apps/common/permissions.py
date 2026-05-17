from rest_framework.permissions import BasePermission


class HasRole(BasePermission):
    allowed_roles = ()

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in self.allowed_roles


class IsAdmin(HasRole):
    allowed_roles = ("admin",)


class IsOrganizer(HasRole):
    allowed_roles = ("organizer", "admin")


class IsJudge(HasRole):
    allowed_roles = ("judge", "admin")


class IsParticipant(HasRole):
    allowed_roles = ("participant", "admin")
