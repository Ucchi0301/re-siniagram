from rest_framework.views import APIView
from rest_framework.response import Response
from common.models import PostContent
from api.serializers.post_serializer import PostSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


class PostView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        queryset = PostContent.objects.all()
        serializer = PostSerializer(queryset, many=True)
        return Response(status=status.HTTP_200_OK ,data=serializer.data)

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(status=status.HTTP_200_OK ,data=serializer.data)
        return Response(serializer.errors)