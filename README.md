# Contract (Scilla)

## test

```
$ docker-compose up
```

## deploy

### ローカルにノードを立ち上げる

```
$ git clone https://github.com/Zilliqa/kaya
$ cd kaya
$ yarn
$ node ./server.js
```

### デプロイ

```
# 上で出てきた秘密鍵のうちどれかをdeploy.jsの`const privateKey =`以降に貼り付ける

$ yarn deploy
```

