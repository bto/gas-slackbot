# 開発環境構築

## ローカル環境の初期化

注) この操作はプロジェクト内のファイルにしか影響しないので安心

- `make init` を実行

## clasp を使えるようにするための認証

[clasp](https://github.com/google/clasp) を使えるようにするために Google 認証をします。
これは Global に設定される認証なので、既に他のプロジェクトで実行していれば作業は不要です。

- `make login` を実行
- ブラウザが開くので認証する
- うまくいけば `$HOME/.clasprc.json` ができているはず

## Standalone Google Apps Script の作成

[Googleのマニュアル](https://developers.google.com/apps-script/guides/standalone)に作り方が書いてある。
おすすめは [Google Drive](https://drive.google.com) にアクセスして作る方法。[Developer Hub](https://script.google.com)から作ると `My Drive` に作成されてしまう。

- [Google Drive](https://drive.google.com) にアクセス
- Google Drive に Google Apps Script を追加してない場合
  - New -> More -> Connect more apps
  - `script` で検索
  - `Google Apps Script` を追加
- 好きなフォルダに `Google Apps Script` を追加
  - おすすめのプロジェクト名: `<MyName>SlackBotApp`
- 以下これを `GAS Project` と表記

## GAS Project に開発用の slack の設定

[開発用の SlackApp](https://api.slack.com/apps/AC92PKXST) を作ってあるので、そちらを登録します。
もちろん自分で SlackApp を作って、それを登録しても構いません。
アクセス権がない場合は、管理者に相談して collaborator に追加してもらってください。

- GAS Project -> File -> Project properties -> Script properties
- TEST_SLACK_ACCESS_TOKEN: SlackApp -> Install App -> Bot User OAuth Access Token
- TEST_SLACK_CHANNEL_ID: C070J8TDK
- TEST_SLACK_VERIFICATION_TOKEN: SlackApp -> Basic Information -> App Credentials -> Verification Token

## Script Id の登録

- GAS Project -> File -> Project properties -> Script Id
- .clasp.json -> `scriptId` を変更

## Google Developer Project とのひも付け

GAS 用の [Google Developer Project](https://console.developers.google.com/apis/dashboard?project=apps-script-160201) を用意しているので、それとひも付けします。
自分で新しく Project を作成しても良いですが大変です。
プロジェクトへのアクセス権がない場合は管理者に相談してください。

- GAS Project -> Resources -> Cloud Platform project
- Project Number に `56602297590` を入力

## Credential file のダウンロード

ひも付けした Google Developer Project の Credential file をダウンロードします。
この Credential file を使って、認証したり権限の付与を行います。

- [Google Developer Project の Credentials](https://console.developers.google.com/apis/credentials?project=apps-script-160201) にアクセス
- `cli` の credential をダウンロード
- `creds.json` というファイル名で保存

## Credential を使った認証

先程ダウンロードした Credential ファイルを使って認証します。これで認証したアカウントの権限を使って GAS Project を操作できるようになります。

- `make login-creds` を実行
- ブラウザが開くので認証する
- うまくいけば `.clasprc.json` ができているはず

## ソースコードを push する

- `make push` を実行
- `Manifest` を更新するか聞かれるので、勇気をもって `y` を選択
- うまくいけば `GAS Project` のソースコードが更新されているはず

## test を実行する

- `make test` を実行
- うまくいけば実行に成功するはず
- `make logs` でログが確認できます

# 開発の進め方

## ソースコードの変更

好きなエディタを使ってソースコードを変更してください。

## ソースコードのチェック

`eslint` を使ってソースコードのチェックができます。

- `make check` を実行
- エラー箇所を修正する

## ソースコードを GAS Project に push

- `make push` を実行

## テストを実行

- `make test` を実行

## ログを表示

- `make logs` を実行
