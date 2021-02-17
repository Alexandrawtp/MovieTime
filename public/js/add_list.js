function addToList(id) {
    $.post('/my-list', {id}, (data) => {
        if (data['status'] === 'ok') {
            alert("The movie has been added to your list");
        } else {
            alert("Error ...");
        }
    })
}