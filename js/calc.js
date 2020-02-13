const Display = class{
	constructor() {
		function displayClosure(mainView, subView, viewOprtr){
			var tempOprnd = 0, saveOprnd = '', oprtr = '', fontUnit = 'vw';
			return {
				getMainView : _=>{
					return mainView;
				},
				getSubView: _=>{
					return subView;
				},
				getViewOprtr: _=>{
					return viewOprtr;
				},
				getTempOprnd: _=>{
					return tempOprnd;
				},
				setTempOprnd: (number)=>{
					tempOprnd = number;
				},
				getSaveOprnd: _=>{
					return saveOprnd;
				},
				setSaveOprnd: (number)=>{
					saveOprnd = number;
				},
				getOprtr : _=>{
					return oprtr;
				},
				setOprtr : (op)=>{
					oprtr = op;
				},
				getFontUnit: _=>{
					return fontUnit;
				},
				setFontUnit: (unit)=>{
					fontUnit = unit;
				}
			}
		}
		this._disClosure = displayClosure(document.getElementById("mainView"),
											document.getElementById("subView"),
												document.getElementById("viewOperator"));
	};

	setFontUnit(unit){
		this._disClosure.setFontUnit(unit);
	}
	//수식 오류 체크
	isError(){
		return Boolean(this._disClosure.getMainView().dataset.err);
	}

	setMainNum(number){
		this._disClosure.setTempOprnd(number);
		this._disClosure.getMainView().value = this.numWithComma(this._disClosure.getTempOprnd());
		return this;
	};

	setSaveOprnd(){
		this._disClosure.setSaveOprnd(this._disClosure.getTempOprnd());
		this._disClosure.getSubView().value = this.numWithComma(this._disClosure.getSaveOprnd());
		this._disClosure.setTempOprnd(0);
		this._disClosure.getMainView().value = this._disClosure.getTempOprnd();
		return this;
	};

	//음수 입력 처리
	setMinus(){
		this.setMainNum("-");
	};

	addDot(){
		if (this._disClosure.getTempOprnd().toString().indexOf('.') > 0) return;
		else return this.setMainNum(this._disClosure.getTempOprnd() + '.');
	};

	addNumber(number){
		let lngLmt = 20;
		if(this._disClosure.getTempOprnd().toString().length > lngLmt) return;
		if(this._disClosure.getTempOprnd() === 0 && number == 0) return;
		if(this._disClosure.getTempOprnd() === 0 && number != 0) this._disClosure.setTempOprnd('');
		this.setMainNum(this._disClosure.getTempOprnd() + String(number)).resizeFont();
	};

	addOprtr(oprtr, e){
		this._disClosure.setOprtr(oprtr);
		this._disClosure.getViewOprtr().innerHTML = e.target.innerHTML;
	};

	numWithComma(num) {
		if ((num.toString().indexOf('.')) != -1) {
			num = num.toString().split('.');
			return num[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + num[1];
		}
		else return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	result(){
		let equation = this._disClosure.getSaveOprnd() + this._disClosure.getOprtr() + this.minusCheck(this._disClosure.getTempOprnd());
		if(this._disClosure.getOprtr()!='' && Boolean(this._disClosure.getSaveOprnd())) {
			this.allClear();
			let value = +eval(equation).toFixed(12);
			if(value == Number.POSITIVE_INFINITY || value == Number.NEGATIVE_INFINITY) this._disClosure.getMainView().dataset.err = true;
			this.setMainNum(value).resizeFont();
		}
	};

	//피연산자 음수인지 체크
	minusCheck(number){
		if(isNaN(number)) return 0;
		else return number<0?"("+number+")":number;
	};

	allClear(){
		this._disClosure.setTempOprnd(0);
		this._disClosure.setSaveOprnd('');
		this._disClosure.setOprtr('');
		this._disClosure.getMainView().value = 0;
		this._disClosure.getSubView().value = '';
		this._disClosure.getViewOprtr().innerHTML = '';
		this._disClosure.getMainView().dataset.err = '';
	};

	backSpace(){
		let number = Number(this._disClosure.getTempOprnd().toString().substring(0, String(this._disClosure.getTempOprnd()).length -1));
		this._disClosure.setTempOprnd(isNaN(number) ? 0 : number);
		this._disClosure.getMainView().value = this.numWithComma(this._disClosure.getTempOprnd());
		this.resizeFont();
	};

	//스위치 방식 변경 객체 리터럴
	resizeFont(){
		let element = [this._disClosure.getMainView(), this._disClosure.getSubView()];
		element.forEach(element =>{
			let len = element.value.toString().length;
			if(this._disClosure.getFontUnit() == "vw"){
				if (len < 6) return element.style.fontSize = "19" + this._disClosure.getFontUnit();
				let switchPortrait = {
					1: _=> {
						return element.style.fontSize = "14" + this._disClosure.getFontUnit();
					},
					2: _=> {
						return element.style.fontSize = "8" + this._disClosure.getFontUnit();
					},
					3: _=> {
						return element.style.fontSize = "6" + this._disClosure.getFontUnit();
					},
					_default: _=> {
						return element.style.fontSize = "5" + this._disClosure.getFontUnit();
					}
				};
				(Object.hasOwnProperty.call( switchPortrait, Math.floor(len / 6)) && switchPortrait[Math.floor(len / 6)] || switchPortrait._default)();
			}else{
				if (len < 6) return element.style.fontSize = "19" + this._disClosure.getFontUnit();
				let switchLandscape = {
					0: _=> {
						return element.style.fontSize = "19" + this._disClosure.getFontUnit();
					},
					1: _=> {
						return element.style.fontSize = "12.5" + this._disClosure.getFontUnit();
					},
					2: _=> {
						return element.style.fontSize = "8.5" + this._disClosure.getFontUnit();
					},
					_default: _=> {
						return element.style.fontSize = "5.5" + this._disClosure.getFontUnit();
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
	click(){}
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
		return Boolean(this._display._disClosure.getTempOprnd() == 0 && this._key == '-');
	};

	checkTempOprnd(){
		return Boolean(this._display._disClosure.getTempOprnd() == '-' || this._display._disClosure.getTempOprnd() == 0);
	};

	canResult(){
		return Boolean(this._display._disClosure.getTempOprnd() && this._display._disClosure.getOprtr() && !this.checkTempOprnd());
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

//이벤트
const DetectEvent = class{
	constructor() {
		function dteClosure(){
			var display = new Display();
			return {
				getDisplay: _=> {
					return display;
				}
			}
		}
		this._displayClosure = new dteClosure();
	};

	clickKeypad = (e) => {
		if(Boolean(this._displayClosure.getDisplay().isError())) return this._displayClosure.getDisplay().allClear();
		return new CheckInput().checkKey(e, this._displayClosure.getDisplay());
	};

	changeUnit = (isPortrait) => {
		isPortrait ? this._displayClosure.getDisplay().setFontUnit("vw") : this._displayClosure.getDisplay().setFontUnit("vh");
		this._displayClosure.getDisplay().resizeFont();
	};
};

const Calculator = class{
	constructor() {
		function calculatorClosure(isPortrait, keypad){
			var detectEvent = new DetectEvent();
			return {
				getDetectEvent: _=>{
					return detectEvent;
				},
				getKeypad: _=>{
					return keypad
				},
				getIsPortait: _=>{
					return isPortrait
				}

			}
		}
		this._calculatorClo = new calculatorClosure(window.matchMedia("(orientation: portrait)"), document.getElementById("keypad"));
		this._calculatorClo.getKeypad().addEventListener("click", (e)=>{
			this._calculatorClo.getDetectEvent().clickKeypad(e);
		});
		this._calculatorClo.getIsPortait().addEventListener("change", (e)=>{
			this._calculatorClo.getDetectEvent().changeUnit(e.matches);
		});
		this._calculatorClo.getDetectEvent().changeUnit(this._calculatorClo.getIsPortait().matches);
	};
};

window.onload = _=>{
	const calculator = new Calculator();
};