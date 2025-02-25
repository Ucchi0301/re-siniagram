// 画像の縦向き・横向きを確認する関数
const img = document.getElementById('photo');

function imageRotate() {
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    if (width > height) {
        // 横向きの画像の場合: 90度回転
        img.style.transform = 'rotate(90deg)';
        img.style.width = '80vh';
        img.style.height = 'auto';
    } else if (width < height) {
        // 縦向きの画像の場合: そのまま表示
        img.style.transform = 'none';
        img.style.width = 'auto';
        img.style.height = '80vh';
    } else {
        // 正方形の画像の場合
        img.style.transform = 'none';
        img.style.width = '100%';
        img.style.height = 'auto';
    }
}

// CSRFトークンを取得する関数
function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

$(document).ready(function () {
    const csrftoken = getCSRFToken();
    let isFetching = false; // リクエスト中フラグ

    // 初期状態で画像にぼかしを適用（CSSで.blurredにフィルター指定しておく）
    $('#photo').addClass('blurred');

    function fetchRandomPost() {
        $('#spinner').show(); // ローディングスピンを表示
        $.ajax({
            url: '/api/post/random/',
            type: 'GET',
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function (data) {
                if (data.image) {
                    // 画像読み込み完了時のイベントを設定（キャッシュ対応のためcompleteチェックも）
                    $('#photo').off('load').one('load', function() {
                        imageRotate();
                        $('#spinner').hide(); // ローディングスピンを非表示
                        isFetching = false;
                        $('#fetchRandomPost').prop('disabled', false).removeClass('pressed');
                        // 画像読み込み完了でぼかし解除
                        $(this).removeClass('blurred');
                    });
                    $('#photo').attr('src', data.image);
                    // キャッシュの場合、すでに読み込み済みなら即時loadイベントを発火
                    if ($('#photo')[0].complete) {
                        $('#photo').trigger('load');
                    }
                } else {
                    $('#spinner').hide();
                    isFetching = false;
                    $('#fetchRandomPost').prop('disabled', false).removeClass('pressed');
                    $('#photo').removeClass('blurred');
                }
            },
            error: function () {
                $('#spinner').hide();
                isFetching = false;
                $('#fetchRandomPost').prop('disabled', false).removeClass('pressed');
                $('#photo').removeClass('blurred');
            }
        });
    }

    // 初期ロード時にリクエストを実行
    fetchRandomPost();

    const button = $('#fetchRandomPost');

    // mousedown/touchstart時にボタンを「押し込んだ」状態にする
    button.on('mousedown touchstart', function () {
        if (!$(this).hasClass('pressed')) {
            $(this).addClass('pressed');
        }
    });

    // mouseup/touchendではクラス削除はせず、AJAX完了時に削除する

    button.on('click', function (event) {
        if (isFetching) {
            event.preventDefault();
            return;
        }
        // 再取得時は画像に再度ぼかしを適用
        $('#photo').addClass('blurred');
        isFetching = true;
        $(this).prop('disabled', true);
        fetchRandomPost();
    });

    $('#fetchRandomPost').on('touchstart', function (event) {
        const touchCount = event.touches.length;
        if (touchCount === 1) {
            if (isFetching) return;
            $('#photo').addClass('blurred');
            isFetching = true;
            $(this).prop('disabled', true);
            fetchRandomPost();
            event.preventDefault();
        }
        if (touchCount >= 2) {
            if (isFetching) return;
            $('#photo').addClass('blurred');
            isFetching = true;
            $(this).prop('disabled', true);
            fetchRandomPost();
        }
    });

    $('#fetchRandomPost').on('touchend', function (event) {
        if (isFetching) {
            event.preventDefault();
        }
    });
});
