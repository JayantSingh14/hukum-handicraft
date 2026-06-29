interface PromptMessageProps {
    message: string;
}
const PromptMessage = ({ message }: PromptMessageProps) => {
  return (
    <div className='px-3 py-4 bg-[#C8A24A]/10 rounded-md self-end'>{message}</div>
  )
}

export default PromptMessage
