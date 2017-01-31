
var UIController = (function() {

	var DOMStrings = {
		navAddExpense: 'nav-add-exp',
		navAllTransac: 'nav-all-transac',
		navAddIncome: 'nav-add-inc',
		// navBudgetRep: '.nav-budget-rep',
		allTransacDiv: 'all-transactions',
		addExpDiv: 'add_expense',
		addIncDiv: 'add_income',
		expValue: 'exp-value',
		expComment: 'exp-comment',
		incValue: 'inc-value',
		incComment: 'inc-comment',
		expForm: 'exp-form',
		expBtn: 'add-exp-btn',
		incBtn: 'add-inc-btn',
		allTransacList: '.transactions-list',
		expCategoryList:'.categories',
		totalExpLabel: 'total-exp',
		totalIncLabel: 'total-inc',
		balanceLabel: '.balance-label'
	};

	var navBar = function(el) {
		var el, divs, visibleDivId;

		el = el;
		divs = [DOMStrings.allTransacDiv, DOMStrings.addExpDiv, DOMStrings.addIncDiv];
		visibleDivId = null;

		function toggleVisibility() {
			if(visibleDivId === el) {
			} else {
				visibleDivId = el;
			}
				hideNonVisibleDivs();
		}

		function hideNonVisibleDivs() {
			
			var i, divId, div;
			for(i = 0; i < divs.length; i++) {
				el = divs[i];
				div = document.getElementById(el);
				
				if(visibleDivId === el) {
					div.style.display = "block";
				} else {
					div.style.display = "none";
				}
			}
		}
		toggleVisibility();
	}

	function parseCatString(string) {
		var string;

		string = string.replace(/-/g , " ");
		string = string.slice(3);
		
		return string;
	}

	return {
		addListItem: function(obj, type) {
			var html, newHtml, element, category;
			// console.log(obj.category);
			category = parseCatString(obj.category);
			
			if(type === 'exp') {
				element = DOMStrings.allTransacList;
				html = '<li id="exp-%id%"><i class="ion-ios-telephone-outline"></i><div><span class="expense-category">%description%</span><span class="expense-amount">- %value%</span></div></li>'
			} else if (type === 'inc') {
				element = DOMStrings.allTransacList;
				html = '<li id="inc-%id%"><i class="im im-banknote"></i><div><span class="income-category">%description%</span><span class="income-amount">+ %value%</span></div></li>'
			}
			//Replace the place holder with new text
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', category);
			newHtml = newHtml.replace('%value%', obj.value);

			// NOw insert new text into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		getItemDescription: function(el) {
			var el;

			el = document.getElementById(el);
			
			el.classList.toggle('backgr-red');
			el.classList.toggle('select-category');
			return el;
		},

		displayBudget: function(obj) {			
			document.getElementById(DOMStrings.totalIncLabel).textContent = obj.totalInc;
			document.getElementById(DOMStrings.totalExpLabel).textContent = obj.totalExp;
			
			document.querySelector(DOMStrings.balanceLabel).textContent = obj.balance;
		},

		clearFields: function(type) {
			var fields, fieldsArr, category;

			category = document.querySelector('.select-category');

			if (type === 'exp') {
				fields = [document.getElementById(DOMStrings.expValue), document.getElementById(DOMStrings.expComment)];
			} else {
				fields = [document.getElementById(DOMStrings.incValue), document.getElementById(DOMStrings.incComment)];
			}
			
			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(curr, index, array) {
				curr.value = "";
			});

			category.classList.remove('backgr-red','select-category');

			fieldsArr[0].focus();
		},

		getInputValue: function(type) {
			var category;

			category = document.querySelector('.select-category').id;

			if (type === 'exp'){
				return {
				value: parseFloat(document.getElementById(DOMStrings.expValue).value),
				comment: document.getElementById(DOMStrings.expComment).value,
				category: category
				};
			} else {
				return {
					value: parseFloat(document.getElementById(DOMStrings.incValue).value),
					comment: document.getElementById(DOMStrings.incComment).value,
					category: category
				};
			}
			
		},

		getNavBar: function(el) {
			return navBar(el);
		},

		getDOMStrings: function() {
			return DOMStrings;
		}
	};

})();

