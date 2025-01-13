from PIL import Image, ExifTags
import io
from django.core.files.uploadedfile import InMemoryUploadedFile


def compress_image_to_webp(image):
    # 画像を開く
    img = Image.open(image)

    # EXIF情報から回転方向を取得して回転処理を行う
    try:
        # EXIF情報を取得
        exif = img._getexif()
        if exif is not None:
            for tag, value in exif.items():
                if ExifTags.TAGS.get(tag) == "Orientation":
                    # 回転方向に応じて画像を回転
                    if value == 3:
                        img = img.rotate(180, expand=True)
                    elif value == 6:
                        img = img.rotate(270, expand=True)
                    elif value == 8:
                        img = img.rotate(90, expand=True)
    except (AttributeError, KeyError, IndexError):
        # EXIF情報が無い場合やエラーが発生した場合は無視
        pass

    # 画像をWebP形式で圧縮
    image_io = io.BytesIO()
    img.save(image_io, format="WEBP", quality=10)
    image_io.seek(0)

    # ファイル名を変更してWebP拡張子を追加
    webp_image_name = image.name.rsplit('.', 1)[0] + '.webp'

    # 圧縮後の画像を返す（ファイル名をwebpに変更）
    return InMemoryUploadedFile(
        image_io, None, webp_image_name, "image/webp", image_io.tell(), None
    )
