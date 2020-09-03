import CozyClient from 'cozy-client'

import { fetchContactsToUpdate, fetchNormalizedServiceByName } from './fetches'
import { updateIndexFullNameAndDisplayName } from './contacts'
import { johnDoeContact } from './testData'

const client = new CozyClient({})

describe('fetchContactsToUpdate', () => {
  it('should returns only contact to update', async () => {
    const lastSuccess = new Date()
    const contactToUpdate = johnDoeContact
    const contactUpToDate = updateIndexFullNameAndDisplayName(johnDoeContact)
    const queryResult = [contactToUpdate, contactUpToDate]
    client.queryAll = jest.fn().mockResolvedValue(queryResult)

    const expected = [contactToUpdate]
    expect(await fetchContactsToUpdate(client, lastSuccess)).toEqual(expected)
  })

  it('should returns contact to update even if lastSuccess is undefined', async () => {
    const lastSuccess = undefined
    const contactToUpdate = johnDoeContact
    const contactUpToDate = updateIndexFullNameAndDisplayName(johnDoeContact)
    const queryResult = [contactToUpdate, contactUpToDate]
    client.queryAll = jest.fn().mockResolvedValue(queryResult)

    const expected = [contactToUpdate]
    expect(await fetchContactsToUpdate(client, lastSuccess)).toEqual(expected)
  })
})

describe('fetchNormalizedServiceByName', () => {
  it('should fetch a normalized service', async () => {
    const trigger = {
      data: [
        {
          id: '6e0847f496cbeb11e3ed653f170086bd'
        }
      ]
    }
    const normalizedTrigger = {
      data: {
        id: '6e0847f496cbeb11e3ed653f170086bd',
        current_state: {
          last_success: '2020-08-12T11:14:46.060006+02:00'
        }
      }
    }

    client.query = jest
      .fn()
      .mockReturnValueOnce(trigger)
      .mockReturnValueOnce(normalizedTrigger)

    const expected = {
      id: '6e0847f496cbeb11e3ed653f170086bd',
      current_state: { last_success: '2020-08-12T11:14:46.060006+02:00' }
    }
    expect(await fetchNormalizedServiceByName(client, 'serviceName')).toEqual(
      expected
    )
  })
})
