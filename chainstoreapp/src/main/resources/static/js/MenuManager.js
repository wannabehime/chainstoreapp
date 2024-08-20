/**
 * メニューに関するクラス
 */
export class MenuManager {
    constructor() {
        this.menuBoardContainerDiv = document.getElementById('menu-board-container');
        this.menuResultContainer = document.getElementById('menu-result-container');
        this.menuResultWrappers = this.menuResultContainer.querySelectorAll('.menu-result-wrapper');
        this.priceLimit = document.getElementById('price-limit');
    }

    init(brandName, priceLimit) {
        this.menuResultWrappers.forEach(wrapper => {
            wrapper.style.display = 'flex';
            this.getMenus(brandName, priceLimit, wrapper);
        });
    }
    
    displayMenuResultsContainer() {
        this.menuBoardContainerDiv.style.display = 'block';
        this.priceLimit.options[0].selected = true;
        this.menuResultWrappers.forEach(wrapper => {
            wrapper.style.display = 'none';
            const menuBox = wrapper.querySelector('.menu-box');
            menuBox.innerHTML = ''; // メニューをクリア
            const totalPriceValue = wrapper.querySelector('.total-price-value');
            totalPriceValue.textContent = ''; // 合計金額をクリア
        });
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
        const menuBox = menuResultWrapper.querySelector('.menu-box');
        menuBox.innerHTML = ''; // メニューをクリア

        let priceCounter = 0;
        menus.forEach(menu => {
            const menuDiv = this.createMenuElement(menu);
            menuBox.appendChild(menuDiv);
            priceCounter += parseInt(menu.price);
        });

        const totalPriceValue = menuResultWrapper.querySelector('.total-price-value');
        totalPriceValue.textContent = priceCounter + '円';

        const shuffleMenusButton = menuResultWrapper.querySelector('.shuffle-menus-button');
        shuffleMenusButton.onclick = () => this.getMenus(brandName, priceLimit, menuResultWrapper);
    }

    createMenuElement(menu) {
        const menuDiv = document.createElement('div');
        menuDiv.className = 'menu';
        menuDiv.innerHTML = `
            <span class="menu-name">${menu.name}</span>
            <span class="menu-price">${menu.price}円</span>
        `;
        return menuDiv;
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