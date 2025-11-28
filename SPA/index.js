// Load existing notes
function loadNotes() {
  fetch('/exampleapp/data.json')
    .then(res => res.json())
    .then(data => {
      const notesDiv = document.getElementById('notes');
      notesDiv.innerHTML = ''; // clear previous list

      if (data.length === 0) {
        notesDiv.textContent = "No notes yet.";
        return;
      }

      const ul = document.createElement('ul');
      ul.className = 'notes';
      data.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note.content;
        ul.appendChild(li);
      });

      notesDiv.appendChild(ul);
    });
}

loadNotes(); // initial load

// Handle form submit
document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  const noteInput = this.note.value;

  fetch('/exampleapp/new_note', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note: noteInput })
  })
  .then(res => {
    if (!res.ok) throw new Error('Failed to save note');
    return res.json();
  })
  .then(() => {
    this.reset();     // clear input
    loadNotes();      // reload notes from server
  })
  .catch(err => console.error(err));
});
