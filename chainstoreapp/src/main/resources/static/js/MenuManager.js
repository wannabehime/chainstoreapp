/**
 * メニューに関するクラス
 */
export class MenuManager {
    constructor() {
        this.menuResultContainer = document.getElementById('menu-result-container'); // メニューを表示するコンテナ要素
    }

    init(brandName, priceLimit) {
		// メニュー表示のコンテナをクリア
        this.clearMenuResultContainer();
        // メニュー表示のラッパーを作成
        const firstMenuResultWrapper = this.createMenuResultWrapper();
        const secondMenuResultWrapper = this.createMenuResultWrapper();
        // 最初のランダムなメニューを表示
        this.getMenus(brandName, priceLimit, firstMenuResultWrapper);
        this.getMenus(brandName, priceLimit, secondMenuResultWrapper);
    }

	/**
	 * メニュー表示のコンテナをクリアするメソッド
	 */
    clearMenuResultContainer() {
        while (this.menuResultContainer.firstChild) {
            this.menuResultContainer.removeChild(this.menuResultContainer.firstChild);
        }
    }

	/**
	 * コンテナの中にラッパーを作成するメソッド
	 */
    createMenuResultWrapper() {
        const menuResultWrapper = document.createElement('div');
        menuResultWrapper.className = 'menu-result-wrapper';
        this.menuResultContainer.appendChild(menuResultWrapper);
        return menuResultWrapper;
    }

	/**
	 * メニューを取得するメソッド
	 */
    getMenus(brandName, priceLimit, menuResultWrapper) {
        fetch(`/chainstoresearch/get-menus?brandName=${brandName}&priceLimit=${priceLimit}`)
            .then(response => { // fetchの戻り値であるPromiseオブジェクトは、成功時then・失敗時catchを呼ぶ
                if (!response.ok) {
                    throw new Error(); // Promiseオブジェクトがrejectになるのはネットワークエラーなので、リクエスト失敗時にcatchで捕捉できるよう例外を投げる
                }
                return response.json(); // アロー関数の略記ではreturnしないと次のthenに値を渡せない
            })
            .then(menus => { // json()はPromiseオブジェクトを返すので、thenで繋げる必要がある
                this.getMenusSuccess(brandName, priceLimit, menuResultWrapper, menus);
            })
            .catch(error => {
                this.showGetInformationStatus();
            });
    }

	/**
	 * メニュー取得に成功した場合の、メニュー表示を行うメソッド
	 */
    getMenusSuccess(brandName, priceLimit, menuResultWrapper, menus) {
		// メニュー表示のラッパーをクリア
        while (menuResultWrapper.firstChild) {
            menuResultWrapper.removeChild(menuResultWrapper.firstChild);
        }

        const { menuBoxDiv, priceCounter } = this.createMenuBox(menus); //メニューの生成
        const totalPriceBoxDiv = this.createTotalPriceBox(priceCounter); // 合計金額の生成
        const shuffleMenusButton = this.createShuffleMenusButton(brandName, priceLimit, menuResultWrapper); // シャッフルボタンの生成
		
		//	生成した要素を集約
        const menuResultGroupDiv = document.createElement('div');
        menuResultGroupDiv.className = 'menu-result-group';
        menuResultGroupDiv.appendChild(menuBoxDiv);
        menuResultGroupDiv.appendChild(totalPriceBoxDiv);
        menuResultWrapper.appendChild(menuResultGroupDiv);
        menuResultWrapper.appendChild(shuffleMenusButton);
    }

	/**
	 * メニューを生成するメソッド
	 */
	createMenuBox(menus) {
        let priceCounter = 0; // createTotalPriceBox関数で用いる合計金額のカウンター
        // メニューdivを入れるボックスの生成
        const menuBoxDiv = document.createElement('div');
        menuBoxDiv.className = 'menu-box';

        menus.forEach(menu => {
			// メニュー名と価格を入れるdivの生成
            const menuDiv = document.createElement('div');
            menuDiv.className = 'menu';

			// メニュー名の生成
            const menuNameSpan = document.createElement('span');
            menuNameSpan.className = 'menu-name';
            menuNameSpan.textContent = menu.name;
			// 価格の生成
            const menuPriceSpan = document.createElement('span');
            menuPriceSpan.className = 'menu-price';
            menuPriceSpan.textContent = menu.price + '円';
			
			// メニュー名と価格をメニューdivに、メニューdivをボックスに入れる
            menuDiv.appendChild(menuNameSpan);
            menuDiv.appendChild(menuPriceSpan);
            menuBoxDiv.appendChild(menuDiv);
			// 合計金額を累加する
            priceCounter += parseInt(menu.price);
        });

        return { menuBoxDiv, priceCounter };
    }

	/**
	 * 合計金額を生成するメソッド
	 */
    createTotalPriceBox(priceCounter) {
		// 合計金額の前に表示する「合計」の生成
        const totalPriceSymbolSpan = document.createElement('span');
        totalPriceSymbolSpan.className = 'total-price-symbol';
        totalPriceSymbolSpan.textContent = '合計';

		// 合計金額の生成
        const totalPriceValueSpan = document.createElement('span');
        totalPriceValueSpan.className = 'total-price-value';
        totalPriceValueSpan.textContent = priceCounter + '円';

		// spanを生成し、合計金額と「合計」を入れる
        const totalPriceSpan = document.createElement('span');
        totalPriceSpan.className = 'total-price';
        totalPriceSpan.appendChild(totalPriceSymbolSpan);
        totalPriceSpan.appendChild(totalPriceValueSpan);

		// divを生成し、spanを入れる
        const totalPriceBoxDiv = document.createElement('div');
        totalPriceBoxDiv.className = 'total-price-box';
        totalPriceBoxDiv.appendChild(totalPriceSpan);

        return totalPriceBoxDiv;
    }

	/**
	 * シャッフルボタンを生成するメソッド
	 */
    createShuffleMenusButton(brandName, priceLimit, menuResultWrapper) {
        const shuffleMenusButton = document.createElement('button');
        shuffleMenusButton.className = 'shuffle-menus-button';
        shuffleMenusButton.textContent = 'シャッフル';
        shuffleMenusButton.addEventListener('click', () => {
            this.getMenus(brandName, priceLimit, menuResultWrapper);
        });

        return shuffleMenusButton;
    }

	//TODO: エラーメッセージ
    showGetInformationStatus() {
        const getInfoStatusDiv = document.getElementById('get-information-status');
        getInfoStatusDiv.style.display = 'block';
        setTimeout(() => {
            getInfoStatusDiv.style.display = 'none';
        }, 3000);
    }
}