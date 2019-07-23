from authentication.serializers import MemberSignupSerializer, MemberProfileSerializer, MemberPageSerializer
from django.contrib.auth import authenticate
from django.http import Http404
from django.views.generic import DetailView
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from authentication.models import Member


class MemberSignupAPIView(CreateAPIView):
    serializer_class = MemberSignupSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)


class HelloView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'s': 'a'})


class MemberProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        member = self.request.user
        data = MemberProfileSerializer(member).data
        return Response(data)


class Logout(APIView):
    def get(self, request, format=None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class MemberProfileEditAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        member = self.request.user
        first_name = self.request.data.get('first_name', member.first_name)
        last_name = self.request.data.get('last_name', member.last_name)
        if len(first_name) >= 20 or len(last_name) >= 20:
            raise ValidationError('حداکثر طول مجاز نام/نام خانوادگی 20 کاراکتر است.')
        if self.request.data.get('bio', None):
            bio = self.request.data.get('bio')
            if len(bio) < 1000:
                member.bio = bio
            else:
                raise ValidationError('طول بیوگرافی بیش از حد مجاز است.')
        member.first_name = first_name
        member.last_name = last_name
        password = self.request.data.get('password', None)
        if password is not None:
            prev_password = self.request.data.get('lastPassword', None)
            print(password, "nice", prev_password)
            if not prev_password:
                raise ValidationError('پسورد قبلی الزامی است.')
            if not authenticate(username=member.username, password=prev_password):
                raise ValidationError('پسورد قبلی نادرست است.')
            if password.count(' ') > 0:
                raise ValidationError('رمز عبور نباید حاوی کاراکتر فاصله باشد.')
            if len(password) < 6:
                raise ValidationError('رمز عبور باید حداقل 6 کاراکتر باشد.')
            member.set_password(password)
        member.save()
        return Response('تغییرات با موفقیت اعمال شد.')


class MemberPageAPIView(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        username = kwargs.get('username')
        if not username or not Member.objects.filter(username=username).exists():
            raise Http404
        return Response(MemberPageSerializer(Member.objects.get(username=username)).data)

