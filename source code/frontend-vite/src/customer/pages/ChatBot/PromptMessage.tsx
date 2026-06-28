interface PromptMessageProps {
    message: string,
    index: number
}
const PromptMessage = ({ message, index }: PromptMessageProps) => {
  return (
    <div className='px-3 py-4 bg-[#C8A24A]/10 rounded-md self-end'>{message}</div>
  )
}

export default PromptMessage