import { assertEquals } from './dependencies.ts';
import { FormErrorClass } from './helper.ts'

Deno.test('Testing FormErrorClass #1', () => {
  const parameters = {
    name: 'hoge',
    birth: {
      year: 1964,
      month: 5,
      day: 24
    },
    skill: ['ability1', 'ability2', 'ability3']
  }

  const { invalid, hasError } = new FormErrorClass(
    parameters,
    {
      birthDay: 'something message'
    }
  )

  assertEquals(invalid, {
    name: false,
    birth: false,
    skill: false,
    birthDay: true
  })
  assertEquals(hasError, true)
})
