// src/App.tsx
import { useMemo, useState, useEffect } from "react"
import * as C from "@chakra-ui/react"
import { pizzas } from "./data"
import PizzaCard from "./components/PizzaCard"

type CartItem = {
  id: string
  pizzaId: string
  ingredientIds: string[]
  qty: number
}

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (pizzaId: string, ingredientIds: string[], qty: number) => {
    setCart((prev) => [...prev, { id: uid(), pizzaId, ingredientIds, qty }])
  }

  const inc = (id: string) =>
    setCart((prev) => prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)))

  const dec = (id: string) =>
    setCart((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it))
    )

  const removeItem = (id: string) =>
    setCart((prev) => prev.filter((it) => it.id !== id))

  const priceOf = (pizzaId: string, ingredientIds: string[]) => {
    const p = pizzas.find((x) => x.id === pizzaId)
    if (!p) return 0
    const adds = ingredientIds.reduce((sum, id) => {
      const ing = p.ingredients.find((i) => i.id === id)
      return sum + (ing?.price ?? 0)
    }, 0)
    return p.basePrice + adds
  }

  const total = useMemo(
    () => cart.reduce((sum, it) => sum + priceOf(it.pizzaId, it.ingredientIds) * it.qty, 0),
    [cart]
  )

  return (
    <C.Container maxW="container.lg" py={10}>
      <C.HStack justify="space-between" mb={6}>
        <C.Heading>Конструктор пиццы 🍕</C.Heading>
        <C.Text>
          <b>Корзина:</b> {cart.length} | <b>Итого:</b> {total} ₽
        </C.Text>
      </C.HStack>

      {/* Сетка пицц */}
      <C.SimpleGrid columns={[1, 2, 3]} gap={6} mb={10}>
        {pizzas.map((p) => (
          <PizzaCard
            key={p.id}
            pizza={p}
            onAdd={(ings, qty) => addToCart(p.id, ings, qty)}
          />
        ))}
      </C.SimpleGrid>

      {/* Корзина */}
      <C.Stack gap={4}>
        <C.Heading size="md">Корзина</C.Heading>
        {cart.length === 0 && <C.Text>Пока пусто</C.Text>}

        {cart.map((it) => {
          const p = pizzas.find((x) => x.id === it.pizzaId)!
          const unit = priceOf(it.pizzaId, it.ingredientIds)
          const names =
            it.ingredientIds
              .map((id) => p.ingredients.find((i) => i.id === id)?.name)
              .filter(Boolean)
              .join(", ") || "без допов"

          return (
            <C.Box key={it.id} p={4} borderWidth="1px" borderRadius="md">
              <C.HStack justify="space-between" align="start">
                <C.Stack gap={1}>
                  <C.Text><b>{p.name}</b></C.Text>
                  <C.Text>Ингредиенты: {names}</C.Text>
                  <C.Text>Цена за штуку: {unit} ₽</C.Text>
                </C.Stack>

                <C.HStack>
                  <C.Button onClick={() => dec(it.id)}>-</C.Button>
                  <C.Box minW="32px" textAlign="center">{it.qty}</C.Box>
                  <C.Button onClick={() => inc(it.id)}>+</C.Button>
                  <C.Button variant="plain" onClick={() => removeItem(it.id)}>Удалить</C.Button>
                </C.HStack>
              </C.HStack>

              <C.Text mt={2}><b>Итого по позиции:</b> {unit * it.qty} ₽</C.Text>
            </C.Box>
          )
        })}
      </C.Stack>
    </C.Container>
  )
}