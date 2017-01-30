
var UIController = (function() {

	var DOMStrings = {
		navAddExpense: 'nav-add-exp',
		navAllTransac: 'nav-all-transac',
		// navBudgetRep: '.nav-budget-rep',
		allTransacDiv: 'all-transactions',
		addExpDiv: 'add_expense'
	};

	var navBar = function(el) {
		var el, divs, visibleDivId;

		el = el;
		divs = [DOMStrings.allTransacDiv, DOMStrings.addExpDiv];
		visibleDivId = null;

		function toggleVisibility(el) {
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
				console.log(div);
				if(visibleDivId === el) {
					div.style.display = "block";
				} else {
					div.style.display = "none";
				}
			}
		}
		toggleVisibility(el);
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

		var otherEl = document.getElementById(DOM.navAddExpense)
	
		var el = document.getElementById(DOM.navAllTransac);

			el.onclick = handleTransacClick;
			otherEl.onclick = handleExpClick;
			
			function handleExpClick(el) {
				UICtrl.getNavBar(DOM.addExpDiv);
			}

			function handleTransacClick(otherEl) {
				UICtrl.getNavBar(DOM.allTransacDiv);
			}
	}

	return {
		init: function() {
			console.log('I control stuff');
			setupEventListners();
		}
	};

})(budgetController, UIController);

window.onload = controller.init();