import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supplierProductsApi } from '../api/supplierProductsApi'
import type { LinkProductDto } from '../types/supplier.types'

function supplierProductsKey(supplierId: string) {
  return ['suppliers', supplierId, 'products']
}

export function useSupplierProducts(supplierId: string) {
  return useQuery({
    queryKey: supplierProductsKey(supplierId),
    queryFn: () => supplierProductsApi.getAll(supplierId),
    enabled: !!supplierId,
  })
}

export function useLinkProduct(supplierId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LinkProductDto) => supplierProductsApi.link(supplierId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supplierProductsKey(supplierId) })
    },
  })
}

export function useUnlinkProduct(supplierId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => supplierProductsApi.unlink(supplierId, productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supplierProductsKey(supplierId) })
    },
  })
}
