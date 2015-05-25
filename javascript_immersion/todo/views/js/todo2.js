(function ($) {

	function pageLoaded () {
		$('#add').on('click', showForm);
		$('#submit').on('click', submitTodo);
		$('#todos').on('click', '.delete', deleteTodo); //event delegation
		load();
	}

	function loaded (data) {
		var todos = data || [];

		$('#todos').empty();
		for (var i = 0; i < todos.length; i++) {
			$('#todos').append('<li data-id="'+todos[i].id+'"><span>'+todos[i].todo+'</span><button class="delete">x</button></li>');
		}
	}

	/* TODO: implement errorOccurred */

	function load () {
		$.ajax({
			url: '/todos',
			success: loaded /*,
			error: errorOccurred 
			*/
		});
	}

	function showForm () {
		$('#newTodo').toggle();
	}

	function postSent () {
		// A more efficient way, in terms of fewer network calls, to do this would be to return the current list of todos from the POST response.
		load();
	}

	/* TODO: implement postErrorOccurred */

	function submitTodo (e) {
		e.preventDefault();
		e.stopPropagation();
		var val = $('#todo').val();
		if (val) {
			var todo = { 
				id: uuid.v4(),
				todo: $('#todo').val()
			};
			$.ajax({
				url: '/todo',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(todo),
				success: postSent/*,
				error: postErrorOccurred*/
			});
		}
		return false;
	}

	function deleteSent () {
		// A more efficient way, in terms of fewer network calls, to do this would be to return the current list of todos from the POST response.
		load();
	}

	function deleteTodo (e) {
		e.preventDefault();
		e.stopPropagation();
		var id = $(e.target).parent('li').data('id');

		if (id) {
			$.ajax({
				url: '/todos/' + id,
				method: 'DELETE',
				success: deleteSent/*,
				error: postErrorOccurred*/
			});
		}

		return false;
	}

	$(document).on('ready', pageLoaded);

})(jQuery);