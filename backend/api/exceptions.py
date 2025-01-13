from rest_framework.exceptions import APIException


class GroupAlreadyJoinedException(APIException):
    status_code = 400
    default_detail = "すでにグループに参加しています"
    default_code = "group_already_joined"

class UserNotInGroupException(APIException):
    status_code = 400
    default_detail = "グループに所属していません"
    default_code = "user_not_in_group"

class GroupNotFoundException(APIException):
    status_code = 404
    default_detail = "グループが見つかりません"
    default_code = "group_not_found"


class PasswordOrIdException(APIException):
    status_code = 400
    default_detail = "パスワードかIDが間違っています"
    default_code = "password_or_id_error"
