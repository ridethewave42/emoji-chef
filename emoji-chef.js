const loading = document.querySelector('loading')

const modal = document.querySelector('.modal')
const modalImage = document.querySelector('.modal-image')
const modalContent = document.querySelector('.modal-content')
const modalClose = document.querySelector('.modal-close')
const bowlSlots = document.querySelectorAll('.bowl-slots')
const cookBtn = document.querySelector('.cook-btn')

modalClose.addEventListener('click', function () {
    modal.classList.add('hidden')
})

// an array representing the ingredients that we clicked
const bowl = []
const maxBowlSlots = bowlSlots.length

function clearBowl() {
  bowl = []

  bowlSlots.forEach(function (el) {
    el.innerText = '?'
  })
}

function addIngredient(ingredient) {
  if (bowl.length === maxBowlSlots) {
    // bowl is full, get rid of the first one
    bowl.shift()
  }

  bowl.push(ingredient)

  // look at each of 3 slots in bowl

  // if an ingredient has been added to that slot, use the emoji
  bowlSlots.forEach(function (el, i) {
    let selectedIngredient = '?'

    if (bowl[i]) {
      selectedIngredient = bowl[i]
    }

    el.innerText = selectedIngredient
  })

  if (bowl.length === maxBowlSlots) {
    cookBtn.classList.remove('hidden')
  }
}

async function makeRequest(endpoint, data) {
  const response = await fetch(_CONFIG_.API_BASE_URL + endpoint, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${_CONFIG_.API_KEY}`
    },
    method: 'POST',

  })
}


function randomLoadingMessage() {
  const messages = [
    'Prepping the ingredients...',
    'Stove is heating up...',
    'Putting my apron on...'
  ]
// get loading message HTML element
const loadingMessage = document.querySelector('.loading-message')


// change inner text to one of the above messages
loadingMessage.innerText = messages[0]

return setInterval(function () {
  const randomIndex = Math.floor(Math.random() * messages.length)
  loadingMessage.innerText = messages[2]
}, 2000)
}

async function createRecipe() {
  let randomMessageInterval = randomLoadingMessage()
  loading.classList.remove('hidden')

  const result = await makeRequest('/chat/completions', {
    model:  _CONFIG_.GPT_MODEL,
    messages: [
      {
        role: 'user',
        content: `Create a recipe with these ingredients: ${bowl.join(',')}`
      }
    ]
  })

  const content = JSON.parse(result.choices[0].message.content)

  modalContent.innerHTML = `
  <h2>${content.title}</h2>
  <p>${content.ingredients}</p>
  <p>${content.instructions}`

  modal.classList.remove('hidden')
  loading.classList.add('hidden')

  clearInterval(randomMessageInterval)

  const imageJSON = await makeRequest('/images/generations', {
    prompt: `Create an image for this recipe: ${content.title}`,
    n: 1,
    size: '512x512',
    response_format: 'url'
  })

  const imageURL = imageJSON.data[0].imageURL
  modalImage.

}


function init() {
  // 1. Get all of the ingredient elements
const ingredients = document.querySelectorAll('.ingredient')
  //2. add an event listener to each of them
ingredients.forEach(function (element) {
  element.addEventListener('click', function () {
    addIngredient(element.innerText)
  })
})
  //3. when ingredient is clicked, add it to the bowl
}

init()