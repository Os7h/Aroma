'use client';

import { useQuery } from '@tanstack/react-query';
import {
    getIngredientProfile,
    getIngredientMatches,
    getAllIngredients,
    getAllGroups
} from '@/lib/queries/ingredients';

export function useIngredientProfile(ingredientId: string) {
    return useQuery({
        queryKey: ['ingredient-profile', ingredientId],
        queryFn: () => getIngredientProfile(ingredientId),
        enabled: !!ingredientId,
    });
}

export function useIngredientMatches(ingredientId: string) {
    return useQuery({
        queryKey: ['ingredient-matches', ingredientId],
        queryFn: () => getIngredientMatches(ingredientId),
        enabled: !!ingredientId,
    });
}

export function useAllIngredients() {
    return useQuery({
        queryKey: ['all-ingredients'],
        queryFn: getAllIngredients,
    });
}

export function useAllGroups() {
    return useQuery({
        queryKey: ['all-groups'],
        queryFn: getAllGroups,
    });
}
