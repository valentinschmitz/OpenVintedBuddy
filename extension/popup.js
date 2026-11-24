fetch('http://127.0.0.1:8787/api/health')
  .then((response) => response.json())
  .then((data) => {
    document.getElementById('status').textContent = data.database
      ? 'Backend local connecté'
      : 'API joignable, base indisponible';
  })
  .catch(() => {
    document.getElementById('status').textContent =
      'Backend hors ligne — démarrez OpenVintedBuddy';
  });