//////////////////////////////////////////BUDGET CONTROLLER//////////////////////////////////////////

var budgetController = (function() {

	var Expense = function(id, value, comment, category) {
		this.id = id;
		this.value = value;
		this.comment = comment;
		this.category = category;
	};

	var Income = function(id, value, comment, category) {
		this.id = id;
		this.value = value;
		this.comment = comment;
		this.category = category;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		total: {
			exp: 0,
			inc: 0
		},
		balance: 0
	}

	calculateTotals = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(curr) {
			sum += curr.value;
		});
		data.total[type] = sum;
	}

	return {
		calculateBudget: function() {
			calculateTotals('exp');
			calculateTotals('inc');

			data.balance = data.total.inc - data.total.exp;
			console.log(data.balance);
		},

		getBudget: function() {
			return {
				totalExp: data.total.exp,
				totalInc: data.total.inc,
				balance: data.balance
			};
		},

		addItem: function(type, value, comment, category) {
			var newItem, ID;

			if(data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			if (type === 'exp') {
				newItem = new Expense(ID, value, comment, category);
			} else if (type === 'inc') {
				newItem = new Income(ID, value, comment, category);
			}

			data.allItems[type].push(newItem);

			return newItem;
		},

		test: function() {
			console.log(data);
		}
	}

})();

////////////////////////////////////////// APP CONTROLLER //////////////////////////////////////////

var controller = (function(budgetCtrl, UICtrl) {
	
	var setupEventListners = function() {
		var DOM, form, category; 
		DOM = UICtrl.getDOMStrings();

		////////NAV CLICKS
		var exp = document.getElementById(DOM.navAddExpense)
	
		var transactions = document.getElementById(DOM.navAllTransac);

		var inc = document.getElementById(DOM.navAddIncome);
			
			transactions.onclick = handleTransacClick;
			exp.onclick = handleExpClick;
			inc.onclick = handleIncClick;
			
			function handleExpClick(exp) {
				UICtrl.getNavBar(DOM.addExpDiv);
			}

			function handleTransacClick(transactions) {
				UICtrl.getNavBar(DOM.allTransacDiv);
			}

			function handleIncClick(inc) {
				UICtrl.getNavBar(DOM.addIncDiv);
			}
			//////////////////////////////////////////////////
		//Submit add expense
		var addExp = document.getElementById(DOM.expBtn);
		addExp.onclick = handleAddExpClick;
		function handleAddExpClick() {
			ctrlAddItem('exp');
		}
		// .addEventListener('click', ctrlAddItem);
		
		var addInc = document.getElementById(DOM.incBtn);
		addInc.onclick = handleAddIncClick;
		function handleAddIncClick() {
			ctrlAddItem('inc');
		}
	}

	var updateBudget = function() {
		// calculate budget
		budgetCtrl.calculateBudget();
		// return budget
		var budget = budgetCtrl.getBudget();
		//update the UI
		UICtrl.displayBudget(budget);
	}

	var ctrlAddItem = function(type) {
		var input, newItem, type;

		type = type;
		input = UICtrl.getInputValue(type);
		
		if (input.comment !== "" && !isNaN(input.value) && input.value > 0) {
			newItem = budgetCtrl.addItem(type, input.value, input.comment, input.category);
			console.log(newItem);
		}

		//Clear input fields
		UICtrl.clearFields(type);
		//Add item to the UI
		UICtrl.addListItem(newItem, type);
		//now update budget
		updateBudget();
	}

	return {
		init: function() {
			console.log('I control stuff');
			setupEventListners();
		}
	};

})(budgetController, UIController);

window.onload = controller.init();