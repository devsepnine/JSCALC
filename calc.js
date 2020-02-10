const Display = class{
	#mainView; #subView; #viewOprtr; #tempOprnd; #saveOprnd; #oprtr; #fontUnit;
	constructor() {
		this.#mainView = document.getElementById("mainView");
		this.#subView = document.getElementById("subView");
		this.#viewOprtr = document.getElementById("viewOperator");
		this.#tempOprnd = 0;
		this.#saveOprnd = '';
		this.#oprtr = '';
		this.#fontUnit = "vw";
	};

	get tempOprnd(){
		return this.#tempOprnd;
	}

	get oprtr(){
		return this.#oprtr;
	}

	set fontUnit(unit){
		this.#fontUnit = unit;
	}

	//수식 오류 체크
	isError(){
		return Boolean(this.#mainView.dataset.err);
	}

	setMainNum(number){
		this.#tempOprnd = number;
		this.#mainView.value = this.numWithComma(this.#tempOprnd);
		return this;
	};

	setSaveOprnd(){
		this.#saveOprnd = this.#tempOprnd;
		this.#subView.value = this.numWithComma(this.#saveOprnd);
		this.#tempOprnd = 0;
		this.#mainView.value = this.#tempOprnd;
		return this;
	};

	//음수 입력 처리
	setMinus(){
		this.setMainNum("-");
	};

	addDot(){
		if (this.#tempOprnd.toString().indexOf('.') > 0) return;
		else return this.setMainNum(this.#tempOprnd + '.');
	};

	addNumber(number){
		let lngLmt = 20;
		if(this.#tempOprnd.toString().length > lngLmt) return;
		if(this.#tempOprnd === 0 && number == 0) return;
		if(this.#tempOprnd === 0 && number != 0) this.#tempOprnd = '';
		this.setMainNum(this.#tempOprnd + String(number)).resizeFont();
	};

	addOprtr(oprtr, e){
		this.#oprtr = oprtr;
		this.#viewOprtr.innerHTML = e.target.innerHTML;
	};

	numWithComma(num) {
		if ((num.toString().indexOf('.')) != -1) {
			num = num.toString().split('.');
			return num[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + num[1];
		}
		else return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	result(){
		let equation = this.#saveOprnd + this.#oprtr + this.minusCheck(this.#tempOprnd);
		if(this.#oprtr!='' && Boolean(this.#saveOprnd)) {
			this.allClear();
			let value = +eval(equation).toFixed(12);
			if(value == Number.POSITIVE_INFINITY || value == Number.NEGATIVE_INFINITY) this.#mainView.dataset.err = true;
			this.setMainNum(value).resizeFont();
		}
	};

	//피연산자 음수인지 체크
	minusCheck(number){
		if(isNaN(number)) return 0;
		else return number<0?"("+number+")":number;
	};

	allClear(){
		this.#tempOprnd = 0;
		this.#saveOprnd = '';
		this.#oprtr = '';
		this.#mainView.value = 0;
		this.#subView.value = '';
		this.#viewOprtr.innerHTML = '';
		this.#mainView.dataset.err = '';
	};

	backSpace(){
		let number = Number(this.#tempOprnd.toString().substring(0, String(this.#tempOprnd).length -1));
		this.#tempOprnd = isNaN(number) ? 0 : number;
		this.#mainView.value = this.numWithComma(this.#tempOprnd);
		this.resizeFont();
	};

	//스위치 방식 변경 객체 리터럴
	resizeFont(){
		let element = [this.#mainView, this.#subView];
		element.forEach(element =>{
			let len = element.value.toString().length;
			if(this.#fontUnit == "vw"){
				if (len < 6) return element.style.fontSize = "19" + this.#fontUnit;
				let switchPortrait = {
					1: _=> {
						return element.style.fontSize = "14" + this.#fontUnit;
					},
					2: _=> {
						return element.style.fontSize = "8" + this.#fontUnit;
					},
					3: _=> {
						return element.style.fontSize = "6" + this.#fontUnit;
					},
					_default: _=> {
						return element.style.fontSize = "5" + this.#fontUnit;
					}
				};
				(Object.hasOwnProperty.call( switchPortrait, Math.floor(len / 6)) && switchPortrait[Math.floor(len / 6)] || switchPortrait._default)();
			}else{
				if (len < 6) return element.style.fontSize = "19" + this.#fontUnit;
				let switchLandscape = {
					0: _=> {
						return element.style.fontSize = "19" + this.#fontUnit;
					},
					1: _=> {
						return element.style.fontSize = "12.5" + this.#fontUnit;
					},
					2: _=> {
						return element.style.fontSize = "8.5" + this.#fontUnit;
					},
					_default: _=> {
						return element.style.fontSize = "5.5" + this.#fontUnit;
					}
				};
				(Object.hasOwnProperty.call( switchLandscape, Math.floor(len / 10)) && switchLandscape[Math.floor(len / 10)] || switchLandscape._default)();
			}
		});
	};

};

const Keypad = class{
	constructor(key, display) {
		this._key = key;
		this._display = display;
	}
	click(){
	}
};

//연산자 입력
const InputOprtr = class extends Keypad{
	constructor(key, display) {
		super(key, display);
	}

	click(e) {
		if(this.inputStatus()) return this._display.setMinus();
		if(this.canResult()) this._display.result();
		if(this.checkTempOprnd()) return this._display.addOprtr(this._key, e);
		this._display.addOprtr(this._key, e);
		this._display.setSaveOprnd().resizeFont();
	};

	inputStatus(){
		return Boolean(this._display.tempOprnd == 0 && this._key == '-');
	};

	checkTempOprnd(){
		return Boolean(this._display.tempOprnd == '-' || this._display.tempOprnd == 0);
	};

	canResult(){
		return Boolean(this._display.tempOprnd && this._display.oprtr && !this.checkTempOprnd());
	};

};

//숫자키
const InputNum = class extends Keypad{
	constructor(key, display) {
		super(key, display);
	}

	click() {
		this._display.addNumber(this._key);
	}
};

//기능키
const InputFn = class extends Keypad{
	constructor(key, display) {
		super(key, display);
	};

	click() {
		let switchKey = {
			ac: _=>{
				this._display.allClear()
			},
			bs: _=> {
				this._display.backSpace()
			},
			result: _=>{
				this._display.result()
			},
			dot: _=>{
				this._display.addDot()
			}
		};
		switchKey[this._key]();
	};
};

//들어온 버튼 체크
const CheckInput = class{
	checkKey(e, display){
		let key = String(e.target.dataset.cmd);
		if(isNaN(key)){
			let pattern = "^[*+/-]$";
			if(key.match(pattern)) return new InputOprtr(key, display).click(e);
			else return new InputFn(key, display).click();
		}else{
			new InputNum(key, display).click();
		}
	};
};

//이벤트 감지
const DetectEvent = class{
	#display;
	constructor() {
		this.#display = new Display();
	};

	clickKeypad = (e) => {
		if(Boolean(this.#display.isError())) return this.#display.allClear();
		return new CheckInput().checkKey(e, this.#display);
	};

	changeUnit = (isPortrait) => {
		isPortrait ? this.#display.fontUnit = "vw" : this.#display.fontUnit = "vh";
		this.#display.resizeFont();
	};
};

const Calculator = class{
	#detectEvent; #isPortrait; #keypad;
	constructor() {
		this.#detectEvent = new DetectEvent();
		this.#isPortrait  = window.matchMedia("(orientation: portrait)");
		this.#keypad = document.getElementById("keypad");
		this.#keypad.addEventListener("click", (e)=>{
			this.#detectEvent.clickKeypad(e);
		});
		this.#isPortrait.addEventListener("change", (e) => {
			this.#detectEvent.changeUnit(e.matches);
		});
		this.#detectEvent.changeUnit(this.#isPortrait.matches);
	};
};

window.onload = _=>{
	const calculator = new Calculator();
};

