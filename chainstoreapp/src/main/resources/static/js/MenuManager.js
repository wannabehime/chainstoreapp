export class MenuManager {
    constructor() {
        this.menuResultContainer = document.getElementById('menu-result-container');
    }

    initMenus(brandName, priceLimit) {
		// メニュー表示のコンテナをクリア
        this.clearMenuResultContainer();
        // メニュー表示のラッパーを作成
        const firstMenuResultWrapper = this.createMenuResultWrapper();
        const secondMenuResultWrapper = this.createMenuResultWrapper();
        // 最初のランダムなメニューを表示
        this.getMenus(brandName, priceLimit, firstMenuResultWrapper);
        this.getMenus(brandName, priceLimit, secondMenuResultWrapper);
    }

//		------ メニュー表示のラッパーを作成 ------
    clearMenuResultContainer() {
        while (this.menuResultContainer.firstChild) {
            this.menuResultContainer.removeChild(this.menuResultContainer.firstChild);
        }
    }

    createMenuResultWrapper() {
        const menuResultWrapper = document.createElement('div');
        menuResultWrapper.className = 'menu-result-wrapper';
        this.menuResultContainer.appendChild(menuResultWrapper);
        return menuResultWrapper;
    }

//		------ メニューをシャッフル ------
    getMenus(brandName, priceLimit, menuResultWrapper) {
        fetch(`/chainstoresearch/get-menus?brandName=${brandName}&priceLimit=${priceLimit}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error();
                }
                return response.json();
            })
            .then(menus => {
                this.getMenusSuccess(brandName, priceLimit, menuResultWrapper, menus);
            })
            .catch(error => {
                this.showGetInformationStatus();
            });
    }

//		------ getMenus内fetchの成功時に呼び出される関数 ------
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

//		------ メニューの生成 ------
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

//		------ 合計金額の生成 ------
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

//		------ シャッフルボタンの生成 ------
    createShuffleMenusButton(brandName, priceLimit, menuResultWrapper) {
        const shuffleMenusButton = document.createElement('button');
        shuffleMenusButton.className = 'shuffle-menus-button';
        shuffleMenusButton.textContent = 'シャッフル';
        shuffleMenusButton.addEventListener('click', () => {
            this.getMenus(brandName, priceLimit, menuResultWrapper);
        });

        return shuffleMenusButton;
    }

    showGetInformationStatus() {
        const getInfoStatusDiv = document.getElementById('get-information-status');
        getInfoStatusDiv.style.display = 'block';
        setTimeout(() => {
            getInfoStatusDiv.style.display = 'none';
        }, 3000);
    }
}