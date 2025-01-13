from rest_framework.exceptions import APIException


class GroupAlreadyJoinedException(APIException):
    status_code = 400
    default_detail = "すでにグループに参加しています"
    default_code = "group_already_joined"


class GroupNotFoundException(APIException):
    status_code = 404
    default_detail = "グループが見つかりません"
    default_code = "group_not_found"
