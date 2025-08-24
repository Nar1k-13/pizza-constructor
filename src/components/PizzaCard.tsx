
import { useState } from "react"
import * as C from "@chakra-ui/react"
import type { Pizza } from "../data"

type Props = { pizza: Pizza; onAdd: (ingredientIds: string[], qty: number) => void }

export default function PizzaCard({ pizza, onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [qty, setQty] = useState(1)

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const confirm = () => {
    onAdd(selected, qty)
    setSelected([])
    setQty(1)
    setOpen(false)
  }

  return (
    <>
      {/* Карточка */}
      <C.Card.Root>
        <C.Card.Body>
          <img
            src={pizza.image}
            alt={pizza.name}
            style={{ width: "100%", borderRadius: 8, objectFit: "cover" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://placehold.co/300x200?text=No+Image"
            }}
          />
          <C.Stack mt="3" gap="1">
            <C.Heading size="md">{pizza.name}</C.Heading>
            <C.Text>Базовая цена: {pizza.basePrice} ₽</C.Text>
          </C.Stack>
        </C.Card.Body>
        <C.Card.Footer>
          <C.Button colorPalette="teal" onClick={() => setOpen(true)}>
            Добавить в корзину
          </C.Button>
        </C.Card.Footer>
      </C.Card.Root>

      {/* Диалог настройки */}
      <C.Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <C.Dialog.Content>
          <C.Dialog.Header>Настройка пиццы</C.Dialog.Header>

          <C.Dialog.Body>
            <C.VStack align="stretch" gap={5}>
              {/* Доп. ингредиенты */}
              <C.Box>
                <C.Text mb={2}><b>Доп. ингредиенты</b></C.Text>
                <C.VStack align="stretch" gap={3}>
                  {pizza.ingredients.map((ing) => {
                    const isChecked = selected.includes(ing.id)
                    return (
                      <C.HStack
                        key={ing.id}
                        onClick={() => toggle(ing.id)}
                        gap={3}
                        cursor="pointer"
                        userSelect="none"
                        _hover={{ opacity: 0.85 }}
                      >
                        {/* Кастомный «чекбокс» */}
                        <C.Box
                          w="18px"
                          h="18px"
                          borderWidth="2px"
                          borderRadius="sm"
                          display="inline-flex"
                          alignItems="center"
                          justifyContent="center"
                          bg={isChecked ? "teal.500" : "transparent"}
                          borderColor={isChecked ? "teal.500" : "gray.300"}
                        >
                          {isChecked && (
                            <C.Box as="span" w="10px" h="10px" bg="white" borderRadius="1px" />
                          )}
                        </C.Box>

                        <C.Text>
                          {ing.name} (+{ing.price} ₽)
                        </C.Text>
                      </C.HStack>
                    )
                  })}
                </C.VStack>
              </C.Box>

              {/* Количество (кастомный степпер) */}
              <C.Box>
                <C.Text mb={2}><b>Количество</b></C.Text>
                <C.HStack>
                  <C.Button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</C.Button>
                  <C.Box minW="48px" textAlign="center">{qty}</C.Box>
                  <C.Button onClick={() => setQty((q) => Math.min(10, q + 1))}>+</C.Button>
                </C.HStack>
              </C.Box>
            </C.VStack>
          </C.Dialog.Body>

          <C.Dialog.Footer>
            <C.Button variant="plain" onClick={() => setOpen(false)}>
              Отмена
            </C.Button>
            <C.Button colorPalette="teal" onClick={confirm}>
              Добавить ({qty})
            </C.Button>
          </C.Dialog.Footer>
        </C.Dialog.Content>
      </C.Dialog.Root>
    </>
  )
}