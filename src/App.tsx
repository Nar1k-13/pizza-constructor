// src/App.tsx
import { useEffect, useMemo, useState } from "react"
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

const priceOf = (pizzaId: string, ingredientIds: string[]) => {
  const p = pizzas.find((x) => x.id === pizzaId)
  if (!p) return 0
  const adds = ingredientIds.reduce((sum, id) => {
    const ing = p.ingredients.find((i) => i.id === id)
    return sum + (ing?.price ?? 0)
  }, 0)
  return p.basePrice + adds
}

export default function App() {
  /* localStorage синхронно (до первого рендера) */
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("cart")
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      return parsed.map((it: any) => ({
        id: String(it?.id ?? uid()),
        pizzaId: String(it?.pizzaId ?? ""),
        ingredientIds: Array.isArray(it?.ingredientIds) ? it.ingredientIds.map(String) : [],
        qty: Math.max(1, Number(it?.qty) || 1),
      }))
    } catch {
      return []
    }
  })

  /* автосохранение корзины */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // операции с корзиной
  const addToCart = (pizzaId: string, ingredientIds: string[], qty: number) =>
    setCart((prev) => [...prev, { id: uid(), pizzaId, ingredientIds, qty }])

  const inc = (id: string) =>
    setCart((prev) => prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)))

  const dec = (id: string) =>
    setCart((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it))
    )

  const removeItem = (id: string) => setCart((prev) => prev.filter((it) => it.id !== id))

  const total = useMemo(
    () => cart.reduce((sum, it) => sum + priceOf(it.pizzaId, it.ingredientIds) * it.qty, 0),
    [cart]
  )

  /** форма + черновик в sessionStorage */
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("orderDraft")
      if (raw) {
        const d = JSON.parse(raw)
        setName(d.name ?? "")
        setPhone(d.phone ?? "")
        setAddress(d.address ?? "")
      }
    } catch {}
  }, [])
  useEffect(() => {
    sessionStorage.setItem("orderDraft", JSON.stringify({ name, phone, address }))
  }, [name, phone, address])

  // валидации
  const phoneRe = /^(?:\+7|8)\s?(?:\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/
  const phoneValid = phoneRe.test(phone.trim())
  const nameValid = name.trim().length >= 2
  const addressValid = address.trim().length >= 5
  const canSubmit = cart.length > 0 && nameValid && phoneValid && addressValid

  const submitOrder = (e?: any) => {
    if (e) e.preventDefault()
    setSubmitted(true)
    if (!canSubmit) return

    // очистка
    setCart([])
    localStorage.removeItem("cart")
    setName("")
    setPhone("")
    setAddress("")
    sessionStorage.removeItem("orderDraft")
    setSubmitted(false)
  }

  return (
    <C.Container maxW="container.xl" py={8}>
      <C.HStack justify="space-between" mb={6}>
        <C.Heading>Конструктор пиццы 🍕</C.Heading>
        <C.Text>
          <b>Позиций:</b> {cart.length} &nbsp;|&nbsp; <b>Итого:</b> {total} ₽
        </C.Text>
      </C.HStack>

      <C.Flex gap={6} flexDir={["column", "column", "row"]} align="start">
        {/* Каталог пицц */}
        <C.Box flex="1" w="100%">
          <C.SimpleGrid columns={[1, 2, 3]} gap={6}>
            {pizzas.map((p) => (
              <PizzaCard key={p.id} pizza={p} onAdd={(ings, qty) => addToCart(p.id, ings, qty)} />
            ))}
          </C.SimpleGrid>
        </C.Box>

        {/* корзина + модалка через Dialog.Trigger */}
        <C.Box w={["100%", "100%", "360px"]} position={["static", "static", "sticky"]} top="24px">
          <C.Card.Root>
            <C.Card.Header>
              <C.Heading size="md">Корзина</C.Heading>
            </C.Card.Header>

            <C.Card.Body>
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
                  <C.Box key={it.id} mb={4} p={3} borderWidth="1px" borderRadius="md">
                    <C.Text fontWeight="bold" mb={1}>{p.name}</C.Text>
                    <C.Text fontSize="sm" color="fg.muted">{names}</C.Text>

                    <C.HStack justify="space-between" mt={2}>
                      <C.Text>Цена: {unit} ₽</C.Text>
                      <C.HStack>
                        <C.Button size="sm" onClick={() => dec(it.id)}>−</C.Button>
                        <C.Box minW="28px" textAlign="center">{it.qty}</C.Box>
                        <C.Button size="sm" onClick={() => inc(it.id)}>+</C.Button>
                        <C.Button size="sm" variant="plain" onClick={() => removeItem(it.id)}>
                          Удалить
                        </C.Button>
                      </C.HStack>
                    </C.HStack>

                    <C.Text mt={1} fontWeight="semibold">Итого по позиции: {unit * it.qty} ₽</C.Text>
                  </C.Box>
                )
              })}
            </C.Card.Body>

            {/* кнопка-триггер и контент модалки вместе */}
            <C.Dialog.Root>
              <C.Card.Footer justifyContent="space-between">
                <C.Text><b>К оплате:</b> {total} ₽</C.Text>
                <C.Dialog.Trigger asChild>
                  <C.Button colorPalette="teal" disabled={!cart.length} onClick={() => setSubmitted(false)}>
                    Оформить заказ
                  </C.Button>
                </C.Dialog.Trigger>
              </C.Card.Footer>

              <C.Dialog.Content>
                <C.Dialog.Header>Оформление заказа</C.Dialog.Header>
                <C.Dialog.Body>
                  <C.Stack gap={4}>
                    <C.Box>
                      <C.Text mb={1}><b>Имя</b></C.Text>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Иван"
                        style={{
                          width: "100%",
                          padding: 10,
                          borderRadius: 6,
                          border: `1px solid ${
                            submitted && !nameValid ? "var(--chakra-colors-red-500)" : "var(--chakra-colors-border)"
                          }`,
                        }}
                      />
                      {submitted && !nameValid && (
                        <C.Text color="red.500" mt={1}>Имя должно быть ≥ 2 символов</C.Text>
                      )}
                    </C.Box>

                    <C.Box>
                      <C.Text mb={1}><b>Телефон</b></C.Text>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+7 (999) 123-45-67"
                        style={{
                          width: "100%",
                          padding: 10,
                          borderRadius: 6,
                          border: `1px solid ${
                            submitted && !phoneValid ? "var(--chakra-colors-red-500)" : "var(--chakra-colors-border)"
                          }`,
                        }}
                      />
                      {submitted && !phoneValid && (
                        <C.Text color="red.500" mt={1}>
                          Неверный формат. Примеры: +7 (999) 123-45-67, 8 999 123-45-67
                        </C.Text>
                      )}
                    </C.Box>

                    <C.Box>
                      <C.Text mb={1}><b>Адрес</b></C.Text>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Город, улица, дом, квартира"
                        rows={3}
                        style={{
                          width: "100%",
                          padding: 10,
                          borderRadius: 6,
                          border: `1px solid ${
                            submitted && !addressValid ? "var(--chakra-colors-red-500)" : "var(--chakra-colors-border)"
                          }`,
                          resize: "vertical",
                        }}
                      />
                      {submitted && !addressValid && (
                        <C.Text color="red.500" mt={1}>Адрес должен быть ≥ 5 символов</C.Text>
                      )}
                    </C.Box>

                    <C.Text mt={2}><b>Итого к оплате:</b> {total} ₽</C.Text>
                  </C.Stack>
                </C.Dialog.Body>

                <C.Dialog.Footer>
                  <C.Dialog.CloseTrigger asChild>
                    <C.Button variant="plain">Отмена</C.Button>
                  </C.Dialog.CloseTrigger>
                  <C.Dialog.CloseTrigger asChild>
                    <C.Button colorPalette="teal" onClick={submitOrder} disabled={!canSubmit}>
                      Подтвердить заказ
                    </C.Button>
                  </C.Dialog.CloseTrigger>
                </C.Dialog.Footer>
              </C.Dialog.Content>
            </C.Dialog.Root>
          </C.Card.Root>
        </C.Box>
      </C.Flex>
    </C.Container>
  )
}
