# Watch Dog

## 概要

Watch Dogは、指定されたAPIエンドポイントを定期的に監視し、サービスの状態をチェックするAWS CDKプロジェクトです。
サービスが停止している場合は、SNSトピックにアラートメッセージを送信します。

## 特徴

* AWS Lambdaを使用してAPIエンドポイントを定期的にポーリングします。
* サービスの停止を検知すると、SNSトピックにアラートメッセージを送信します。
* CloudWatch Eventsを使用してLambda関数を定期的に実行します。
* .envファイルを使用して環境変数を設定します。

## プロジェクト構成

```
.
├── bin
│   └── watch_dog.ts        // CDKアプリのエントリポイント
├── lambda
│   ├── index.mjs           // Lambda関数のコード
│   └── package.json        // Lambda関数の依存関係
├── lib
│   └── watch_dog-stack.ts  // CDKスタックの定義
├── test
│   ├── polling.go          // APIエンドポイントへのポーリングテスト
│   └── watch_dog.test.ts   // CDKスタックのテスト
├── .npmignore
├── cdk.json                 // CDKの設定ファイル
├── jest.config.js          // Jestの設定ファイル
├── package.json            // プロジェクトの依存関係
└── tsconfig.json            // TypeScriptの設定ファイル
```

## インストール方法

1. AWS CLIとCDK Toolkitがインストールされていることを確認してください。
2. リポジトリをクローンします。
3. プロジェクトディレクトリに移動します。
4. 依存関係をインストールします。

```bash
npm install
```

## 環境変数の設定

`.env`ファイルを作成し、以下の環境変数を設定します。

```
API_ENDPOINT=<APIエンドポイントのURL>
WATCH_DOG_KEY=<APIキー>
API_SECRET=<APIシークレット>
```

## デプロイ方法

1. CDK Toolkitを使用してスタックをデプロイします。

```bash
npx cdk deploy
```

## 使い方

1. APIエンドポイントを監視対象のサービスに設定します。
2. APIキーとAPIシークレットを設定します。
3. スタックをデプロイします。
4. Lambda関数が定期的にAPIエンドポイントをポーリングし、サービスの状態をチェックします。
5. サービスが停止している場合は、SNSトピックにアラートメッセージが送信されます。

## コマンド実行例

* TypeScriptのコンパイル:

```bash
npm run build
```

* TypeScriptの変更を監視してコンパイル:

```bash
npm run watch
```

* Jestによるユニットテストの実行:

```bash
npm run test
```

* CDKスタックのデプロイ:

```bash
npx cdk deploy
```

* デプロイされたスタックと現在の状態の比較:

```bash
npx cdk diff
```

* CloudFormationテンプレートの出力:

```bash
npx cdk synth
```

## ライセンス

このプロジェクトはMITライセンスで公開されています。
