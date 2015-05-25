(function ($) {

	function pageLoaded() {
		$('#add').on('click', showForm);
		$('#submit').on('click', submitTodo);
		$('#todos').on('click', '.delete', deleteTodo); //event delegation
		load();
	}

	function load() {
		var todos = JSON.parse(localStorage['todos'] || '[]');
		$('#todos').empty();
		for (var i = 0; i < todos.length; i++) {
			$('#todos').append('<li data-id="'+todos[i].id+'"><span>'+todos[i].todo+'</span><button class="delete">x</button></li>');
		}
	}

	function showForm() {
		$('#newTodo').toggle();
	}

	function submitTodo(e) {
		e.preventDefault();
		e.stopPropagation();
		var todos = JSON.parse(localStorage['todos'] || '[]');
		var id = uuid.v4();
		todos.push({ 
			id: id,
			todo: $('#todo').val()
		});
		$('#todo').val('');
		$('#newTodo').hide();
		localStorage['todos'] = JSON.stringify(todos);
		load();
		return false;
	}

	function deleteTodo(e) {
		var id = $(e.target).parent('li').data('id');

		var todos = JSON.parse(localStorage['todos'] || '[]');

		var index = -1;

		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == id) {
				index = i;
				break;
			}
		}

		if (index >= 0) {
			todos.splice(index, index + 1);
			localStorage['todos'] = JSON.stringify(todos);			
		}

		load();
	}

	$(document).on('ready', pageLoaded);

})(jQuery);