function addToList(id) {
  $.post('/my-list', {
    id
  }, (data) => {
    if (data['status'] === 'ok') {
    } else {
      alert("Error ...");
    }
  })
}