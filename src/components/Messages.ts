// errorMessages.ts
export const errorMessages = {
    passwordRequired: "Ingresar contraseña",
    passwordInvalid: "Contraseña inválida",
    // Add more messages as needed
  } as const;
  
  export type ErrorMessageKeys = keyof typeof errorMessages;