
var UIController = (function() {

	var DOMStrings = {
		navAddExpense: 'nav-add-exp',
		navAllTransac: 'nav-all-transac',
		navAddIncome: 'nav-add-inc',
		navBudgetRep: 'nav-budget-rep',
		navMobile: 'nav-hidden',
		mobileNavDiv: 'mobile-nav',
		budgetRepDiv: 'budget-report',
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
		catGrocery: 'cat-groceries',
		catClothing: 'cat-clothing',
		catEating: 'cat-eating',
		catEnter: 'cat-entertainment',
		catPhone: 'cat-phone',
		catOther: 'cat-other',
		catSalary: 'cat-salary',
		catHousing: 'cat-housing',
		catOtherInc: 'cat-other-inc',
		allTransacList: '.transactions-list',
		expCategoryList:'.categories',
		totalExpLabel: '.total-exp-label',
		totalIncLabel: '.total-inc',
		balanceLabel: '.balance-label',
		showComment: '.show-comment',
		grocPerc: 'grocery-percent',
		clothPerc: 'clothing-percent',
		eatPerc: 'eating-percent',
		enterPerc: 'entertainment-percent',
		phonePerc: 'phone-percent',
		otherPrec: 'other-percent',
	};

	var navBar = function(el) {
		var el, divs, visibleDivId;

		if ( window.innerWidth > 739) {      
			  console.log('over 736')
				} 
				else {
				  var navDiv = document.getElementById(DOMStrings.mobileNavDiv);
				  navDiv.style.display = (navDiv.style.display === 'none') ? 'block' : 'none';
				}

		el = el;
		divs = [DOMStrings.allTransacDiv, DOMStrings.addExpDiv, DOMStrings.addIncDiv, DOMStrings.budgetRepDiv];
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
		string = string.slice(4);
		string = string.replace(/-/g , " ");
		
		return string;
	}

	function letterToUpperCase(string) {
		return string = string.charAt(0).toUpperCase() + string.slice(1);
	}

	function formatNumber(num){
		// console.log(num,type);
		var numSplit, int, dec;

		num = Math.abs(num);
		// exactly 2 decimal places for each number
		num = num.toFixed(2);
		//splits number into an array before and after decimal point
		numSplit = num.split('.');
		// int is the first part of the number
		int = numSplit[0];
		//comma to separate the thousands
		if(int.length > 3) {
			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
		}
		// second part of number 
		dec = numSplit[1];

		return int + '.' + dec;
	}

	function updateProgressBar(id, percent) {
		if (percent > 100) {
			percent = 100;
		} else {
			percent = percent;
		}
		document.getElementById('progressbar-' + id).style.width = percent + '%';
	}

	function nodeListForEach(list, num) {
		var i = 0;
			for (i = 0; i < list.length; i++) {
				list[i].textContent = formatNumber(num);
			}
	}

	function removeCategory(el) {
		var clothing = document.getElementById(DOMStrings.catClothing);
		var groceries = document.getElementById(DOMStrings.catGrocery);
		var eat = document.getElementById(DOMStrings.catEating);
		var entertainment = document.getElementById(DOMStrings.catEnter);
		var phone = document.getElementById(DOMStrings.catPhone);
		var other = document.getElementById(DOMStrings.catOther);
		var catSalary = document.getElementById(DOMStrings.catSalary);
		var catHousing = document.getElementById(DOMStrings.catHousing);
		var catOtherInc = document.getElementById(DOMStrings.catOtherInc);
		
		var elArr = [clothing, groceries, eat, entertainment, phone, other, catSalary, catHousing, catOtherInc];

		elArr.forEach(function(curr) {
			if(curr.id != el) {
				curr.classList.remove('backgr-red');
				curr.classList.remove('select-category');
			}
		});

		return el;
	}

	return {
		addListItem: function(obj, type) {
			var html, newHtml, element, category;
			// console.log(obj.category);
			category = parseCatString(obj.category);
			
			if(type === 'exp') {
				element = DOMStrings.allTransacList;
				html = '<li id="exp-%id%"><div><i class="ion-ios-minus-empty"><span class="expense-category"> %description%</span></i><span class="expense-amount">- %value%</span></div><div class="comment-box"><span class="show-comment" onclick="UIController.showHideComment(\'%type%-comment-%id%\'\)">(show comment)</span><p id="%type%-comment-%id%" class="comment">%comment%</p></div></li>'
			} else if (type === 'inc') {
				element = DOMStrings.allTransacList;
				html = '<li id="inc-%id%"><div><i class="ion-ios-plus-empty"><span class="income-category"> %description%</span></i><span class="income-amount">+ %value%</span></div><div class="comment-box"><span class="show-comment" onclick="UIController.showHideComment(\'%type%-comment-%id%\'\)">(show comment)</span><p id="%type%-comment-%id%" class="comment">%comment%</p></div></li>'
			}
			
			category = letterToUpperCase(category);
			//Replace the place holder with new text
			newHtml = html.replace(/%id%/g, obj.id);
			newHtml = newHtml.replace(/%type%/g, type)
			newHtml = newHtml.replace('%comment%', obj.comment);
			newHtml = newHtml.replace('%description%', category);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value));

			// NOw insert new text into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		getItemDescription: function(el) {
			var el;
			
			el = document.getElementById(el);

			removeCategory(el);

			el.classList.toggle('backgr-red');
			el.classList.toggle('select-category');
			return el;
		},

		displayBudget: function(obj) {	
			var balance, income, expense;	

			income = document.body.querySelectorAll(DOMStrings.totalIncLabel);
			
			nodeListForEach(income, obj.totalInc);
			// .textContent = formatNumber(obj.totalInc);

			expense = document.body.querySelectorAll(DOMStrings.totalExpLabel);
			// document.getElementById(DOMStrings.totalExpLabel).textContent = formatNumber(obj.totalExp);
			nodeListForEach(expense, obj.totalExp);
			
			balance = document.body.querySelectorAll(DOMStrings.balanceLabel);
			
			if (obj.balance > 0 ) {
				nodeListForEach(balance, obj.balance);	
			} else {
				nodeListForEach(balance, 0.00);
			}
		},

		displayPercentages: function(obj) {
			var outPut, percentArr, IDArr, i, e;

			percentArr = obj.percentages;

			IDArr = [DOMStrings.grocPerc, DOMStrings.clothPerc, DOMStrings.eatPerc, DOMStrings.enterPerc, DOMStrings.phonePerc, DOMStrings.otherPrec];

			outPut = IDArr, percentArr;
			// IMPERATIVE
			// This loops over the indices of the first array, and uses that to index into the others.
			for (i = 0; i < outPut.length; i += 1) {
				document.getElementById(IDArr[i]).textContent = percentArr[i] + '%';
				updateProgressBar(IDArr[i], percentArr[i]);
			}
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

			if (type === 'exp') {
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

		showHideComment: function(id) {
			var el, nextEl;

			el = document.getElementById(id);

			el.style.display = (el.style.display === 'block') ? 'none' : 'block';
				console.log(el);

			if(id === DOMStrings.mobileNavDiv) {
				console.log(el);
				nextEl = document.getElementById(DOMStrings.budgetRepDiv);
				nextEl.style.display = (nextEl.style.display === 'none') ? 'block' : 'none';
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
		////////////////////I'm here
		categories: {
			groceries: 0,
			clothing: 0,
			eating: 0,
			entertainment: 0,
			phone: 0,
			other: 0
		},
		total: {
			exp: 0,
			inc: 0
		},
		balance: 0,
		percentages: []
	}


	calculateTotals = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(curr) {
			sum += curr.value;
		});
		data.total[type] = sum;
	}

	parseCategoryID = function(string) {
		string = string.slice(4);

		return string;
	}

	return {
		addFakeData: function() {
			var incArr, expArr, budget;
			var inc1 = [3000, "This is a comment", "cat-salary"];
			var inc2 = [3250.00, "Sold the house", "cat-housing"];
			
			incArr = [];
			incArr.push(inc1, inc2);
			incArr.forEach(function(curr) {
				budgetController.addItem('inc', curr[0], curr[1], curr[2]);
			});

			data.allItems.inc.forEach(function(curr) {
				UIController.addListItem(curr, 'inc');
				budgetController.calculateBudget();
				budget = budgetController.getBudget();
				UIController.displayBudget(budget);
				budgetController.calculatePercentages('inc');
				UIController.displayPercentages(budget);
			});

			var exp1 = [200, "Comment", "cat-clothing"];
			var exp2 = [12, "Lunch", "cat-eating"];

			expArr = [];
			expArr.push(exp1, exp2);
			expArr.forEach(function(curr) {
				budgetController.addItem('exp', curr[0], curr[1], curr[2]);
			});

			data.allItems.exp.forEach(function(curr) {
				UIController.addListItem(curr, 'exp');
				budgetController.calculateBudget();
				budget = budgetController.getBudget();
				UIController.displayBudget(budget);
				budgetController.calculatePercentages('exp');
				UIController.displayPercentages(budget);
			});
		},

		calculatePercentages: function(type) {
			var budget, percentArr, myArr;

			budget = this.getBudget();

			budget = budget.totalInc;

			percentArr = [];
			
			// FIX THIS 
			if (type) {	
			
				myArr = Object.keys(data.categories).map(function(key) {
					var newArr = data.categories[key];
					return newArr;
				});
				
				var i;
				for (i = 0; i < myArr.length; i ++) {
					var el = myArr[i];
					el += myArr[i];
					var div = myArr[i] / budget;
					var mult = div * 100;
					var round = Math.floor(mult);
					percentArr.push(mult.toFixed(1));
					data.percentages = percentArr;
				}				
			} else {
				console.log('cannot perform action');
			}
		},

		calculateBudget: function() {
			var category;
			calculateTotals('exp');
			calculateTotals('inc');

			data.balance = data.total.inc - data.total.exp;
		},

		getPercentages: function() {
			return array;
		},

		getBudget: function() {
			return {
				totalExp: data.total.exp,
				totalInc: data.total.inc,
				balance: data.balance,
				percentages: data.percentages
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

			// parseCategoryID and push to array
			categoryStr = parseCategoryID(category);
			if (type === 'exp') {
				data.categories[categoryStr] += (newItem.value);
			}

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
		var DOM; 
		DOM = UICtrl.getDOMStrings();

		////////NAV CLICKS
		var nav = document.getElementById(DOM.navMobile);
		var navDiv = document.getElementById(DOM.mobileNavDiv);

		var exp = document.getElementById(DOM.navAddExpense);
	
		var transactions = document.getElementById(DOM.navAllTransac);

		var inc = document.getElementById(DOM.navAddIncome);

		var budget = document.getElementById(DOM.navBudgetRep);
			
			nav.onclick = handleMenuClick;
			transactions.onclick = handleTransacClick;
			exp.onclick = handleExpClick;
			inc.onclick = handleIncClick;
			budget.onclick = handleBudgetClick;
			
			function handleMenuClick(el) {
				navDiv.style.display = (navDiv.style.display === 'none') ? 'block' : 'none';
			}

			function handleExpClick(exp) {
				UICtrl.getNavBar(DOM.addExpDiv);
			}

			function handleTransacClick(transactions) {
				UICtrl.getNavBar(DOM.allTransacDiv);
			}

			function handleIncClick(inc) {
				UICtrl.getNavBar(DOM.addIncDiv);
			}

			function handleBudgetClick(budget) {
				UICtrl.getNavBar(DOM.budgetRepDiv);
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

	var updateBudget = function(category) {
		// calculate budget
		budgetCtrl.calculateBudget(category);
		// return budget
		var budget = budgetCtrl.getBudget();
		//update the UI
		UICtrl.displayBudget(budget);
	}

	var updatePercentages = function(type) {
		// first calculate the percentage for each category
		budgetCtrl.calculatePercentages(type);
		// return Percentages from budget controller
		var percentages = budgetCtrl.getBudget();
		//Update the UI to display them
		UICtrl.displayPercentages(percentages);
	}

	var ctrlAddItem = function(type) {
		var input, newItem, type;

		type = type;
		input = UICtrl.getInputValue(type);
		
		if (input.comment !== "" && !isNaN(input.value) && input.value > 0) {
			newItem = budgetCtrl.addItem(type, input.value, input.comment, input.category);
			// console.log(newItem);
		}

		//Clear input fields
		UICtrl.clearFields(type);
		//Add item to the UI
		UICtrl.addListItem(newItem, type);

		//now update budget
		updateBudget(input.category);
		//now update Percentages
		updatePercentages(type);
	}

	return {
		init: function() {
			setupEventListners();
			budgetController.addFakeData();
		}
	};

})(budgetController, UIController);

window.onload = controller.init();