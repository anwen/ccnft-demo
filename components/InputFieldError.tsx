
interface InputFieldErrorProps {
  message?: string
}

export const InputFieldError = ({ message }: InputFieldErrorProps) => {
  if (!message) return null
  return <p className="text-red-500">{message}</p>
}
