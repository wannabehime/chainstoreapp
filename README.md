# chainstoreapp

## 【アプリの目的】
・チェーン店検索からメニュー決定までをワンストップで行えるアプリ  

・ここで言うチェーン店とは、主に牛丼屋(すき家等)とうどん屋(はなまるうどん等)  
・上記のチェーン店は他の食品を扱うチェーン店に比べ、メニューの組み合わせの自由度が高い故に考える時間を要するも、発券機に並んでいる人々の存在が気になって落ち着けず、結局満足のいくメニュー選択ができなかった経験が出発点。

・メニューの組み合わせの自由度が高いというのは、例えばマクドナルドと比べてみると、こちらはセットメニューで価格が最適化されているので、大体はセットメニューの一覧を見て、価格と食べたいものの均衡点を特定すれば事足りる。  
・しかし、今回扱うチェーン店はそうはいかない。まず、牛丼やうどんといったメインメニューの中で、豪華さに応じて価格が変動するのは、マクドナルドと一緒だ。しかしそれに加え、牛丼屋にはトッピング、うどん屋には天ぷらやおでんといったサイドメニューが充実している。すると、マクドナルドのようにメインメニューの一覧を見るだけでは、そのとき最も食べたい組み合わせを考えるには事足りず、メインメニュー＋サイドメニューの組み合わせも考えないといけない。

・例えば、うどん屋では大抵かけうどんが最安だが、それだけでは今ひとつ足りないと思ったとしよう。充実させるには、メインのうどんをきつねうどんにするなどのグレードアップを図るもよし、一方で、かけうどんに天ぷらやおでんを付けるというサイドメニューによるグレードアップを図るのもよい。  
・今回はかけうどんのグレードアップだけなので、注文の直前にその場で考えることも比較的容易だが、これが予算を拡大するとそうはいかない。うどん屋で予算800円ほどになると、メイン×サイドの組み合わせはかなりの数になるだろう。  
・しかし、うどん屋ないし牛丼屋等のチェーン店は、注文までの時間が非常に短く、組み合わせを考えている余裕がない。そこで、予算を入力すると、その予算内でメニューの組み合わせをランダム表示する機能を作成した。

・さらに、チェーン店に行こうとするとき、必要なのはメニュー決定だけでなく、店舗の位置である。そこで、現在地周辺の店舗位置を検索・ルート表示を行える機能も実装した。

