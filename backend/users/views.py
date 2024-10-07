from users.serializer import UserSerializer
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response


class UserRetrieveAPIView(RetrieveAPIView):

    def get(self, request):
        user = request.user  # Get the authenticated user
        serializer = UserSerializer(user)  # Serialize the user
        return Response(serializer.data)  # Return serialized user data
