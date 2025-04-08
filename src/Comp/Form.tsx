import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface GithubFormProps {
  onSearch: (username: string) => void
}

export const GithubForm: React.FC<GithubFormProps> = ({ onSearch }) => {
  const [input, setInput] = useState("")

  return (
    <div className="flex gap-4 mb-4 ">
      <Input width={20}
        placeholder="Enter GitHub username"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button onClick={() => onSearch(input)}>Search</Button>
    </div>
  )
}
