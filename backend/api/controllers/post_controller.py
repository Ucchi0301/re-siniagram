from rest_framework.views import APIView
from rest_framework.response import Response
from common.models import PostContent
from api.serializers.post_serializer import PostSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


class PostListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = PostContent.objects.all()
        serializer = PostSerializer(queryset, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(status=status.HTTP_201_CREATED, data=serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        queryset = PostContent.objects.get(pk=pk)
        serializer = PostSerializer(queryset)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    def put(self, request, pk):
        queryset = PostContent.objects.get(pk=pk)
        serializer = PostSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK, data=serializer.data)
        return Response(serializer.errors)

    def delete(self, request, pk):
        queryset = PostContent.objects.get(pk=pk)
        queryset.delete()
        return Response(status=status.HTTP_200_OK)


class RandomPostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = PostContent.objects.order_by("?").first()
        serializer = PostSerializer(queryset)
        return Response(status=status.HTTP_200_OK, data=serializer.data)
