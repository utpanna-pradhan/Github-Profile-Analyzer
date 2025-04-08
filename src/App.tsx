import { useState } from "react"
import { GithubRepo } from "@/types/github"
import { GithubForm } from "@/Comp/Form"
import { RepoList } from "@/Comp/Repolist"
import { Skeleton } from "@/components/ui/skeleton";
import './App.css'

function App() {
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchRepos = async (username: string) => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`)
      if (!response.ok) throw new Error("User not found or API error")
      const data: GithubRepo[] = await response.json()
      setRepos(data)
    } catch (err) {
      setError("Could not fetch repositories. Try again.")
      setRepos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 flex-column text-center justify-content-center">
      <h1 className="text-2xl font-bold mb-4">GitHub User Profile Analyzer</h1>
      <GithubForm onSearch={fetchRepos} />

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {!loading && repos.length > 0 && <RepoList repos={repos} />}
    </div>
  )
}

export default App
