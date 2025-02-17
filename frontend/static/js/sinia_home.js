// 画像の縦向き・横向きを確認する関数
const img = document.getElementById('photo');

// 画像が読み込まれた後に動作する
function imageRotate() {
    const width = img.naturalWidth;
    const height = img.naturalHeight;

    if (width > height) {
        // 横向きの画像の場合: 90度回転
        img.style.transform = 'rotate(90deg)';
        img.style.width = '80vh';  // 回転後の横幅を画面いっぱいに設定
        img.style.height = 'auto';  // 高さも100%に設定
    } else if (width < height) {
        // 縦向きの画像の場合: そのまま表示
        img.style.transform = 'none';
        img.style.width = 'auto';   // 幅を画面いっぱいに
        img.style.height = '80vh';  // 高さも100%に設定
    } else {
        // 縦と横が同じ場合（正方形の画像）
        img.style.transform = 'none';  // 回転なし
        img.style.width = '100%';      // 幅を100%に設定
        img.style.height = 'auto';     // 高さを自動調整
    }
};

// CSRFトークンを取得する関数
function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

$(document).ready(function () {
    const csrftoken = getCSRFToken(); // CSRFトークンを取得

    let isFetching = false; // リクエスト中フラグ

    function fetchRandomPost() {
        $.ajax({
            url: '/api/post/random/', // APIエンドポイント
            type: 'GET',
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function (data) {
                if (data.image) {
                    $('#photo').attr('src', data.image);
                }
                isFetching = false; // フラグ解除
                $('#fetchRandomPost').prop('disabled', false); // ボタンを有効化
            },
            error: function () {
                isFetching = false; // フラグ解除
                $('#fetchRandomPost').prop('disabled', false); // ボタンを有効化
            }
        });
    }

    // 初期ロード時にリクエストを実行
    fetchRandomPost();

    // 画像読み込み後に回転を適用
    $('#photo').on('load', function() {
        imageRotate();
    });

    // ボタンのクリックイベント
    const button = $('#fetchRandomPost');

    button.on('mousedown touchstart', function () {
        $(this).addClass('pressed'); // 押した状態のクラスを追加
    });

    button.on('mouseup touchend', function () {
        $(this).removeClass('pressed'); // 押した状態のクラスを削除
    });

    button.on('click', function (event) {
        if (isFetching) {
            event.preventDefault(); // リクエスト中は無効化
            return;
        }

        isFetching = true; // フラグを設定
        $(this).prop('disabled', true); // ボタンを無効化
        fetchRandomPost();
    });

    // ボタン領域でのタッチイベントを監視
    $('#fetchRandomPost').on('touchstart', function (event) {
        // タッチされた指の数を取得
        const touchCount = event.touches.length;

        // 1本の指でのタップ：通常のクリック動作
        if (touchCount === 1) {
            if (isFetching) return;  // 既にリクエスト中なら処理しない

            isFetching = true;  // フラグを立てて処理中にする
            $('#fetchRandomPost').prop('disabled', true); // ボタンを無効にする
            fetchRandomPost();

            // `touchstart` が発生した場合、`click` イベントは無視
            event.preventDefault(); // クリックイベントが発火しないようにする
        }

        // 2本以上の指でのタッチ：長押しを許可
        if (touchCount >= 2) {
            if (isFetching) return;  // 既にリクエスト中なら処理しない

            isFetching = true;  // フラグを立てて処理中にする
            $('#fetchRandomPost').prop('disabled', true); // ボタンを無効にする
            fetchRandomPost();
        }
    });

    // `touchend` イベントは無視する
    $('#fetchRandomPost').on('touchend', function (event) {
        if (isFetching) {
            event.preventDefault(); // リクエストが送信された場合、`touchend` での処理を無効にする
        }
    });

    // `click` イベントを無視
    $('#fetchRandomPost').on('click', function (event) {
        if (isFetching) {
            event.preventDefault(); // クリックイベントでリクエストを送らない
        }
    });
});
