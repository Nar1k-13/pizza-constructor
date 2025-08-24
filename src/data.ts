export type Ingredient = { id: string; name: string; price: number }

export type Pizza = {
  id: string
  name: string
  basePrice: number
  image: string
  ingredients: Ingredient[]
}

const img = (text: string) =>
  'https://placehold.co/300x200?text=${encodeURIComponent(text)}'

export const pizzas: Pizza[] = [
  {
    id: "pepperoni",
    name: "Пепперони",
    basePrice: 500,
    image: img("Пепперони"),
    ingredients: [
      { id: "mozzarella", name: "сыр моцарелла", price: 50 },
      { id: "hot-sauce", name: "острый соус", price: 30 },
      { id: "olives", name: "оливки", price: 40 },
      { id: "extra-pepperoni", name: "доп. пепперони", price: 70 },
    ],
  },
  {
    id: "margherita",
    name: "Маргарита",
    basePrice: 400,
    image: img("Маргарита"),
    ingredients: [
      { id: "basil", name: "базилик", price: 20 },
      { id: "cherry", name: "помидоры черри", price: 40 },
      { id: "extra-cheese", name: "доп. сыр", price: 50 },
      { id: "pesto", name: "песто", price: 30 },
    ],
  },
  {
    id: "four-cheese",
    name: "Четыре сыра",
    basePrice: 550,
    image: img("Четыре сыра"),
    ingredients: [
      { id: "gorgonzola", name: "горгонзола", price: 60 },
      { id: "cheddar", name: "чеддер", price: 50 },
      { id: "cream-sauce", name: "сливочный соус", price: 30 },
      { id: "mushrooms", name: "грибы", price: 40 },
    ],
  },
  {
    id: "hawaiian",
    name: "Гавайская",
    basePrice: 480,
    image: img("Гавайская"),
    ingredients: [
      { id: "extra-pineapple", name: "доп. ананас", price: 30 },
      { id: "ham", name: "ветчина", price: 50 },
      { id: "hot-sauce-2", name: "острый соус", price: 30 },
      { id: "mozzarella-2", name: "моцарелла", price: 50 },
    ],
  },
  {
    id: "bbq",
    name: "Барбекю",
    basePrice: 530,
    image: img("Барбекю"),
    ingredients: [
      { id: "chicken", name: "курица", price: 50 },
      { id: "bacon", name: "бекон", price: 50 },
      { id: "onion", name: "лук", price: 20 },
      { id: "bbq-sauce", name: "соус барбекю", price: 30 },
    ],
  },
  {
    id: "veggie",
    name: "Вегетарианская",
    basePrice: 450,
    image: img("Вегетарианская"),
    ingredients: [
      { id: "eggplant", name: "баклажаны", price: 40 },
      { id: "zucchini", name: "цукини", price: 40 },
      { id: "bell-pepper", name: "перец болгарский", price: 30 },
      { id: "broccoli", name: "брокколи", price: 30 },
    ],
  },
  {
    id: "meat",
    name: "Мясная",
    basePrice: 560,
    image: img("Мясная"),
    ingredients: [
      { id: "salami", name: "салями", price: 50 },
      { id: "bacon-2", name: "бекон", price: 50 },
      { id: "chicken-2", name: "курица", price: 50 },
      { id: "beef", name: "говядина", price: 70 },
    ],
  },
  {
    id: "diablo",
    name: "Дьябло",
    basePrice: 520,
    image: img("Дьябло"),
    ingredients: [
      { id: "jalapeno", name: "халапеньо", price: 30 },
      { id: "hot-sauce-3", name: "острый соус", price: 30 },
      { id: "extra-pepperoni-2", name: "доп. пепперони", price: 70 },
      { id: "red-onion", name: "лук красный", price: 20 },
    ],
  },
  {
    id: "mushroom",
    name: "С грибами",
    basePrice: 470,
    image: img("С грибами"),
    ingredients: [
      { id: "porcini", name: "белые грибы", price: 50 },
      { id: "truffle-oil", name: "трюфельное масло", price: 60 },
      { id: "champignon", name: "шампиньоны", price: 40 },
      { id: "onion-2", name: "лук", price: 20 },
    ],
  },
  {
    id: "seafood",
    name: "С морепродуктами",
    basePrice: 600,
    image: img("Морепродукты"),
    ingredients: [
      { id: "shrimp", name: "креветки", price: 80 },
      { id: "squid", name: "кальмары", price: 70 },
      { id: "mussels", name: "мидии", price: 60 },
      { id: "lemon", name: "лимон", price: 10 },
    ],
  },
]