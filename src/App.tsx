import { useState } from "react"
import { GithubRepo } from "@/types/github"
import { GithubForm } from "@/Comp/Form"
import { RepoList } from "@/Comp/Repolist"
import { Skeleton } from "@/components/ui/skeleton";
import CommitChart from "@/Comp/CommitChart";
import './App.css'

function App() {
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [commitData, setCommitData] = useState<{ date: string, count: number }[]>([])
  const [username, setUsername] = useState<string>("")

  const fetchRepos = async (username: string) => {
    setLoading(true)
    setError("")
    setUsername(username) // Save for CommitChart
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`)
      if (!response.ok) throw new Error("User not found or API error")
      const data: GithubRepo[] = await response.json()
      setRepos(data)

      // Fetch commit data (dummy logic)
      const commits: { date: string, count: number }[] = await fetchCommitActivity()
      setCommitData(commits)

    } catch (err) {
      setError("Could not fetch repositories or commits. Try again.")
      setRepos([])
      setCommitData([])
    } finally {
      setLoading(false)
    }
  }

  // 👇 Replace with real logic for commit data
  const fetchCommitActivity = async () => {
    // Simulating dummy commit activity (replace with real logic or GitHub GraphQL API)
    const dummyData = []
    const today = new Date()
    for (let i = 0; i < 100; i++) {
      const date = new Date()
      date.setDate(today.getDate() - i)
      dummyData.push({
        date: date.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 5),
      })
    }
    return dummyData
  }

  return (
    <div className="max-w-4xl mx-auto p-4 flex-column text-center justify-content-center">
      <h1 className="text-2xl font-bold mb-4">GitHub User Profile Analyzer</h1>

      <GithubForm onSearch={fetchRepos} />

      {username && commitData.length > 0 && (
        <CommitChart
          data={commitData}
          username={username}
        
        />
      )}
      <h3 className="text-xl text-gray-700">Repositories of {username}</h3>
      <br></br>
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
