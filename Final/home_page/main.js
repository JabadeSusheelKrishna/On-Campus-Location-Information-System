document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      alert(`You clicked: ${button.innerText}`);
    });
  });
  