## 【操作手順】
### 1. トップ画面
   ・現在地のマーカーが表示される  
   ・以後、常時現在地を監視し、変更があればマーカーが移動する
   
   ![スクリーンショット 2024-06-15 23 03 22](https://github.com/wannabehime/chainstoreapp/assets/106756903/724aa338-cf36-46a7-84ca-a014615adce4)

### 2. チェーン店検索

  #### 2.1. 検索条件入力
  
   ##### 2.1.1. ブランド名
   ・入力欄にホバーするとドロップダウンが出現、その中から選択。  
   ・ただ、現時点では直接入力もできてしまうが、後述のメニュー検索の都合上ドロップダウンからのみ選択できるようにしたい。
      
   ![スクリーンショット 2024-06-15 23 03 40](https://github.com/wannabehime/chainstoreapp/assets/106756903/af83f143-b233-4ea4-9ab7-cdb9ce920280)
      
   ![スクリーンショット 2024-06-15 23 03 54](https://github.com/wannabehime/chainstoreapp/assets/106756903/e72ee9a9-635f-4999-a525-82631d561ad5)

   ##### 2.1.2. 検索範囲の中心地
   ・2文字以上入力すると、駅名サジェストが出現、その中から選択。  
   ・サジェストは駅名DBから取得し、「(入力文字 + "駅")の駅名」→「入力文字から始まる駅名」→「入力文字が含まれる駅名」の順で表示。  
   ・駅名入力ではなく、「現在地から検索」ボタンにより、「現在地」という文字列入力も可能。文字列上だけでなく、内部処理でも現在地の経緯度を取得してある。
      
   ![スクリーンショット 2024-06-15 23 04 04](https://github.com/wannabehime/chainstoreapp/assets/106756903/8f9a39bf-e5c6-45bc-8c2f-7631e7b3cfb4)
   
   ![スクリーンショット 2024-06-15 23 04 15](https://github.com/wannabehime/chainstoreapp/assets/106756903/f61b3f2e-2bd9-4c74-9a6c-78a73c754a61)

   ##### 2.1.3. 中心地からの範囲
   ・入力欄をクリックするとドロップダウンが出現、その中から選択。  
   ・ただし、ユーザビリティ的に不要な気がしたので、後々範囲指定は無くして自動で300mとかにするつもり。  
      
   ![スクリーンショット 2024-06-15 23 04 22](https://github.com/wannabehime/chainstoreapp/assets/106756903/3edf84d4-a274-4446-886d-b620a0d40da8)
   
   　![スクリーンショット 2024-06-15 23 04 27](https://github.com/wannabehime/chainstoreapp/assets/106756903/2eb89d90-6e07-4b43-92f6-f971efcc5c00)
      
  #### 2.2. 店舗の位置マーカー・店舗までの徒歩時間表示
   ・「検索」ボタンを押下すると、条件に該当する全ての店舗の位置のマーカーと、現在地マーカーが収まるように、マップの表示範囲が調整される。  
   ・店舗マーカーには現在地からの徒歩時間も表示される。
   
   ・3で使う予算入力欄、4で使う「一覧に戻る」ボタンも表示される。後者はタイミング再考の余地あり。
      
   ![スクリーンショット 2024-06-15 23 04 34](https://github.com/wannabehime/chainstoreapp/assets/106756903/f576969e-a4bf-4da4-96a9-d9952ba4396c)

### 3. メニューのランダム表示

   #### 3.1. 予算入力
  ・入力欄をクリックするとドロップダウンが出現、その中から選択。
     
   ![スクリーンショット 2024-06-15 23 04 40](https://github.com/wannabehime/chainstoreapp/assets/106756903/f16ab013-9eb7-45e1-9648-6c9a031a59ec)

   #### 3.2. メニューのランダム表示
  ・予算を入力すると、検索したブランドのチェーン店のメニューDBから、予算以内、かつ最低メイン1品、かつランダムでメニューを取得して表示する。  
  ・3.3のシャッフルを使った後ユーザーがメニューを比較できるよう、2通り表示する。
     
   ![スクリーンショット 2024-06-15 23 04 46](https://github.com/wannabehime/chainstoreapp/assets/106756903/78773aec-a610-484d-8fe0-6f2a9ab20d05)
     
   #### 3.3. メニューシャッフル
  ・「シャッフル」ボタンを押すと、2通り表示されているメニューのうち、押したボタンが紐づいている方について、3.2のメニューランダム取得が再度行われる（スクショは下のボタンを押した)。
     
   ![スクリーンショット 2024-06-15 23 04 55](https://github.com/wannabehime/chainstoreapp/assets/106756903/678a9fbe-4abf-492a-944d-d357a9d252a5)

### 4. ルート検索

   #### 4.1. 現在地から店舗までのルート表示
  ・マーカーの吹き出しの「ルート」ボタンを押すと、現在地から店舗までのルートが表示され、ルートにフォーカスするようにマップの表示範囲が調整される。
     
   ![スクリーンショット 2024-06-15 23 05 11](https://github.com/wannabehime/chainstoreapp/assets/106756903/025a6e33-6b8b-424e-a8ed-9879ef7a0c79)

   #### 4.2. 店舗一覧に戻る
  ・ルートを表示させた状態で「一覧に戻る」ボタンを押すと、ルート表示が消え、再度全ての店舗マーカーが表示される。
     
   ![スクリーンショット 2024-06-15 23 06 36](https://github.com/wannabehime/chainstoreapp/assets/106756903/1dd30a4e-a228-4c6d-81c1-dfeee632e48e)
