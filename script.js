
var UIController = (function() {

	var DOMStrings = {
		navAddExpense: 'nav-add-exp',
		navAllTransac: 'nav-all-transac',
		// navBudgetRep: '.nav-budget-rep',
		allTransacDiv: 'all-transactions',
		addExpDiv: 'add_expense'
	};

	var navBar = function(el) {
		var el, divs, visibleDiv;

		el = el;
		divs = [DOMStrings.allTransacDiv, DOMStrings.addExpDiv];
		visibleDiv = null;

		function toggleVisibility(divClass) {
			if(visibleDiv === divClass) {
			} else {
				visibleDiv = divClass;
			}
				hideNonVisibleDivs();
		}

		function hideNonVisibleDivs() {
			
			var i, divClass, div;
			for(i = 0; i < divs.length; i++) {
				divClass = divs[i];
				div = document.getElementById(el);
				console.log(div);
				if(visibleDiv === divClass) {
					div.style.display = "block";
				} else {
					div.style.display = "none";
				}
			}
		}
		toggleVisibility();
	}

	return {
		getNavBar: function(el) {
			return navBar(el);
		},

		getDOMStrings: function() {
			return DOMStrings;
		}
	};

})();

var budgetController = (function() {

})();

var controller = (function(budgetCtrl, UICtrl) {
	
	var setupEventListners = function() {
		var DOM = UICtrl.getDOMStrings();

		// document.querySelector(DOM.navAllTransac).addEventListener('click', function(event) {
		// 	UICtrl.getNavBar(DOM.navAllTransac);
		// });

		var otherEl = document.getElementById(DOM.navAddExpense)
	
		var el = document.getElementById(DOM.navAllTransac);

			el.addEventListener("click", handleClick(el), false);
			
			function handleClick(el) {
				UICtrl.getNavBar(DOM.allTransacDiv);
			}
			// otherEl.addEventListener("click", 
			// UICtrl.getNavBar(DOM.addExpDiv));
		
	}

	return {
		init: function() {
			console.log('I control stuff');
			setupEventListners();
		}
	};

})(budgetController, UIController);

window.onload = controller.init();