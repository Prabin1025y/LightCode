"use client";
import { useQuery } from 'convex/react'
import React, { useState } from 'react'
import NavBar from './_components/NavBar';
import { api } from '../../../convex/_generated/api';
import Header from './_components/Header';

const SnippetPage = () => {
  const snippets = useQuery(api.snippets.getSnippet);
  const [searchString, setSearchString] = useState("");
  // const [filteredLanguage, setFilteredLanguage] = useState<string | null>(null)
  // const [view, setView] = useState<"grid" | "list">("grid")

  if (snippets === undefined)
    return <div>Loading</div>

  const languages = [...new Set(snippets.map(s => s.language))];
  const popularLanguages = languages.slice(0, 5);

  // const filteredSnippets = snippets.filter(snippet => {
  //   const matchesSearch = snippet.language.includes(searchString) ||
  //     snippet.title.includes(searchString) ||
  //     snippet.userId.includes(searchString);

  //   const matchesLanguage = !filteredLanguage || snippet.language === filteredLanguage;

  //   return matchesSearch && matchesLanguage
  // })

  return (
    <>
      <NavBar />
      <div>
        <Header />
        <input onChange={(e)=>setSearchString(e.target.value)} value={searchString} type="text" />
        <div>
          {popularLanguages.map(language=>(
            <div key={language}>{language}</div>
          ))}
        </div>
        <div>
          {snippets.map(snippet=>(
            <div key={snippet._id}>{snippet.code}</div>
          ))}
        </div>
      </div>

    </>
  )
}

export default SnippetPage