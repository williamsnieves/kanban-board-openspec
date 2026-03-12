import { act } from 'react'
import { useBoardStore } from '../domain/boardStore'
import { loadState } from '../domain/storage'

const makeBoard = (id: string, name: string) => ({
  id, name, columns: [], createdAt: new Date().toISOString()
})

beforeEach(() => {
  localStorage.clear()
  act(() => {
    useBoardStore.setState({ boards: [], selectedBoardId: null })
  })
})

describe('Local-first persistence for board management', () => {
  it('Persist rename and delete actions — persist rename after refresh', () => {
    // Arrange
    act(() => {
      useBoardStore.setState({ boards: [makeBoard('b1', 'Original')], selectedBoardId: null })
    })

    // Act
    act(() => {
      useBoardStore.getState().renameBoard('b1', 'Renamed')
    })

    // Assert
    const persisted = loadState()
    expect(persisted).not.toBeNull()
    expect(persisted![0].name).toBe('Renamed')
  })

  it('Persist rename and delete actions — persist delete after refresh', () => {
    // Arrange
    act(() => {
      useBoardStore.setState({ boards: [makeBoard('b1', 'ToDelete')], selectedBoardId: null })
    })

    // Act
    act(() => {
      useBoardStore.getState().deleteBoard('b1')
    })

    // Assert
    const persisted = loadState()
    expect(persisted).toEqual([])
  })
})
