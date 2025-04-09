import { useState } from "react"
import { GithubRepo } from "@/types/github"
import { Card } from "@/components/ui/card"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface RepoListProps {
  repos: GithubRepo[]
}

const ITEMS_PER_PAGE = 6

export const RepoList: React.FC<RepoListProps> = ({ repos }) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(repos.length / ITEMS_PER_PAGE)

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const visibleRepos = repos.slice(startIndex, endIndex)

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {visibleRepos.map((repo) => (
  <Card key={repo.id} className="p-4 bg-white">
    <h3 className="font-bold text-lg">{repo.name}</h3>
    <p className="text-sm text-muted-foreground">{repo.description}</p>
    <div className="text-sm mt-2">
      ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}
    </div>
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline text-sm"
    >
      View on GitHub
    </a>

   
  </Card>
))}

      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handlePrevious} />
            </PaginationItem>

            <PaginationItem className="px-4 text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </PaginationItem>

            <PaginationItem>
              <PaginationNext onClick={handleNext} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}
