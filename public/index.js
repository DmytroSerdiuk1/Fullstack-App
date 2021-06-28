
document.addEventListener('click', e => {
  if(e.target.classList.contains('button-delete-cart')) {
    const id = e.target.dataset.id;
    console.log(id);

    fetch(`/cart/remove/${id}`, {
      method: 'delete'
    })
    .then(res =>{
      return res.json()
    })
    .then(card => {
      console.log(card);
      if (card.courses.length) {
        const html = card.courses.map(c => {
          return `
          <tr>
            <td>${c.title}</td>
            <td>${c.count}</td>
            <td>
                <button data-id="${c.id}" type="button" class="button-delete-cart btn btn-danger">Delete</button>
            </td>
        </tr>
          `
        })

        document.querySelector('.tables').innerHTML = html;
        document.querySelector('.price').textContent = card.price
      } else {
        document.querySelector('.tables').innerHTML = '<p>Корзина пуста</p>'
        document.querySelector('.price').textContent = card.price
      }
    })
  }
})

const date = document.querySelectorAll('.date');

date.forEach(c => {
  c.innerHTML = new Intl.DateTimeFormat('ua-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(c.innerHTML))
})