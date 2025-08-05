import { AuthService } from "@/services/auth"
import { useMutation } from "@tanstack/react-query"

export const useRegister = () => {
    return useMutation({
        mutationFn: AuthService.register,
    })
}