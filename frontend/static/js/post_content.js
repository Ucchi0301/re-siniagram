$(document).ready(function () {
    const selectedFiles = []; // 選択された画像を管理

    // 画像選択時の処理
    $('#images').on('change', function (event) {
        const files = Array.from(event.target.files);

        // 選択された画像を`selectedFiles`に追加
        files.forEach((file) => {
            if (!selectedFiles.some((f) => f.name === file.name)) {
                selectedFiles.push(file);
            }
        });

        updatePreview(); // プレビューを更新
    });

    // プレビュー更新関数
    function updatePreview() {
        const previewContainer = $('#preview-container');
        previewContainer.empty();

        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const previewDiv = $('<div>')
                    .addClass('preview-item position-relative');

                const img = $('<img>')
                    .attr('src', e.target.result)
                    .addClass('img-thumbnail col-4');

                const closeButton = $('<button>')
                    .addClass('btn btn-danger btn-sm position-absolute top-0 end-0 m-1')
                    .text('やめる')
                    .click(function () {
                        selectedFiles.splice(index, 1); // 配列から削除
                        updatePreview(); // プレビュー更新
                    });

                // 画像の親要素にposition: relativeを指定し、バツボタンをその中に配置
                previewDiv.append(img).append(closeButton);
                previewContainer.append(previewDiv);
            };
            reader.readAsDataURL(file);
        });
    }

    // フォーム送信時の処理
    $('#create-post-form').submit(function (event) {
        event.preventDefault();

        if (selectedFiles.length === 0) {
            alert('少なくとも1枚の画像を選択してください。');
            return;
        }

        const submitButton = $('#submit-button'); // ボタンを取得
        const spinner = $('#loading-spinner'); // スピンを取得

        // ボタンを無効化し、スピンを表示
        submitButton.prop('disabled', true);
        spinner.removeClass('d-none');

        let successCount = 0;
        let errorCount = 0;

        // 画像を1枚ずつPOST
        selectedFiles.forEach((file, index) => {
            const formData = new FormData();
            formData.append('image', file);

            $.ajax({
                url: '/api/post/create/',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                },
                success: function () {
                    successCount++;
                    if (successCount + errorCount === selectedFiles.length) {
                        finalizePost(successCount, errorCount);
                    }
                },
                error: function () {
                    errorCount++;
                    if (successCount + errorCount === selectedFiles.length) {
                        finalizePost(successCount, errorCount);
                    }
                },
            });
        });

        // POST終了時の処理
        function finalizePost(successCount, errorCount) {
            let message = '';
            if (successCount > 0) {
                message += `<div class="alert alert-success">${successCount} 枚の画像が正常に投稿されました。</div>`;
            }
            if (errorCount > 0) {
                message += `<div class="alert alert-danger">${errorCount} 枚の画像の投稿に失敗しました。</div>`;
            }
            $('#response-message').html(message);

            selectedFiles.length = 0; // 配列をリセット
            updatePreview(); // プレビュークリア
            $('#images').val(''); // inputをリセット

            // ボタンを有効化し、スピンを非表示
            submitButton.prop('disabled', false);
            spinner.addClass('d-none');
        }
    });

    // CSRFトークン取得関数
    function getCSRFToken() {
        return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }
});
