import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { suppliersApi } from '../api/suppliersApi'
import type { CreateSupplierDto, UpdateSupplierDto } from '../types/supplier.types'

export const SUPPLIERS_QUERY_KEY = ['suppliers']

export function useSuppliers() {
  return useQuery({
    queryKey: SUPPLIERS_QUERY_KEY,
    queryFn: suppliersApi.getAll,
  })
}

export function useSupplier(id: number) {
  return useQuery({
    queryKey: [...SUPPLIERS_QUERY_KEY, id],
    queryFn: () => suppliersApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSupplierDto) => suppliersApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY })
    },
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSupplierDto }) =>
      suppliersApi.update(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY })
      void queryClient.invalidateQueries({
        queryKey: [...SUPPLIERS_QUERY_KEY, variables.id],
      })
    },
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => suppliersApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY })
    },
  })
}
